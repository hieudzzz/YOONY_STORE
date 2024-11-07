import axios from "axios";
import { Label } from "flowbite-react";
import { useCallback, useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import instance from "../../../instance/instance";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
const ResetPassRequest = () => {
  const [capVal, SetCapVal] = useState<string | null>(null);
  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();
  const [isActive, setActive] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const onSubmit = useCallback(
    async (formData: any) => {
      try {
        const { email } = formData;
        setActive(true);
        await instance.post("auth/password/request-reset", {
          email,
          recaptchaToken: capVal,
        });
        setActive(false);
        reset();
        recaptchaRef.current?.reset();
        SetCapVal(null);
        toast.success("Gửi URL đổi mật khẩu thành công");
        throw new Error();
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
    },
    [capVal, reset]
  );
  return (
      <form
        className="max-w-[350px] space-y-5 w-full"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="font-[500] text-[32px] text-primary">
          KHÔI PHỤC MẬT KHẨU
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
        >
          <div className="space-y-5">
            <div className="max-w-[305px]">
              <div className="mb-2 block">
                <Label htmlFor="email" value="Email" />
              </div>
              <input
                type="email"
                placeholder="Email"
                id="email"
                {...register("email", {
                  required: "Email là bắt buộc !",
                  pattern: {
                    value: /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/,
                    message: "Email sai định dạng !",
                  },
                })}
                className="block focus:!border-primary/50 h-10 border-input px-3 rounded-lg w-full focus:!shadow-none"
              />
              <span className="text-red-500 block text-sm mt-2">
                {errors.email?.message}
              </span>
            </div>
            <div>
              <div className="mb-3 block">
                <ReCAPTCHA
                  sitekey={import.meta.env.VITE_SITE_KEY_CAPTCHA}
                  onChange={(val) => SetCapVal(val)}
                  className="!w-full"
                  ref={recaptchaRef}
                />
              </div>
            </div>
          </div>
          <button
            className={`${
              !capVal ? "bg-slate-400 cursor-not-allowed" : "bg-primary"
            } py-2 px-6 rounded-md text-util inline-block font-[400]`}
            disabled={!capVal}
          >
            KHÔI PHỤC
          </button>
        </LoadingOverlay>
      </form>
  );
};

export default ResetPassRequest;
