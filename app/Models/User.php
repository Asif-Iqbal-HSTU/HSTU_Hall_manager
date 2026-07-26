<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Fortify\TwoFactorAuthenticatable;

#[Fillable(['name', 'email', 'password', 'role', 'hall_id'])]
#[Hidden(['password', 'two_factor_secret', 'two_factor_recovery_codes', 'remember_token'])]
class User extends Authenticatable
{
    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }

    public function academic()
    {
        return $this->hasOne(StudentAcademic::class);
    }

    public function address()
    {
        return $this->hasOne(StudentAddress::class);
    }

    public function residential()
    {
        return $this->hasOne(StudentResidential::class);
    }

    public function guardian()
    {
        return $this->hasOne(StudentGuardian::class);
    }

    public function teacherProfile()
    {
        return $this->hasOne(TeacherProfile::class);
    }

    public function staffProfile()
    {
        return $this->hasOne(StaffProfile::class);
    }

    public function feePayments()
    {
        return $this->hasMany(FeePayment::class);
    }

    public function complaints()
    {
        return $this->hasMany(Complaint::class);
    }

    /**
     * Per-level hall-fee clearance summary for this student, up to their
     * current level. Each row: level, amount due, and whether it is paid.
     *
     * @return array<int, array{level:int, amount:float, paid:bool, payment:?FeePayment}>
     */
    public function clearanceSummary(): array
    {
        $currentLevel = (int) optional($this->academic)->level;
        if (! $currentLevel || ! $this->hall_id) {
            return [];
        }

        $structures = FeeStructure::where('hall_id', $this->hall_id)
            ->where('residency', $this->residencyKey())
            ->whereIn('level', range(1, $currentLevel))
            ->pluck('amount', 'level');
        $payments = $this->feePayments()->whereIn('level', range(1, $currentLevel))->get()->keyBy('level');

        $rows = [];
        for ($level = 1; $level <= $currentLevel; $level++) {
            $payment = $payments->get($level);
            $rows[] = [
                'level' => $level,
                'amount' => (float) ($structures[$level] ?? 0),
                'paid' => (bool) $payment,
                'payment' => $payment,
            ];
        }

        return $rows;
    }

    /**
     * Fee residency bucket for this student: 'residential' or 'non_residential'
     * (attached). Non-residential is the default when no seat is allocated.
     */
    public function residencyKey(): string
    {
        return optional($this->residential)->status === 'Residential' ? 'residential' : 'non_residential';
    }

    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable, TwoFactorAuthenticatable;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'two_factor_confirmed_at' => 'datetime',
        ];
    }
}
