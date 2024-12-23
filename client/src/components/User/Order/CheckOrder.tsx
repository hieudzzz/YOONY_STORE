import { Input, message } from "antd";
import { useForm, Controller } from "react-hook-form";
import { useCallback, useEffect, useRef, useState } from "react";
import instance from "../../../instance/instance";
import axios from "axios";
import ReCAPTCHA from "react-google-recaptcha";
import { SearchOutlined } from "@ant-design/icons";
import ListOrdersCheck from "./ListOrdersCheck";
import { IOrderUserClient } from "../../../interfaces/IOrderUserClient";
export const CheckOrder = () => {
  const [capVal, SetCapVal] = useState<string | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    reset,
    control,
  } = useForm();
  const [isActive, setActive] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const [datas, setDatas] = useState<IOrderUserClient[]>();
  const onSubmit = useCallback(
    async (formData: any) => {
      try {
        setActive(true);
        const { search } = formData;
        const { data } = await instance.get(`check-order?search=${search}`);
        setDatas(data.orders);
        reset();
        recaptchaRef.current?.reset();
        SetCapVal(null);
      } catch (error) {
        setActive(false);
        if (axios.isAxiosError(error)) {
          message.error(error.response?.data?.message);
        } else if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.log("Đã xảy ra lỗi không mong muốn");
        }
      }
    },
    [capVal, reset]
  );
  return (
      <div className="mt-5 mb-20 space-y-5">
        <div className="py-12">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-7 flex flex-col items-center p-10 mx-auto rounded-md bg-primary/10 shadow-[rgba(149_157_165_0.2)_0px_8px_24px]"
          >
            <h2 className="font-[500] text-[28px] text-primary text-center flex gap-2 items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="size-12"
                color={"currentColor"}
                fill={"none"}
              >
                <circle
                  cx="17"
                  cy="18"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <circle
                  cx="7"
                  cy="18"
                  r="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M5 17.9724C3.90328 17.9178 3.2191 17.7546 2.73223 17.2678C2.24536 16.7809 2.08222 16.0967 2.02755 15M9 18H15M19 17.9724C20.0967 17.9178 20.7809 17.7546 21.2678 17.2678C22 16.5355 22 15.357 22 13V11H17.3C16.5555 11 16.1832 11 15.882 10.9021C15.2731 10.7043 14.7957 10.2269 14.5979 9.61803C14.5 9.31677 14.5 8.94451 14.5 8.2C14.5 7.08323 14.5 6.52485 14.3532 6.07295C14.0564 5.15964 13.3404 4.44358 12.4271 4.14683C11.9752 4 11.4168 4 10.3 4H2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 8H8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2 11H6"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M14.5 6H16.3212C17.7766 6 18.5042 6 19.0964 6.35371C19.6886 6.70742 20.0336 7.34811 20.7236 8.6295L22 11"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              TRA CỨU THÔNG TIN ĐƠN HÀNG
            </h2>
            <div className="space-y-2.5 max-w-xl w-full">
              {/* <Label
              htmlFor="input-search-order-code"
              value="Nhập số điện thoại hoặc mã đơn hàng"
            /> */}
              <Controller
                name="search"
                rules={{
                  required: "Vui lòng nhập số điện thoại hoặc mã đơn hàng",
                  pattern: {
                    value: /^[0-9]{10,15}$|^ORD-\d{8}-\d{3,4}$/,
                    message: "Số điện thoại hoặc mã đơn hàng không hợp lệ",
                  },
                  minLength: {
                    value: 10,
                    message: "Tối thiểu là 10 kí tự !",
                  },
                }}
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <div className="w-full z-50">
                    <Input
                      size="large"
                      {...field}
                      placeholder="Nhập số điện thoại hoặc mã đơn hàng"
                      prefix={
                        <SearchOutlined className="text-xl text-[#A4A4A4]" />
                      }
                      className="w-full text-sm space-x-2 placeholder:text-[#A4A4A4]"
                    />
                    {error && (
                      <p className="text-primary text-sm my-1">
                        {error.message}
                      </p>
                    )}
                  </div>
                )}
              />
            </div>
            <div className="mb-3 block">
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_SITE_KEY_CAPTCHA}
                onChange={(val) => SetCapVal(val)}
                className="!w-full"
                ref={recaptchaRef}
              />
            </div>
            <button
              className={`${
                !capVal ? "bg-slate-300 cursor-not-allowed" : "bg-primary"
              } py-2 px-6 rounded-md text-util inline-block font-[400]`}
              disabled={!capVal}
            >
              TRA CỨU NGAY
            </button>
          </form>
        </div>
        {datas && <ListOrdersCheck datas={datas} />}
      </div>
  );
};
