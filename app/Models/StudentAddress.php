<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentAddress extends Model
{
    protected $guarded = [];

    protected static function booted()
    {
        static::saving(function ($address) {
            if (is_null($address->distance_from_home)) {
                $districtName = $address->perm_district ?: $address->pres_district;
                if ($districtName) {
                    $districtDistance = \App\Models\DistrictDistance::where('district', trim($districtName))->first();
                    if ($districtDistance) {
                        $address->distance_from_home = $districtDistance->distance;
                    }
                }
            }
        });
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
