<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\CouponUser;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class OderCheckController extends Controller
{
    public function checkOrder(Request $request)
    {
        $request->validate([
            'search' => 'required|string',
        ]);

        $search = $request->input('search');

        try {
            // Kiểm tra nếu 'search' là mã đơn hàng
            if (preg_match('/[A-Za-z]/', $search)) {
                $order = Order::where('code', $search)->first();

                // Nếu tìm thấy, trả về thông tin đơn hàng
                if ($order) {
                    return response()->json([
                        'status' => 'success',
                        'order' => $order,
                    ]);
                } else {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Không tìm thấy đơn hàng với mã đã cung cấp',
                    ], 404);
                }
            }

            $orders = Order::where('tel', $search)->get();

            if ($orders->count() > 0) {
                return response()->json([
                    'status' => 'success',
                    'orders' => $orders,
                ]);
            } else {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Không tìm thấy đơn hàng với số điện thoại đã cung cấp',
                ], 404);
            }
        } catch (\Throwable $th) {
            Log::error($th->getMessage());

            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra khi kiểm tra đơn hàng',
            ], 500);
        }
    }


    public function getEventCoupons(Request $request)
{
    // Lấy thông tin người dùng
    $user = $request->user();

    // Truy vấn các coupon đã nhận của người dùng với loại là 'event'
    $eventCoupons = CouponUser::where('user_id', $user->id)
        ->whereNull('used_at') // Kiểm tra xem coupon chưa được sử dụng
        ->join('coupons', 'coupon_users.coupon_id', '=', 'coupons.id')
        ->where('coupons.type', 'event')
        ->select('coupon_users.coupon_id', 'coupons.*', \DB::raw('COUNT(coupon_users.coupon_id) as total_count')) // Đếm số lượng coupon
        ->groupBy('coupon_users.coupon_id') // Nhóm theo coupon_id
        ->get();

    return response()->json([
        'event_coupons' => $eventCoupons,
    ]);
}





}
