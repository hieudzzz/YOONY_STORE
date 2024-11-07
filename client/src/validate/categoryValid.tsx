import { z } from "zod";
const categorySchema = z.object({
  name: z.string().min(6, "Tên danh mục tối thiểu 6 kí tự !"),
  image:z.any().refine(val => val.length > 0, "Ảnh là bắt buộc !"),
  is_active:z.boolean().optional()
});
export default categorySchema;
