import { useEffect, useState, useRef, useCallback, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../../instance/instance";
import Cookies from "js-cookie";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";
import { NotificationsContext } from "../../../contexts/NotificationsContext";
import CartContext from "../../../contexts/CartContext";
import { CARTLOCAL_KEY, WISHLIST_KEY } from "./Login";
import { message } from "antd";

const CallBackLoginGoogle = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setLoading] = useState<boolean>(false);
    const hasFetchedRef = useRef(false); 
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
  
    useEffect(() => {
        const fetchLoginInfo = async () => {
            const params = new URLSearchParams(location.search);
            const code = params.get("code");
            if (code && !hasFetchedRef.current) { 
                hasFetchedRef.current = true;
                try {
                    setLoading(true);
                    const { data: responseLoginInfor } = await instance.get(
                        `auth/google/callback?code=${encodeURIComponent(code)}`
                    );
                    if (responseLoginInfor && responseLoginInfor.token) {
                        setLoading(false);
                        Cookies.set("authToken", responseLoginInfor.token, {
                            expires: 1 / 12,
                            secure: true,
                            sameSite: "strict",
                        });
                        localStorage.setItem("userInfor", JSON.stringify(responseLoginInfor.user));
                        await Promise.all([
                            fetchWishlists(),
                            callNotification(responseLoginInfor.user.id!),
                            addCartLocal(responseLoginInfor.user.id!)
                          ]);
                          message.success("Đăng nhập thành công!");
                          window.dispatchEvent(new Event("auth-change"));
                        navigate("/"); 
                    }
                } catch (error) {
                    console.error("Error fetching login info:", error);
                    setLoading(false);
                }
            }
        };

        fetchLoginInfo();
    }, [location]);

    return (
        <div>
            <LoadingOverlay
                active={isLoading}
                spinner
                text="Đang đăng nhập ..."
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
            </LoadingOverlay>
        </div>
    );
}

export default CallBackLoginGoogle;