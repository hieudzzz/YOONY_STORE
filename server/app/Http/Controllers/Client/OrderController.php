<?php

namespace App\Http\Controllers\Client;

use App\Events\OrderCanceled;
use App\Events\OrderShipped;
use App\Events\OrderStatusChanged;
use App\Events\OrderStatusUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\CouponUser;
use App\Models\InventoryDeduction;
use App\Models\InventoryImport;
use App\Models\InventoryStock;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderCancellation;
use App\Models\OrderCoupon;
use App\Models\OrderItem;
use App\Models\User;
use App\Models\Variant;
use App\Services\VNPAYService;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Session;


class OrderController extends Controller
{


    private function generateOrderCode()
    {
        $date = date('Ymd');
        $lastOrder = Order::whereDate('created_at', today())->orderBy('code', 'desc')->first();

        if ($lastOrder && preg_match('/ORD-' . $date . '-(\d{3})$/', $lastOrder->code, $matches)) {
            $increment = intval($matches[1]) + 1;
        } else {
            $increment = 1;
        }

        return 'ORD-' . $date . '-' . str_pad($increment, 3, '0', STR_PAD_LEFT);
    }

    public function getOrder(Request $request)
    {
        try {
            $query = Order::query()
                ->with(['items.variant.product'])
                ->where('user_id', Auth::id())
                ->orderBy('created_at', 'desc');

            // Thêm điều kiện status nếu được chọn
            if (isset($request->status)) {
                $query->where('status_order', '=', $request->status);
            }

            // Phân trang với 10 items mỗi trang
            $orders = $query->paginate(10);

            return response()->json([
                'data' => $orders->items(),
                'meta' => [
                    'current_page' => $orders->currentPage(),
                    'per_page' => $orders->perPage(),
                    'last_page' => $orders->lastPage(),
                    'total' => $orders->total()
                ],
                'status' => 'success'
            ]);

        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);

            return response()->json([
                'message' => 'Lỗi tải trang',
                'status' => 'error',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function getOrderDetail($code)
    {
        try {

            $data = Order::query()
                ->with([
                    'items.variant.product.category',
                    'coupons.coupon',
                    'user',

                ])
                ->where('user_id', Auth::id())
                ->where('code', $code)
                ->firstOrFail();



            foreach ($data->items as &$item) {
                if (isset($item['order_item_attribute'])) {
                    $item['order_item_attribute'] = json_decode($item['order_item_attribute'], true);
                }
                if (isset($item['product_image'])) {

                    $item['product_image'] = stripslashes(trim($item['product_image'], '"'));
                }
            }

            // $data = $data->toArray();
            // foreach ($data['items'] as &$item) {
            // if (isset($item['variant']['product'])) {
            //     $product = &$item['variant']['product'];
            //     if (isset($product['images'])) {
            //         $images = json_decode($product['images'], true);
            //         if (is_array($images)) {
            //             foreach ($images as &$imageUrl) {
            //                 $imageUrl = stripslashes($imageUrl);
            //             }
            //         }
            //         $product['images'] = $images;
            //     }

            // }}

            $data['email'] = Auth::user()->email;


            return response()->json([
                'data' => $data,
                'status' => 'success'
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);

            return response()->json([
                'message' => 'Lỗi tải trang',
                'status' => 'error',

            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

    }

public function canceledOrder(Request $request, $id)
{
    try {
        // Tìm đơn hàng theo ID, kèm theo các quan hệ liên quan
        $order = Order::query()
            ->with(['items', 'user'])
            ->findOrFail($id);

        // Validate lý do hủy đơn hàng
        $request->validate([
            'reason' => 'required|max:225'
        ], [
            'reason.required' => 'Vui lòng nhập lý do',
            'reason.max' => 'Tiêu đề không được vượt quá 225 ký tự.',
        ]);

        $reason = $request->reason;

        // Cập nhật trạng thái đơn hàng thành "Đã hủy"
        $order->update(['status_order' => Order::STATUS_ORDER_CANCELED]);

        // Hoàn lại số lượng tồn kho và xử lý inventory_imports
        foreach ($order->items as $value) {
            // Kiểm tra xem variant_id có tồn tại không
            if ($value->variant_id) {
                $inventoryStock = InventoryStock::query()->where('variant_id', $value->variant_id)->first();

                if ($inventoryStock) {
                    $inventoryStock->update([
                        'quantity' => $inventoryStock->quantity + $value->quantity
                    ]);
                }

                // Lấy các bản ghi InventoryDeduction liên quan
                $deductions = InventoryDeduction::where('order_id', $order->id)
                    ->where('variant_id', $value->variant_id)
                    ->get();

                foreach ($deductions as $deduction) {
                    $inventoryImport = InventoryImport::withTrashed()->find($deduction->inventory_import_id);

                    if ($inventoryImport) {
                        if ($inventoryImport->trashed()) {
                            $inventoryImport->restore();
                        }

                        $inventoryImport->update([
                            'quantity' => $inventoryImport->quantity + $deduction->quantity_deducted
                        ]);
                    }
                }

                // Xóa các bản ghi InventoryDeduction liên quan
                InventoryDeduction::where('order_id', $order->id)
                    ->where('variant_id', $value->variant_id)
                    ->delete();
            } else {
                // Xử lý các sản phẩm không có variant (nếu cần)
                Log::warning('OrderItem không có variant', ['order_item_id' => $value->id]);
            }
        }


        // Ghi nhận lý do hủy đơn hàng
        OrderCancellation::create([
            'reason' => $reason,
            'order_id' => $id,
            'user_id' => Auth::id(),
        ]);

        $order['reason'] = $reason;
        $order['user']['code'] = $order->code;

        // Dispatch sự kiện hủy đơn hàng
        $dataOrder = json_encode($order);
        OrderCanceled::dispatch($dataOrder);

        return response()->json([
            'message' => 'Đơn hàng đã hủy thành công',
            'status' => 'success',
            'data' => $order
        ], Response::HTTP_OK);
    } catch (\Throwable $th) {
        // Ghi log lỗi nếu xảy ra
        Log::error(__CLASS__ . '@' . __FUNCTION__, [
            'line' => $th->getLine(),
            'message' => $th->getMessage()
        ]);

        return response()->json([
            'message' => 'Lỗi tải trang',
            'status' => 'error',
        ], Response::HTTP_INTERNAL_SERVER_ERROR);
    }
}
















    //xác nhận giao hàng
    public function confirmDelivered(Request $request, $code)
    {
        try {
            $order = Order::where('code', $code)->first();

            if (!$order) {
                return response()->json(['success' => false, 'message' => 'Không tìm thấy đơn hàng với mã: ' . $code], 404);
            }

            if ($order->status_order !== Order::STATUS_ORDER_SHIPPING) {
                return response()->json(['success' => false, 'message' => 'Chỉ các đơn hàng đang vận chuyển mới có thể chuyển sang trạng thái "Đã giao hàng".'], 400);
            }
            $isDelivered = $order->is_delivered ?? [];
            $isDelivered[] = 1;
            $order->is_delivered = $isDelivered;
            if (count($order->is_delivered) >= 2) {
                $order->status_order = Order::STATUS_ORDER_DELIVERED;
                $order->completed_at = now();

            }
            $order->save();


            // Cập nhật trạng thái đơn hàng
            // $order->update([
            //     'status_order' => Order::STATUS_ORDER_DELIVERED,
            //     'completed_at' => now(),
            // ]);

            // Tạo thông báo
            $notification = Notification::create([
                'user_id' => $order->user_id,
                'order_id' => $order->id,
                'order_code' => $order->code,
                'status' => $order->status_order,
                'content' => 'Đơn hàng ' . '<b>' . $order->code . '</b>' .
                             ' đã được cập nhật trạng thái thành <span style="color: #8bc34a;">' .
                             Order::STATUS_ORDER[$order->status_order] . '</span>',
            ]);

            // Phát sự kiện cho admin (kênh admin.notifications)
            event(new OrderStatusChanged($notification, $order->user_id));

            // Phát sự kiện cho client (kênh notifications.{userId})
            event(new OrderStatusUpdated($notification, $order->user_id));

            return response()->json([
                'success' => true,
                'message' => 'Trạng thái đơn hàng đã được cập nhật.',
                'order' => $order,
                'notification' => $notification,
            ]);
        } catch (\Exception $e) {
            \Log::error('Lỗi xác nhận đơn hàng: ' . $e->getMessage(), ['code' => $code]);

            return response()->json([
                'success' => false,
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý. Vui lòng thử lại sau.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }



}
