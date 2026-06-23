<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hall extends Model
{
    protected $guarded = [];

    public function floors()
    {
        return $this->hasMany(Floor::class);
    }

    public function rooms()
    {
        return $this->hasManyThrough(Room::class, Floor::class);
    }

    public function applications()
    {
        return $this->hasMany(SeatApplication::class);
    }
}
