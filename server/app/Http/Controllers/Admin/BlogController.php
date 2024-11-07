<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Blog\StoreBlogRequest;
use App\Http\Requests\Blog\UpdateBlogRequest;
use App\Http\Resources\BlogResource;
use App\Models\Blog;
use Illuminate\Http\Request;


class BlogController extends Controller
{
    public function index()
    {
        $blogs = Blog::with('user')->latest('id')->paginate(10);

        return BlogResource::collection($blogs);
    }

    public function store(StoreBlogRequest $request)
    {
        try {
            $blog = Blog::create($request->validated());

            return response()->json([
                'message' => 'Blog đã được thêm thành công!',
                'blog' => new BlogResource($blog)
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Có lỗi xảy ra trong quá trình tạo blog.',
                'message' => $e->getMessage()
            ], 500);
        }
    }


    public function show($id)
    {
        $blog = Blog::findOrFail($id);
        return new BlogResource($blog);
    }

    public function update(UpdateBlogRequest $request, $id)
    {
        try {
            $blog = Blog::findOrFail($id);

            $data = [
                'content' => $request->content,
                'slug' => $request->slug,
                'user_id' => $request->user_id,
                'is_active' => $request->has('is_active') ? $request->is_active : $blog->is_active,
            ];

            $blog->update($data);

            return response()->json([
                'message' => 'Blog đã được sửa thành công!',
                'blog' => new BlogResource($blog)
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Có lỗi xảy ra trong quá trình cập nhật blog.',
                'message' => $e->getMessage()
            ], 500);
        }
    }



    public function updateIsActive(UpdateBlogRequest $request, $id)
{
    try {
        $blog = Blog::findOrFail($id);

        $blog->update(['is_active' => $request->validated()['is_active']]);

        return response()->json([
            'message' => 'Trạng thái blog đã được cập nhật thành công!',
            'blog' => new BlogResource($blog)
        ], 200);

    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Có lỗi xảy ra trong quá trình cập nhật trạng thái blog.',
            'message' => $e->getMessage()
        ], 500);
    }
}

public function destroy($id)
{
    try {
        $blog = Blog::findOrFail($id);

        $blog->delete();

        return response()->json([
            'message' => 'Blog đã được xóa thành công!',
        ], 200);
    } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
        return response()->json([
            'error' => 'Blog không được tìm thấy.',
            'message' => $e->getMessage(),
        ], 404);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Có lỗi xảy ra trong quá trình xóa blog.',
            'message' => $e->getMessage(),
        ], 500);
    }
}

}