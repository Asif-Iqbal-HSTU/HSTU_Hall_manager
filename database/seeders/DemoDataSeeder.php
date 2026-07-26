<?php

namespace Database\Seeders;

use App\Models\CanteenCosting;
use App\Models\CanteenMenu;
use App\Models\Complaint;
use App\Models\DistrictDistance;
use App\Models\FeePayment;
use App\Models\FeeStructure;
use App\Models\Floor;
use App\Models\Hall;
use App\Models\MealBooking;
use App\Models\Room;
use App\Models\Seat;
use App\Models\SeatApplication;
use App\Models\StudentAcademic;
use App\Models\StudentAddress;
use App\Models\StudentGuardian;
use App\Models\StudentResidential;
use App\Models\TeacherProfile;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Clean demo dataset for the HSTU Hall Manager.
 *
 * Keeps the 9 halls and the district_distances reference table, wipes every
 * other data table, then repopulates a realistic dataset:
 *   - 1 system admin
 *   - per hall: 1 hall administrator (role=admin) + 1 provost (role=hall_super)
 *   - per hall: a clean floor/room/seat structure
 *   - per hall: 5 students (gender-matched, real Bangladeshi names) with full
 *     academic / address / guardian / residential profiles
 *   - per hall: 4 students allocated a seat (approved application) + 1 pending
 *   - per hall: weekly canteen menu, recent costings, default meal prices
 *   - meal bookings for the residential students
 *
 * Every account's password is "password".
 */
class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        $this->clean();

        // Reference data (keep if present, otherwise reseed a minimal set).
        $distanceByDistrict = DistrictDistance::pluck('distance', 'district');

        // ---- Name / value pools --------------------------------------------
        $maleStudentNames = [
            'Md. Sakib Hasan', 'Abdullah Al Mamun', 'Rakibul Islam', 'Tanvir Ahmed', 'Mehedi Hasan',
            'Nayeem Islam', 'Shariar Kabir', 'Fahim Faisal', 'Ashiqur Rahman', 'Jahidul Islam',
            'Mahmudul Hasan', 'Rifat Hossain', 'Sabbir Ahmed', 'Naimur Rahman', 'Tahmid Chowdhury',
            'Riyad Hossain', 'Arif Hossain', 'Salauddin Ahmed', 'Imran Hossain', 'Kawsar Ahmed',
            'Zubayer Rahman', 'Mizanur Rahman', 'Tofael Ahmed', 'Rasel Mia', 'Hasibul Islam',
        ];
        $femaleStudentNames = [
            'Fatema Akter', 'Sumaiya Islam', 'Nusrat Jahan', 'Tania Sultana', 'Mim Akter',
            'Sadia Afrin', 'Jannatul Ferdous', 'Ayesha Siddika', 'Israt Jahan', 'Sharmin Akter',
            'Habiba Khatun', 'Lamia Islam', 'Nafisa Tabassum', 'Umme Habiba', 'Sanjida Akter',
            'Rabeya Basri', 'Maliha Rahman', 'Farhana Yasmin', 'Tasnim Ara', 'Mitu Rani Roy',
        ];
        $maleProvosts = [
            'Prof. Dr. Md. Abdul Karim', 'Prof. Dr. Mohammad Ali Hossain', 'Prof. Dr. Shahidul Islam',
            'Prof. Dr. A. K. M. Rezaul Karim', 'Prof. Dr. Bidhan Chandra Roy',
        ];
        $femaleProvosts = [
            'Prof. Dr. Rokeya Begum', 'Prof. Dr. Nasrin Sultana', 'Prof. Dr. Shahnaz Parvin', 'Prof. Dr. Mahmuda Khatun',
        ];
        $adminNames = [
            'Md. Golam Mostafa', 'Abul Kalam Azad', 'Md. Ruhul Amin', 'Nurul Islam', 'Md. Delwar Hossain',
            'Aminul Haque', 'Bimal Chandra Barman', 'Shafiqul Islam', 'Harun-or-Rashid',
        ];
        $departments = [
            ['name' => 'Computer Science and Engineering', 'code' => 5, 'degree' => 'B.Sc. (Engg.)'],
            ['name' => 'Electrical and Electronic Engineering', 'code' => 6, 'degree' => 'B.Sc. (Engg.)'],
            ['name' => 'Electronics and Communication Engineering', 'code' => 7, 'degree' => 'B.Sc. (Engg.)'],
            ['name' => 'Mechanical Engineering', 'code' => 9, 'degree' => 'B.Sc. (Engg.)'],
            ['name' => 'Civil Engineering', 'code' => 10, 'degree' => 'B.Sc. (Engg.)'],
            ['name' => 'Agronomy', 'code' => 1, 'degree' => 'B.Sc. (Ag.)'],
            ['name' => 'Statistics', 'code' => 12, 'degree' => 'B.Sc. (Hons.)'],
            ['name' => 'Food Engineering and Technology', 'code' => 14, 'degree' => 'B.Sc. (Engg.)'],
        ];
        $fatherNames = [
            'Md. Abdul Malek', 'Md. Nurul Islam', 'Abdul Karim', 'Md. Shahjahan Ali', 'Abdur Rahim',
            'Md. Abdul Hai', 'Mofizur Rahman', 'Abul Hossain', 'Md. Ismail Hossain', 'Nurul Amin',
            'Md. Lutfor Rahman', 'Abdus Salam', 'Md. Anwar Hossain', 'Sirajul Islam', 'Md. Yusuf Ali',
        ];
        $motherNames = [
            'Mst. Rahima Begum', 'Mst. Ayesha Khatun', 'Mst. Fatema Begum', 'Mst. Nurjahan Begum',
            'Mst. Sabina Yasmin', 'Mst. Hasina Begum', 'Mst. Rokeya Khatun', 'Mst. Salma Begum',
            'Mst. Momena Begum', 'Mst. Shirin Akter', 'Mst. Jahanara Begum', 'Mst. Rashida Begum',
        ];
        $occupations = ['Farmer', 'School Teacher', 'Businessman', 'Government Service', 'Bank Officer', 'Shopkeeper', 'Day Labourer', 'Retired'];

        $districtCycle = ['Dinajpur', 'Rangpur', 'Nilphamari', 'Thakurgaon', 'Panchagarh', 'Gaibandha',
            'Bogura', 'Rajshahi', 'Dhaka', 'Mymensingh', 'Sylhet', 'Khulna', 'Barishal', 'Chattogram', 'Cumilla'];

        $weeklyMenu = [
            'Saturday'  => ['Khichuri with Egg', 'Rice, Rui Fish Curry, Dal, Mixed Vegetables', 'Rice, Chicken Curry, Dal'],
            'Sunday'    => ['Paratha, Dal Fry, Omelette', 'Rice, Beef Curry, Dal, Salad', 'Rice, Egg Curry, Vegetables'],
            'Monday'    => ['Ruti, Vaji, Boiled Egg', 'Rice, Fish Bhuna, Dal, Vegetables', 'Rice, Chicken Curry, Dal'],
            'Tuesday'   => ['Khichuri', 'Rice, Chicken Roast, Dal, Salad', 'Rice, Fish Curry, Dal'],
            'Wednesday' => ['Paratha, Dal, Egg', 'Rice, Beef Bhuna, Dal', 'Rice, Vegetable Khichuri, Egg'],
            'Thursday'  => ['Ruti, Sabji', 'Rice, Rui Fish, Dal, Salad', 'Rice, Chicken Curry, Dal'],
            'Friday'    => ['Luchi, Halwa', 'Rice, Mutton Curry, Dal, Borhani', 'Rice, Egg Curry, Vegetables'],
        ];

        // Yearly hall fee per level (charged in the 1st semester of each level),
        // separately for residential and non-residential (attached) students.
        $feeByLevel = [
            1 => ['residential' => 3000, 'non_residential' => 1500],
            2 => ['residential' => 3000, 'non_residential' => 1500],
            3 => ['residential' => 3500, 'non_residential' => 2000],
            4 => ['residential' => 3500, 'non_residential' => 2000],
        ];

        // Sample anonymous complaints (seeded per hall for demo).
        $sampleComplaints = [
            ['Cleanliness & Sanitation', 'Washroom on 2nd floor needs cleaning', 'The washrooms on the 2nd floor have not been cleaned for several days. Please arrange regular cleaning.', 'in_progress', 'Cleaning staff has been notified; daily cleaning will resume from tomorrow.'],
            ['Canteen / Dining', 'Food quality declining', 'The dinner quality has dropped this week and portions are small for the price charged.', 'pending', null],
            ['Water & Electricity', 'Frequent power outage in Block A', 'There have been repeated power cuts at night in Block A affecting studies.', 'resolved', 'The faulty distribution board has been replaced. Issue resolved.'],
        ];

        // ---- System admin ---------------------------------------------------
        User::create([
            'name' => 'System Administrator',
            'email' => 'admin@hstu.ac.bd',
            'email_verified_at' => now(),
            'password' => Hash::make('password'),
            'role' => 'admin',
            'hall_id' => null,
        ]);

        $halls = Hall::orderBy('id')->get();
        $maleHallIndex = 0;
        $femaleHallIndex = 0;
        $studentSerial = 0;      // global running serial for names/ids
        $now = Carbon::now();

        foreach ($halls as $hi => $hall) {
            $isMale = $hall->gender === 'male';

            // Reset & open a current application window for the hall.
            $hall->update([
                'application_start' => $now->copy()->subDays(2),
                'application_end' => $now->copy()->addDays(14),
                'application_message' => "Applications are now open for seat allocation in {$hall->name}. "
                    . 'Eligible students should submit their application with correct academic, address and guardian '
                    . 'information before the deadline. Allocation is merit-based (CGPA, distance from home, family income).',
                'is_application_active' => true,
                'canteen_default_breakfast_price' => 25.00,
                'canteen_default_lunch_price' => 55.00,
                'canteen_default_dinner_price' => 50.00,
            ]);

            // Fee structure (yearly hall fee per level) for this hall — both types.
            foreach ($feeByLevel as $lvl => $amt) {
                FeeStructure::create(['hall_id' => $hall->id, 'level' => $lvl, 'residency' => 'residential', 'amount' => $amt['residential']]);
                FeeStructure::create(['hall_id' => $hall->id, 'level' => $lvl, 'residency' => 'non_residential', 'amount' => $amt['non_residential']]);
            }

            // ---- Hall administrator (role=admin, tied to the hall) ----------
            User::create([
                'name' => $adminNames[$hi],
                'email' => 'admin.hall' . $hall->id . '@hstu.ac.bd',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'admin',
                'hall_id' => $hall->id,
            ]);

            // ---- Provost / Hall Super (role=hall_super) ---------------------
            $provostName = $isMale ? $maleProvosts[$maleHallIndex] : $femaleProvosts[$femaleHallIndex];
            $provost = User::create([
                'name' => $provostName,
                'email' => 'provost.hall' . $hall->id . '@hstu.ac.bd',
                'email_verified_at' => now(),
                'password' => Hash::make('password'),
                'role' => 'hall_super',
                'hall_id' => $hall->id,
            ]);
            TeacherProfile::create([
                'user_id' => $provost->id,
                'designation' => 'Provost',
                'department' => $departments[$hi % count($departments)]['name'],
            ]);

            // ---- Physical structure: 3 floors -------------------------------
            // Floor 1: office + common room + 2 residential rooms
            // Floor 2: 3 residential rooms
            // Floor 3: dining hall + 3 residential rooms
            $residentialSeats = [];
            $floorPlan = [
                1 => ['office' => 1, 'common_room' => 1, 'residential' => 2],
                2 => ['residential' => 3],
                3 => ['dining_hall' => 1, 'residential' => 3],
            ];
            foreach ($floorPlan as $floorNumber => $plan) {
                $floor = Floor::create([
                    'hall_id' => $hall->id,
                    'name' => $this->ordinal($floorNumber) . ' Floor',
                    'floor_number' => $floorNumber,
                ]);
                $roomSeq = 0;
                foreach ($plan as $purpose => $count) {
                    for ($r = 1; $r <= $count; $r++) {
                        $roomSeq++;
                        $capacity = $purpose === 'residential' ? 4 : 0;
                        $room = Room::create([
                            'floor_id' => $floor->id,
                            'room_number' => $hall->id . sprintf('%d%02d', $floorNumber, $roomSeq),
                            'purpose' => $purpose,
                            'square_feet' => $purpose === 'residential' ? 220 : ($purpose === 'dining_hall' ? 1200 : 300),
                            'capacity' => $capacity,
                        ]);
                        for ($s = 1; $s <= $capacity; $s++) {
                            $residentialSeats[] = Seat::create([
                                'room_id' => $room->id,
                                'seat_number' => $room->room_number . '-' . chr(64 + $s), // e.g. 101-A
                                'status' => 'available',
                            ]);
                        }
                    }
                }
            }

            // ---- 5 students -------------------------------------------------
            $namePool = $isMale ? $maleStudentNames : $femaleStudentNames;
            $poolBase = $isMale ? $maleHallIndex * 5 : $femaleHallIndex * 5;

            for ($s = 0; $s < 5; $s++) {
                $studentSerial++;
                $name = $namePool[$poolBase + $s];
                $dept = $departments[($hi + $s) % count($departments)];
                $level = ($s % 4) + 1;                       // levels 1..4
                $admissionYear = 2025 - $level;               // level 4 -> 2021 intake, etc.
                $semester = $s % 2 === 0 ? 'I' : 'II';
                $cgpa = round(2.75 + (($studentSerial * 7) % 110) / 100, 2); // 2.75 .. 3.84, deterministic
                $studentId = sprintf('%02d%02d%03d', $admissionYear % 100, $dept['code'], $studentSerial);
                $district = $districtCycle[$studentSerial % count($districtCycle)];
                $distance = (int) ($distanceByDistrict[$district] ?? 0);

                $studentUser = User::create([
                    'name' => $name,
                    'email' => $studentId . '@student.hstu.ac.bd',
                    'email_verified_at' => now(),
                    'password' => Hash::make('password'),
                    'role' => 'student',
                    'hall_id' => $hall->id,
                ]);

                StudentAcademic::create([
                    'user_id' => $studentUser->id,
                    'student_id' => $studentId,
                    'department' => $dept['name'],
                    'degree' => $dept['degree'],
                    'level' => $level,
                    'semester' => $semester,
                    'current_cgpa' => $cgpa,
                ]);

                StudentAddress::create([
                    'user_id' => $studentUser->id,
                    'perm_district' => $district,
                    'perm_upazilla' => $district . ' Sadar',
                    'perm_village_area' => 'Village ' . chr(65 + ($s % 5)) . ', ' . $district,
                    'pres_district' => $district,
                    'pres_upazilla' => $district . ' Sadar',
                    'pres_village_area' => 'Village ' . chr(65 + ($s % 5)) . ', ' . $district,
                    'distance_from_home' => $distance,
                ]);

                StudentGuardian::create([
                    'user_id' => $studentUser->id,
                    'father_name' => $fatherNames[$studentSerial % count($fatherNames)],
                    'mother_name' => $motherNames[$studentSerial % count($motherNames)],
                    'guardian_name' => $fatherNames[$studentSerial % count($fatherNames)],
                    'guardian_occupation' => $occupations[$studentSerial % count($occupations)],
                    'annual_income_amount' => 90000 + (($studentSerial * 17) % 40) * 5000, // 90k .. 285k
                ]);

                // First 4 students: allocated a seat (approved). 5th: pending.
                $isAllocated = $s < 4;

                $application = SeatApplication::create([
                    'student_id' => $studentUser->id,
                    'hall_id' => $hall->id,
                    'status' => $isAllocated ? 'approved' : 'pending',
                    'cgpa' => $cgpa,
                    'guardian_income' => 90000 + (($studentSerial * 17) % 40) * 5000,
                    'distance_from_home' => $distance,
                    'created_at' => $now->copy()->subDay(),
                    'updated_at' => $isAllocated ? $now->copy()->subHours(6) : $now->copy()->subDay(),
                ]);

                if ($isAllocated) {
                    $seat = $residentialSeats[$s];   // deterministic seat per student
                    $seat->update(['status' => 'booked']);
                    StudentResidential::create([
                        'user_id' => $studentUser->id,
                        'status' => 'Residential',
                        'hall_id' => $hall->id,
                        'seat_id' => $seat->id,
                        'staying_from' => $now->copy()->subDays(20 + $s * 5)->toDateString(),
                    ]);

                    // A few meal bookings for the residential student.
                    for ($d = 0; $d < 3; $d++) {
                        MealBooking::create([
                            'user_id' => $studentUser->id,
                            'hall_id' => $hall->id,
                            'date' => $now->copy()->addDays($d + 1)->toDateString(),
                            'breakfast_units' => 1,
                            'lunch_units' => 1,
                            'dinner_units' => $d === 0 ? 0 : 1,
                        ]);
                    }
                } else {
                    StudentResidential::create([
                        'user_id' => $studentUser->id,
                        'status' => 'Non-Residential',
                        'hall_id' => $hall->id,
                        'seat_id' => null,
                        'staying_from' => null,
                    ]);
                }

                // Fee payments: allocated students have cleared past levels.
                // Even-indexed also cleared the current level (fully paid);
                // odd-indexed still owe the current level (due). Pending
                // student (s==4) has paid nothing.
                if ($isAllocated) {
                    $payThroughLevel = ($s % 2 === 0) ? $level : $level - 1;
                    for ($lvl = 1; $lvl <= $payThroughLevel; $lvl++) {
                        FeePayment::create([
                            'user_id' => $studentUser->id,
                            'hall_id' => $hall->id,
                            'level' => $lvl,
                            'amount' => $feeByLevel[$lvl]['residential'], // allocated students are residential
                            'payment_method' => 'offline',
                            'bank_name' => 'Sonali Bank PLC, HSTU Branch',
                            'transaction_ref' => 'TXN' . $studentSerial . $lvl . '00',
                            'voucher_no' => sprintf('HSTU-%02d-%d-L%d', $hall->id, $studentUser->id, $lvl),
                            'paid_on' => $now->copy()->subMonths((5 - $lvl) * 2)->toDateString(),
                            'verified_by' => $provost->id,
                            'remarks' => 'Verified against sealed bank voucher.',
                        ]);
                    }
                }
            }

            // ---- Sample anonymous complaints --------------------------------
            $complainantIds = User::where('hall_id', $hall->id)->where('role', 'student')
                ->orderBy('id')->take(count($sampleComplaints))->pluck('id')->all();
            foreach ($sampleComplaints as $ci => $c) {
                Complaint::create([
                    'hall_id' => $hall->id,
                    'user_id' => $complainantIds[$ci] ?? null, // hidden from authority; for the student's own view
                    'category' => $c[0],
                    'subject' => $c[1],
                    'message' => $c[2],
                    'status' => $c[3],
                    'response' => $c[4],
                    'responded_at' => $c[4] ? $now->copy()->subDays($ci + 1) : null,
                    'created_at' => $now->copy()->subDays($ci + 3),
                    'updated_at' => $now->copy()->subDays($ci),
                ]);
            }

            // ---- Canteen menu (7 days) + recent costings --------------------
            foreach ($weeklyMenu as $day => $meals) {
                CanteenMenu::create([
                    'hall_id' => $hall->id,
                    'day_of_week' => $day,
                    'breakfast' => $meals[0],
                    'lunch' => $meals[1],
                    'dinner' => $meals[2],
                ]);
            }
            for ($d = -5; $d <= 2; $d++) {
                CanteenCosting::create([
                    'hall_id' => $hall->id,
                    'date' => $now->copy()->addDays($d)->toDateString(),
                    'breakfast_price' => 25.00,
                    'lunch_price' => 55.00 + ($d % 2 === 0 ? 0 : 5),
                    'dinner_price' => 50.00,
                ]);
            }

            if ($isMale) {
                $maleHallIndex++;
            } else {
                $femaleHallIndex++;
            }
        }
    }

    /**
     * Wipe every data table except halls and the district_distances reference.
     */
    private function clean(): void
    {
        $tables = [
            'complaints', 'fee_payments', 'fee_structures',
            'meal_bookings', 'canteen_costings', 'canteen_menus',
            'seat_applications', 'seats', 'rooms', 'floors',
            'student_academics', 'student_addresses', 'student_residentials', 'student_guardians',
            'teacher_profiles', 'staff_profiles',
            'users', 'sessions', 'password_reset_tokens',
        ];

        DB::statement('SET FOREIGN_KEY_CHECKS=0');
        foreach ($tables as $table) {
            DB::table($table)->truncate();
        }
        DB::statement('SET FOREIGN_KEY_CHECKS=1');
    }

    private function ordinal(int $n): string
    {
        return match ($n) {
            1 => '1st',
            2 => '2nd',
            3 => '3rd',
            default => $n . 'th',
        };
    }
}
