import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

// Định nghĩa các vai trò
const ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manage',
  USER: null // Người dùng thông thường
};

// Ánh xạ quyền truy cập cho từng vai trò
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['*'], // Toàn quyền
  [ROLES.MANAGER]: [
    '/admin/dashboard', 
    '/admin/products', 
    '/admin/orders',
    '/admin/users'
  ],
  [ROLES.USER]: [] // Không có quyền truy cập admin
};

const CheckPermission = () => {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem("userInfor") || "{}");

  // Hàm kiểm tra quyền truy cập
  const hasAccess = (role: string | null, path: string) => {
    // Admin luôn có toàn quyền
    if (role === ROLES.ADMIN) return true;

    // Kiểm tra quyền dựa trên danh sách được phép
    const permissions = ROLE_PERMISSIONS[role] || [];
    
    return permissions.includes('*') || 
           permissions.some(permission => 
             path.startsWith(permission)
           );
  };

  // Xử lý các trường hợp truy cập
  const handleAccess = () => {
    // Đã đăng nhập (USER: null)
    if (userData.role === null) {
      // Chặn truy cập trang auth khi đã đăng nhập
      if (location.pathname.startsWith('/auth')) {
        return <Navigate to="/" />;
      }

      // Chặn truy cập trang admin
      if (location.pathname.startsWith('/admin')) {
        toast.error('Bạn không có quyền truy cập trang này');
        return <Navigate to="/" />;
      }

      // Các trang khác cho người dùng đã đăng nhập
      const protectedRoutes = [
        '/user-manager', 
        '/check-out', 
        '/gio-hang'
      ];

      if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
        // Cho phép truy cập các trang yêu cầu đăng nhập
        return <Outlet />;
      }

      // Các trang công khai
      return <Outlet />;
    }

    // Đăng nhập với vai trò khác null (ADMIN, MANAGER)
    if (userData.role) {
      // Kiểm tra quyền truy cập trang admin
      if (location.pathname.startsWith('/admin')) {
        // Kiểm tra quyền
        if (hasAccess(userData.role, location.pathname)) {
          return <Outlet />;
        }

        // Thông báo và chuyển hướng nếu không có quyền
        toast.error('Bạn không có quyền truy cập trang này');
        return <Navigate to="/" />;
      }
    }

    // Chưa đăng nhập - chuyển đến trang đăng nhập
    if (!userData.role) {
      if (location.pathname.startsWith('/auth')) {
        return <Outlet />;
      }

      // Chuyển hướng đến trang đăng nhập cho các trang yêu cầu xác thực
      const protectedRoutes = [
        '/user-manager', 
        '/check-out', 
        '/admin',
        '/gio-hang'
      ];

      if (protectedRoutes.some(route => location.pathname.startsWith(route))) {
        toast.warning('Vui lòng đăng nhập để tiếp tục');
        return <Navigate to="/auth/login" />;
      }
    }

    // Các trang công khai
    return <Outlet />;
  };

  return handleAccess();
};

export default CheckPermission;