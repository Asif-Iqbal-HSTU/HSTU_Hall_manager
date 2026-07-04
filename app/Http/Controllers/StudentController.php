<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function applyForSeat(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);

        $user->load(['academic', 'address', 'guardian']);
        if (!$user->academic || !$user->address || !$user->guardian) {
            return back()->with('error', 'Profile information is incomplete.');
        }

        // Check if application period is active
        $hall = \App\Models\Hall::find($user->hall_id);
        if (!$hall || !$hall->is_application_active) {
            return back()->with('error', 'Seat applications are not currently open.');
        }

        $now = now();
        if ($hall->application_start && $now->lt(\Illuminate\Support\Carbon::parse($hall->application_start))) {
            return back()->with('error', 'Application period has not started yet.');
        }
        if ($hall->application_end && $now->gt(\Illuminate\Support\Carbon::parse($hall->application_end))) {
            return back()->with('error', 'Application period has ended.');
        }

        // Check if already applied (pending or denied) in the current period
        if ($hall->application_start) {
            $existing = \App\Models\SeatApplication::where('student_id', $user->id)
                ->where('created_at', '>=', $hall->application_start)
                ->whereIn('status', ['pending', 'denied'])
                ->first();

            if ($existing) {
                if ($existing->status === 'denied') {
                    return back()->with('error', 'You cannot apply during the current allocation period as you were denied.');
                }
                return back()->with('error', 'You have already submitted an application for this period.');
            }
        }

        \App\Models\SeatApplication::create([
            'student_id' => $user->id,
            'hall_id' => $user->hall_id,
            'cgpa' => $user->academic->current_cgpa,
            'guardian_income' => $user->guardian->annual_income_amount,
            'distance_from_home' => $user->address->distance_from_home,
            'status' => 'pending'
        ]);

        return back()->with('success', 'Application submitted.');
    }
}
