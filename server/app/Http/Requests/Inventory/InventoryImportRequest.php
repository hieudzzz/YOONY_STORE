<?php

namespace App\Http\Requests\Inventory;

use Illuminate\Foundation\Http\FormRequest;

class InventoryImportRequest extends FormRequest
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
            'quantity' => 'required|integer|min:1',
            'import_price' => 'required|integer'
        ];
    }

    public function messages()
    {
        return [
            'quantity.required' => 'Số lượng là bắt buộc.',
            'quantity.integer' => 'Số lượng phải là số.',
            'quantity.min' => 'Số lượng phải >= 1',
            'import_price.required' => 'Giá nhập là bắt buộc',
            'import_price.integer' => 'Giá nhập phải là số.',
        ];
    }
}
