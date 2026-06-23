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
        Schema::table('halls', function (Blueprint $table) {
            $table->dateTime('application_start')->nullable();
            $table->dateTime('application_end')->nullable();
            $table->text('application_message')->nullable();
            $table->boolean('is_application_active')->default(false);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('halls', function (Blueprint $table) {
            $table->dropColumn(['application_start', 'application_end', 'application_message', 'is_application_active']);
        });
    }
};
