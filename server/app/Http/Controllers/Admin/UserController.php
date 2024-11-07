<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    // Lấy tất cả thông tin user
    public function index()
    {
        $users = User::with('role')->paginate(5);
        return response()->json($users, 200);
    }

    public function updateRole(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'role_id' => 'required|exists:roles,id'
            ]);

            if ($validator->fails()) {
                return response()->json($validator->errors(), 400);
            }

            $user = User::find($id);
            if (!$user) {
                return response()->json(['message' => 'không có người dùng'], 404);
            }

            $user->role_id = $request->input('role_id');
            $user->save();

            return response()->json(['message' => 'Role update thành công'], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Có lỗi xảy ra trong quá trình cập nhật role.',
                'message' => $e->getMessage()
            ], 500);
        }
    }

}
