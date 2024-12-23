import React, { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { message } from "antd";
import { IUser } from "../interfaces/IUser";

interface AuthContextType {
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_COOKIE_NAME = "authToken";
const USER_INFO_KEY = "userInfor";
const WISHLIST_KEY = "wishlists";
const ADDRESS_KEY = "addressSelect";
const FINAL_TOTAL_KEY = "final_total";
const ID_CART_KEY = "id_cart";
const METHOD_PAYMENT_KEY = "methodPayment";
const ORDER_DATA_KEY = "orderData";
const VOUCHER_KEY = "selected_voucher";
const CALLBACK_KEY = "callback_processed";
const CARTLOCAL_KEY = "cartLocal";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {

  useEffect(() => {
    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener("storage", handleStorageChange);
    checkAuthStatus();
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

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
      CARTLOCAL_KEY
    ];

    keysToClear.forEach(key => localStorage.removeItem(key));
    Cookies.remove(AUTH_COOKIE_NAME);
  };

  const checkAuthStatus = useCallback(() => {
    const authCookie = Cookies.get(AUTH_COOKIE_NAME);
    const userInfo = localStorage.getItem(USER_INFO_KEY);

    if (!authCookie || !userInfo) {
      clearStorage();
    }
  }, []);


  const logout = () => {
    clearStorage();
    window.dispatchEvent(new Event("auth-change"));
    message.success("Đăng xuất thành công");
  };

  return (
    <AuthContext.Provider value={{ 
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth phải được sử dụng trong AuthProvider");
  }
  return context;
};
