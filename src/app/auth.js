import axios from "axios";
import constants from '../utils/globalConstantUtil'; // Import hằng số toàn cục cho URL API

const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

const checkAuth = async () => {
  const TOKEN = getCookie("token");
  let ROLE = "";

  if (TOKEN) {
    try {
      const response = await fetch(`${constants.API_BASE_URL}/verify-auth-token?token=${TOKEN}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        ROLE = data.role || 'guest'; // 'guest' nếu không có role
        axios.defaults.headers.common['Authorization'] = `Bearer ${TOKEN}`;
      } else {
        document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        window.location.href = '/login';
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      window.location.href = '/login';
    }
  }

  return { token: TOKEN, role: ROLE };
};

export default checkAuth;