<?php

namespace App\Jobs;

use App\Models\Order;
use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class AutoMarkDelivered implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle()
    {
        \Log::info('AutoMarkDelivered Job started');
        // Lấy các đơn hàng ở trạng thái 'shipping' quá 7 ngày
        $orders = Order::where('status_order', Order::STATUS_ORDER_SHIPPING)
            ->where('shipped_at', '<=', Carbon::now()->subDays(7))
            ->get();

        foreach ($orders as $order) {
            $order->update([
                'status_order' => Order::STATUS_ORDER_DELIVERED,
                'completed_at' => now(),
            ]);
        }
    }

}