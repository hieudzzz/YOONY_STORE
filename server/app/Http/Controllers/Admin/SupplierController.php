<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Supplier\StoreSupplierRequest;
use App\Http\Requests\Supplier\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\Request;

class SupplierController extends Controller
{
    public function index()
    {
        $supplier = Supplier::orderBy('created_at', 'desc')->paginate(10);
        return response()->json([
            'data' => $supplier
        ]);
    }

    public function store(StoreSupplierRequest $request)
    {
        try {
            $supplier = Supplier::create([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'address' => $request->address
            ]);

            return response()->json([
                'data' => $supplier
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }

    public function show(string $id)
    {
        $supplier = Supplier::where('id', $id)->first();
        return response()->json([
            'data' => $supplier
        ]);   
    }

    public function update(UpdateSupplierRequest $request, string $id)
    {
        try {
            $supplier = Supplier::findOrFail($id);

            $updateSupplier = $supplier->update([
                'name' => $request->name,
                'phone' => $request->phone,
                'email' => $request->email,
                'address' => $request->address
            ]);

            return response()->json([
                'data' => $supplier
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }

    public function delete(string $id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
    
            // Kiểm tra nếu supplier_id tồn tại trong bảng inventory_import_history
            $hasHistory = \App\Models\InventoryImportHistory::where('supplier_id', $id)->exists();
    
            if ($hasHistory) {
                return response()->json([
                    'error' => 'Không thể xóa nhà cung cấp vì có lịch sử nhập hàng liên quan.'
                ], 400);
            }
    
            // Xóa nhà cung cấp nếu không có lịch sử nhập hàng
            $supplier->delete();
    
            return response()->json(['message' => 'Xóa thành công'], 200);
    
        } catch (\Exception $e) {
            return response()->json(['error' => 'Có lỗi xảy ra: ' . $e->getMessage()], 500);
        }
    }    
}
