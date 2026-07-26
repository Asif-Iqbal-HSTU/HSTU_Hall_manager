<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Add the column and the new composite unique first. Because the new
        // index still leads with hall_id, it can back the hall_id foreign key,
        // so the old unique can then be dropped (MySQL error 1553 otherwise).
        Schema::table('fee_structures', function (Blueprint $table) {
            $table->enum('residency', ['residential', 'non_residential'])->default('residential')->after('level');
            $table->unique(['hall_id', 'level', 'residency']);
        });
        Schema::table('fee_structures', function (Blueprint $table) {
            $table->dropUnique(['hall_id', 'level']);
        });
    }

    public function down(): void
    {
        Schema::table('fee_structures', function (Blueprint $table) {
            $table->unique(['hall_id', 'level']);
        });
        Schema::table('fee_structures', function (Blueprint $table) {
            $table->dropUnique(['hall_id', 'level', 'residency']);
            $table->dropColumn('residency');
        });
    }
};
