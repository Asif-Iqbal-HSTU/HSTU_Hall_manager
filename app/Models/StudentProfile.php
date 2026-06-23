<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentProfile extends Model
{
    protected $guarded = [];

    protected static function booted()
    {
        static::saving(function ($profile) {
            $districtName = $profile->perm_district ?: $profile->pres_district;
            if ($districtName) {
                $districtDistance = \App\Models\DistrictDistance::where('district', trim($districtName))->first();
                if ($districtDistance) {
                    $profile->distance_from_home = $districtDistance->distance;
                }
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function seat()
    {
        return $this->belongsTo(Seat::class);
    }

    public function applications()
    {
        return $this->hasMany(SeatApplication::class, 'student_id');
    }
}
