<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryDeduction extends Model
{
    use HasFactory;

    protected $fillable = ['inventory_import_id', 'order_id','variant_id', 'quantity_deducted'];

    public function inventoryImport()
    {
        return $this->belongsTo(InventoryImport::class);
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }
    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }
}
