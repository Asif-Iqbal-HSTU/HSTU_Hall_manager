<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class StudentResidential extends Model
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

    public function seat()
    {
        return $this->belongsTo(Seat::class);
    }
}
