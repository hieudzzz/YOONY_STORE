import { ReactNode, useEffect, useReducer, useState } from "react";
import CartContext from "../contexts/CartContext";
import { ICart } from "../interfaces/ICart";
import CartReducer from "../reducer/CartReducer";
import instance from "../instance/instance";
import isAuthenticated from "../components/Middleware/isAuthenticated";

type Props = {
  children: ReactNode;
};

const CartProvider = ({ children }: Props) => {
  const [carts, dispatch] = useReducer(CartReducer, [] as ICart[]);
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated());

  useEffect(() => {
    const fetchCarts = async () => {
      if (isLoggedIn) {
        try {
          const { data: { data: response } } = await instance.get('cart');
          dispatch({
            type: "LIST",
            payload: response
          });
        } catch (error) {
          console.log(error);
        }
      } else {
        dispatch({
          type: "LIST",
          payload: []
        });
      }
    };

    fetchCarts();
  }, [isLoggedIn]);

  useEffect(() => {
    const checkAuthStatus = () => {
      setIsLoggedIn(isAuthenticated());
    };

    checkAuthStatus();

    window.addEventListener('storage', checkAuthStatus);
    
    const cookieCheckInterval = setInterval(checkAuthStatus, 500); 

    return () => {
      window.removeEventListener('storage', checkAuthStatus);
      clearInterval(cookieCheckInterval);
    };
  }, []);

  return (
    <CartContext.Provider value={{ carts, dispatch }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;