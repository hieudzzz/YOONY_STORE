<?php


namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LockedItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'cart_id',
        'variant_id',
        'quantity',
        'locked_at'
    ];

    // Liên kết với các model khác
    public function variant()
    {
        return $this->belongsTo(Variant::class);
    }

    public function cart()
    {
        return $this->belongsTo(Cart::class);
    }
    public function user()
{
    return $this->belongsTo(User::class, 'user_id');
}

}
