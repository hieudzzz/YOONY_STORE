<?php
namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Http\Requests\Category\InsertCategoryRequest;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    use SoftDeletes;

    public function index()
    {
        $category = Category::orderByDesc('id')->paginate(10); //10 cate trên

        return CategoryResource::collection($category)->additional(['message' => 'Toàn Bộ Danh Mục']);
    }

    public function store(InsertCategoryRequest $request)
    {
        $data = [
            'name' => $request->name,
            'slug' => $request->slug,
            'image' => $request->image,
            'is_active' => $request->is_active,
        ];

        $category = Category::create($data);

        return (new CategoryResource($category))->additional(['message' => 'Thêm danh mục thành công!']);
    }

    public function show(string $id)
    {
        $category = Category::findOrFail($id);

        return (new CategoryResource($category))->additional(['message' => 'Hiển thị dữ liệu thành công!']);
    }


    public function update(Request $request, string $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'slug' => 'required|string|max:255|unique:categories,slug,' . $id,
            'image' => 'nullable',
            'is_active' => 'boolean',
        ]);

        $category = Category::findOrFail($id);

        $data = [
            'name' => $request->name,
            'slug' => $request->slug,
            'image' => $request->image,
            'is_active' => $request->has('is_active') ? $request->is_active : $category->is_active,
        ];

        $category->update($data);

        return (new CategoryResource($category))->additional(['message' => 'Sửa danh mục thành công!']);
    }

    public function destroy(string $id)
    {
        $category = Category::findOrFail($id);

        $category->delete();
        return response()->json(['message' => 'Xóa danh mục thành công!'], 200);
    }

    //sửa trạng thái
    public function updateIsActive(Request $request, string $id)
    {
        $category = Category::findOrFail($id);

        $category->update([
            'is_active' => $request->is_active,
        ]);
        return response()->json([
            'message' => 'Cập nhật trạng thái hoạt động thành công!',
            'data' => new CategoryResource($category),
        ], 200);
    }

    //xóa nhiều
    public function deleteMuch(Request $request)
    {
        try {
            $ids = $request->ids;

            if (!is_array($ids) || empty($ids)) {
                return response()->json(['message' => 'Danh sách ID không hợp lệ!'], 400);
            }

            // Xóa nhiều Cate theo id
            Category::whereIn('id', $ids)->delete();

            return response()->json(['message' => 'Xóa nhiều danh mục thành công!'], 200);
        } catch (\Exception $e) {
            return response()->json(['message' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }

    //khôi phục cate (chuyển deleted_at về null)
    public function restore(string $id)
    {
        $category = Category::withTrashed()->findOrFail($id);

        $category->restore();

        return response()->json(['message' => 'Khôi phục danh mục thành công!'], 200);
    }

    //xóa cứng
    public function hardDelete(string $id)
    {
        $category = Category::withTrashed()->findOrFail($id);

        $category->forceDelete();

        return response()->json(['message' => 'Xóa vĩnh viễn danh mục thành công!'], 200);
    }


}
