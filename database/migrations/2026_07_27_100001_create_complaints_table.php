<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('complaints', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hall_id')->constrained()->onDelete('cascade');
            // Nullable, and NEVER exposed to the hall authority. Kept only so the
            // submitting student can see their own complaints and any response.
            // The authority sees complaints anonymously.
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('set null');
            $table->string('category')->default('Other');
            $table->string('subject');
            $table->text('message');
            $table->enum('status', ['pending', 'in_progress', 'resolved'])->default('pending');
            $table->text('response')->nullable();
            $table->timestamp('responded_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('complaints');
    }
};
