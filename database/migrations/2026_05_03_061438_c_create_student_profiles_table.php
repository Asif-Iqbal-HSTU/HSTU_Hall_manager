<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('student_academics', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('student_id')->unique();
            $table->string('department');
            $table->string('degree');
            $table->integer('level'); // level 1-4
            $table->string('semester'); // semester I-II
            $table->decimal('current_cgpa', 3, 2);
            $table->timestamps();
        });

        Schema::create('student_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('perm_district');
            $table->string('perm_upazilla');
            $table->string('perm_village_area');
            $table->string('pres_district');
            $table->string('pres_upazilla');
            $table->string('pres_village_area');
            $table->integer('distance_from_home')->nullable(); // in km, calculated from perm_district
            $table->timestamps();
        });

        Schema::create('student_residentials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->enum('status', ['Residential', 'Non-Residential'])->default('Non-Residential');
            $table->foreignId('hall_id')->nullable()->constrained('halls')->onDelete('set null');
            $table->foreignId('seat_id')->nullable()->constrained('seats')->onDelete('set null');
            $table->date('staying_from')->nullable();
            $table->timestamps();
        });

        Schema::create('student_guardians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->unique()->constrained()->onDelete('cascade');
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('guardian_name')->nullable();
            $table->string('guardian_occupation');
            $table->decimal('annual_income_amount', 10, 2);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_guardians');
        Schema::dropIfExists('student_residentials');
        Schema::dropIfExists('student_addresses');
        Schema::dropIfExists('student_academics');
    }
};
