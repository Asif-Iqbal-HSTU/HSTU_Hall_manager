<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // The yearly hall fee a student must clear, configured per hall & level.
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hall_id')->constrained()->onDelete('cascade');
            $table->integer('level'); // 1..4
            $table->decimal('amount', 10, 2)->default(0);
            $table->timestamps();
            $table->unique(['hall_id', 'level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee_structures');
    }
};
