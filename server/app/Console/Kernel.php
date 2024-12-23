<?php

namespace App\Console;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Foundation\Console\Kernel as ConsoleKernel;

class Kernel extends ConsoleKernel
{
    /**
     * Define the application's command schedule.
     */
    protected function schedule(Schedule $schedule): void
    {
        // $schedule->command('inspire')->hourly();
        // Tự động xóa token hết hạn
        $schedule->command('sanctum:prune-expired --hours=24')->daily();

        // $schedule->command('sale:check-expired')->everyMinute(); // Cấu hình để cron job chạy mỗi phút

        // // Nếu bạn cần chạy command mỗi giây, sử dụng cách này:
        // $schedule->command('sale:check-expired')
        //          ->everyMinute()
        //          ->appendOutputTo(storage_path('logs/sale-expired.log'));
        //  $schedule->command('order:update-status')->daily();
        // $schedule->exec('php artisan app:update-sale-price-realtime & php artisan app:unlock-locked-items')
        // ->everyMinute()
        // ->name('Run both commands together');
        $schedule->command('app:unlock-locked-items')->everyMinute();


        $schedule->command('order:update-status')

            ->hourly()
            ->appendOutputTo(storage_path('logs/order-status.log'));

        
        // Chạy mỗi ngày kiểm tra đơn hàng
        $schedule->job(new \App\Jobs\AutoMarkDelivered())->everyMinute();

    }

    /**
     * Register the commands for the application.
     */
    protected function commands(): void
    {
        $this->load(__DIR__ . '/Commands');

        require base_path('routes/console.php');
    }
}