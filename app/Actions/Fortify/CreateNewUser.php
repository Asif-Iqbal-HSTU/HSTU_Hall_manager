<?php

namespace App\Actions\Fortify;

use App\Models\User;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Laravel\Fortify\Contracts\CreatesNewUsers;

class CreateNewUser implements CreatesNewUsers
{
    /**
     * Validate and create a newly registered user.
     *
     * @param  array<string, string>  $input
     */
    public function create(array $input): User
    {
        Validator::make($input, [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            
            // Academics
            'student_id' => ['required', 'string', 'unique:student_academics,student_id'],
            'department' => ['required', 'string', 'max:255'],
            'degree' => ['required', 'string', 'max:255'],
            'level' => ['required', 'integer', 'between:1,4'],
            'semester' => ['required', 'string', 'in:I,II,i,ii,1,2'],
            'current_cgpa' => ['required', 'numeric', 'between:0.00,4.00'],

            // Addresses
            'perm_district' => ['required', 'string', 'max:255'],
            'perm_upazilla' => ['required', 'string', 'max:255'],
            'perm_village_area' => ['required', 'string', 'max:255'],
            'pres_district' => ['required', 'string', 'max:255'],
            'pres_upazilla' => ['required', 'string', 'max:255'],
            'pres_village_area' => ['required', 'string', 'max:255'],
            'distance_from_home' => ['required', 'integer', 'min:0'],

            // Residential
            'status' => ['required', 'string', 'in:Residential,Non-Residential'],
            'hall_id' => ['required_if:status,Residential', 'nullable', 'exists:halls,id'],
            'room_no' => ['required_if:status,Residential', 'nullable', 'string', 'max:255'],
            'seat_no' => ['required_if:status,Residential', 'nullable', 'string', 'max:255'],
            'staying_from' => ['nullable', 'date'],

            // Guardian
            'father_name' => ['nullable', 'string', 'max:255'],
            'mother_name' => ['nullable', 'string', 'max:255'],
            'guardian_name' => ['nullable', 'string', 'max:255'],
            'guardian_occupation' => ['required', 'string', 'max:255'],
            'annual_income_amount' => ['required', 'numeric', 'min:0'],
        ])->validate();

        $password = Str::random(12);

        return DB::transaction(function() use ($input, $password) {
            $user = User::create([
                'name' => $input['name'],
                'email' => $input['email'],
                'password' => bcrypt($password),
                'role' => 'student',
                'hall_id' => $input['status'] === 'Residential' ? $input['hall_id'] : null,
            ]);

            // Create academic details
            $user->academic()->create([
                'student_id' => $input['student_id'],
                'department' => $input['department'],
                'degree' => $input['degree'],
                'level' => $input['level'],
                'semester' => in_array(strtoupper($input['semester']), ['1', 'I']) ? 'I' : 'II',
                'current_cgpa' => $input['current_cgpa'],
            ]);

            // Create address details
            $user->address()->create([
                'perm_district' => $input['perm_district'],
                'perm_upazilla' => $input['perm_upazilla'],
                'perm_village_area' => $input['perm_village_area'],
                'pres_district' => $input['pres_district'],
                'pres_upazilla' => $input['pres_upazilla'],
                'pres_village_area' => $input['pres_village_area'],
                'distance_from_home' => $input['distance_from_home'],
            ]);

            // Find or create seat dynamically
            $seatId = null;
            if ($input['status'] === 'Residential' && !empty($input['room_no']) && !empty($input['seat_no'])) {
                $hallId = $input['hall_id'];
                $roomNo = $input['room_no'];
                $seatNo = $input['seat_no'];
                
                $seat = \App\Models\Seat::where('seat_number', $seatNo)
                    ->whereHas('room', function($q) use ($roomNo, $hallId) {
                        $q->where('room_number', $roomNo)
                          ->whereHas('floor', function($fq) use ($hallId) {
                              $fq->where('hall_id', $hallId);
                          });
                    })->first();
                
                if (!$seat) {
                    $floorNumber = 1;
                    if (preg_match('/^\d/', $roomNo)) {
                        $floorNumber = intval($roomNo[0]);
                    }
                    
                    $floor = \App\Models\Floor::firstOrCreate(
                        ['hall_id' => $hallId, 'floor_number' => $floorNumber],
                        ['name' => $floorNumber . ' Floor']
                    );
                    
                    $room = \App\Models\Room::firstOrCreate(
                        ['floor_id' => $floor->id, 'room_number' => $roomNo],
                        ['purpose' => 'residential', 'capacity' => 4, 'square_feet' => 200]
                    );
                    
                    $seat = \App\Models\Seat::create([
                        'room_id' => $room->id,
                        'seat_number' => $seatNo,
                        'status' => 'available'
                    ]);
                }
                
                $seatId = $seat->id;
            }

            // Create residential details
            $user = $user->fresh(); // Ensure relationships sync
            $user->residential()->create([
                'status' => $input['status'],
                'hall_id' => $input['status'] === 'Residential' ? $input['hall_id'] : null,
                'seat_id' => $input['status'] === 'Residential' ? $seatId : null,
                'staying_from' => $input['status'] === 'Residential' ? ($input['staying_from'] ?? null) : null,
            ]);

            // Update seat status if booked
            if ($input['status'] === 'Residential' && $seatId) {
                \App\Models\Seat::where('id', $seatId)->update(['status' => 'booked']);
            }

            // Create guardian details
            $user->guardian()->create([
                'father_name' => $input['father_name'] ?? null,
                'mother_name' => $input['mother_name'] ?? null,
                'guardian_name' => $input['guardian_name'] ?? $input['father_name'] ?? null,
                'guardian_occupation' => $input['guardian_occupation'],
                'annual_income_amount' => $input['annual_income_amount'],
            ]);

            // Flash the generated password to session
            session()->flash('generated_password', $password);

            return $user;
        });
    }
}
