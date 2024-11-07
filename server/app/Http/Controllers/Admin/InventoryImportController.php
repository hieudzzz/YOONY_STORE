<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Inventory\InventoryImportRequest;
use App\Models\InventoryImport;
use App\Models\InventoryStock;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InventoryImportController extends Controller 
{
    public function index()
    {
        $imports = InventoryImport::orderByDesc('id')->paginate(10);
        
        return response()->json([
            'message' => 'Danh sách nhập hàng',
            'data' => $imports
        ]);
    }
    public function import(InventoryImportRequest $request)
    {
        $data = [
            'quantity' => $request->quantity,
            'import_price' => $request->import_price,
            'variant_id' => $request->variant_id
        ];

        try {
            DB::beginTransaction();

            // 1. Tạo bản ghi nhập hàng
            $import = InventoryImport::create($data);

            // 2. Cập nhật hoặc tạo mới stock
            $stock = InventoryStock::firstOrNew([
                'variant_id' => $request->variant_id
            ]);

            // Nếu là bản ghi mới, quantity sẽ là 0
            $stock->quantity = ($stock->quantity ?? 0) + $request->quantity;
            $stock->save();

            DB::commit();

            return response()->json([
                'message' => 'Nhập hàng thành công!',
                'import' => $import,
                'stock' => $stock
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Có lỗi xảy ra.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
