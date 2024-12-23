import { message } from "antd";
import axios from "axios";
import axiosRetry from "axios-retry";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BE_URL,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
});

// Cấu hình axios-retry
axiosRetry(instance, {
  retries: 3, // Số lần retry
  retryDelay: axiosRetry.exponentialDelay, // Delay theo cấp số nhân
  retryCondition: (error) => {
    // Điều kiện retry: lỗi mạng, lỗi server, hoặc lỗi Too Many Requests
    return (
      axiosRetry.isNetworkOrIdempotentRequestError(error) ||
      (error.response && 
        (error.response.status === 500 || 
         (error.response.status === 400 && 
          error.response.data?.message?.includes("Too Many Requests"))
        )
      )
    );
  },
});

// Interceptor cho request
instance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor cho response
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    // Xử lý specific error cho Too Many Requests
    if (
      error.response?.status === 400 && 
      error.response?.data?.message?.includes("Too Many Requests")
    ) {
      // Hiển thị thông báo cho người dùng
      message.warning("Bạn đã thực hiện quá nhiều yêu cầu. Vui lòng thử lại sau.");
      
      // Có thể thêm logic chuyển hướng hoặc xử lý khác
      // window.location.href = '/wait-page';
    }

    return Promise.reject(error);
  }
);

export default instance;