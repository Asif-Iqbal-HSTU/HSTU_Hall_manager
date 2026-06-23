<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SeatApplication extends Model
{
    protected $guarded = [];

    public function student()
    {
        return $this->belongsTo(StudentProfile::class, 'student_id');
    }

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }
}
