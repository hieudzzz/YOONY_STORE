import { z } from "zod"
const AttributeValueSchema = z.object({

});

export const VariantSchema = z.object({
    price: z.number({
        required_error: "Giá không được rỗng !"
    }).positive(),
    sale_price: z.number().positive().optional(),
    quantity: z.number().int().nonnegative().optional(),
    image: z.string().url().optional(),
    attribute_values: z.array(AttributeValueSchema).optional(),
});



const productValidSchema = z.object(
    {
        name: z.string().min(1, "Tên sản phẩm là bắt buộc !"),
        slug: z.string().min(1, "Slug là bắt buộc !"),
        description: z.string().optional(),
        category_id: z.string(
            {
              required_error: "Vui lòng chọn danh mục !"
            }
        ).or(z.number()),
        is_active: z.boolean(),
        is_featured: z.boolean(),
        is_good_deal: z.boolean(),
        // variants: z.array(VariantSchema).nonempty("Ít nhất một biến thể là bắt buộc !"),
        variants: z.array(
            z.object({
              price: z.number({
                invalid_type_error:"(*)"
              }).positive("Giá phải là số dương").min(1, "Giá không được để trống").optional(),
              sale_price: z.number({
                invalid_type_error:" "
              }).positive("Giá sale phải là số dương").optional().nullable(),
              quantity: z.number(
                {
                    invalid_type_error:""
                }
              ).int().nonnegative("Số lượng phải là số không âm").min(0, "Số lượng không được âm"),
              image: z.string().optional().nullable(),
              attribute_values: z.array(
                z.object({
                  attribute_value_id: z.union([
                    z.number().int().positive("ID thuộc tính phải là số dương"),
                    z.array(z.number().int().positive("ID thuộc tính phải là số dương"))
                  ]).optional()
                })
              )
            })
          ).min(1, "Phải có ít nhất một biến thể"),
        is_variant: z.boolean(),
    }
)
export type ProductFormData = z.infer<typeof productValidSchema>;
export default productValidSchema