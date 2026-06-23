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
            $students = \App\Models\User::where('hall_id', $hall->id)->where('role', 'student')->with('studentProfile')->get();
            $residentialStudents = $students->filter(function($student) {
                return $student->studentProfile && $student->studentProfile->is_residential;
            });

            // Load floors and rooms with seats for this hall
            $rooms = \App\Models\Room::whereHas('floor', function($q) use ($hall) {
                $q->where('hall_id', $hall->id);
            })->where('purpose', 'residential')->with(['seats' => function($q) {
                $q->with(['studentProfile.user']);
            }])->get();

            // Load pending applications for the current period
            $applicationsQuery = \App\Models\SeatApplication::where('hall_id', $hall->id)
                                                       ->where('status', 'pending');
            if ($hall->application_start) {
                $applicationsQuery->where('created_at', '>=', $hall->application_start);
            }
            $applications = $applicationsQuery->with(['student.user'])->get();

            return inertia('admin/dashboard', [
                'hall' => $hall,
                'students' => $students,
                'residentialStudents' => $residentialStudents->values(),
                'rooms' => $rooms,
                'applications' => $applications
            ]);
        }

        if ($user->role === 'student') {
            $profile = \App\Models\StudentProfile::where('user_id', $user->id)->with('seat.room')->first();
            $hall = $user->hall_id ? \App\Models\Hall::find($user->hall_id) : null;

            // Only load applications created during/after the current period start date
            $application = null;
            if ($profile && $hall && $hall->application_start) {
                $application = \App\Models\SeatApplication::where('student_id', $profile->id)
                                                           ->where('created_at', '>=', $hall->application_start)
                                                           ->latest()
                                                           ->first();
            }

            return inertia('student/dashboard', [
                'profile' => $profile,
                'application' => $application,
                'hall' => $hall
            ]);
        }

        return inertia('dashboard');
    }
}
