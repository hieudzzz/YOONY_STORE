import { Label } from "flowbite-react";
import { IUser } from "../../../interfaces/IUser";
import { useForm, Controller } from "react-hook-form";
import registerValidScheme from "../../../validations/registerValidScheme";
import { zodResolver } from "../../../../node_modules/@hookform/resolvers/zod/src/zod";
import instance from "../../../instance/instance";
import { toast } from "react-toastify";
import axios from "axios";
import { Input } from "antd";
import { useState } from "react";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
const Register = () => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IUser>({
    resolver: zodResolver(registerValidScheme),
  });
  const [isLoading, setLoading] = useState<boolean>(false);
  //Xử lý Đăng ký
  const onSubmit = async (dataForm: IUser) => {
    try {
      setLoading(true)
      const { name, email, password } = dataForm;
      const data = await instance.post("register", {
        name,
        email,
        password,
      });
      if (data) {
        reset();
        // toast.success("Đăng ký tài khoản thành công!");
        toast.success(
          <div>
            <p>Đăng kí thành công !</p>
            <pre
              style={{
                maxHeight: "250px",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
              }}
            >
              Chúng tôi đã gửi một email đến bạn để xác nhận !
            </pre>
          </div>,
          {
            autoClose: false,
            closeOnClick: false,
          }
        );
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message);
      } else if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("Đã xảy ra lỗi không mong muốn");
      }
    }finally{
      setLoading(false)
    }
  };
  return (
    <LoadingOverlay
      active={isLoading}
      spinner
      text="Đang xử lý ..."
      styles={{
        overlay: (base) => ({
          ...base,
          background: "rgba(255, 255, 255, 0.75)",
          backdropFilter: "blur(4px)",
        }),
        spinner: (base) => ({
          ...base,
          width: "40px",
          "& svg circle": {
            stroke: "rgba(255, 153, 0,5)",
            strokeWidth: "3px",
          },
        }),
      }}
    >
      <section className="flex items-center justify-evenly mt-14">
        <form
          className="max-w-[350px] space-y-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <h2 className="font-[500] text-[32px] text-primary text-center">
            ĐĂNG KÝ
          </h2>
          <div className="space-y-4">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="username-input" value="Username" />
              </div>
              <input
                type="text"
                placeholder="Username"
                id="username-input"
                className="block focus:!border-primary/50 h-10 border-input px-3 rounded-lg w-full focus:!shadow-none text-sm"
                {...register("name")}
              />
              <span className="block text-sm text-red-500 mt-1">
                {errors.name?.message}
              </span>
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email-input" value="Email" />
              </div>
              <input
                type="text"
                placeholder="Email"
                id="email-input"
                className="block focus:!border-primary/50 h-10 border-input px-3 rounded-lg w-full focus:!shadow-none text-sm"
                {...register("email")}
              />
              <span className="block text-sm text-red-500 mt-1">
                {errors.email?.message}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="pass-input" value="Mật khẩu" />
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
                <span className="block text-sm text-red-500 mt-1">
                  {errors.password?.message}
                </span>
              </div>
              <div>
                <div className="mb-2 block">
                  <Label
                    htmlFor="confirmPass-input"
                    value="Nhập lại mật khẩu"
                  />
                </div>
                <Controller
                  name="confirmPass"
                  control={control}
                  render={({ field }) => (
                    <Input.Password
                      {...field}
                      placeholder="Nhập lại mật khẩu"
                      className="h-10"
                    />
                  )}
                />
                <span className="block text-sm text-red-500 mt-1">
                  {errors.confirmPass?.message}
                </span>
              </div>
            </div>
          </div>
          <button className="w-fit bg-primary py-2 px-6 rounded-md text-util mx-auto block font-[400]">
            ĐĂNG KÝ
          </button>
        </form>
        <div>
          <img
            src="../../../../src/assets/images/sign-up-form.svg"
            alt="sign-up-form"
          />
        </div>
      </section>
    </LoadingOverlay>
  );
};

export default Register;
