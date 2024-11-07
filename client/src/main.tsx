import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutUser from "./layouts/LayoutUser.tsx";
import LayoutAdmin from "./layouts/LayoutAdmin.tsx";
import DashboardAdmin from "./pages/admin/DashboardAdmin.tsx";
import UsersAdmin from "./pages/admin/users/UserAdmin.tsx";
import CategorysAdmin from "./pages/admin/CategorysAdmin.tsx";
import Register from "./components/User/Auth/Register.tsx";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import MainContentUser from "./pages/user/MainContentUser.tsx";
import Login from "./components/User/Auth/Login.tsx";
import ProductList from "./pages/admin/products/ProductsList.tsx";
import Orders from "./pages/admin/Orders/Order.tsx";
import Rates from "./pages/admin/Evaluate.tsx";
import OrderDetails from "./pages/admin/Orders/OrderDetails.tsx";
import ScrollToTop from "./utils/ScrollToTop.tsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LayoutResetPassword from "./layouts/User/LayoutResetPassword.tsx";
import ResetPassRequest from "./components/User/Auth/ResetPassRequest.tsx";
import FormResetPass from "./components/User/Auth/FormResetPass.tsx";
import LayoutVoucherAdmin from "./layouts/Admin/LayoutVoucherAdmin.tsx";
import BannerList from "./pages/admin/BannerAdmin.tsx";
import LayoutBlogsAdmin from "./layouts/Admin/LayoutBlogsAdmin.tsx";
import BlogProvider from "./contexts/BlogsContext.tsx";
import UpdateBlogsAdmin from "./pages/admin/blogs/UpdateBlogAdmin.tsx";
import BlogPage from "./components/User/Blogs/BlogsPage.tsx";
import LayoutProductAdmin from "./layouts/Admin/LayoutProductAdmin.tsx";
import AddOrUpdateProduct from "./pages/admin/products/AddOrUpdateProduct.tsx";
import ShowDetailProduct from "./components/User/Show/ShowDetailProduct.tsx";
import CartListClient from "./components/User/Cart/CartListClient.tsx";
import LayoutUsersAdmin from "./layouts/Admin/LayoutUsersAdmin.tsx";
import UserRoleManager from "./pages/admin/users/UserRoleManager.tsx";
import CheckOutOrder from "./components/User/Order/CheckOutOrder.tsx";
import CheckPermission from "./components/Middleware/CheckPermission.tsx";
import UserDetails from "./components/componentUserDetails/UserDetails.tsx";
import WishList from "./components/componentUserDetails/WishList.tsx";
import OrdersUser from "./components/componentUserDetails/OrdersUser.tsx";
import LayoutUserDetails from "./layouts/User/LayoutUserDetails.tsx";
import { CheckOrder } from "./components/User/Header/CheckOrder.tsx";
import EventUser from "./components/User/Event/EventUser.tsx";
// import LayoutEventAdmin from "./layouts/Admin/LayoutEventAdmin.tsx";
import BlogDetail from "./components/User/Blogs/BlogDetail.tsx";
import FiledsProvider from "./contexts/FiledsContext.tsx";
import LayoutChatAdmin from "./layouts/Admin/LayoutChatAdmin.tsx";
import SizeFilters from "./components/User/Filter/FilterCategory.tsx";
import ManagerOrdersUser from "./components/User/Manager/Orders/ManagerOrdersUser.tsx";
import UserOrderDetail from "./components/User/Manager/Orders/UserOrderDetail.tsx";
import PaymentCheckVnpay from "./components/User/Order/PaymentCheckVnpay.tsx";
import UserRatings from "./components/User/Manager/Ratings/UserRatings.tsx";
import RatingDetailOrder from "./components/User/Manager/Ratings/RatingDetailOrder.tsx";
import CallBackLoginGoogle from "./components/User/Auth/CallBackLoginGoogle.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <BlogProvider>
        <FiledsProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<App />}>
            {/* User */}
            <Route path="/" element={<LayoutUser />}>
              <Route index element={<MainContentUser />} />
              <Route path="auth" element={<CheckPermission />}>
                <Route path="register" element={<Register />} />
                <Route path="login" element={<Login />} />
              </Route>
              {/* <Route path="reset-password" element={<CheckPermission />}>
                <Route path="reset-password" element={<LayoutResetPassword />}>
                  <Route index element={<ResetPassRequest />} />
                  <Route path=":token/:email" element={<FormResetPass />} />
                </Route>
              </Route> */}
              <Route path='api/auth/google/callback' element={<CallBackLoginGoogle />}/>
              <Route path="reset-password" element={<LayoutResetPassword />}>
                  <Route index element={<ResetPassRequest />} />
                  <Route path=":token/:email" element={<FormResetPass />} />
              </Route>
              <Route
                path=":category/:slugproduct"
                element={<ShowDetailProduct />}
              />
              <Route path="gio-hang" element={<CartListClient />} />
              <Route path="check-out" element={<CheckOutOrder />} />
              <Route path="blogs" element={<BlogPage />} />
              <Route path="sizefileds" element={<SizeFilters />} />
              <Route path="user-manager" element={<LayoutUserDetails />}>
                <Route index element={<UserDetails />} />
                <Route path="wishlist" element={<WishList />} />
                <Route path="user-orders" element={<ManagerOrdersUser />} />
                <Route path="user-orders/order-detail/:code_order" element={<UserOrderDetail />} />
                <Route path="user-ratings" element={<UserRatings />} />
                <Route path="user-ratings/rating-detail/:code_order" element={<RatingDetailOrder />} />
              </Route>
              <Route path="checkorder" element={<CheckOrder />} />
              <Route path="event" element={<EventUser />} />
              <Route path="detailBlog/:slug" element={<BlogDetail/>}/>
            </Route>
            {/* Admin */}
            <Route path="admin" element={<LayoutAdmin />}>
              <Route index element={<DashboardAdmin />} />
              <Route path="blogs" element={<LayoutBlogsAdmin />} />
              <Route path="blogs/:id" element={<UpdateBlogsAdmin />} />
              <Route path="categorys" element={<CategorysAdmin />} />
              <Route path="products" element={<LayoutProductAdmin />}>
                <Route index element={<ProductList />} />
                <Route path="add" element={<AddOrUpdateProduct />} />
                <Route path="update/:id" element={<AddOrUpdateProduct />} />
              </Route>
              <Route path="orders" element={<Orders />} />
              <Route path="users" element={<LayoutUsersAdmin />}>
                <Route index element={<UsersAdmin />} />
                <Route path="role-manager" element={<UserRoleManager />} />
              </Route>
              <Route path="vouchers" element={<LayoutVoucherAdmin />} />
              {/* <Route path="events" element={<LayoutEventAdmin />} /> */}
              <Route path="banner" element={<BannerList />} />
              <Route path="orders/orderDetails/:code" element={<OrderDetails />} />
              <Route path="rates" element={<Rates />} />
              <Route path="chatbot" element={<LayoutChatAdmin />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer autoClose={3000} newestOnTop={true} />
        </FiledsProvider>
      </BlogProvider>  
    </BrowserRouter>
  </StrictMode>
);
