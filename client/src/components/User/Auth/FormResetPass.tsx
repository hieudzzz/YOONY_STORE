import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import axios from "axios";
import { Label } from "flowbite-react"
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import instance from "../../../instance/instance";
import { zodResolver } from "@hookform/resolvers/zod/src/zod.js";
import resetPassValid from "../../../validations/resetPassValid";

const FormResetPass = () => {
const [isActive, setActive] = useState(false);
const navigate=useNavigate()
// Lấy token và email mã hóa từ URL
const {token,email}=useParams()
// Giải mã email từ Base64
const decodeBase64 = (base64String:string) => {
    try {
      return atob(base64String);
    } catch (e) {
      console.error("Error decoding base64 string:", e);
      return null;
    }
};
const decodedEmail = decodeBase64(email!);

const {register,formState:{errors},handleSubmit}=useForm({
    resolver:zodResolver(resetPassValid)
})
const onSubmit= async(dataForm:any)=>{
    
    try {
        const {password}=dataForm
        console.log(password)
        setActive(true);
       await instance.post('auth/password/reset',{
        email:decodedEmail,
        token,
        password
       })
       setActive(false);
       toast.success('Đổi mật khẩu thành công !')
       navigate('/login')
    } catch (error) {
        setActive(false);
        if (axios.isAxiosError(error)) {
          toast.error(error.response?.data?.message);
        } else if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("Đã xảy ra lỗi không mong muốn");
        }
    }
}
  return (
    <form
        className="max-w-[400px] space-y-5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="font-[500] text-[32px] text-primary">
          THIẾT LẬP MẬT KHẨU MỚI
        </h2>
        <LoadingOverlay
          active={isActive}
          spinner
          styles={{
            overlay: (base) => ({
              ...base,
              background: 'rgba(255, 255, 255, 0.75)',
              backdropFilter: 'blur(4px)'
            }),
            spinner: (base) => ({
              ...base,
              width: "40px",
              "& svg circle": {
                stroke: "rgba(255, 153, 0,5)",
                strokeWidth:"3px"
              },
            }),
          }}
        className="space-y-5"
        >
          <div className="space-y-5">
            <div className="max-w-[305px]">
              <div className="mb-2 block">
                <Label htmlFor="password" value="Mật khẩu mới" />
              </div>
              <input
                type="password"
                placeholder="Mật khẩu mới"
                id="password"
                {...register("password")}
                className="block focus:!border-primary/50 h-10 border-input px-3 rounded-lg w-full focus:!shadow-none"
              />
              <span className="text-red-500 block text-sm mt-2">
                {errors?.password?.message}
              </span>
            </div>
            <div className="max-w-[305px]">
              <div className="mb-2 block">
                <Label htmlFor="password-confirm" value="Nhập lại mật khẩu" />
              </div>
              <input
                type="password"
                placeholder="Nhập lại mật khẩu"
                id="password-confirm"
                {...register("confirmPass")}
                className="block focus:!border-primary/50 h-10 border-input px-3 rounded-lg w-full focus:!shadow-none"
              />
              <span className="text-red-500 block text-sm mt-2">
                {errors?.confirmPass?.message}
              </span>
            </div>
          </div>
          <button
            className={`bg-primary py-2 px-6 rounded-md text-util inline-block font-[400]`}
            type="submit"
          >
            ĐỔI MẬT KHẨU
          </button>
        </LoadingOverlay>
      </form>
  )
}

export default FormResetPass