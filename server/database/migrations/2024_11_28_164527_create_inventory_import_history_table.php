<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('inventory_import_history', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('variant_id');
            $table->unsignedBigInteger('supplier_id');
            $table->integer('quantity');
            $table->integer('import_price');

            $table->string('batch_number');
            $table->string('status')->default('Còn hàng');

            $table->timestamps();
            $table->foreign('variant_id')->references('id')->on('variants')->onDelete('cascade');
            $table->foreign('supplier_id')->references('id')->on('suppliers')->onDelete('cascade');  
        });
    }

    public function down()
    {
        Schema::dropIfExists('inventory_import_history');
    }
};
