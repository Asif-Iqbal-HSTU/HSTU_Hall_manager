<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->role === 'admin' || $user->role === 'hall_super') {
            if (!$user->hall_id) {
                // System admin without a specific hall
                return inertia('admin/system-dashboard');
            }

            $hall = \App\Models\Hall::find($user->hall_id);
            $students = \App\Models\User::where('hall_id', $hall->id)->where('role', 'student')->with(['academic', 'address', 'residential.seat.room', 'guardian'])->get();
            $residentialStudents = $students->filter(function($student) {
                return $student->residential && $student->residential->status === 'Residential';
            });

            // Load floors and rooms with seats for this hall
            $rooms = \App\Models\Room::whereHas('floor', function($q) use ($hall) {
                $q->where('hall_id', $hall->id);
            })->where('purpose', 'residential')->with(['seats' => function($q) {
                $q->with(['studentResidential.user']);
            }])->get();

            // Load pending applications for the current period
            $applicationsQuery = \App\Models\SeatApplication::where('hall_id', $hall->id)
                                                       ->where('status', 'pending');
            if ($hall->application_start) {
                $applicationsQuery->where('created_at', '>=', $hall->application_start);
            }
            $applications = $applicationsQuery->with(['student.academic'])->get();

            return inertia('admin/dashboard', [
                'hall' => $hall,
                'students' => $students,
                'residentialStudents' => $residentialStudents->values(),
                'rooms' => $rooms,
                'applications' => $applications
            ]);
        }

        if ($user->role === 'student') {
            $user->load(['academic', 'address', 'residential.seat.room', 'residential.hall', 'guardian']);
            $hall = $user->hall_id ? \App\Models\Hall::find($user->hall_id) : null;

            // Only load applications created during/after the current period start date
            $application = null;
            if ($user->academic && $hall && $hall->application_start) {
                $application = \App\Models\SeatApplication::where('student_id', $user->id)
                                                           ->where('created_at', '>=', $hall->application_start)
                                                           ->latest()
                                                           ->first();
            }

            return inertia('student/dashboard', [
                'academic' => $user->academic,
                'address' => $user->address,
                'residential' => $user->residential,
                'guardian' => $user->guardian,
                'application' => $application,
                'hall' => $hall
            ]);
        }

        return inertia('dashboard');
    }
}
