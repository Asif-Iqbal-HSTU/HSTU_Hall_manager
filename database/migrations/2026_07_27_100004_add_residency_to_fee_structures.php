<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('fee_structures', function (Blueprint $table) {
            $table->dropUnique(['hall_id', 'level']);
            $table->enum('residency', ['residential', 'non_residential'])->default('residential')->after('level');
            $table->unique(['hall_id', 'level', 'residency']);
        });
    }

    public function down(): void
    {
        Schema::table('fee_structures', function (Blueprint $table) {
            $table->dropUnique(['hall_id', 'level', 'residency']);
            $table->dropColumn('residency');
            $table->unique(['hall_id', 'level']);
        });
    }
};
