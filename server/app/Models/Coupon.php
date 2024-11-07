<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    protected $table = 'coupons'; 

    protected $fillable = [
        'code',
        'discount',
        'discount_type',
        'usage_limit',
        'start_date',
        'end_date',
        'status',
        'is_featured',
        'min_order_value',
        'max_order_value',
        'winning_probability',
        'type'
    ];

    protected $casts = [
        'status' => 'boolean',
        'is_featured' => 'boolean',
    ];
    public function users() {
        return $this->belongsToMany(User::class, 'coupon_user');
    }
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id', 'id'); // Đảm bảo bạn đã xác định đúng tên khóa ngoại
    }

}