<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;

class StoreBlogRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'content' => 'required|string',
            'slug' => 'required|string|max:255|unique:blogs',
            'user_id' => 'required|exists:users,id',
            'is_active' => 'boolean',
        ];
    }

    public function messages()
    {
        return [
            'content.required' => 'Nội dung không được để trống.',
            'slug.required' => 'Slug không được để trống.',
            'slug.unique' => 'Slug đã tồn tại. Vui lòng chọn một slug khác.',
            'user_id.required' => 'Người dùng không được để trống.',
            'user_id.exists' => 'Người dùng không tồn tại trong hệ thống.',
            'is_active.boolean' => 'Trạng thái phải là true hoặc false.',
        ];
    }
}
