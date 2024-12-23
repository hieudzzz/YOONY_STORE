<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Rate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ReviewController extends Controller
{
    //đánh giá
    public function review(Request $request)
    {
        try {
            // Xác thực dữ liệu đầu vào
            $validatedData = $request->validate([
                'order_id' => 'required|exists:orders,id',
                'review.*.product_id' => 'required|exists:products,id',
                'review.*.rating' => 'integer|min:1|max:5',
                'review.*.content' => 'nullable|string',
            ]);

            $userId = auth()->id();

            // Lấy trạng thái đơn hàng và kiểm tra xem đơn hàng có thuộc về người dùng không
            $order = Order::where('id', $validatedData['order_id'])
                ->where('user_id', $userId)
                ->with('items.variant') // Load các sản phẩm trong đơn hàng thông qua variant
                ->first();

            if (!$order) {
                return response()->json(['message' => 'Đơn hàng không tồn tại.'], 404);
            }

            // Kiểm tra trạng thái đơn hàng
            if ($order->status_order !== Order::STATUS_ORDER_DELIVERED) {
                return response()->json(['message' => 'Bạn chỉ có thể đánh giá khi đơn hàng đã được giao.'], 403);
            }

            // Mảng từ ngữ thô tục
            $prohibitedWords = [
                'địt', 'chó', 'đụ', 'lồn', 'vãi', 'cặc', 'tinh', 'pê đê', 'fuck', 'l.ồn', 'c.ặc', 'đ.m', 'khốn nạn', 'đụ mẹ',
                'lắm chuyện', 'con đĩ', 'bẩn thỉu', 'súc vật', 'vô dụng', 'thối nát', 'đểu', 'chửi', 'bịp', 'khốn', 'xéo đi',
                'mẹ kiếp', 'cầm thú', 'quái vật', 'thứ đê tiện', 'lão già', 'thằng ngu', 'con ngu', 'đồ hạ đẳng',
                'khùng điên', 'hài hước quá', 'dở hơi', 'điên khùng', 'ngốc nghếch', 'vô duyên', 'đồ đĩ', 'trẻ trâu', 'dâm dục',
                'khốn kiếp', 'đồ khốn', 'hạ đẳng', 'sĩ diện', 'cứu mạng', 'thằng chó', 'kẻ ngu', 'khốn nạn',
                'thằng chết tiệt', 'đồ đệ', 'bố láo', 'chó chết', 'thằng điên', 'điều đỉnh', 'đồ khốn nạn',
                'thằng này', 'đụ người', 'cặn bã', 'dâm đảng', 'thằng ranh con', 'đê tiện', 'con chó cái', 'mất dạy',
                'cái đứa hư', 'bạn chết mẹ đi', 'đúng là đồ khốn', 'đi chết đi', 'đi cút', 'dạ dột', 'nghiện tình',
                'đi chơi gái', 'chó ngáp phải ruồi', 'chết tiệt', 'lắm chuyện', 'vứt', 'chửi tục', 'bạn làm lố',
                'đi chết đi', 'đi tắm cống', 'thằng già móm', 'tạo nghiệp', 'bố láo', 'làm trò hề', 'cái con ngu',
                'thằng hâm', 'đừng có giỡn', 'bám đít', 'ngu si', 'đồ xàm', 'thằng đái dầm', 'lố bịch', 'chửi bậy',
                'trẻ ranh', 'đi cút', 'đi chơi gái', 'ngu thế', 'xúc phạm', 'hạ đẳng', 'thằng đéo', 'bà đéo', 'đéo này'
            ];

            // Kiểm tra xem nội dung có chứa từ ngữ thô tục không
            foreach ($validatedData['review'] as $item) {
                if ($item['content']) {
                    foreach ($prohibitedWords as $word) {
                        if (stripos($item['content'], $word) !== false) {
                            throw new \Exception('Nội dung đánh giá chứa từ ngữ thô tục.');
                        }
                    }
                }
            }

            // Khởi tạo mảng để lưu kết quả đánh giá
            $responses = [];

            // Lặp qua từng đánh giá trong mảng review
            foreach ($validatedData['review'] as $item) {
                // Kiểm tra xem sản phẩm có trong đơn hàng không thông qua variant_id
                $productInOrder = $order->items()->whereHas('variant', function ($query) use ($item) {
                    $query->where('product_id', $item['product_id']);
                })->exists();

                if (!$productInOrder) {
                    return response()->json(['message' => 'Sản phẩm không có trong đơn hàng.'], 403);
                }

                // Kiểm tra xem người dùng đã đánh giá sản phẩm này trong đơn hàng chưa
                $existingReview = Rate::where('product_id', $item['product_id'])
                    ->where('user_id', $userId)
                    ->where('order_id', $validatedData['order_id'])
                    ->first();

                if ($existingReview) {
                    $responses[] = [
                        'product_id' => $item['product_id'],
                        'message' => 'Bạn chỉ có thể đánh giá sản phẩm này một lần.'
                    ];
                    continue; // Bỏ qua nếu đã đánh giá
                }

                // Tạo đánh giá mới
                $rating = Rate::create([
                    'product_id' => $item['product_id'],
                    'user_id' => $userId,
                    'order_id' => $validatedData['order_id'],
                    'rating' => $item['rating'],
                    'content' => $item['content'],
                ]);

                $responses[] = [
                    'product_id' => $item['product_id'],
                    'message' => 'Đánh giá đã được lưu thành công.',
                    'rating' => $rating
                ];
            }

            return response()->json(['responses' => $responses], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json(['message' => 'Dữ liệu không hợp lệ.', 'errors' => $e->errors()], 422);
        } catch (\Exception $e) {
            // Kiểm tra lỗi từ ngữ thô tục
            if ($e->getMessage() == 'Nội dung đánh giá chứa từ ngữ thô tục.') {
                return response()->json(['message' => 'Nội dung đánh giá chứa từ ngữ thô tục.'], 400);
            }

            Log::error('Error saving review: ' . $e->getMessage());
            return response()->json(['message' => 'Đã xảy ra lỗi trong quá trình lưu đánh giá.'], 500);
        }
    }


    //lấy sản phẩm đã giao và chưa đánh giá
    public function getPendingReviews(Request $request)
    {
        $userId = auth()->id();
    
        if (!$userId) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
        }
    
        try {
            // 1. Lấy danh sách đơn hàng đã giao và phân trang
            $orders = Order::where('user_id', $userId)
                ->where('status_order', Order::STATUS_ORDER_DELIVERED)
                ->with(['items.variant.product', 'rates', 'items.variant.attributeValues'])
                ->orderBy('created_at', 'desc')
                ->paginate(10);  // Điều chỉnh số lượng bản ghi mỗi trang theo nhu cầu
    
            // 2. Lọc các đơn hàng chưa được đánh giá
            $pendingReviews = $orders->getCollection()->filter(function ($order) {
                foreach ($order->items as $item) {
                    // Kiểm tra nếu sản phẩm chưa được đánh giá
                    $hasRated = $order->rates->contains('product_id', $item->variant->product_id);
    
                    // Nếu chưa được đánh giá, thêm hình ảnh nếu có
                    if (!$hasRated) {
                        if ($item->variant->product->images) {
                            $item->variant->product->images = is_string($item->variant->product->images)
                                ? json_decode($item->variant->product->images, true)
                                : $item->variant->product->images;
                        }
                        return true;  // Đánh dấu rằng đơn hàng cần được đánh giá
                    }
                }
                return false;
            })->values();  // Đảm bảo trả về collection sau khi lọc
    
            // 3. Trả về kết quả phân trang cùng với các đơn hàng chưa được đánh giá
            return response()->json([
                'data' => $pendingReviews,
                'pagination' => [
                    'total' => $orders->total(),  // Tổng số bản ghi
                    'current_page' => $orders->currentPage(),  // Trang hiện tại
                    'per_page' => $orders->perPage(),  // Số bản ghi mỗi trang
                    'last_page' => $orders->lastPage(),  // Trang cuối cùng
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }
    
    
    

    //lấy chi tiết đánh giá
    public function detailReview(string $code)
    {
        $userId = auth()->id();

        if (!$userId) {
            return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
        }

        try {
            $order = Order::with(['items.variant.product', 'items.variant.attributeValues.attribute', 'rates', 'items.variant.product.category'])
                ->where('code', $code)
                ->where('user_id', $userId)
                ->first();

            if (!$order) {
                return response()->json(['message' => 'Đơn hàng không tồn tại.'], 404);
            }

            foreach ($order->items as $item) {
                if (is_string($item->variant->product->images)) {
                    $item->variant->product->images = json_decode($item->variant->product->images, true);
                }
            }

            $reviews = [];
            foreach ($order->rates as $rate) {
                $reviews[$rate->product_id] = [
                    'rating' => $rate->rating,
                    'content' => $rate->content,
                ];
            }

            $groupedItems = [];
            foreach ($order->items as $item) {
                $productId = $item->variant->product_id;

                // Chỉ thêm sản phẩm nếu review là null (chưa có đánh giá)
                if (!isset($groupedItems[$productId]) && !isset($reviews[$productId])) {
                    $groupedItems[$productId] = [
                        'product' => $item->variant->product,
                        'variant_lists' => [],
                        'review' => null,
                    ];
                }

                // Chỉ thêm các items nếu sản phẩm chưa có đánh giá
                if (!isset($reviews[$productId])) {
                    $groupedItems[$productId]['variant_lists'][] = [
                        'id' => $item->id,
                        'order_id' => $item->order_id,
                        'variant_id' => $item->variant_id,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total_price' => $item->total_price,
                        'variant' => $item->variant,
                    ];
                }
            }

            // Tạo cấu trúc JSON cần thiết
            $response = [
                'order_id' => $order->id,
                'user_id' => $order->user_id,
                'grand_total' => $order->grand_total,
                'final_total' => $order->final_total,
                'payment_method' => $order->payment_method,
                'status_order' => $order->status_order,
                'code' => $order->code,
                'notes' => $order->notes,
                'name' => $order->name,
                'tel' => $order->tel,
                'address' => $order->address,
                'items' => array_values($groupedItems),
            ];

            return response()->json($response, 200);

        } catch (\Exception $e) {
            return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
        }
    }

    //lấy những sản phẩm đã đánh giá
//lấy những sản phẩm đã đánh giá
public function getReviewedOrders(Request $request)
{
    $userId = auth()->id();

    if (!$userId) {
        return response()->json(['message' => 'Người dùng chưa đăng nhập.'], 401);
    }

    try {
        // 1. Trước tiên lấy các order đã delivered
        $orders = Order::where('user_id', $userId)
            ->where('status_order', Order::STATUS_ORDER_DELIVERED)
            ->orderBy('created_at', 'desc')
            ->get();

        // 2. Thu thập order_ids có rates
        $orderIdsWithRates = Rate::whereIn('order_id', $orders->pluck('id'))
            ->distinct()
            ->pluck('order_id');

        // 3. Lấy chi tiết orders có rates với eager loading
        $reviewedOrders = Order::with([
            'rates.product.category',
            'rates.user',
            'items.variant.attributeValues.attribute'
        ])
        ->whereIn('id', $orderIdsWithRates)
        ->get()
        ->map(function ($order) {
            return [
                'order_id' => $order->id,
                'items' => $order->items->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'variant_id' => $item->variant_id,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total_price' => $item->total_price,
                        'attribute_values' => $item->variant ? $item->variant->attributeValues->map(function ($attrValue) {
                            return [
                                'id' => $attrValue->id,
                                'value' => $attrValue->value,
                                'attribute' => [
                                    'id' => $attrValue->attribute->id,
                                    'name' => $attrValue->attribute->name,
                                ]
                            ];
                        })->toArray() : [],
                    ];
                })->toArray(),
                'rates' => $order->rates->map(function ($rate) {
                    $images = $rate->product->images;
                    if (is_string($images)) {
                        $images = json_decode($images, true);
                    }

                    return [
                        'id' => $rate->id,
                        'content' => $rate->content,
                        'rating' => $rate->rating,
                        'product' => [
                            'id' => $rate->product->id,
                            'name' => $rate->product->name,
                            'slug' => $rate->product->slug,
                            'images' => $images,
                            'category' => [
                                'id' => $rate->product->category->id,
                                'name' => $rate->product->category->name,
                                'slug' => $rate->product->category->slug,
                            ]
                        ],
                        'user' => [
                            'id' => $rate->user->id,
                            'name' => $rate->user->name,
                            'email' => $rate->user->email,
                            'avatar' => $rate->user->avatar,
                        ],
                        'order_id' => $rate->order_id,
                        'created_at' => $rate->created_at,
                        'updated_at' => $rate->updated_at,
                    ];
                })->toArray()
            ];
        })->toArray();

        // 4. Return response với dữ liệu đã xử lý
        return response()->json([
            'data' => array_values($reviewedOrders),
            'pagination' => [
                'total' => count($reviewedOrders),
                'current_page' => 1,
                'per_page' => count($reviewedOrders),
                'last_page' => 1
            ]
        ]);

    } catch (\Exception $e) {
        \Log::error('Error in getReviewedOrders: ' . $e->getMessage());
        \Log::error($e->getTraceAsString());
        return response()->json(['message' => 'Đã xảy ra lỗi: ' . $e->getMessage()], 500);
    }
}



}
