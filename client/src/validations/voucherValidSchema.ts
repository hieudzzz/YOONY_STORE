import { z } from "zod";

// Lấy ngày hôm nay theo múi giờ UTC+7
const today = new Date();
today.setHours(today.getHours() + 7); // Thêm 7 giờ để chuyển sang UTC+7
const todayString = today.toISOString().split('T')[0];  // Chuyển đổi thành chuỗi "YYYY-MM-DD"

// Schema
const VoucherSchemaValid = z.object({
  code: z
    .string({
      required_error: "Không được để trống !",
    })
    .min(3, "Tối thiểu 3 kí tự !"),

  name: z.string({
    required_error: "Không được để trống !",
  }).min(10, "Tối thiểu 10 kí tự !"),

  description: z.string({
    required_error: "Không được để trống !",
  }).min(10, "Tối thiểu 10 kí tự !"),

  discount: z.coerce.number({
    required_error: "Bắt buộc !",
    invalid_type_error: "Phải là số !",
  }).min(0, "Giá trị phải là số dương"),

  discount_type: z.enum(["fixed", "percentage"], {
    required_error: "Phải chọn loại giảm giá !",
  }),

  usage_limit: z.coerce.number({
    required_error: "Bắt buộc !",
    invalid_type_error: "Phải là số !",
  }).min(0, "Giới hạn sử dụng phải là số dương"),

  start_date: z.union([
    z.string().refine(date => {
      const inputDate = new Date(date);
      inputDate.setHours(inputDate.getHours() + 7);
      return inputDate >= new Date(todayString);
    }, {
      message: `Ngày bắt đầu phải từ ${todayString} trở đi`,
    }).optional(),
    z.null().optional()
  ]),

  // Cập nhật các trường min_order_value, max_order_value, và max_discount để cho phép NULL
  min_order_value: z.coerce.number({
    invalid_type_error: "Phải là số !",
  }).min(0, "Giá trị đơn hàng tối thiểu phải là số dương")
    .nullable(),  // Cho phép NULL

  max_order_value: z.coerce.number({
    invalid_type_error: "Phải là số !",
  }).min(null, "Giá trị đơn hàng tối đa phải là số dương")
    .nullable(),  // Cho phép NULL

  max_discount: z.coerce.number({
    invalid_type_error: "Phải là số !",
  }).min(0, "Giảm giá tối đa phải là số dương")
    .nullable(),  // Cho phép NULL

  end_date: z.union([
    z.string().optional(),
    z.null().optional()
  ]),

  status: z.boolean().optional().default(true),
}).refine((data) => {
  // Kiểm tra ngày kết thúc phải sau ngày bắt đầu
  if (data.start_date && data.end_date) {
    return new Date(data.end_date) > new Date(data.start_date);
  }
  return true;
}, {
  message: "Ngày kết thúc phải sau ngày bắt đầu",
  path: ["end_date"]
}).refine((data) => {
  // Kiểm tra max_order_value phải lớn hơn min_order_value
  if (data.min_order_value !== undefined && data.max_order_value !== undefined) {
    return data.max_order_value >= data.min_order_value;
  }
  return true;
}, {
  message: "Giá trị đơn hàng tối đa phải lớn hơn hoặc bằng giá trị đơn hàng tối thiểu",
  path: ["max_order_value"]
}).transform((data) => {
  // Loại bỏ các trường có giá trị null, undefined hoặc rỗng
  return Object.fromEntries(
    Object.entries(data).filter(([_, value]) => 
      value !== '' && value !== null && value !== undefined
    )
  );
});

export default VoucherSchemaValid;
