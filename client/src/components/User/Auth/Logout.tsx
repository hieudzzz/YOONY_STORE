import { message } from "antd";
import Cookies from "js-cookie";

export const AUTH_COOKIE_NAME = "authToken";
export const USER_INFO_KEY = "userInfor";
export const WISHLIST_KEY = "wishlists";
export const ADDRESS_KEY = "addressSelect";
export const FINAL_TOTAL_KEY = "final_total";
export const ID_CART_KEY = "id_cart";
export const METHOD_PAYMENT_KEY = "methodPayment";
export const ORDER_DATA_KEY = "orderData";
export const VOUCHER_KEY = "selected_voucher";
export const CALLBACK_KEY = "callback_processed";
export const CARTLOCAL_KEY = "cartLocal";

const clearStorage = () => {
  const keysToClear = [
    USER_INFO_KEY,
    WISHLIST_KEY,
    ADDRESS_KEY,
    METHOD_PAYMENT_KEY,
    CALLBACK_KEY,
    FINAL_TOTAL_KEY,
    ID_CART_KEY,
    ORDER_DATA_KEY,
    VOUCHER_KEY,
    CARTLOCAL_KEY,
  ];

  keysToClear.forEach((key) => localStorage.removeItem(key));
  Cookies.remove(AUTH_COOKIE_NAME, { path: '/' });
};

const logout = (customMessage = "Đăng xuất thành công") => {
  clearStorage();
  window.dispatchEvent(new Event("auth-change"));
  message.success(customMessage);
};

export default logout;
