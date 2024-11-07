<?php

namespace App\Http\Requests\Blog;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBlogRequest extends FormRequest
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
            'content' => 'nullable|string',
            'slug' => 'nullable|string|max:255|unique:blogs,slug,' . $this->route('blog'), 
            'user_id' => 'nullable|exists:users,id',
            'is_active' => 'boolean',
        ];
    }


    public function messages()
    {
        return [
            'content.string' => 'Nội dung phải là chuỗi.',
            'slug.string' => 'Slug phải là chuỗi.',
            'slug.unique' => 'Slug đã tồn tại. Vui lòng chọn một slug khác.',
            'user_id.exists' => 'Người dùng không tồn tại trong hệ thống.',
            'is_active.boolean' => 'Trạng thái phải là true hoặc false.',
        ];
    }
}
