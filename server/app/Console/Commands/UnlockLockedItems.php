<?php

namespace App\Console\Commands;

use App\Models\InventoryStock;
use App\Models\LockedItem;
use App\Models\Coupon;
use App\Models\CouponUser;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Log;
use Pusher\Pusher;

class UnlockLockedItems extends Command
{
    protected $signature = 'app:unlock-locked-items';

    protected $description = 'Unlock items that have exceeded the expiration time and update inventory stock, and restore coupon usage.';

    public function handle()
    {
        while (true) {
            $expirationTime = Carbon::now()->subMinutes(15);

            $expiredItems = LockedItem::where('locked_at', '<', $expirationTime)->get();

            if ($expiredItems->isEmpty()) {
                $this->info('No expired items found.');
            } else {
                foreach ($expiredItems as $item) {
                    $inventory = InventoryStock::where('variant_id', $item->variant_id)->first();
                    if ($inventory) {
                        $inventory->quantity += $item->quantity;
                        $inventory->save();
                    }

                    if ($item->user_id) {
                        try {
                            $this->restoreCouponsForUser($item->user_id);
                        } catch (\Exception $e) {
                            Log::error('Lỗi khi khôi phục coupon', [
                                'user_id' => $item->user_id,
                                'error' => $e->getMessage(),
                            ]);
                        }
                    }
                    $item->delete();

                }

                $this->info('Unlocked expired items and restored coupons successfully!');
            }

            sleep(60);
        }
    }

    private function restoreCouponsForUser(int $userId)
    {
        Log::info("Bắt đầu khôi phục tất cả coupon chưa sử dụng cho userId: {$userId}");

        $couponsUserHasNotUsed = CouponUser::where('user_id', $userId)
            ->whereNull('used_at') 
            ->get();

        foreach ($couponsUserHasNotUsed as $couponUser) {
            $coupon = Coupon::find($couponUser->coupon_id);

            if ($coupon) {
                $coupon->usage_limit += 1;
                $coupon->save();

                $couponUser->delete();

                Log::info("Hoàn trả số lượng coupon với ID: {$couponUser->coupon_id} cho userId: {$userId}");
            }
        }

        Log::info("Khôi phục coupon thành công cho userId: {$userId}");
    }


    public function sendPusherNotification($variantId, $quantity,$userId)
    {
        $pusher = new Pusher(
            env('PUSHER_APP_KEY'),
            env('PUSHER_SECRET'),
            env('PUSHER_APP_ID'),
            [
                'cluster' => env('PUSHER_CLUSTER'),
                'useTLS' => true
            ]
        );


        $data = [
            'variant_id' => $variantId,
            'quantity' => $quantity,
            'user_id' => $userId,
        ];

        $pusher->trigger('product-channel', 'inventory-updated', $data);
    }
}