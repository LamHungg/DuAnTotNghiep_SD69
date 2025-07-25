import axios from "axios";
import SERVER_URL from "../configs/server.config";

const API_URL = `${SERVER_URL}/api/auth`;

const authService = {
  login: async (tenDangNhap, matKhau) => {
    try {
      const response = await axios.post(
        `${SERVER_URL}/api/auth/login`,
        {
          email: tenDangNhap,
          matKhau,
        },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Luôn xóa dữ liệu local storage khi đăng xuất
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isLoggedIn");
      // Chuyển về trang login
      window.location.href = "/login";
    }
  },

  getCurrentUser: () => {
    const userStr = localStorage.getItem("currentUser");
    return userStr ? JSON.parse(userStr) : null;
  },

  isLoggedIn: () => {
    return localStorage.getItem("isLoggedIn") === "true";
  },
};

export default authService;
