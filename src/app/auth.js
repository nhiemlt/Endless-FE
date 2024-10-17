import axios from "axios";
import constants from '../utils/globalConstantUtil'; // Import hằng số toàn cục cho URL API

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const setupAxiosInterceptors = () => {
  // Cấu hình interceptor để hiển thị/ẩn chỉ báo tải
  axios.interceptors.request.use(
    (config) => {
      document.body.classList.add('loading-ball');
      return config;
    },
    (error) => {
      document.body.classList.remove('loading-ball');
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      document.body.classList.remove('loading-ball');
      return response;
    },
    (error) => {
      document.body.classList.remove('loading-ball');
      return Promise.reject(error);
    }
  );
};

const checkAuth = async (navigate) => {
  const TOKEN = getCookie("token"); // Lấy token từ cookie
  const PUBLIC_ROUTES = ["/login", "/forgot-password", "/register", "/logout"];
  
  // Kiểm tra xem đường dẫn hiện tại có phải là trang công khai không
  const isPublicPage = PUBLIC_ROUTES.some(route => window.location.pathname.includes(route));

  // Nếu không có token và không phải trang công khai, chuyển hướng đến trang đăng nhập
  if (!TOKEN && !isPublicPage) {
    window.location.href = '/login';
    return;
  }

  // Nếu có token, tiến hành xác thực
  if (TOKEN) {
    try {
      const response = await fetch(`${constants.API_BASE_URL}/verify-auth-token?token=${TOKEN}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        // Nếu token không hợp lệ, điều hướng đến trang đăng nhập và xóa token khỏi cookie
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        if (!isPublicPage) window.location.href = '/login';
        return;
      }

      // Nếu token hợp lệ, cấu hình axios và trả về token
      axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;
      setupAxiosInterceptors();
      navigate && navigate("/app/welcome"); // Điều hướng đến trang welcome nếu cần
    } catch (error) {
      console.error("Error verifying token:", error);
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      if (!isPublicPage) window.location.href = '/login';
    }
  }

  return TOKEN;
};

export default checkAuth;
