import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import instance from "../../../instance/instance";
import { message } from "antd";
import { useAuth } from "../../../providers/AuthProvider";
import Cookies from "js-cookie";
import { LoadingOverlay } from "@achmadk/react-loading-overlay";

const CallBackLoginGoogle = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const location = useLocation();
    const [isLoadingProduct, setLoadingProduct] = useState<boolean>(false);
    useEffect(() => {
      const fetchLoginInfo = async () => {
        const params = new URLSearchParams(location.search);
        const code = params.get("code");
        if (code) {
          try {
            setLoadingProduct(true)
            const { data: responseLoginInfor } = await instance.get(
              `auth/google/callback?code=${code}`
            );
            console.log(responseLoginInfor);
            if (responseLoginInfor && responseLoginInfor.token) {
                setLoadingProduct(false)
                Cookies.set("authToken", responseLoginInfor.token, {
                  expires: 1 / 12,
                  secure: true,
                  sameSite: "strict",
                });
                localStorage.setItem("userInfor", JSON.stringify(responseLoginInfor.user));
                login(responseLoginInfor.user);
                message.success("Đăng nhập thành công!");
                navigate("/");
              }

          } catch (error) {
            console.error("Error fetching login info:", error);
          }
        }
      };
  
      fetchLoginInfo();
    }, [location]);
  
    return <div>
            <LoadingOverlay
                active={isLoadingProduct}
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
    </div>;
}

export default CallBackLoginGoogle


