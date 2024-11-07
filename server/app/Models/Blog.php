<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    protected $table = 'blogs';

    protected $fillable = [
        'content',
        'slug',
        'user_id',
        'is_active',
    ];

    public function user()
{
    return $this->belongsTo(User::class);
}
}
