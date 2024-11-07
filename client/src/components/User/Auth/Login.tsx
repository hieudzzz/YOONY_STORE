import { Label } from "flowbite-react";
import Ilogin from "../../../interfaces/ILogin";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import instance from "../../../instance/instance";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../providers/AuthProvider";
import { Input, message } from "antd";
import LoginGoogleFaceBook from "./LoginGoogleFaceBook";

const Login = () => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<Ilogin>();
  const navigate = useNavigate();
  const { login } = useAuth();
  const onSubmit = async (formData: Ilogin) => {
    try {
      const { data } = await instance.post("login", formData);
      if (data && data.token) {
        Cookies.set("authToken", data.token, {
          expires: 1 / 12,
          secure: true,
          sameSite: "strict",
        });
        localStorage.setItem("userInfor", JSON.stringify(data.user));
        login(data.user);
        message.success("Đăng nhập thành công!");
        navigate("/");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        message.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error("Đã xảy ra lỗi không mong muốn");
      }
    }
  };
  return (
    <section className="flex items-center justify-evenly mt-14 gap-5">
      <div>
        <img src="../../../../src/assets/images/login.svg" alt="sign-up-form" />
      </div>
      <form
        className="max-w-[350px] space-y-5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="font-[500] text-[32px] text-primary text-center">
          ĐĂNG NHẬP
        </h2>
        <div className="space-y-4">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Email" />
            </div>
            <input
              type="text"
              placeholder="Email"
              id="email"
              {...register("email")}
              className="block focus:!border-primary/50 h-10 border-input px-3 rounded-lg w-full focus:!shadow-none"
            />
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password-input" value="Mật khẩu" />
            </div>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Mật khẩu"
                  className="h-10"
                />
              )}
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-fit bg-primary py-2 px-6 rounded-md text-util mx-auto block font-[400]"
        >
          ĐĂNG NHẬP
        </button>
        <span className="text-secondary/50 block text-center">HOẶC</span>
        <LoginGoogleFaceBook />
      </form>
    </section>
  );
};

export default Login;
