<?php

namespace App\Http\Controllers\Client;

use App\Events\OrderShipped;
use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Coupon;
use App\Models\CouponUser;
use App\Models\InventoryStock;
use App\Models\LockedItem;
use App\Models\Order;
use App\Models\OrderCoupon;
use App\Models\Variant;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    private $tmnCode = "KFDM60UR";
    private $secretKey = "TSM1WWZ64ZAR2KYEEHAE99OWBYBCW9VQ";
    private $vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    private $returnUrl = "http://localhost:5173/check-out";

    // Cấu hình MoMo
    private $momoEndpoint = "https://test-payment.momo.vn/v2/gateway/api/create";
    private $momoPartnerCode = "MOMOBKUN20180529";
    private $momoAccessKey = "klm05TvNBzhg7h7j";
    private $momoSecretKey = "at67qH6mk8w5Y1nAyMoYKMWACiEi2bsa";
    private $momoReturnUrl = "http://localhost:5173/check-out";

    public function processPayment(Request $request)
{
    $paymentMethod = $request->payment_method;

    // Kiểm tra số lượng sản phẩm trong giỏ hàng
    $selectedItems = $request->selected_items;
    if (empty($selectedItems)) {
        return response()->json(['error' => 'Bạn chưa chọn sản phẩm nào để thanh toán.'], 400);
    }

    // Mở một giao dịch để kiểm tra và cập nhật kho
    return DB::transaction(function () use ($request, $selectedItems, $paymentMethod) {
        $cartItems = Cart::query()
            ->with(['variant.product', 'variant.inventoryStock'])
            ->where('user_id', Auth::id())
            ->whereIn('id', $selectedItems)
            ->get();

        if ($cartItems->isEmpty()) {
            return response()->json(['error' => 'Không tìm thấy sản phẩm nào trong giỏ hàng.'], 400);
        }

        // Kiểm tra tồn kho trước khi tạo bản ghi
        foreach ($cartItems as $item) {
            $requiredQuantity = $item->quantity;
            $stockQuantity = $item->variant->inventoryStock->quantity;

            $lockedItems = LockedItem::where('variant_id', $item->variant->id)->sum('quantity');
            $availableQuantity = $stockQuantity - $lockedItems;

            if ($requiredQuantity > $availableQuantity) {
                return response()->json([
                    'error' => 'Sản phẩm ' . $item->variant->product->name . ' không đủ tồn kho.'
                ], 400);
            }
        }

        // Lưu vào bảng locked_items và giảm số lượng trong kho
        foreach ($cartItems as $item) {
            $requiredQuantity = $item->quantity;

            // Lưu vào bảng locked_items
            $lockedItem = LockedItem::create([
                'user_id' => Auth::id(),
                'cart_id' => $item->id,
                'variant_id' => $item->variant->id,
                'quantity' => $requiredQuantity,
                'locked_at' => now(),
            ]);

            $inventory = $item->variant->inventoryStock;
            $inventory->quantity -= $requiredQuantity;
            $inventory->save();
        }

        // Kiểm tra nếu coupon có được áp dụng và chưa hết hạn
        if ($request->coupon_id) {
            $coupon = Coupon::find($request->coupon_id);

            if ($coupon) {
                $couponUser = CouponUser::where('user_id', Auth::id())
                    ->where('coupon_id', $coupon->id)
                    ->first();

                if ($couponUser) {
                    return response()->json(['error' => 'Bạn đã sử dụng coupon này trước đó.'], 400);
                }

                if ($coupon->usage_limit <= 0) {
                    return response()->json(['error' => 'Coupon này đã hết số lần sử dụng.'], 400);
                }

                CouponUser::create([
                    'user_id' => Auth::id(),
                    'coupon_id' => $coupon->id,
                ]);

                // Trừ số lượng coupon
                $coupon->usage_limit -= 1;
                $coupon->save();
            } else {
                return response()->json(['error' => 'Coupon không hợp lệ hoặc không tồn tại.'], 400);
            }
        }

        // Xử lý thanh toán
        try {
            switch ($paymentMethod) {
                case 'COD':
                    return $this->handleOrder($request);
                case 'VNPAY':
                    return $this->handleVNPay($request);
                case 'MOMO':
                    return $this->handleMoMo($request);
                default:
                    return response()->json(['error' => 'Phương thức thanh toán không hợp lệ'], 400);
            }
        } catch (\Exception $e) {
            // Khôi phục lại các sản phẩm bị khóa trong trường hợp lỗi
            $this->restoreLockedItems(Auth::id());
            Log::error('Lỗi thanh toán: ' . $e->getMessage());
            return response()->json(['error' => 'Lỗi hệ thống. Vui lòng thử lại.'], 500);
        }
    });
}




    // public function processPayment(Request $request)
    // {
    //     $paymentMethod = $request->payment_method; // Nhận phương thức thanh toán từ form

    //     switch ($paymentMethod) {
    //         case 'COD':
    //             return $this->handleOrder($request);
    //         case 'VNPAY':
    //             return $this->handleVNPay($request);
    //         case 'MOMO':
    //             return $this->handleMoMo($request);
    //         default:
    //             return response()->json(['error' => 'Phương thức thanh toán không hợp lệ'], 400);
    //     }
    // }

        function handleVNPay(Request $request)
    {
        $ipAddr = request()->ip();
        $createDate = Carbon::now('Asia/Ho_Chi_Minh')->format('YmdHis');
        $currCode = "VND";
        $vnpParams = [
            'vnp_Version' => '2.1.0',
            'vnp_Command' => 'pay',
            'vnp_TmnCode' => $this->tmnCode,
            'vnp_Locale' => 'vn',
            'vnp_CurrCode' => $currCode,
            'vnp_TxnRef' => Str::random(10),
            'vnp_OrderInfo' => 'orderDescription 12345646',
            'vnp_OrderType' => 'other',
            'vnp_Amount' => $request->final_total * 100,
            'vnp_ReturnUrl' => $this->returnUrl,
            'vnp_IpAddr' => $ipAddr,
            'vnp_CreateDate' => $createDate,
        ];

        ksort($vnpParams);
        $query = "";
        $hashdata = "";
        $i = 0;
        foreach ($vnpParams as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $query = rtrim($query, '&'); // Remove trailing '&' from query string
        $vnpSecureHash = hash_hmac('sha512', $hashdata, $this->secretKey);
        $vnp_Url = $this->vnpUrl . "?" . $query . '&vnp_SecureHash=' . $vnpSecureHash;

        return response()->json(['paymentUrl' => $vnp_Url]);
    }


    public function handleOrder(Request $request)
    {
        try {
            return DB::transaction(function () use ($request) {
                $selectedItems = $request->selected_items;
                Log::info('Start transaction', ['selectedItems' => $request->selected_items]);
                // Kiểm tra nếu không có sản phẩm nào được chọn
                if (empty($selectedItems)) {
                    return response()->json([
                        'error' => 'Bạn chưa chọn sản phẩm nào để thanh toán.'
                    ]);
                }

                $cartItems = Cart::query()
                    ->with(['variant.attributeValues.attribute', 'variant.product', 'user', 'variant.inventoryStock'])
                    ->where('user_id', Auth::id())
                    ->whereIn('id', $selectedItems)
                    ->get();

                if ($cartItems->isEmpty()) {
                    return response()->json(['error' => 'Không tìm thấy sản phẩm nào trong giỏ hàng.']);
                }

                $data = $request->all();
                $data['user_id'] = Auth::id();
                $data['code'] = $this->generateOrderCode();
                $data['grand_total'] = 0;

                // Kiểm tra số lượng tồn kho và tính tổng giá trị đơn hàng
                foreach ($cartItems as $value) {
                    $requiredQuantity = $value->quantity;

                    // Cộng dồn tổng giá trị đơn hàng
                    $data['grand_total'] += $requiredQuantity * ($value->variant->sale_price ?: $value->variant->price);
                }

                if ($request->payment_method === "VNPAY" || $request->payment_method === "MOMO") {
                    $data['paid_at'] = now();
                }

                if ($request->final_total < 0) {
                    $data['final_total'] = 0;
                }

                // Tạo đơn hàng
                $order = Order::query()->create($data);

                // Xử lý giảm giá từ coupon
                if ($request->coupon_id && $request->discount_amount) {
                    $couponUser = CouponUser::query()
                        ->where('user_id', Auth::id())
                        ->where('coupon_id', $request->coupon_id)
                        ->whereNull('used_at') // Chỉ áp dụng nếu chưa sử dụng
                        ->first();

                    if ($couponUser) {
                        $couponUser->used_at = now();
                        $couponUser->save();

                        OrderCoupon::query()->create([
                            'order_id' => $order->id,
                            'discount_amount' => $request->discount_amount,
                            'coupon_id' => $request->coupon_id
                        ]);
                    } else {
                        return response()->json([
                            'error' => 'Coupon không hợp lệ hoặc đã được sử dụng.'
                        ]);
                    }
                }

                if (!$order) {
                    return response()->json(['error' => 'Đặt hàng không thành công.']);
                }

                // Gửi mail && Xóa cart
                $order['idCart'] = $selectedItems;
                $order['discount_amount'] = $request->discount_amount;
                $order['items'] = $cartItems;
                $order['user'] = Auth::user();
                $orderData = json_decode($order);
                OrderShipped::dispatch($orderData);

                return response()->json([
                    'message' => 'ĐẶT HÀNG THÀNH CÔNG',
                    'description' => 'Xin cảm ơn Quý khách đã tin tưởng và mua sắm tại cửa hàng của chúng tôi.'
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


    public function callback(Request $request)
    {
        Log::info("Giao dịch thành công với mã: " . $request->vnp_TransactionNo);
        Log::info("Callback request data: " . json_encode($request->all()));

        // Lấy dữ liệu từ callback và sắp xếp các tham số
        $vnp_SecureHash = $request->vnp_SecureHash;
        Log::info("SecureHash received: " . $vnp_SecureHash);

        $inputData = array();
        foreach ($request->all() as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        unset($inputData['vnp_SecureHash']);
        ksort($inputData);

        // Tạo chuỗi hash từ dữ liệu đã nhận
        $hashData = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        Log::info("Generated HashData for comparison: " . $hashData);

        $secureHash = hash_hmac('sha512', $hashData, $this->secretKey);
        Log::info("Generated SecureHash: " . $secureHash);

        // Kiểm tra SecureHash
        if ($secureHash == $vnp_SecureHash) {
            if ($request->vnp_ResponseCode == '00') {
                // Giao dịch thành công
                Log::info("Giao dịch thành công với mã giao dịch: " . $request->vnp_TransactionNo);
                return response()->json([
                    'status' => 'success',
                    'message' => 'Giao dịch thành công',
                ]);
            } else {
                // Giao dịch thất bại: Khôi phục ngay lập tức
                $this->restoreLockedItems(Auth::id());

                $responseMessage = "Giao dịch không thành công";
                if ($request->vnp_ResponseCode == '24') {
                    $responseMessage = "Lỗi mã 24: Quá thời gian thanh toán.";
                }

                Log::warning("Giao dịch thất bại với mã: {$request->vnp_ResponseCode}");

                $this->restoreCouponsForUser(Auth::id());


                return response()->json([
                    'status' => 'error',
                    'message' => $responseMessage,
                ]);
            }
        } else {
            // Hash không khớp: Khôi phục ngay lập tức
            $this->restoreLockedItems(Auth::id());

            Log::error("Hash không khớp. Giao dịch thất bại.");
            return response()->json([
                'status' => 'error',
                'message' => 'Tài khoản không đúng. Giao dịch không thành công',
            ]);
        }
    }

    private function restoreLockedItems(int $userId)
    {
        Log::info("Bắt đầu khôi phục các sản phẩm bị khóa cho userId: {$userId}");

        // Lấy các sản phẩm đã bị khóa từ bảng LockedItem
        $lockedItems = LockedItem::where('user_id', $userId)->get();

        if ($lockedItems->isEmpty()) {
            Log::warning("Không có sản phẩm bị khóa để khôi phục.");
            return;
        }

        DB::transaction(function () use ($lockedItems) {
            foreach ($lockedItems as $lockedItem) {
                $variant = $lockedItem->variant;
                if ($variant) {
                    $inventory = $variant->inventoryStock;
                    // Khôi phục số lượng vào kho
                    $inventory->quantity += $lockedItem->quantity;
                    $inventory->save();
                    Log::info("Khôi phục số lượng sản phẩm với mã variant: {$variant->id}, số lượng khôi phục: {$lockedItem->quantity}");
                }
                $lockedItem->delete();
            }
        });

        Log::info("Khôi phục thành công số lượng sản phẩm bị khóa.");
    }

    private function restoreCouponsForUser(int $userId)
    {
        Log::info("Bắt đầu khôi phục tất cả coupon chưa sử dụng cho userId: {$userId}");

        $couponsUserHasNotUsed = CouponUser::where('user_id', $userId)
                                            ->whereNull('used_at') // Chưa sử dụng
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







    public function handleMoMo(Request $request)
    {
        try {
            $orderId = time() . "";
            $requestId = time() . "";
            $amount = $request->final_total;
            $orderInfo = "Thanh toán đơn hàng MoMo";
            $extraData = "";

            // Tạo chuỗi hash đúng thứ tự
            $rawHash = "accessKey=" . $this->momoAccessKey;
            $rawHash .= "&amount=" . $amount;
            $rawHash .= "&extraData=" . $extraData;
            $rawHash .= "&ipnUrl=" . $this->momoReturnUrl;
            $rawHash .= "&orderId=" . $orderId;
            $rawHash .= "&orderInfo=" . $orderInfo;
            $rawHash .= "&partnerCode=" . $this->momoPartnerCode;
            $rawHash .= "&redirectUrl=" . $this->momoReturnUrl;
            $rawHash .= "&requestId=" . $requestId;
            $rawHash .= "&requestType=payWithMethod";

            // Bước 2: Tạo chữ ký
            $signature = hash_hmac("sha256", $rawHash, $this->momoSecretKey);

            $params = [
                'partnerCode' => $this->momoPartnerCode,
                'accessKey' => $this->momoAccessKey,
                'requestId' => $requestId,
                'amount' => $amount,
                'orderId' => $orderId,
                'orderInfo' => $orderInfo,
                'redirectUrl' => $this->momoReturnUrl,
                'ipnUrl' => $this->momoReturnUrl,
                'extraData' => $extraData,
                'requestType' => 'payWithMethod',
                'signature' => $signature,
                'lang' => 'vi'  // Thêm ngôn ngữ
            ];

            // Log request params để debug
            Log::info("MoMo Payment Request Params: ", $params);
            Log::info("MoMo Raw Hash: " . $rawHash);
            Log::info("MoMo Signature: " . $signature);

            // Bước 4: Gửi request đến MoMo
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $this->momoEndpoint);
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($params));
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json'
            ]);
            $result = curl_exec($ch);

            // Kiểm tra lỗi curl
            if (curl_errno($ch)) {
                Log::error('Curl error: ' . curl_error($ch));
                return response()->json(['error' => 'Lỗi kết nối đến MoMo'], 500);
            }
            curl_close($ch);

            // Log response để debug
            Log::info("MoMo Payment Response: " . $result);

            // Bước 5: Xử lý response
            $jsonResult = json_decode($result, true);

            if (isset($jsonResult['payUrl'])) {
                return response()->json([
                    'paymentUrl' => $jsonResult['payUrl']
                ]);
            } else {
                Log::error("MoMo Payment Error: ", $jsonResult);
                return response()->json([
                    'status' => 'error',
                    'message' => $jsonResult['localMessage'] ?? 'Có lỗi xảy ra khi tạo yêu cầu thanh toán MoMo'
                ], 400);
            }

        } catch (\Exception $e) {
            Log::error("MoMo Payment Exception: " . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Có lỗi xảy ra trong quá trình xử lý'
            ], 500);
        }
    }

    public function callbackMomo(Request $request)
    {
        // Log the incoming request data
        Log::info("MoMo callback request data: " . json_encode($request->all()));

        // Get the signature from request
        $requestSignature = $request->signature;

        // Prepare input data for signature verification
        $inputData = [
            'accessKey' => $this->momoAccessKey,
            'amount' => $request->amount,
            'extraData' => $request->extraData,
            'message' => $request->message,
            'orderId' => $request->orderId,
            'orderInfo' => $request->orderInfo,
            'orderType' => $request->orderType,
            'partnerCode' => $request->partnerCode,
            'payType' => $request->payType,
            'requestId' => $request->requestId,
            'responseTime' => $request->responseTime,
            'resultCode' => $request->resultCode,
            'transId' => $request->transId
        ];

        // Create raw hash string
        $rawHash = "";
        $i = 0;
        foreach ($inputData as $key => $value) {
            if ($i == 0) {
                $rawHash = $rawHash . $key . "=" . $value;
            } else {
                $rawHash = $rawHash . "&" . $key . "=" . $value;
            }
            $i++;
        }

        // Generate signature for verification
        $signature = hash_hmac("sha256", $rawHash, $this->momoSecretKey);

        // Verify signature and process payment
        if ($signature == $requestSignature) {
            if ($request->resultCode == '0') {
                // Payment successful
                try {
                    // Update your order status in database here if needed

                    return response()->json([
                        'status' => 'success',
                        'message' => 'Giao dịch thành công'
                    ]);
                } catch (\Exception $e) {
                    Log::error("MoMo callback error: " . $e->getMessage());
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Lỗi xử lý giao dịch'
                    ]);
                }
            } else {
                // Payment failed
                return response()->json([
                    'status' => 'error',
                    'message' => 'Giao dịch không thành công'
                ]);
            }
        } else {
            // Invalid signature
            return response()->json([
                'status' => 'error',
                'message' => 'Chữ ký không hợp lệ. Giao dịch không thành công'
            ]);
        }
    }
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

}
