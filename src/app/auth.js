import axios from "axios";
import constants from '../utils/globalConstantUtil'; // Import hằng số toàn cục cho URL API

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const checkAuth = async (navigate) => {
  const TOKEN = getCookie("token"); // Lấy token từ cookie
  const PUBLIC_ROUTES = ["/login", "/forgot-password", "/register", "/logout"];
  let ROLE = "";
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
      const data = await response.json();
      ROLE = data.role;
        navigate && navigate("/app/welcome");
    } catch (error) {
      console.error("Error verifying token:", error);
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      if (!isPublicPage) window.location.href = '/login';
    }
  }

  return { token: TOKEN, role: ROLE};
};

export default checkAuth;
