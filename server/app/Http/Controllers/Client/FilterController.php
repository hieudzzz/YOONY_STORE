<?php

namespace App\Http\Controllers\Client;

use App\Http\Controllers\Controller;
use App\Models\Attribute;
use App\Models\Category;
use App\Models\Order;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class FilterController extends Controller
{
    public function filter(Request $request)
    {
        $query = Product::query();

        // Ghi lại các tiêu chí lọc vào log
        Log::info('Lọc sản phẩm theo tiêu chí:', $request->all());

        // Lọc theo tên
        if ($request->has('name')) {
            $query->where('name', 'LIKE', '%' . $request->input('name') . '%');
        }

        // Lọc theo danh mục
        if ($request->has('category_id')) {
            $query->whereIn('category_id', $request->input('category_id'));
        }

        // Lọc theo giá
        if ($request->has('price')) {
            $price = $request->input('price');
            $query->whereHas('variants', function ($q) use ($price) {
                if (isset($price['min'])) {
                    $q->where('price', '>=', $price['min']);
                }
                if (isset($price['max'])) {
                    $q->where('price', '<=', $price['max']);
                }
            });
        }

        // Lọc theo thuộc tính
        if ($request->has('attributes')) {
            foreach ($request->input('attributes') as $attributeName => $values) {
                // Lọc theo từng giá trị thuộc tính
                $query->whereHas('variants.attributeValues', function ($q) use ($values) {
                    $q->whereIn('value', array_column($values, 'value'));
                });
            }
        }
        // Sắp xếp sản phẩm mới nhất
        if ($request->has('newest') && $request->input(key: 'newest')) {
            $query->orderBy('created_at', 'desc');
        }

        Log::info('Thông số truy vấn sql:', [$query->toSql(), $query->getBindings()]);

        // Lấy kết quả
        $products = $query->with(['category', 'variants.attributeValues'])->paginate(8);

        // Kiểm tra nếu không có sản phẩm nào
        if ($products->isEmpty()) {
            Log::warning('Không tìm thấy sản phẩm nào theo tiêu chí lọc nhất định.');
        }

        return response()->json($products);
    }

    //lấy thông tin category và atributes
    public function getFilter()
    {
        Log::info('Đang gọi hàm getFilter');
    
        $categories = Category::all(); 
        $attributes = Attribute::with('attributeValues')->get(); 
    
        // Ghi log thông tin các dữ liệu
        Log::info('Thông tin categories:', [$categories]);
        Log::info('Thông tin attributes:', [$attributes]);
    
        return response()->json([
            'categories' => $categories,
            'attributes' => $attributes,
        ]);
    }
    
    
    public function filterOrdersByDate(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after_or_equal:start_date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors()
                ], 422);
            }

            $userId = Auth::id();

            $query = Order::where('user_id', $userId);

            //lọc ngày bắt đầu
            if ($request->filled('start_date')) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }

            //lọc ngày kết thúc
            if ($request->filled('end_date')) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }

            $orders = $query->with(['items.variant'])->get();

            // Trả về kết quả dưới dạng JSON
            return response()->json([
                'success' => true,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            // Xử lý lỗi chung và trả về thông báo lỗi
            return response()->json([
                'success' => false,
                'message' => 'Lỗi không mong muốn xảy ra!',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function filterOrdersByPrice(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'sort_order' => 'nullable|in:asc,desc',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation errors',
                    'errors' => $validator->errors()
                ], 422);
            }
    
            $userId = Auth::id();
    
            $query = Order::where('user_id', $userId);
    
            // Áp dụng sắp xếp theo giá trị đơn hàng
            if ($request->filled('sort_order')) {
                $query->orderBy('final_total', $request->sort_order);
            }
            $orders = $query->with(['items.variant'])->get();
            Log::info('Sort order: ' . $request->sort_order);
            Log::info('Query: ' . $query->toSql());
            
            return response()->json([
                'success' => true,
                'data' => $orders
            ]);
        } catch (\Exception $e) {
            // Ghi log lỗi
            Log::error('Lỗi lọc đơn hàng theo giá: ' . $e->getMessage());
    
            return response()->json([
                'success' => false,
                'message' => 'Lỗi không mong muốn xảy ra!',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
}