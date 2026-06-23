<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MealBooking extends Model
{
    protected $guarded = [];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }
}
