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
        Schema::create('canteen_menus', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hall_id')->constrained()->onDelete('cascade');
            $table->string('day_of_week'); // e.g. Saturday, Sunday...
            $table->text('breakfast')->nullable();
            $table->text('lunch')->nullable();
            $table->text('dinner')->nullable();
            $table->unique(['hall_id', 'day_of_week']);
            $table->timestamps();
        });

        Schema::create('canteen_costings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hall_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->decimal('breakfast_price', 10, 2)->default(0);
            $table->decimal('lunch_price', 10, 2)->default(0);
            $table->decimal('dinner_price', 10, 2)->default(0);
            $table->unique(['hall_id', 'date']);
            $table->timestamps();
        });

        Schema::create('meal_bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('hall_id')->constrained()->onDelete('cascade');
            $table->date('date');
            $table->integer('breakfast_units')->default(0);
            $table->integer('lunch_units')->default(0);
            $table->integer('dinner_units')->default(0);
            $table->unique(['user_id', 'date']);
            $table->timestamps();
        });

        Schema::table('halls', function (Blueprint $table) {
            $table->decimal('canteen_default_breakfast_price', 10, 2)->default(0);
            $table->decimal('canteen_default_lunch_price', 10, 2)->default(0);
            $table->decimal('canteen_default_dinner_price', 10, 2)->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('canteen_menus');
        Schema::dropIfExists('canteen_costings');
        Schema::dropIfExists('meal_bookings');

        Schema::table('halls', function (Blueprint $table) {
            $table->dropColumn([
                'canteen_default_breakfast_price',
                'canteen_default_lunch_price',
                'canteen_default_dinner_price'
            ]);
        });
    }
};
