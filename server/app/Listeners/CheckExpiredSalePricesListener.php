<?php

namespace App\Listeners;

use App\Events\CheckExpiredSalePrices;
use App\Models\Variant;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class CheckExpiredSalePricesListener
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(CheckExpiredSalePrices $event)
    {
        // Lấy tất cả các variant có giá khuyến mãi đã hết hạn
        $variants = Variant::where('end_sale', '<', now())
            ->whereNotNull('sale_price')
            ->get();

        foreach ($variants as $variant) {
            // Xóa sale_price
            $variant->sale_price = null;
            $variant->end_sale = null;
            $variant->save();
        }
    }
}
