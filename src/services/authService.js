import axios from "axios";

const API_URL = "http://localhost:8080/api/auth";

const authService = {
  login: async (tenDangNhap, matKhau) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        {
          tenDangNhap,
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
