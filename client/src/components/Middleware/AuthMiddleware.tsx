import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
export const AuthMiddleware = () => {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userInfor") || "{}");
  const token = Cookies.get('authToken');
  // Danh sách route không bị chặn khi đã đăng nhập
  const allowedRoutes = [
    '/auth/register', 
    '/auth/login', 
    '/reset-password', 
    '/api/auth/google/callback',
  ];

  // Các route yêu cầu đăng nhập
  const protectedRoutes = [
    '/user-manager', 
    '/check-out', 
    '/checkorder',
    '/user-manager/user-orders',
    '/user-manager/user-ratings',
    '/user-manager/wishlist',
    '/user-manager/addresses'
  ];



  // Xử lý các trường hợp truy cập
  const handleAccess = () => {
    // Đã đăng nhập
    if (userData && Object.keys(userData).length > 0 && token) {
      // Chặn truy cập các route auth
      if (allowedRoutes.some(route => location.pathname.startsWith(route))) {
        return <Navigate to="/" />;
      }

      // Chặn truy cập trang admin
      if (location.pathname.startsWith('/admin')) {
        // Chỉ cho ADMIN và MANAGER truy cập
        if (userData.role === 'admin' || userData.role === 'manage') {
          return <Outlet />;
        }
        
        toast.error('Bạn không có quyền truy cập trang này');
        return <Navigate to="/" />;
      }

      // Các trang yêu cầu đăng nhập
      if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
        // Cho phép truy cập các trang yêu cầu đăng nhập
        return <Outlet />;
      }

      // Các trang công khai
      return <Outlet />;
    }

    // Chưa đăng nhập
    // Cho phép truy cập các route auth
    if (allowedRoutes.some(route => location.pathname.startsWith(route))) {
      return <Outlet />;
    }

    // Chuyển hướng đến trang đăng nhập cho các trang yêu cầu xác thực
    if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
      toast.warning('Vui lòng đăng nhập để tiếp tục');
      return <Navigate to="/auth/login" state={{ from: location }} />;
    }

    // Các trang công khai
    return <Outlet />;
  };

  return handleAccess();
};
const restrictedRoutesForManager = [
  '/admin/products/inventory',
  '/admin/products/suppliers',
  '/admin/products/historys',
  '/admin/users',
  '/admin/orders',
  '/admin/thong-ke',
];
// Middleware kiểm tra quyền admin
export const AdminMiddleware = () => {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userInfor") || "{}");
  const token = Cookies.get('authToken');

  // Kiểm tra người dùng đã đăng nhập chưa
  if ((!userData && !token) || Object.keys(userData).length === 0) {
    return <Navigate to="/auth/login" state={{ from: location }} />;
  }

  // Kiểm tra quyền truy cập với role là admin
  if (userData.role === 'admin') {
    return <Outlet />;
  }

  // Nếu là manage, xử lý các route cụ thể
  if (userData.role === 'manage') {
    // Nếu đang truy cập vào Dashboard của admin ("/admin")
    if (location.pathname === '/admin' || location.pathname === '/admin/') {
      return <Navigate to="/admin/categorys" />; // Redirect đến trang khác 
    }

    // Kiểm tra quyền truy cập vào các route restricted khác
    if (restrictedRoutesForManager.some(route => location.pathname.startsWith(route))) {
      return <Navigate to="/admin/categorys" />; // Redirect đến trang hợp lệ
    }

    return <Outlet />;
  }

  // Nếu không có quyền truy cập
  toast.error('Bạn không có quyền truy cập trang này');
  return <Navigate to="/" />;
};

