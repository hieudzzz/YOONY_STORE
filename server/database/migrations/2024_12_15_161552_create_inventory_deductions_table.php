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
        Schema::create('inventory_deductions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('inventory_import_id');
            $table->unsignedBigInteger('order_id');
            $table->unsignedBigInteger('variant_id');
            $table->integer('quantity_deducted');
            $table->timestamps();

            $table->foreign('inventory_import_id')->references('id')->on('inventory_imports')->onDelete('cascade');
            $table->foreign('order_id')->references('id')->on('orders')->onDelete('cascade');
            $table->foreign('variant_id')->references('id')->on('variants')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_deductions');
    }
};
