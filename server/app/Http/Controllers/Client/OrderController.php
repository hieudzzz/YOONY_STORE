<?php

namespace App\Http\Controllers\Client;

use App\Events\OrderShipped;
use App\Http\Controllers\Controller;
use App\Http\Requests\Order\StoreOrderRequest;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\CouponUser;
use App\Models\Order;
use App\Models\OrderCancellation;
use App\Models\OrderCoupon;
use App\Models\OrderItem;
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
            switch ($request->status) {
                case Order::STATUS_ORDER_PENDING:
                    $orders = Order::query()
                        ->where('status_order', '=', Order::STATUS_ORDER_PENDING)
                        ->with(['items.variant'])
                        ->where('user_id', Auth::id())
                        ->orderBy('created_at', 'desc')
                        ->get();
                    break;

                case Order::STATUS_ORDER_CONFIRMED:
                    $orders = Order::query()
                        ->where('status_order', '=', Order::STATUS_ORDER_CONFIRMED)
                        ->with(['items.variant'])
                        ->where('user_id', Auth::id())
                        ->orderBy('created_at', 'desc')
                        ->get();
                    break;

                case Order::STATUS_ORDER_PREPARING_GOODS:
                    $orders = Order::query()
                        ->where('status_order', '=', Order::STATUS_ORDER_PREPARING_GOODS)
                        ->with(['items.variant'])
                        ->where('user_id', Auth::id())
                        ->orderBy('created_at', 'desc')
                        ->get();
                    break;

                case Order::STATUS_ORDER_SHIPPING:
                    $orders = Order::query()
                        ->where('status_order', '=', Order::STATUS_ORDER_SHIPPING)
                        ->with(['items.variant'])
                        ->where('user_id', Auth::id())
                        ->orderBy('created_at', 'desc')
                        ->get();
                    break;

                case Order::STATUS_ORDER_DELIVERED:
                    $orders = Order::query()
                        ->where('status_order', '=', Order::STATUS_ORDER_DELIVERED)
                        ->with(['items.variant'])
                        ->where('user_id', Auth::id())
                        ->orderBy('created_at', 'desc')
                        ->get();
                    break;

                case Order::STATUS_ORDER_CANCELED:
                    $orders = Order::query()
                        ->where('status_order', '=', Order::STATUS_ORDER_CANCELED)
                        ->with(['items.variant'])
                        ->where('user_id', Auth::id())
                        ->orderBy('created_at', 'desc')
                        ->get();
                    break;

                default:
                    $orders = Order::query()
                        ->with(['items.variant'])
                        ->where('user_id', Auth::id())
                        ->orderBy('created_at', 'desc')
                        ->get();
            }

            return response()->json([
                'data' => $orders,
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
            ->with(['items.variant.attributeValues.attribute', 'items.variant.product','items.variant.product.category', 'coupons.coupon', 'user'])
            ->where('user_id', Auth::id())
            ->where('code', $code)
            ->firstOrFail();

            $data = $data->toArray();
            foreach ($data['items'] as &$item) {
            if (isset($item['variant']['product'])) {
                $product = &$item['variant']['product'];
                if (isset($product['images'])) {
                    $images = json_decode($product['images'], true);
                    if (is_array($images)) {
                        foreach ($images as &$imageUrl) {
                            $imageUrl = stripslashes($imageUrl);
                        }
                    }
                    $product['images'] = $images;
                }
            
            }}
            
            return response()->json([
                'data' => $data,
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

    public function store(Request $request)
    {
        try {

            return DB::transaction(function() use ($request) {

                $selectedItems = $request->selected_items;
                // Nếu không có sản phẩm nào được chọn
                if (empty($selectedItems)) {
                    return response()->json([
                        'error' => 'Bạn chưa chọn sản phẩm nào để thanh toán.'
                    ]);
                }
                $cartItems = [];
                // Lấy thông tin các sản phẩm đã chọn
                $cartItems = Cart::query()
                ->with(['variant.attributeValues.attribute', 'variant.product', 'user', 'variant.inventoryStock'])
                ->where('user_id', Auth::id()) 
                ->whereIn('id', $selectedItems)
                ->get();

                if ($cartItems->isEmpty()) {
                    return response()->json(['error' => 'Không tìm thấy sản phẩm nào trong giỏ hàng.']);
                }

                $data =  $request->all();
                $data['user_id'] = Auth::id();
                $data['code'] = $this->generateOrderCode();
                $data['grand_total'] = 0;

                foreach ($cartItems as $value) {
                    $data['grand_total'] += $value->quantity * ($value->variant->sale_price ?: $value->variant->price);
                }

                $order = Order::query()->create($data);

                if($request->coupon_id && $request->discount_amount){
                    
                    $coupon = Coupon::query()->where('id',  $request->coupon_id)->first();
                    $coupon->usage_limit -= 1;
                    $coupon->save();

                    OrderCoupon::query()->create([
                        'order_id' =>  $order->id,
                        'discount_amount' => $request->discount_amount,
                        'coupon_id' => $request->coupon_id
                    ]);

                    CouponUser::create([
                        'user_id' => Auth::id(),
                        'coupon_id' => $request->coupon_id,
                        'used_at' => now(),
                    ]);
                }
                
                

                if (!$order) {
                    return response()->json(['error' => 'Đặt hàng không thành công.']);
                }
                

                //Gửi mail && Xóa cart
                $order['idCart'] = $selectedItems;
                $order['discount_amount'] = $request->discount_amount;
                $order['items']=$cartItems;
                $order['user']=Auth::user();
                $orderData = json_decode($order);
                OrderShipped::dispatch($orderData);
                
                return response()->json([
                    'message' =>  'ĐẶT HÀNG THÀNH CÔNG',
                    'description'=>'Xin cảm ơn Quý khách đã tin tưởng và mua sắm tại cửa hàng của chúng tôi.'
                ]);
            });


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

    public function canceledOrder(Request $request ,$id)
    {
        try {
            $order = Order::query()->findOrFail($id);

            $request->validate([
                'reason' => 'required|max:225'
            ], [
                'reason.required' => 'Vui lòng nhập lý do',
                'reason.max' => 'Tiêu đề không được vượt quá 225 ký tự.',
            ]);

            $reason = $request->reason;

            $order->update(['status_order' => Order::STATUS_ORDER_CANCELED]);

            OrderCancellation::create([
                'reason' => $reason,
                'order_id' => $id,
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
}