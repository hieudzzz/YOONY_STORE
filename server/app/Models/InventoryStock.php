<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InventoryStock extends Model
{
    use HasFactory;
    protected $fillable = ['quantity', 'variant_id','reserved_stock','available_stock','last_updated'];

    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }
}