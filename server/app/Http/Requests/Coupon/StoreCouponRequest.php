<?php

namespace App\Http\Requests\Coupon;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Http\Response;
use Illuminate\Validation\Rule;

class StoreCouponRequest extends FormRequest
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
            'code' => 'required|max:255|unique:coupons',
            'name' => 'required|max:255|unique:coupons',
            'description' => 'required|max:255',
            'discount' => 'required',
            'discount_type' => 'required',
            'usage_limit' => 'required',
            'start_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:today',
            'end_date' => 'nullable|date|date_format:Y-m-d|after_or_equal:start_date',
            'status' => 'boolean',
            'min_order_value' => 'nullable|numeric|min:0',
            'max_order_value' => 'nullable|numeric|min:0|gte:min_order_value',
            'max_discount'   => 'nullable|numeric|min:0',
            'type' => 'nullable|string',
        ];
    }

    public function messages(): array
    {
        return [
            'end_date.date' => 'Ngày kết thúc phải là một ngày hợp lệ.',
            'name.unique' => 'Tên mã giảm giá đã tồn tại',
            'end_date.date_format' => 'Ngày kết thúc phải có định dạng YYYY-MM-DD.',
            'end_date.after_or_equal' => 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.',
            'start_date.date' => 'Ngày bắt đầu phải là một ngày hợp lệ.',
            'start_date.date_format' => 'Ngày bắt đầu phải có định dạng YYYY-MM-DD.',
            'start_date.after_or_equal' => 'Ngày bắt đầu phải từ hôm nay trở đi.',
            'code.required' => 'Yêu cầu nhập',
            'code.max' => 'Không nhập quá 255 ký tự',
            'code.unique' => 'Mã này đã tồn tại',
            'discount.required' => 'Yêu cầu nhập',
            'discount_type.required' => 'Yêu cầu nhập',
            'usage_limit.required' => 'Yêu cầu nhập',
            'min_order_value.min' => 'Giá trị phải là số ',
            'min_order_value.numeric' => 'Vui lòng nhập số',
            'max_order_value.min' => 'Vui lòng nhập giá trị lớn hơn 0',
            'max_order_value.gte' => 'Giá trị đơn hàng tối đa phải lớn hơn hoặc bằng giá trị đơn hàng tối thiểu.',
            'max_order_value.numeric' => 'Vui lòng nhập số',
            'max_discount.numeric' => 'Vui lòng nhập số',
            'max_discount.gt:min' => 'Giá trị phải là số',
            'status.in' => 'Trạng thái đã chọn không hợp lệ',


        ];
    }

    protected function failedValidation(Validator $validator)
    {
        $errors = $validator->errors();

        $response = response()->json([
            'errors' => $errors->messages()
        ], Response::HTTP_BAD_REQUEST);

        throw new HttpResponseException($response);
    }
}