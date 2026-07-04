<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function startApplicationProcess(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'hall_super') abort(403);
        if (!$user->hall_id) {
            return back()->with('error', 'You must be assigned to a hall to start the application process.');
        }

        $request->validate([
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'message' => 'required|string',
        ]);

        $hall = \App\Models\Hall::findOrFail($user->hall_id);
        $hall->update([
            'application_start' => $request->start_date,
            'application_end' => $request->end_date,
            'application_message' => $request->message,
            'is_application_active' => true,
        ]);
        
        return back()->with('success', 'Application process started.');
    }

    public function closeApplicationProcess(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'hall_super') abort(403);
        if (!$user->hall_id) {
            return back()->with('error', 'You must be assigned to a hall.');
        }

        $hall = \App\Models\Hall::findOrFail($user->hall_id);
        $hall->update([
            'is_application_active' => false,
        ]);

        return back()->with('success', 'Application process closed.');
    }

    public function allocateSeat(Request $request)
    {
        $request->validate([
            'application_id' => 'required|exists:seat_applications,id',
            'seat_id' => 'required|exists:seats,id'
        ]);

        $app = \App\Models\SeatApplication::findOrFail($request->application_id);
        $seat = \App\Models\Seat::findOrFail($request->seat_id);

        if ($seat->status === 'booked') {
            return back()->with('error', 'Seat already booked.');
        }

        $app->status = 'approved';
        $app->save();

        $seat->status = 'booked';
        $seat->save();

        $user = \App\Models\User::findOrFail($app->student_id);
        $residential = $user->residential ?: new \App\Models\StudentResidential(['user_id' => $user->id]);
        $residential->status = 'Residential';
        $residential->seat_id = $seat->id;
        $residential->hall_id = $seat->room->floor->hall_id;
        $residential->save();

        return back()->with('success', 'Seat allocated successfully.');
    }

    public function denyApplication(Request $request)
    {
        $request->validate([
            'application_id' => 'required|exists:seat_applications,id'
        ]);

        $app = \App\Models\SeatApplication::findOrFail($request->application_id);
        $app->status = 'denied';
        $app->save();

        return back()->with('success', 'Application denied.');
    }
}
