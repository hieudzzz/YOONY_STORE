<?php

namespace App\Console\Commands;

use App\Events\CheckExpiredSalePrices;
use Illuminate\Console\Command;

class CheckSalePrices extends Command
{


    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-sale-prices';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Gọi sự kiện
        event(new CheckExpiredSalePrices());
        $this->info('Đã kiểm tra và cập nhật giá khuyến mãi.');
    }
}
