<?php

namespace App\Http\Controllers;

use App\Models\Complaint;
use App\Models\Hall;
use Illuminate\Http\Request;

class ComplaintController extends Controller
{
    /** Categories a student can file a complaint under. */
    public const CATEGORIES = [
        'Canteen / Dining',
        'Room / Seat',
        'Cleanliness & Sanitation',
        'Water & Electricity',
        'Security & Safety',
        'Ragging / Harassment',
        'Internet / Wi-Fi',
        'Other',
    ];

    /**
     * Student view: guideline + submission form + the student's own past
     * complaints (with any authority response). Anonymous to the authority.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);

        $myComplaints = Complaint::where('user_id', $user->id)
            ->latest()
            ->get(['id', 'category', 'subject', 'message', 'status', 'response', 'responded_at', 'created_at']);

        return inertia('complaints/index', [
            'categories' => self::CATEGORIES,
            'myComplaints' => $myComplaints,
            'hall' => $user->hall_id ? Hall::find($user->hall_id) : null,
        ]);
    }

    /** Student submits an anonymous complaint routed to their hall authority. */
    public function store(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);
        if (! $user->hall_id) {
            return back()->with('error', 'You are not assigned to any hall.');
        }

        $validated = $request->validate([
            'category' => 'required|string|in:' . implode(',', self::CATEGORIES),
            'subject' => 'required|string|max:150',
            'message' => 'required|string|max:5000',
        ]);

        Complaint::create([
            'hall_id' => $user->hall_id,
            'user_id' => $user->id, // stored only for the student's own tracking; hidden from authority
            'category' => $validated['category'],
            'subject' => $validated['subject'],
            'message' => $validated['message'],
            'status' => 'pending',
        ]);

        return back()->with('success', 'Your complaint has been submitted anonymously. Thank you.');
    }

    /**
     * Authority view: complaints for their hall, WITHOUT any student identity.
     */
    public function adminIndex(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'hall_super') abort(403);
        if (! $user->hall_id) {
            return back()->with('error', 'You are not assigned to a hall.');
        }

        $hall = Hall::findOrFail($user->hall_id);

        // Explicitly select only non-identifying columns — never user_id.
        $complaints = Complaint::where('hall_id', $hall->id)
            ->latest()
            ->get(['id', 'category', 'subject', 'message', 'status', 'response', 'responded_at', 'created_at']);

        return inertia('admin/complaints', [
            'hall' => $hall,
            'complaints' => $complaints,
            'stats' => [
                'pending' => $complaints->where('status', 'pending')->count(),
                'in_progress' => $complaints->where('status', 'in_progress')->count(),
                'resolved' => $complaints->where('status', 'resolved')->count(),
            ],
        ]);
    }

    /** Authority updates the status of / responds to a complaint. */
    public function respond(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'hall_super') abort(403);
        if (! $user->hall_id) abort(400, 'Hall not assigned.');

        $validated = $request->validate([
            'id' => 'required|exists:complaints,id',
            'status' => 'required|in:pending,in_progress,resolved',
            'response' => 'nullable|string|max:5000',
        ]);

        // Scope to the authority's own hall.
        $complaint = Complaint::where('hall_id', $user->hall_id)->findOrFail($validated['id']);
        $complaint->status = $validated['status'];
        if ($request->filled('response')) {
            $complaint->response = $validated['response'];
            $complaint->responded_at = now();
        }
        $complaint->save();

        return back()->with('success', 'Complaint updated.');
    }
}
