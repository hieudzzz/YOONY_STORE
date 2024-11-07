import z from 'zod'

const resetPassValid = z.object({
    password: z.string()
        .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
        .regex(/[A-Z]/, "Mật khẩu phải có ít nhất một ký tự viết hoa")
        .regex(/[a-z]/, "Mật khẩu phải có ít nhất một ký tự viết thường")
        .regex(/[0-9]/, "Mật khẩu phải có ít nhất một ký tự số")
        .regex(/[\W_]/, "Mật khẩu phải có ít nhất một ký tự đặc biệt"),
    confirmPass: z.string()
}).refine(data => data.password === data.confirmPass, {
    message: "Mật khẩu và xác nhận mật khẩu không khớp",
    path: ["confirmPass"],
})

export default resetPassValid