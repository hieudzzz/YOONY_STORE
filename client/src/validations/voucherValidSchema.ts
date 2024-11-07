import { z } from "zod";

const VoucherSchemaValid = z.object({
  code: z
    .string({
      required_error: "Không được để trống !",
    })
    .min(3, "Tối thiểu 3 kí tự !"),
  discount: z.number({
    required_error: "Bắt buộc !",
    invalid_type_error: "Phải là số !",
  }),
  discount_type: z.string().nonempty("Discount type is required"), 
  usage_limit: z.number({
    required_error: "Giới hạn sử dụng",
    invalid_type_error: "Tối đa 3",
  }),
  min_order_value: z.number({
    required_error: "Nhập giá min",
    invalid_type_error: "Phải là số !",
  }),
  max_order_value: z.number({
    required_error: "Nhập giá max ",
    invalid_type_error: "Phải là số !",
  }),
  start_date: z.string({
    required_error: "Nhập ngày",
    invalid_type_error: "Nhập đúng ngày",
  }),
  end_date: z.string({
    required_error: "Nhập ngày",
    invalid_type_error: "Nhập đúng ngày",
  }),
  status: z.boolean().optional(),
  is_featured: z.boolean().optional(),

});

export default VoucherSchemaValid;
