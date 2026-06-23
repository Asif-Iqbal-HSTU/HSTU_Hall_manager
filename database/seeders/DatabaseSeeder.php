<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $districtDistances = [
            // Rangpur Division
            ['district' => 'Dinajpur', 'distance' => 5],
            ['district' => 'Rangpur', 'distance' => 75],
            ['district' => 'Gaibandha', 'distance' => 110],
            ['district' => 'Kurigram', 'distance' => 125],
            ['district' => 'Lalmonirhat', 'distance' => 120],
            ['district' => 'Nilphamari', 'distance' => 60],
            ['district' => 'Panchagarh', 'distance' => 115],
            ['district' => 'Thakurgaon', 'distance' => 80],
            // Rajshahi Division
            ['district' => 'Joypurhat', 'distance' => 110],
            ['district' => 'Bogura', 'distance' => 140],
            ['district' => 'Naogaon', 'distance' => 150],
            ['district' => 'Rajshahi', 'distance' => 215],
            ['district' => 'Chapainawabganj', 'distance' => 250],
            ['district' => 'Natore', 'distance' => 220],
            ['district' => 'Sirajganj', 'distance' => 240],
            ['district' => 'Pabna', 'distance' => 275],
            // Mymensingh Division
            ['district' => 'Mymensingh', 'distance' => 310],
            ['district' => 'Jamalpur', 'distance' => 290],
            ['district' => 'Sherpur', 'distance' => 320],
            ['district' => 'Netrokona', 'distance' => 360],
            // Dhaka Division
            ['district' => 'Dhaka', 'distance' => 338],
            ['district' => 'Gazipur', 'distance' => 320],
            ['district' => 'Narayanganj', 'distance' => 360],
            ['district' => 'Narsingdi', 'distance' => 380],
            ['district' => 'Tangail', 'distance' => 250],
            ['district' => 'Manikganj', 'distance' => 310],
            ['district' => 'Munshiganj', 'distance' => 375],
            ['district' => 'Faridpur', 'distance' => 390],
            ['district' => 'Madaripur', 'distance' => 430],
            ['district' => 'Shariatpur', 'distance' => 450],
            ['district' => 'Rajbari', 'distance' => 360],
            ['district' => 'Gopalganj', 'distance' => 440],
            ['district' => 'Kishoreganj', 'distance' => 380],
            // Sylhet Division
            ['district' => 'Sylhet', 'distance' => 510],
            ['district' => 'Sunamganj', 'distance' => 490],
            ['district' => 'Habiganj', 'distance' => 450],
            ['district' => 'Moulvibazar', 'distance' => 495],
            // Khulna Division
            ['district' => 'Khulna', 'distance' => 450],
            ['district' => 'Jashore', 'distance' => 390],
            ['district' => 'Satkhira', 'distance' => 460],
            ['district' => 'Bagerhat', 'distance' => 480],
            ['district' => 'Kushtia', 'distance' => 310],
            ['district' => 'Jhenaidah', 'distance' => 350],
            ['district' => 'Chuadanga', 'distance' => 330],
            ['district' => 'Meherpur', 'distance' => 310],
            ['district' => 'Magura', 'distance' => 360],
            ['district' => 'Narail', 'distance' => 400],
            // Barishal Division
            ['district' => 'Barishal', 'distance' => 530],
            ['district' => 'Patuakhali', 'distance' => 580],
            ['district' => 'Bhola', 'distance' => 620],
            ['district' => 'Pirojpur', 'distance' => 540],
            ['district' => 'Jhalokathi', 'distance' => 545],
            ['district' => 'Barguna', 'distance' => 600],
            // Chattogram Division
            ['district' => 'Chattogram', 'distance' => 590],
            ['district' => 'Cox\'s Bazar', 'distance' => 720],
            ['district' => 'Feni', 'distance' => 520],
            ['district' => 'Noakhali', 'distance' => 550],
            ['district' => 'Lakshmipur', 'distance' => 540],
            ['district' => 'Chandpur', 'distance' => 490],
            ['district' => 'Cumilla', 'distance' => 470],
            ['district' => 'Brahmanbaria', 'distance' => 430],
            ['district' => 'Rangamati', 'distance' => 650],
            ['district' => 'Bandarban', 'distance' => 680],
            ['district' => 'Khagrachhari', 'distance' => 620]
        ];

        foreach ($districtDistances as $data) {
            \App\Models\DistrictDistance::create($data);
        }

        $maleHalls = [
            'Shaheed Nur Hossain Hall',
            'Shaheed President Ziaur Rahman Hall',
            'Shaheed Abrar Fahad Hall',
            'International Hall',
            'Bijoy 24 Hall'
        ];

        $femaleHalls = [
            'Begum Rokeya Hall',
            'Nawab Faizunnesa Hall',
            'Kobi Sufia Kamal Hall',
            'Khurshid Zahan Haque Hall'
        ];

        $halls = [];

        foreach ($maleHalls as $name) {
            $halls[] = \App\Models\Hall::create(['name' => $name, 'gender' => 'male']);
        }

        foreach ($femaleHalls as $name) {
            $halls[] = \App\Models\Hall::create(['name' => $name, 'gender' => 'female']);
        }

        $admin = User::create([
            'name' => 'System Admin',
            'email' => 'admin@example.com',
            'password' => bcrypt('password'),
            'role' => 'admin'
        ]);

        foreach ($halls as $hall) {
            // Create Hall Admin
            $hallAdmin = User::create([
                'name' => $hall->name . ' Admin',
                'email' => 'admin.' . strtolower(str_replace(' ', '', $hall->name)) . '@example.com',
                'password' => bcrypt('password'),
                'role' => 'admin',
                'hall_id' => $hall->id
            ]);

            // Create Hall Super
            $hallSuperUser = User::create([
                'name' => 'Prof. ' . $hall->name . ' Super',
                'email' => 'super.' . strtolower(str_replace(' ', '', $hall->name)) . '@example.com',
                'password' => bcrypt('password'),
                'role' => 'hall_super',
                'hall_id' => $hall->id
            ]);
            \App\Models\TeacherProfile::create([
                'user_id' => $hallSuperUser->id,
                'designation' => 'Professor',
                'department' => 'Computer Science and Engineering'
            ]);

            // Create Floors, Rooms, Seats
            for ($f = 1; $f <= 3; $f++) {
                $floor = \App\Models\Floor::create([
                    'hall_id' => $hall->id,
                    'name' => $f . ' Floor',
                    'floor_number' => $f
                ]);

                for ($r = 1; $r <= 5; $r++) {
                    $capacity = 4;
                    $room = \App\Models\Room::create([
                        'floor_id' => $floor->id,
                        'room_number' => $hall->id . '0' . $f . '0' . $r,
                        'purpose' => 'residential',
                        'square_feet' => 200,
                        'capacity' => $capacity
                    ]);

                    for ($s = 1; $s <= $capacity; $s++) {
                        \App\Models\Seat::create([
                            'room_id' => $room->id,
                            'seat_number' => $room->room_number . '-' . $s,
                            'status' => 'available'
                        ]);
                    }
                }
            }

            // Create Students
            for ($st = 1; $st <= 20; $st++) {
                $studentUser = User::create([
                    'name' => 'Student ' . $st . ' of ' . $hall->name,
                    'email' => 'student' . $st . '.' . strtolower(str_replace(' ', '', $hall->name)) . '@example.com',
                    'password' => bcrypt('password'),
                    'role' => 'student',
                    'hall_id' => $hall->id
                ]);

                $randomDistrict = $districtDistances[array_rand($districtDistances)]['district'];

                \App\Models\StudentProfile::create([
                    'user_id' => $studentUser->id,
                    'student_id' => '19020' . $hall->id . sprintf('%02d', $st),
                    'father_name' => 'Father of Student ' . $st,
                    'mother_name' => 'Mother of Student ' . $st,
                    'perm_district' => $randomDistrict,
                    'pres_district' => $randomDistrict,
                    'guardian_income' => rand(100000, 500000),
                    'cgpa' => rand(250, 400) / 100,
                    'is_residential' => false,
                ]);
            }
        }
    }
}
