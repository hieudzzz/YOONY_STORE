import { Outlet } from "react-router-dom";
import HeaderUser from "../components/User/Header/HeaderUser";
import Footer from "../components/User/Footer/Footer";
import CartProvider from "../providers/CartProvider";
import { AuthProvider } from "../providers/AuthProvider";

const LayoutUser = () => {
  document.body.style.backgroundColor = "#FFFFFF";
  return (
    <AuthProvider>
      <CartProvider>
        <div id="layout-user">
          <HeaderUser />
          <main className="container-main min-h-[100vh]">
            <Outlet />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
};

export default LayoutUser;
