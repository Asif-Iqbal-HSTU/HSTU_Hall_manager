<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // One row per (student, level) recorded by the hall authority once the
        // student presents a sealed bank voucher. Presence of a row == paid.
        Schema::create('fee_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('hall_id')->constrained()->onDelete('cascade');
            $table->integer('level');
            $table->decimal('amount', 10, 2);
            $table->enum('payment_method', ['online', 'offline'])->default('offline');
            $table->string('bank_name')->nullable();
            $table->string('transaction_ref')->nullable(); // bank txn / online ref
            $table->string('voucher_no')->nullable();
            $table->date('paid_on');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->text('remarks')->nullable();
            $table->timestamps();
            $table->unique(['user_id', 'level']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee_payments');
    }
};
