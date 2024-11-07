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
        Schema::create('inventory_imports', function (Blueprint $table) {
            $table->id();
            $table->integer('quantity');
            $table->integer('import_price');
            $table->text('note');
            $table->foreignId('variant_id')->constrained('variants')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('inventory_imports');
    }
};
