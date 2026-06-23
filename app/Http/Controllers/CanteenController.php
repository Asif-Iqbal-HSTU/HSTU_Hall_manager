<?php

namespace App\Http\Controllers;

use App\Models\CanteenCosting;
use App\Models\CanteenMenu;
use App\Models\MealBooking;
use App\Models\Hall;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class CanteenController extends Controller
{
    /**
     * Display student canteen dashboard
     */
    public function index(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);
        if (!$user->hall_id) {
            return back()->with('error', 'You are not assigned to any hall.');
        }

        $hall = Hall::findOrFail($user->hall_id);
        $menus = CanteenMenu::where('hall_id', $hall->id)->get();

        // Load bookings and costings for a window of 30 days past and 30 days future
        $startDate = Carbon::now()->subDays(30)->format('Y-m-d');
        $endDate = Carbon::now()->addDays(30)->format('Y-m-d');

        $bookings = MealBooking::where('user_id', $user->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        $costings = CanteenCosting::where('hall_id', $hall->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->get();

        return inertia('canteen/index', [
            'hall' => $hall,
            'menus' => $menus,
            'bookings' => $bookings,
            'costings' => $costings,
        ]);
    }

    /**
     * Student books meals for a date
     */
    public function bookMeal(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'student') abort(403);
        if (!$user->hall_id) abort(400, 'Hall not assigned.');

        $request->validate([
            'date' => 'required|date_format:Y-m-d',
            'breakfast_units' => 'required|integer|min:0',
            'lunch_units' => 'required|integer|min:0',
            'dinner_units' => 'required|integer|min:0',
        ]);

        $bookingDate = Carbon::parse($request->date)->startOfDay();
        // Deadline is D-1 at 17:00 (5 PM)
        $deadline = $bookingDate->copy()->subDay()->setTime(17, 0, 0);

        if (Carbon::now()->greaterThan($deadline)) {
            return back()->with('error', 'Deadline passed. You can only book/edit meals up to 5:00 PM of the previous day.');
        }

        MealBooking::updateOrCreate(
            [
                'user_id' => $user->id,
                'date' => $request->date,
            ],
            [
                'hall_id' => $user->hall_id,
                'breakfast_units' => $request->breakfast_units,
                'lunch_units' => $request->lunch_units,
                'dinner_units' => $request->dinner_units,
            ]
        );

        return back()->with('success', 'Meal booking updated successfully.');
    }

    /**
     * Display admin canteen management dashboard
     */
    public function adminIndex(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'hall_super') abort(403);
        if (!$user->hall_id) {
            return back()->with('error', 'You are not assigned to a hall.');
        }

        $hall = Hall::findOrFail($user->hall_id);
        $menus = CanteenMenu::where('hall_id', $hall->id)->get();
        $costings = CanteenCosting::where('hall_id', $hall->id)
            ->orderBy('date', 'desc')
            ->limit(100)
            ->get();

        // Booking summaries: aggregate units grouped by date for kitchen count
        $startDate = Carbon::now()->subDays(7)->format('Y-m-d');
        $endDate = Carbon::now()->addDays(30)->format('Y-m-d');

        $summaries = MealBooking::where('hall_id', $hall->id)
            ->whereBetween('date', [$startDate, $endDate])
            ->selectRaw('date, sum(breakfast_units) as total_breakfast, sum(lunch_units) as total_lunch, sum(dinner_units) as total_dinner')
            ->groupBy('date')
            ->get();

        return inertia('admin/canteen', [
            'hall' => $hall,
            'menus' => $menus,
            'costings' => $costings,
            'summaries' => $summaries,
        ]);
    }

    /**
     * Admin updates default prices
     */
    public function updateDefaults(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'hall_super') abort(403);
        if (!$user->hall_id) abort(400, 'Hall not assigned.');

        $request->validate([
            'canteen_default_breakfast_price' => 'required|numeric|min:0',
            'canteen_default_lunch_price' => 'required|numeric|min:0',
            'canteen_default_dinner_price' => 'required|numeric|min:0',
        ]);

        $hall = Hall::findOrFail($user->hall_id);
        $hall->update($request->only([
            'canteen_default_breakfast_price',
            'canteen_default_lunch_price',
            'canteen_default_dinner_price'
        ]));

        return back()->with('success', 'Default prices updated successfully.');
    }

    /**
     * Admin updates weekly menu item
     */
    public function updateMenu(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'hall_super') abort(403);
        if (!$user->hall_id) abort(400, 'Hall not assigned.');

        $request->validate([
            'day_of_week' => 'required|string',
            'breakfast' => 'nullable|string',
            'lunch' => 'nullable|string',
            'dinner' => 'nullable|string',
        ]);

        CanteenMenu::updateOrCreate(
            [
                'hall_id' => $user->hall_id,
                'day_of_week' => $request->day_of_week,
            ],
            $request->only(['breakfast', 'lunch', 'dinner'])
        );

        return back()->with('success', 'Menu for ' . $request->day_of_week . ' updated.');
    }

    /**
     * Admin updates costing for a specific date
     */
    public function updateCosting(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'hall_super') abort(403);
        if (!$user->hall_id) abort(400, 'Hall not assigned.');

        $request->validate([
            'date' => 'required|date_format:Y-m-d',
            'breakfast_price' => 'required|numeric|min:0',
            'lunch_price' => 'required|numeric|min:0',
            'dinner_price' => 'required|numeric|min:0',
        ]);

        CanteenCosting::updateOrCreate(
            [
                'hall_id' => $user->hall_id,
                'date' => $request->date,
            ],
            $request->only(['breakfast_price', 'lunch_price', 'dinner_price'])
        );

        return back()->with('success', 'Costing for ' . $request->date . ' updated.');
    }

    /**
     * Admin deletes costing for a date
     */
    public function deleteCosting(Request $request)
    {
        $user = $request->user();
        if ($user->role !== 'admin' && $user->role !== 'hall_super') abort(403);
        if (!$user->hall_id) abort(400, 'Hall not assigned.');

        $request->validate([
            'id' => 'required|exists:canteen_costings,id',
        ]);

        $costing = CanteenCosting::where('hall_id', $user->hall_id)->findOrFail($request->id);
        $costing->delete();

        return back()->with('success', 'Costing deleted successfully.');
    }
}
