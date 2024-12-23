import { Label } from "flowbite-react";
import Ilogin from "../../../interfaces/ILogin";
import { Controller, useForm } from "react-hook-form";
import axios from "axios";
import instance from "../../../instance/instance";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";
import { Input, message } from "antd";
import LoginGoogleFaceBook from "./LoginGoogleFaceBook";
import { useCallback, useContext } from "react";
import { NotificationsContext } from "../../../contexts/NotificationsContext";
import CartContext from "../../../contexts/CartContext";

export const WISHLIST_KEY = "wishlists";
export const CARTLOCAL_KEY = "cartLocal";

const Login = () => {
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<Ilogin>();
  const navigate = useNavigate();
  const { dispatch: dispatchNotification } = useContext(NotificationsContext);
  const { dispatch: dispatchCart } = useContext(CartContext);

  const callNotification = useCallback(
    async (idUser: number) => {
      const {
        data: { data: response },
      } = await instance.get(`notification/${idUser}`);
      if (response) {
        dispatchNotification({ type: "LIST", payload: response });
      }
    },
    [dispatchNotification]
  );

  const fetchWishlists = useCallback(async () => {
    const { data } = await instance.get("list-wishlists-check");
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(data.wishlists));
  }, []);

  const addCartLocal = useCallback(
    async (idUser: number) => {
      const existingCart = JSON.parse(
        localStorage.getItem(CARTLOCAL_KEY) || "[]"
      );

      if (existingCart.length === 0) return;

      const formattedCart = existingCart.map((item) => ({
        variant_id: item.variant_id,
        quantity: item.quantity,
      }));

      const { data } = await instance.post(`addcartMultil/${idUser}`, {
        local_cart: formattedCart,
      });
      dispatchCart({ type: "ADD", payload: data.data });
      localStorage.removeItem(CARTLOCAL_KEY);
    },
    [dispatchCart]
  );

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
        await Promise.all([
          fetchWishlists(),
          callNotification(data.user.id!),
          addCartLocal(data.user.id!)
        ]);
        message.success("Đăng nhập thành công!");
        window.dispatchEvent(new Event("auth-change"));
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
          <div className="space-y-1">
            <div className="space-y-2">
              <div className="block">
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
            <div>
              <Link to={"/reset-password"} className="text-sm text-primary">
                Quên mật khẩu ?
              </Link>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-fit bg-primary py-2 px-6 rounded-md text-util mx-auto block font-[400] hover:bg-transparent transition-all duration-200 hover:text-primary hover:border-primary border border-transparent active:scale-90 active:shadow-lg active:bg-primary-dark"
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
