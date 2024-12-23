<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class NotificationController extends Controller
{
    public function getUserNotifications($userId)
    {
        try {
            $notifications = Notification::where('user_id', $userId)
                ->orderBy('created_at', 'desc')
                ->get();

            $count = Notification::where('user_id', $userId)
            ->count();

            return response()->json([
                'success' => true,
                'count' => $count,
                'data' => $notifications
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi lấy thông báo'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function countIsreadNotifications($userId)
    {
        $is_readCount = Notification::where('user_id', $userId)
            ->where('is_read', 1)
            ->count();
        $is_read =  Notification::where('user_id', $userId)
            ->where('is_read', 1)
            ->get();

        return response()->json([
            'success' => true,
            'count' => $is_readCount,
            'data' => $is_read
        ]);
    }
    public function countUnreadNotifications($userId)
    {
        $un_readCount = Notification::where('user_id', $userId)
            ->where('is_read', 0)
            ->count();
        $un_read = Notification::where('user_id', $userId)
            ->where('is_read', 0)
            ->get(); 
        return response()->json([
            'success' => true,
            'count' => $un_readCount,
            'data' => $un_read
        ]);
    }

    public function markAsRead(string $id)
    {
        try {
            Notification::where('id', $id)->update([
                'is_read' => true
            ]);            

            return response()->json([
                'success' => true,
                'message' => 'Đã đánh dấu đã đọc'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi cập nhật thông báo'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
    public function markAllAsRead($userId)
    {
        try {
            Notification::where('user_id', $userId)
                ->update(['is_read' => true]);

            return response()->json([
                'success' => true,
                'message' => 'Đọc'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra khi cập nhật thông báo'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

}
