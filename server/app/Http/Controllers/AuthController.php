<?php

namespace App\Http\Controllers;

use App\Http\Requests\Auth\RequestPasswordResetRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Hash;
use App\Http\Resources\UserResource;
use App\Notifications\ResetPasswordNotification;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        try {
            $request->validated($request->only(['email', 'password']));

            if (!Auth::attempt($request->only(['email', 'password']))) {
                return $this->error([], 'Tài khoản hoặc mật khẩu không chính xác', 401);
            }

            $user = User::where('email', $request->email)->first();

            // Xóa các token của tài khoản trước đó
            // $user->tokens()->delete();
            $newToken = $user->createToken('API Token', ['*'], now()->addHours(2));
            $token = $newToken->plainTextToken;

            return response()->json([
                'message' => 'Đăng nhập thành công!',
                'user' => $user,
                'token' => $token
            ], 200);
        } catch (\Exception $e) {
            Log::error('Có lỗi xảy ra: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra trong quá trình đăng nhập.'
            ], 500);
        }
    }

    public function register(RegisterRequest $request)
    {
        try {
            $request->validated($request->all());

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => bcrypt($request->password)
            ]);

            return response()->json([
                'message' => 'Đăng ký thành công!',
                'user' => $user,
                'token' => $user->createToken('API Token')->plainTextToken
            ], 200);
        } catch (\Exception $e) {
            Log::error('Có lỗi xảy ra: ' . $e->getMessage());
            return response()->json([
                'message' => 'Có lỗi xảy ra trong quá trình đăng ký.'
            ], 500);
        }
    }

    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Đăng Xuất thành công!'
        ], 200);
    }

    public function requestPasswordReset(RequestPasswordResetRequest $request)
    {
        try {
            $user = User::where('email', $request->email)->first();

            if (!$user) {
                return response()->json([
                    'message' => 'Email không tồn tại trong hệ thống.'
                ], 404);
            }

            $token = app('auth.password.broker')->createToken($user);

            $user->notify(new ResetPasswordNotification($token,$request->email));

            return response()->json([
                'message' => 'Link đổi mật khẩu đã được gửi đến email của bạn.',
                'token' => $token,
                'email' => $request->email
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }


    public function resetPassword(ResetPasswordRequest $request)
    {
        try {
            $status = Password::reset(
                $request->only('email', 'password', 'password_confirmation', 'token'),
                function (User $user, string $password) {
                    $user->password = bcrypt($password);
                    $user->save();
                }
            );

            if ($status === Password::PASSWORD_RESET) {
                return response()->json([
                    'message' => 'Mật khẩu đã được thay đổi thành công.'
                ], 200);
            }

            return response()->json([
                'message' => 'Có lỗi xảy ra trong quá trình đặt lại mật khẩu.'
            ], 500);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}
