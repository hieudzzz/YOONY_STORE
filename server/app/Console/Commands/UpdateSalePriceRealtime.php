<?php

namespace App\Console\Commands;

use App\Models\Variant;
use Carbon\Carbon;
use Illuminate\Console\Command;

class UpdateSalePriceRealtime extends Command
{
    protected $signature = 'app:update-sale-price-realtime';

    protected $description = 'Update sale_price and end_sale to null when the sale period ends in realtime.';

    public function handle()
    {
        while (true) { // Vòng lặp vô hạn để kiểm tra liên tục
            $currentTime = Carbon::now();

            // Lấy các bản ghi có end_sale đã hết hạn
            $expiredSales = Variant::whereNotNull('sale_price')
                ->whereNotNull('end_sale')
                ->where('end_sale', '<', $currentTime)
                ->get();

            if ($expiredSales->isEmpty()) {
                $this->info('No expired sale prices found.');
            } else {
                foreach ($expiredSales as $variant) {
                    // Cập nhật sale_price và end_sale về null
                    $variant->update([
                        'sale_price' => null,
                        'end_sale' => null,
                    ]);

                    $this->info("Sale price reset for Variant ID: {$variant->id}");
                }
            }

            sleep(5);
        }
    }
}
