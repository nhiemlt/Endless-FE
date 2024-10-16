import axios from "axios";

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const setupAxiosInterceptors = () => {
  // Cấu hình interceptor để hiển thị/ẩn chỉ báo tải
  axios.interceptors.request.use(
    (config) => {
      document.body.classList.add('loading-spinner loading-lg');
      return config;
    },
    (error) => {
      document.body.classList.remove('loading-spinner loading-lg');
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => {
      document.body.classList.remove('loading-spinner loading-lg');
      return response;
    },
    (error) => {
      document.body.classList.remove('loading-spinner loading-lg');
      return Promise.reject(error);
    }
  );
};

const checkAuth = () => {
  const TOKEN = getCookie("token"); // Lấy token từ cookie
  const PUBLIC_ROUTES = ["/login", "/forgot-password", "/register", "/logout"];
  
  // Kiểm tra xem đường dẫn hiện tại có phải là trang công khai không
  const isPublicPage = PUBLIC_ROUTES.some(route => window.location.pathname.includes(route));

  // Nếu không có token và không phải trang công khai, chuyển hướng đến trang đăng nhập
  if (!TOKEN && !isPublicPage) {
    window.location.href = '/login';
    return;
  }

  // Nếu có token, cấu hình axios và trả về token
  if (TOKEN) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;
    setupAxiosInterceptors();
  }

  return TOKEN;
};

export default checkAuth;
