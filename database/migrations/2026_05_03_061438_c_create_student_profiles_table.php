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
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('student_id')->unique();
            $table->string('father_name')->nullable();
            $table->string('mother_name')->nullable();
            $table->string('perm_division')->nullable();
            $table->string('perm_district')->nullable();
            $table->string('perm_upazilla')->nullable();
            $table->string('perm_post_code')->nullable();
            $table->string('perm_village')->nullable();
            $table->string('pres_division')->nullable();
            $table->string('pres_district')->nullable();
            $table->string('pres_upazilla')->nullable();
            $table->string('pres_post_code')->nullable();
            $table->string('pres_village')->nullable();
            $table->decimal('guardian_income', 10, 2)->nullable();
            $table->integer('distance_from_home')->nullable(); // In km
            $table->string('level')->nullable();
            $table->string('semester')->nullable();
            $table->string('degree')->nullable();
            $table->string('admission_year')->nullable();
            $table->decimal('cgpa', 3, 2)->nullable();
            $table->boolean('is_residential')->default(false);
            $table->foreignId('seat_id')->nullable()->constrained('seats')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('student_profiles');
    }
};
