import { Outlet } from "react-router-dom";
import HeaderUser from "../components/User/Header/HeaderUser";
import Footer from "../components/User/Footer/Footer";
import CartProvider from "../providers/CartProvider";
import NotificationsProvider from "../providers/NotificationsProvider";
import { PusherProvider } from "../providers/PusherProvider";

const LayoutUser = () => {
  document.body.style.backgroundColor = "#FFFFFF";
  return (
    <NotificationsProvider>
      <CartProvider>
          {/* <PusherProvider> */}
            <div id="layout-user">
              <HeaderUser />
              <main className="container-main min-h-[100vh]">
                <Outlet />
              </main>
              <Footer />
            </div>
          {/* </PusherProvider> */}
      </CartProvider>
    </NotificationsProvider>
  );
};

export default LayoutUser;
