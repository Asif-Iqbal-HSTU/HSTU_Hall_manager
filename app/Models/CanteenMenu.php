<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CanteenMenu extends Model
{
    protected $guarded = [];

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }
}
