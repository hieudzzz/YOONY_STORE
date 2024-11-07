<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Attribute\StoreAttributeRequest;
use App\Http\Requests\Attribute\UpdateAttributeRequest;
use App\Models\Attribute;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AttributeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $data = Attribute::query()->latest('id')->paginate(5);
            return response()->json([
                'message' => 'Danh sách attribute trang ' . request('page', 1),
                'status' => 'success',
                'data' => $data
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

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAttributeRequest $request)
    {
        try {
            $data = $request->all();
            $data['slug'] = Str::slug($request->name);

            $exists = Attribute::where('slug', $data['slug'])->exists();
            if ($exists) {
                return response()->json([
                    'message' => 'Slug đã tồn tại, vui lòng thử lại',
                    'status' => 'error',
                ], Response::HTTP_INTERNAL_SERVER_ERROR);          
            }

            $attribute = Attribute::query()->create($data);

            return response()->json([
                'message' => 'Thêm mới attribute thành công',
                'status' => 'success',
                'data' => $attribute
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {

            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);

            return response()->json([
                'message' => 'Thêm attribute thất bại',
                'status' => 'error',

            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Attribute $attribute)
    {
        try {
            $data=Attribute::findOrFail($attribute->id);
            return response()->json([
                'message' => 'Lấy chi tiết attribute thành công',
                'status' => 'success',
                'data' => $data 
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);
    
            return response()->json([
                'message' => 'Không tìm thấy attribute',
                'status' => 'error'
            ], Response::HTTP_NOT_FOUND);
        }

    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Attribute $attribute)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAttributeRequest $request, $attribute)
    {
        try {
            $model = Attribute::findOrFail($attribute);

            $data =$request->all();

            $model->update($data);

            return response()->json([
                'data' => $model,
                'status' => 'success',
                'messages' =>  'Cập nhật attribute thành công'
            ], Response::HTTP_CREATED);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);
            return response()->json([
                'messages' => 'Cập nhật attribute thất bại',
                'status' => 'error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Attribute $attribute)
    {
        try {
            $model = Attribute::findOrFail($attribute->id);
            $model->delete();

            return response()->json([
                'messages' => 'Xóa attribute thành công',
                'status' => 'success'
            ], Response::HTTP_OK);
        } catch (\Throwable $th) {
            Log::error(__CLASS__ . '@' . __FUNCTION__, [
                'line' => $th->getLine(),
                'message' => $th->getMessage()
            ]);
            return response()->json([
                'messages' => 'Xóa attribute thất bại',
                'status' => 'error'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
