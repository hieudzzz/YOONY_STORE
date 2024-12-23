<?php

namespace App\Http\Controllers\Admin;

use App\Events\OrderStatusChanged;
use App\Events\OrderStatusUpdated;
use App\Http\Controllers\Controller;
use App\Models\Notification;
use App\Models\Order;
use App\Models\OrderCancellation;
use DB;
use Http;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function index(Request $request)
    {
       try {
        $perPage = $request->input('per_page', 10);

        switch ($request->status) {
            case Order::STATUS_ORDER_PENDING:
                $orders = Order::query()
                ->where('status_order', '=', Order::STATUS_ORDER_PENDING)
                ->with(['items.variant'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
                break;
            case Order::STATUS_ORDER_CONFIRMED:
                $orders = Order::query()
                ->where('status_order', '=', Order::STATUS_ORDER_CONFIRMED)
                ->with(['items.variant'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
                break;
            case Order::STATUS_ORDER_PREPARING_GOODS:
                $orders = Order::query()
                ->where('status_order', '=', Order::STATUS_ORDER_PREPARING_GOODS)
                ->with(['items.variant'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
                break;
            case Order::STATUS_ORDER_SHIPPING:
                $orders = Order::query()
                ->where('status_order', '=', Order::STATUS_ORDER_SHIPPING)
                ->with(['items.variant'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
                break;
            case Order::STATUS_ORDER_DELIVERED:
                $orders = Order::query()
                ->where('status_order', '=', Order::STATUS_ORDER_DELIVERED)
                ->with(['items.variant'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
                 break;
            case Order::STATUS_ORDER_CANCELED:
                $orders = Order::query()
                ->where('status_order', '=', Order::STATUS_ORDER_CANCELED)
                ->with(['items.variant'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
                break;
            default:
                $orders = Order::query()
                ->with(['items.variant'])
                ->orderBy('created_at', 'desc')
                ->paginate($perPage);
            }

        return response()->json(
            [
                'data' => $orders,
                'status' => 'success'
            ],Response::HTTP_OK);
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

    public function orderDetail($code)
    {

        try {
            $orders = Order::query()
                ->with([
                    'items.variant.attributeValues.attribute',
                    'items.variant.product',
                    'items.variant.product.category',
                    'coupons.coupon',
                    'user'
                ])
                ->where('code', $code)
                ->firstOrFail();

            $data = $orders->toArray();

            foreach ($data['items'] as &$item) {
                if (isset($item['variant']['product'])) {
                    $product = &$item['variant']['product'];
                    if (isset($product['images'])) {
                        $images = json_decode($product['images'], true);
                        if (is_array($images)) {
                            foreach ($images as &$imageUrl) {
                                $imageUrl = htmlspecialchars(stripslashes($imageUrl));
                            }
                        } else {
                            $product['images'] = [];
                        }
                        $product['images'] = $images;
                    }
                }
            }

            return response()->json(
                [
                    'data' => $data, // Use the processed data instead of orders directly
                    'status' => 'success'
                ],
                Response::HTTP_OK
            );
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



    public function updateOrderDetail(Request $request, $code)
    {
       try {

        $order = Order::query()
        ->with(['items.variant.attributeValues.attribute', 'items.variant.product'])
        ->where('code', $code)
        ->firstOrFail();

        $status = $request->input('status');

        switch ($status) {
            case Order::STATUS_ORDER_PENDING:
                $order->status_order = $status;
                $order->save();

                $notification = Notification::create([
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'order_code' => $order->code,
                    'status'=>$order->status_order,
                    'content' => 'Đơn hàng ' . '<b>' . $order->code . '</b>' . ' đã được cập nhật trạng thái thành <span style="color: #ff9800;">' . Order::STATUS_ORDER[$order->status_order] . '</span>',
                ]);

                event(new OrderStatusUpdated($notification, $order->user_id));

                return response()->json([
                    'success' => true,
                    'message' => 'Trạng thái đơn hàng đã được cập nhật.',
                    'order' => $order,
                    'notification' => $notification
                ]);
            case Order::STATUS_ORDER_CONFIRMED:
                $order->status_order = $status;
                $order->save();

                $notification = Notification::create([
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'order_code' => $order->code,
                    'status'=>$order->status_order,
                    'content' => 'Đơn hàng ' . '<b>' . $order->code . '</b>' . ' đã được cập nhật trạng thái thành <span style="color: #4caf50;">' . Order::STATUS_ORDER[$order->status_order] . '</span>',
                ]);

                event(new OrderStatusUpdated($notification, $order->user_id));

                return response()->json([
                    'success' => true,
                    'message' => 'Trạng thái đơn hàng đã được cập nhật.',
                    'order' => $order,
                    'notification' => $notification
                ]);
            case Order::STATUS_ORDER_PREPARING_GOODS:
                $order->status_order = $status;
                $order->save();

                $notification = Notification::create([
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'order_code' => $order->code,
                    'status'=>$order->status_order,
                    'content' => 'Đơn hàng ' . '<b>' . $order->code . '</b>' . ' đã được cập nhật trạng thái thành <span style="color: #2196f3;">' . Order::STATUS_ORDER[$order->status_order] . '</span>',
                ]);

                event(new OrderStatusUpdated($notification, $order->user_id));

                return response()->json([
                    'success' => true,
                    'message' => 'Trạng thái đơn hàng đã được cập nhật.',
                    'order' => $order,
                    'notification' => $notification
                ]);
            case Order::STATUS_ORDER_SHIPPING:
                $order->status_order = $status;
                $order->save();

                $notification = Notification::create([
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'order_code' => $order->code,
                    'status'=>$order->status_order,
                    'is_delivered'=> json_encode($order->is_delivered),
                    'content' => 'Đơn hàng ' . '<b>' . $order->code . '</b>' . ' đã được cập nhật trạng thái thành <span style="color: #03a9f4;">' . Order::STATUS_ORDER[$order->status_order] . '</span>',
                ]);

                event(new OrderStatusUpdated($notification, $order->user_id));

                return response()->json([
                    'success' => true,
                    'message' => 'Trạng thái đơn hàng đã được cập nhật.',
                    'order' => $order,
                    'notification' => $notification
                ]);
            case Order::STATUS_ORDER_DELIVERED:
                $isDelivered = $order->is_delivered ?? [];
                $isDelivered = [1];
                $order->is_delivered = $isDelivered;
                if (count($order->is_delivered) >= 2) {
                    $order->status_order = Order::STATUS_ORDER_DELIVERED;
                    $order->completed_at = now();
                }
                $order->save();

                $notification = Notification::create([
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'order_code' => $order->code,
                    'status'=>$order->status_order,
                    'is_delivered'=> json_encode($order->is_delivered),
                    'content' => 'Đơn hàng ' . '<b>' . $order->code . '</b>' . ' đã được cập nhật trạng thái thành <span style="color: #8bc34a;">' . Order::STATUS_ORDER[$order->status_order] . '</span>',
                ]);

                event(new OrderStatusUpdated($notification, $order->user_id));

                return response()->json([
                    'success' => true,
                    'message' => 'Trạng thái đơn hàng đã được cập nhật.',
                    'order' => $order,
                    'notification' => $notification
                ]);
            case Order::STATUS_ORDER_CANCELED:
                $order->status_order = $status;
                $order->save();

                $notification = Notification::create([
                    'user_id' => $order->user_id,
                    'order_id' => $order->id,
                    'order_code' => $order->code,
                    'status'=>$order->status_order,
                    'content' => 'Đơn hàng ' . '<b>' . $order->code . '</b>' . ' đã được cập nhật trạng thái thành <span style="color: #f44336;">' . Order::STATUS_ORDER[$order->status_order] . '</span>',
                ]);

                event(new OrderStatusUpdated($notification, $order->user_id));

                return response()->json([
                    'success' => true,
                    'message' => 'Trạng thái đơn hàng đã được cập nhật.',
                    'order' => $order,
                    'notification' => $notification
                ]);
            default:
                return response()->json([
                    'success' => false,
                    'message' => 'Trạng thái không hợp lệ.'
                ], 400);
        }


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

    public function canceledOrder(Request $request ,$code)
    {
        try {
            $order = Order::query()->where('code', $code)->first();

            if(!$order){
                return response()->json([
                            'message' => 'Không tìm thấy sản phẩm',
                            'status' => 'error',
                        ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            $request->validate([
                'reason' => 'required|max:225'
            ], [
                'reason.required' => 'Vui lòng nhập lý do',
                'reason.max' => 'Tiêu đề không được vượt quá 225 ký tự.',
            ]);

            $reason = $request->reason;
            if($order->status_order	 === Order::STATUS_ORDER_CANCELED 
                || $order->status_order === Order::STATUS_ORDER_SHIPPING
                || $order->status_order === Order::STATUS_ORDER_DELIVERED)
            {
                return response()->json([
                    'message' => 'Đơn hàng đang được giao. Không thể hủy đơn hàng',
                    'status' => 'success',
                ], Response::HTTP_INTERNAL_SERVER_ERROR);
            }

            $order->status_order = Order::STATUS_ORDER_CANCELED;
            $order->save();
            // $order->update(['status_order' => Order::STATUS_ORDER_CANCELED]);

            OrderCancellation::create([
                'reason' => $reason,
                'order_id' =>  $order->id,
                'user_id' => Auth::id(),
            ]);

            return response()->json([
                'message' => 'Đơn hàng đã hủy thành công',
                'status' => 'success',
                'data' => $order
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

    public function updateMuch(Request $request)
    {
        try {
            $ids = $request->ids;
    
            if (!is_array($ids) || empty($ids)) {
                return response()->json(['message' => 'Danh sách không hợp lệ!'], 400);
            }

    
            Log::info($ids);
            $updatedOrders = []; // Danh sách đơn hàng được cập nhật
    
            foreach ($ids as $id) {
                $order = Order::find($id);
    
                if (!$order) {
                    continue; // Bỏ qua nếu không tìm thấy đơn hàng
                }
    
                switch ($order->status_order) {
                    case Order::STATUS_ORDER_PENDING:
                        $newStatus = Order::STATUS_ORDER_CONFIRMED;
                        $order->status_order = $newStatus;
                        $order->save();
                        // Tạo thông báo
                        $notification = Notification::create([
                            'user_id' => $order->user_id,
                            'order_id' => $order->id,
                            'order_code' => $order->code,
                            'status' => $newStatus,
                            'is_delivered' => json_encode($order->is_delivered),
                            'content' => 'Đơn hàng <b>' . $order->code . '</b> đã được cập nhật trạng thái thành <span style="color: #2196f3;">' . Order::STATUS_ORDER[$newStatus] . '</span>',
                        ]);
                        break;
                    case Order::STATUS_ORDER_CONFIRMED:
                        $newStatus = Order::STATUS_ORDER_PREPARING_GOODS;
                        $order->status_order = $newStatus;
                        $order->save();
                        // Tạo thông báo
                        $notification = Notification::create([
                            'user_id' => $order->user_id,
                            'order_id' => $order->id,
                            'order_code' => $order->code,
                            'status' => $newStatus,
                            'is_delivered' => json_encode($order->is_delivered),
                            'content' => 'Đơn hàng <b>' . $order->code . '</b> đã được cập nhật trạng thái thành <span style="color: #2196f3;">' . Order::STATUS_ORDER[$newStatus] . '</span>',
                        ]);
                        break;
                    case Order::STATUS_ORDER_PREPARING_GOODS:
                        $newStatus = Order::STATUS_ORDER_SHIPPING;
                        $order->status_order = $newStatus;
                        $order->save();
                        // Tạo thông báo
                        $notification = Notification::create([
                            'user_id' => $order->user_id,
                            'order_id' => $order->id,
                            'order_code' => $order->code,
                            'status' => $newStatus,
                            'is_delivered' => json_encode($order->is_delivered),
                            'content' => 'Đơn hàng <b>' . $order->code . '</b> đã được cập nhật trạng thái thành <span style="color: #2196f3;">' . Order::STATUS_ORDER[$newStatus] . '</span>',
                        ]);
                        break;
                    case Order::STATUS_ORDER_SHIPPING:
                        $isDelivered = $order->is_delivered ?? [];
                        $isDelivered = [1];
                        $order->is_delivered = $isDelivered;
                        $newStatus = Order::STATUS_ORDER_SHIPPING;


                        $order->status_order = $newStatus;
                        if (count($order->is_delivered) >= 2) {
                            $order->completed_at = now();

                        }                    
                        $order->save();
                        // Tạo thông báo
                        $notification = Notification::create([
                            'user_id' => $order->user_id,
                            'order_id' => $order->id,
                            'order_code' => $order->code,
                            'status' => $newStatus,
                            // 'is_delivered' => json_decode($order->is_delivered),
                            'content' => 'Đơn hàng <b>' . $order->code . '</b> đã được cập nhật trạng thái thành <span style="color: #2196f3;">' . Order::STATUS_ORDER[$newStatus] . '</span>',
                        ]);
                        break;
                    default:
                        $newStatus = null;
                        break;
                    }
    
                  continue; // Bỏ qua nếu trạng thái không hợp lệ
                }
                // Phát event real-time
                event(new OrderStatusUpdated($notification, $order->user_id));
    
                // Thêm đơn hàng đã cập nhật vào danh sách
                $updatedOrders[] = [
                    'order_id' => $order->id,
                    'order_code' => $order->code,
                    'new_status' => $newStatus,
                ];
            
    
            if (empty($updatedOrders)) {
                return response()->json(['message' => 'Không có đơn hàng nào được cập nhật.'], 400);
            }
    
            return response()->json([
                'message' => 'Cập nhật trạng thái thành công.',
                'updated_orders' => $updatedOrders,
            ], Response::HTTP_OK);

        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage(),
            ]);
    
            return response()->json([
                'message' => 'Lỗi hệ thống.',
                'status' => 'error',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    

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

            if ($order->user_id !== auth()->id() && !auth()->user()->isAdmin()) {
                return response()->json(['success' => false, 'message' => 'Bạn không có quyền thực hiện hành động này.'], 403);
            }

            // Cập nhật trạng thái đơn hàng
            $order->update([
                'status_order' => Order::STATUS_ORDER_DELIVERED,
                'completed_at' => now(),
            ]);

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

    public function getDeliveredOrders(Request $request)
    {
        // Lọc các đơn hàng có trạng thái STATUS_ORDER_DELIVERED
        $orders = Order::where('status', Order::STATUS_ORDER_DELIVERED)
                       ->get();

        // Kiểm tra nếu không có đơn hàng nào
        if ($orders->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Không có đơn hàng nào có trạng thái "Đã giao hàng".'
            ], 404);
        }

        // Trả về kết quả dưới dạng JSON
        return response()->json([
            'success' => true,
            'orders' => $orders
        ]);
    }

    public function filterOrdersByDateRange(Request $request)
    {
        try {
            // Lấy giá trị bắt đầu và kết thúc từ request
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            // Xác thực dữ liệu đầu vào
            $request->validate([
                'start_date' => 'required|date|before_or_equal:end_date',
                'end_date' => 'required|date|after_or_equal:start_date',
            ], [
                'start_date.required' => 'Ngày bắt đầu là bắt buộc.',
                'start_date.date' => 'Ngày bắt đầu không hợp lệ.',
                'start_date.before_or_equal' => 'Ngày bắt đầu phải trước hoặc bằng ngày kết thúc.',
                'end_date.required' => 'Ngày kết thúc là bắt buộc.',
                'end_date.date' => 'Ngày kết thúc không hợp lệ.',
                'end_date.after_or_equal' => 'Ngày kết thúc phải sau hoặc bằng ngày bắt đầu.',
            ]);

            // Truy vấn đơn hàng trong khoảng thời gian
            $orders = Order::query()
                ->whereBetween('created_at', [$startDate, $endDate])
                ->with(['items.variant'])
                ->orderBy('created_at', 'desc')
                ->get();

            // Kiểm tra nếu không có đơn hàng nào
            if ($orders->isEmpty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Không có đơn hàng nào trong khoảng thời gian này.',
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $orders,
            ], 200);

        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage(),
            ]);

            return response()->json([
                'message' => 'Đã xảy ra lỗi trong quá trình xử lý.',
                'status' => 'error',
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }


}