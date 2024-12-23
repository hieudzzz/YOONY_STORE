import { Input, message } from "antd";
import instance from "../../../../instance/instance";
import { Controller, useForm } from "react-hook-form";
import { Label } from "flowbite-react";
import { zodResolver } from "@hookform/resolvers/zod";
import changePasswordUser from "../../../../validations/changePasswordUser";
import { useEffect, useState } from "react";

export type IPassword = {
  passwordOld: string;
  newPassword: string;
  confirmPass: string;
};
const ChangePasswordUser = () => {
  const [user, setUser] = useState(null);
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<IPassword>({
    resolver: zodResolver(changePasswordUser),
  });

  const handlePasswordChange = async (dataForm: IPassword) => {
    try {
      const response = await instance.post("/change-password", {
        current_password: dataForm.passwordOld,
        new_password: dataForm.newPassword,
      });
      message.success(response.data.message);
      reset();
    } catch (error) {
      message.error(error.response?.data?.message || "Đổi mật khẩu thất bại");
    }
  };

  return (
    <form
      className="flex-1 max-w-lg p-6 rounded-sm space-y-5"
      onSubmit={handleSubmit(handlePasswordChange)}
    >
      <h2 className="uppercase font-medium text-base">Đổi mật khẩu</h2>
      <div className="space-y-3">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="pass-input-old" value="Mật khẩu cũ" />
          </div>
          <Controller
            name="passwordOld"
            control={control}
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder="Mật khẩu cũ"
                className="h-[38px]"
              />
            )}
          />
          <span className="block text-sm text-primary mt-1">
            {errors.passwordOld?.message}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <div className="mb-2 block">
              <Label htmlFor="pass-input" value="Mật khẩu mới" />
            </div>
            <Controller
              name="newPassword"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Mật khẩu mới"
                  className="h-[38px]"
                />
              )}
            />
            <span className="block text-sm text-primary mt-1">
              {errors.newPassword?.message}
            </span>
          </div>
          <div>
            <div className="mb-2 block">
              <Label htmlFor="confirmPass-input" value="Nhập lại mật khẩu" />
            </div>
            <Controller
              name="confirmPass"
              control={control}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Nhập lại mật khẩu"
                  className="h-[38px]"
                />
              )}
            />
            <span className="block text-sm text-primary mt-1">
              {errors.confirmPass?.message}
            </span>
          </div>
        </div>
      </div>
      <div className="flex justify-start">
        <button className="bg-primary hover:bg-primary text-white text-sm py-2 px-3 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary flex items-center gap-1.5">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            color={"currentColor"}
            fill={"none"}
            className="text-white size-5"
          >
            <path
              d="M19.5433 10.5L22 11C21.497 5.94668 17.2229 2 12.0247 2C6.48823 2 1.99999 6.47715 1.99999 12C1.99999 17.5228 6.48823 22 12.0247 22C16.1355 22 19.6684 19.5318 21.2153 16"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10.3371 10.88C9.25713 10.88 8.71713 11.66 8.59713 12.14C8.47713 12.62 8.47713 14.36 8.54913 15.08C8.78913 15.98 9.38913 16.352 9.97713 16.472C10.5171 16.52 12.7971 16.502 13.4571 16.502C14.4171 16.52 15.1371 16.16 15.4371 15.08C15.4971 14.72 15.5571 12.74 15.4071 12.14C15.0891 11.18 14.2971 10.88 13.6971 10.88H10.3371Z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            <path
              d="M10.25 10.4585C10.25 10.3985 10.2582 10.0531 10.2596 9.61854C10.2609 9.22145 10.226 8.83854 10.4156 8.48814C11.126 7.07454 13.166 7.21854 13.67 8.65854C13.7573 8.89562 13.7626 9.27146 13.76 9.61854C13.7567 10.062 13.766 10.4585 13.766 10.4585"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          Đổi mật khẩu
        </button>
      </div>
    </form>
  );
};

export default ChangePasswordUser;
