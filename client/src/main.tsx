import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import LayoutUser from "./layouts/LayoutUser.tsx";
import LayoutAdmin from "./layouts/LayoutAdmin.tsx";
import DashboardAdmin from "./pages/admin/dashboard/DashboardAdmin.tsx";
import CategorysAdmin from "./pages/admin/category/CategorysAdmin.tsx";
import Register from "./components/User/Auth/Register.tsx";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/free-mode";
import MainContentUser from "./pages/user/MainContentUser.tsx";
import Login from "./components/User/Auth/Login.tsx";
import ProductList from "./pages/admin/products/ProductsList.tsx";
// import Orders from "./pages/admin/Orders/Order.tsx";
import Rates from "./pages/admin/rates/Evaluate.tsx";
import OrderDetails from "./pages/admin/Orders/OrderDetails.tsx";
import ScrollToTop from "./utils/ScrollToTop.tsx";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LayoutResetPassword from "./layouts/User/LayoutResetPassword.tsx";
import ResetPassRequest from "./components/User/Auth/ResetPassRequest.tsx";
import FormResetPass from "./components/User/Auth/FormResetPass.tsx";
import LayoutVoucherAdmin from "./layouts/Admin/LayoutVoucherAdmin.tsx";
import LayoutBlogsAdmin from "./layouts/Admin/LayoutBlogsAdmin.tsx";
import UpdateBlogsAdmin from "./pages/admin/blogs/UpdateBlogAdmin.tsx";
import BlogPage from "./components/User/Blogs/BlogsPage.tsx";
import LayoutProductAdmin from "./layouts/Admin/LayoutProductAdmin.tsx";
import AddOrUpdateProduct from "./pages/admin/products/AddOrUpdateProduct.tsx";
import ShowDetailProduct from "./components/User/Show/ShowDetailProduct.tsx";
import CartListClient from "./components/User/Cart/CartListClient.tsx";
import LayoutUsersAdmin from "./layouts/Admin/LayoutUsersAdmin.tsx";
import CheckOutOrder from "./components/User/Order/CheckOutOrder.tsx";
import UserDetails from "./components/User/Manager/Profile/UserDetails.tsx";
import LayoutUserDetails from "./layouts/User/LayoutUserDetails.tsx";
import { CheckOrder } from "./components/User/Order/CheckOrder.tsx";
import EventUser from "./components/User/Event/EventUser.tsx";
import BlogDetail from "./components/User/Blogs/BlogDetail.tsx";
import FiledsProvider from "./contexts/FiledsContext.tsx";
import ManagerOrdersUser from "./components/User/Manager/Orders/ManagerOrdersUser.tsx";
import UserOrderDetail from "./components/User/Manager/Orders/UserOrderDetail.tsx";
import UserRatings from "./components/User/Manager/Ratings/UserRatings.tsx";
import RatingDetailOrder from "./components/User/Manager/Ratings/RatingDetailOrder.tsx";
import CallBackLoginGoogle from "./components/User/Auth/CallBackLoginGoogle.tsx";
import FilterProducts from "./components/User/Filter/FilterProducts.tsx";
import { StrictMode } from "react";
import Whistlist from "./components/User/Manager/Wishlist/Wishlist.tsx";
import BannerList from "./pages/admin/banner/BannerAdmin.tsx";
import AddressesUser from "./components/User/Manager/Addresses/AddressesUser.tsx";
import ListInventory from "./pages/admin/inventory/ListInventory.tsx";
import ListVariant from "./pages/admin/varriant/ListVariant.tsx";
import SuppliersAdmin from "./pages/admin/suppliers/SuppliersAdmin.tsx";
// import ListTrashProducts from "./pages/admin/trash/ListTrashProducts.tsx";
import {
  AdminMiddleware,
  AuthMiddleware,
} from "./components/Middleware/AuthMiddleware.tsx";
import OrdersListAdmin from "./pages/admin/Orders/OrdersListAdmin.tsx";
import LayoutStatisAdmin from "./layouts/Admin/LayoutStatisAdmin.tsx";
import StatisProductAdmin from "./pages/admin/statis/StatisProductAdmin.tsx";
import StatisDetailProduct from "./pages/admin/statis/StatisDetailProduct.tsx";
import HistoryInventory from "./pages/admin/inventory/HistoryInventory.tsx";


import RatingProductAdmin from "./pages/admin/rates/EvaluateDetails.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <FiledsProvider>
        <ScrollToTop />
        <Routes>
          <Route element={<App />}>
            {/* User */}
            <Route path="/" element={<LayoutUser />}>
              <Route index element={<MainContentUser />} />
              {/* Đăng đăng nhập là không vô được */}
              <Route element={<AuthMiddleware />}>
                <Route path="auth">
                  <Route path="register" element={<Register />} />
                  <Route path="login" element={<Login />} />
                </Route>
                <Route path="reset-password">
                  <Route path="" element={<LayoutResetPassword />}>
                    <Route index element={<ResetPassRequest />} />
                    <Route path=":token/:email" element={<FormResetPass />} />
                  </Route>
                </Route>
                <Route
                  path="api/auth/google/callback"
                  element={<CallBackLoginGoogle />}
                />
              </Route>
              {/* Phải đăng nhập */}
              <Route element={<AuthMiddleware />}>
                <Route path="user-manager" element={<LayoutUserDetails />}>
                  <Route index element={<UserDetails />} />
                  <Route path="user-orders" element={<ManagerOrdersUser />} />
                  <Route
                    path="user-orders/order-detail/:code_order"
                    element={<UserOrderDetail />}
                  />
                  <Route path="user-ratings" element={<UserRatings />} />
                  <Route path="wishlist" element={<Whistlist />} />
                  <Route
                    path="user-ratings/rating-detail/:code_order"
                    element={<RatingDetailOrder />}
                  />
                  <Route path="addresses" element={<AddressesUser />} />
                </Route>
                <Route path="check-out" element={<CheckOutOrder />} />
              </Route>
              {/* Công khai */}
              <Route
                path=":category/:slugproduct"
                element={<ShowDetailProduct />}
              />
              <Route path="search" element={<FilterProducts />} />
              <Route path="gio-hang" element={<CartListClient />} />
              <Route path="blogs" element={<BlogPage />} />
              <Route path="blogs/:slug" element={<BlogDetail />} />
              <Route path="checkorder" element={<CheckOrder />} />
              <Route path="event" element={<EventUser />} />
            </Route>
            {/* Admin và manage mới vô được */}
            <Route element={<AdminMiddleware />}>
              <Route path="admin" element={<LayoutAdmin />}>
                <Route index element={<DashboardAdmin />} />
                <Route path="blogs" element={<LayoutBlogsAdmin />} />
                <Route path="blogs/:id" element={<UpdateBlogsAdmin />} />
                <Route path="categorys" element={<CategorysAdmin />} />
                <Route path="products" element={<LayoutProductAdmin />}>
                  <Route index element={<ProductList />} />
                  <Route path="add" element={<AddOrUpdateProduct />} />
                  {/* <Route path="trashs" element={<ListTrashProducts />} /> */}
                  <Route path="variants" element={<ListVariant />} />
                  <Route path="inventory" element={<ListInventory />} />
                  <Route path="suppliers" element={<SuppliersAdmin />} />
                  <Route path="historys" element={<HistoryInventory />} />
                  <Route path="update/:id" element={<AddOrUpdateProduct />} />
                </Route>
                <Route path="thong-ke" element={<LayoutStatisAdmin />}>
                  <Route path="san-pham">
                    <Route index element={<StatisProductAdmin />} />
                    <Route path=":slug" element={<StatisDetailProduct />} />
                  </Route>
                </Route>
                <Route path="orders" element={<OrdersListAdmin />} />
                <Route path="users" element={<LayoutUsersAdmin />} />
                <Route path="vouchers" element={<LayoutVoucherAdmin />} />
                <Route path="banner" element={<BannerList />} />
                <Route
                  path="orders/orderDetails/:code"
                  element={<OrderDetails />}
                />
                <Route path="rates" element={<Rates />} />
            
                <Route
                path="rates/:slug"
                element={<RatingProductAdmin />}
                />
              </Route>
            </Route>
          </Route>
        </Routes>
        <ToastContainer autoClose={3000} newestOnTop={true} />
      </FiledsProvider>
    </BrowserRouter>
  </StrictMode>
);
