<?php

namespace App\Http\Requests\Supplier;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSupplierRequest extends FormRequest
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
            'name' => 'required',
            'email' => 'required|email|unique:suppliers,email,'.$this->id,
            'phone' => 'required',
            'address' => 'required',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'Tên không được để trống',
            'email.required' => 'Email không được để trống',
            'email.email' => 'Email không đúng định dạng',
            'email.unique' => 'Email đã được sử dụng',
            'phone.required' => 'Số điện thoại không được để trống',
            'address.required' => 'Địa chỉ không được để trống',
        ];
    }
}
