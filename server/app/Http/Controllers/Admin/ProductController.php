<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\StoreProductRequest;
use App\Http\Requests\Product\UpdateProductRequest;
use App\Http\Resources\ProductResource;
use App\Models\AttributeValue;
use App\Models\InventoryStock;
use App\Models\Product;
use App\Models\Variant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProductController extends Controller
{
    /**
     * Display a listing of the resource.
     */
public function index()
{
    $products = Product::with(['category', 'variants.attributeValues.attribute', 'variants.inventoryStock'])
    ->orderBy('created_at', 'desc')
    ->paginate(15);

        return ProductResource::collection($products);
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request)
    {
        DB::beginTransaction();

        try {
            $existingVariants = [];
            $existingColors = []; // Lưu các màu đã có từ các biến thể 2 thuộc tính
            $oneAttributeVariants = []; // Lưu các biến thể chỉ có 1 thuộc tính (màu)
            $twoAttributesVariants = []; // Lưu các biến thể có 2 thuộc tính

            // Tách các biến thể ra thành hai nhóm: 1 thuộc tính và 2 thuộc tính
            foreach ($request->variants as $variantData) {
                $attributeValues = AttributeValue::whereIn('id', $variantData['attribute_values'])
                    ->pluck('value')
                    ->sort()
                    ->values();

                $hasColorAttribute = false;
                $variantColor = null;

                foreach ($attributeValues as $value) {
                    $color = AttributeValue::where('value', $value)
                        ->whereHas('attribute', function ($query) {
                            $query->where('type', 'color');
                        })->first();

                    if ($color) {
                        $hasColorAttribute = true;
                        $variantColor = $color->id;
                        break;
                    }
                }

                if (count($attributeValues) == 1 && $hasColorAttribute) {
                    // Nếu biến thể có 1 thuộc tính và thuộc tính đó là màu, lưu vào nhóm oneAttributeVariants
                    $oneAttributeVariants[] = $variantColor;
                } elseif (count($attributeValues) == 2) {
                    // Nếu biến thể có 2 thuộc tính, lưu vào nhóm twoAttributesVariants
                    $twoAttributesVariants[] = $attributeValues;
                    if ($hasColorAttribute) {
                        $existingColors[] = $variantColor; // Thêm màu vào danh sách màu của biến thể 2 thuộc tính
                    }
                }

                // Kiểm tra các giá trị thuộc tính đã tồn tại để tránh trùng lặp
                foreach ($existingVariants as $existingValues) {
                    if ($existingValues->count() == $attributeValues->count() && $existingValues->diff($attributeValues)->isEmpty()) {
                        return response()->json([
                            'message' => 'Biến thể có giá trị thuộc tính trùng lặp.',
                            'error' => 'Các giá trị thuộc tính (value) trùng nhau không được phép.'
                        ], 422);
                    }
                }

                $existingVariants[] = $attributeValues; // Lưu lại biến thể đã xử lý vào danh sách các biến thể đã tồn tại
            }

            // Kiểm tra các màu trùng lặp giữa biến thể 1 thuộc tính và biến thể 2 thuộc tính
            foreach ($oneAttributeVariants as $colorId) {
if (in_array($colorId, $existingColors)) {
                    return response()->json([
                        'message' => 'Màu đã tồn tại trong các biến thể khác.',
                        'error' => 'Không thể thêm màu trùng với các biến thể đã có với 2 thuộc tính.'
                    ], 422);
                }
            }

            // Tạo sản phẩm
            $product = Product::create([
                'name' => $request->name,
                'slug' => $request->slug,
                'description' => $request->description,
                'images' => json_encode($request->images),
                'category_id' => $request->category_id,
                'is_featured' => $request->is_featured ?? false,
                'is_active' => $request->is_active ?? true,
            ]);

            // Lưu các biến thể của sản phẩm
            foreach ($request->variants as $variantData) {
                $variant = Variant::create([
                    'price' => $variantData['price'],
                    'sale_price' => $variantData['sale_price'],
                    'end_sale' => $variantData['end_sale'] ?? null,
                    'image' => $variantData['image'] ?? null,
                    'product_id' => $product->id,
                ]);

                if (isset($variantData['quantity'])) {
                    InventoryStock::create([
                        'variant_id' => $variant->id,
                        'quantity' => $variantData['quantity'],
                    ]);
                }

                if (isset($variantData['attribute_values'])) {
                    $variant->attributeValues()->attach($variantData['attribute_values']);
                }
            }

            DB::commit();
            return new ProductResource($product->load('category', 'variants.attributeValues.attribute', 'variants.inventoryStock'));
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Thêm Product thất bại', 'error' => $e->getMessage()], 500);
        }
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $product = Product::with('category', 'variants.attributeValues.attribute', 'variants.inventoryStock')->findOrFail($id);
        return new ProductResource($product);
    }


    public function update(UpdateProductRequest $request, string $id): JsonResponse
    {
        DB::beginTransaction();

        try {
            $product = Product::findOrFail($id);

            $product->update([
                'name' => $request->name,
                'slug' => $request->slug,
                'description' => $request->description,
                'images' => json_encode($request->images),
                'category_id' => $request->category_id,
                'is_featured' => $request->is_featured ?? false,
                'is_active' => $request->is_active ?? true,
            ]);

            $variantIds = [];
            $existingVariants = [];
            $oneAttributeVariants = []; // Mảng lưu các biến thể có 1 thuộc tính (chỉ có màu)
            $twoAttributesVariants = []; // Mảng lưu các biến thể có 2 thuộc tính
            $existingColors = []; // Mảng lưu các màu của biến thể 2 thuộc tính

            foreach ($request->variants as $variantData) {
                $attributeValues = AttributeValue::whereIn('id', $variantData['attribute_values'])
                    ->pluck('value')
                    ->sort()
                    ->values();

                $hasColorAttribute = false;
                $variantColor = null;

                foreach ($attributeValues as $value) {
                    $color = AttributeValue::where('value', $value)
                        ->whereHas('attribute', function ($query) {
                            $query->where('type', 'color');
                        })->first();

                    if ($color) {
                        $hasColorAttribute = true;
                        $variantColor = $color->id;
                        break;
                    }
                }

                // Nếu biến thể chỉ có một thuộc tính (màu), lưu vào $oneAttributeVariants
                if (count($attributeValues) == 1 && $hasColorAttribute) {
                    $oneAttributeVariants[] = $variantColor;
                } elseif (count($attributeValues) == 2) {
                    // Nếu biến thể có 2 thuộc tính, lưu vào $twoAttributesVariants
                    $twoAttributesVariants[] = $attributeValues;
                    if ($hasColorAttribute) {
                        $existingColors[] = $variantColor; // Lưu màu của biến thể 2 thuộc tính
                    }
                }

                // Kiểm tra trùng lặp thuộc tính giữa các biến thể đã tồn tại
                foreach ($existingVariants as $existingValues) {
                    if ($existingValues->count() == $attributeValues->count() && $existingValues->diff($attributeValues)->isEmpty()) {
                        DB::rollBack();
                        return response()->json([
                            'message' => 'Biến thể có giá trị thuộc tính trùng lặp.',
'error' => 'Các giá trị thuộc tính (value) trùng nhau không được phép.'
                        ], 422);
                    }
                }

                $existingVariants[] = $attributeValues;

                // Cập nhật hoặc tạo mới biến thể
                $variant = Variant::updateOrCreate(
                    ['id' => $variantData['id'] ?? null, 'product_id' => $product->id],
                    [
                        'price' => $variantData['price'],
                        'sale_price' => $variantData['sale_price'],
                        'end_sale' => $variantData['end_sale'] ?? null,
                        'image' => $variantData['image'] ?? null,
                    ]
                );

                // Đồng bộ các giá trị thuộc tính cho biến thể
                if (isset($variantData['attribute_values'])) {
                    $variant->attributeValues()->sync($variantData['attribute_values']);
                }

                $variantIds[] = $variant->id;
            }

            // Kiểm tra các màu trùng lặp giữa biến thể 1 thuộc tính và 2 thuộc tính
            foreach ($oneAttributeVariants as $colorId) {
                if (in_array($colorId, $existingColors)) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Màu đã tồn tại trong các biến thể khác.',
                        'error' => 'Không thể thêm màu trùng với các biến thể đã có với 2 thuộc tính.'
                    ], 422);
                }
            }

            // Xóa các biến thể không còn trong danh sách cập nhật
            $product->variants()->whereNotIn('id', $variantIds)->delete();

            DB::commit();

            return response()->json(new ProductResource(
                $product->load(['category', 'variants.attributeValues.attribute', 'variants.inventoryStock'])
            ), 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }



    public function findBySlug(string $slug): JsonResponse
    {
        try {
            $product = Product::with('category', 'variants.attributeValues.attribute', 'variants.inventoryStock')
                ->where('slug', $slug)
                ->firstOrFail();

            return response()->json(new ProductResource($product), 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Product not found.'], 404);
        }
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $product = Product::with('category')->findOrFail($id);
            $productData = $product->toArray();
            if (isset($productData['images'])) {
                $productData['images'] = json_decode($productData['images'], true);
            }
            $product->delete();
            return response()->json([
                'message' => 'Product xóa thành công',
                'data' => $productData
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Xóa product thất bại', 'error' => $e->getMessage()], 500);
        }
    }

    //updateIsFeatured
    public function updateIsFeatured(Request $request, string $id){
        $product = Product::with('category')->findOrFail($id);
        $product->update(['is_featured'=>$request->is_featured]);

        return response()->json([
            'message' => 'Cập nhật is_featured thành công!',
            'data' => new ProductResource($product),
        ], 200);
    }

    // //updateIsGoodDeal
    // public function updateIsGoodDeal(Request $request, string $id){
    //     $product = Product::findOrFail($id);
    //     $product->update(['is_good_deal'=>$request->is_good_deal]);

    //     return response()->json([
    //         'message' => 'Cập nhật is_good_deal thành công!',
    //         'data' => new ProductResource($product),
    //     ], 200);
    // }

    //updateIsActive

    public function updateIsActive(Request $request, string $id){
        $product = Product::with('category')->findOrFail($id);
        $product->update(['is_active'=>$request->is_active]);


        return response()->json([
            'message' => 'Cập nhật is_active thành công!',
            'data' => new ProductResource($product),
        ], 200);
    }

    public function restore(string $id)
    {
        $product = Product::withTrashed()->findOrFail($id);

        $product->restore();

        return response()->json(['message' => 'Khôi phục Sản Phẩm thành công!'], 200);
    }

    //xóa cứng
    public function hardDelete(string $id)
    {
        $category = Product::withTrashed()->findOrFail($id);

        $category->forceDelete();

        return response()->json(['message' => 'Xóa vĩnh viễn Sản Phẩm thành công!'], 200);
    }


    //khôi phục nhiều
    public function restoreMultiple(Request $request)
    {
        $ids = $request->input('ids');

        if (empty($ids) || !is_array($ids)) {
            return response()->json(['message' => 'Danh sách ID không hợp lệ'], 400);
        }

        $restoredCount = Product::withTrashed()
            ->whereIn('id', $ids)
            ->restore();

        return response()->json([
            'message' => 'Khôi phục nhiều sản phẩm thành công!',
            'so_luong' => $restoredCount
        ], 200);
    }
     public function listDelete()
    {
        $products = Product::onlyTrashed()
            ->with(['category', 'variants.attributeValues.attribute', 'variants.inventoryStock'])
            ->paginate(10);

        return ProductResource::collection($products);
    }

}
