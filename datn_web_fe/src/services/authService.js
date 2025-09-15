import axios from "axios";

const API_URL = "http://localhost:8080/api";

const authService = {
  // Đăng nhập
  login: async (email, password) => {
    try {
      console.log("🔍 Attempting login with:", { email, password: "***" });

      const response = await axios.post(
        `${API_URL}/auth/login`,
        {
          email: email,
          matKhau: password,
        },
        {
          withCredentials: true,
        }
      );

      console.log("✅ Login response:", response.data);
      console.log("🔍 Response data type:", typeof response.data);
      console.log("🔍 Response data keys:", Object.keys(response.data || {}));
      console.log(
        "🔍 Response data stringified:",
        JSON.stringify(response.data)
      );

      if (response.data) {
        // Đảm bảo token được lưu
        const userData = response.data;

        // Nếu không có token, thêm token dựa trên ID
        if (!userData.token && userData.id) {
          userData.token = `customer-token-${userData.id}`;
          console.log("🔧 Added missing token:", userData.token);
        }

        // Lưu toàn bộ response data vào localStorage
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        console.log("💾 User data saved to localStorage");
        console.log("🔍 Saved user data:", localStorage.getItem("user"));

        // Kiểm tra token
        if (userData.token) {
          console.log("🔑 Token found in response:", userData.token);
        } else {
          console.log("❌ No token in response data!");
        }

        // Emit event để thông báo đăng nhập thành công
        window.dispatchEvent(new Event("authChange"));
      }

      return response.data;
    } catch (error) {
      console.error("❌ Lỗi đăng nhập:", error);
      console.error("🔍 Error response:", error.response?.data);
      throw error;
    }
  },

  // Đăng ký
  register: async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      throw error;
    }
  },

  // Đăng xuất
  logout: () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");

    // Emit event để thông báo đăng xuất
    window.dispatchEvent(new Event("authChange"));
  },

  // Lấy thông tin user hiện tại
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  },

  // Refresh user data từ server
  refreshUserData: async () => {
    try {
      // Sử dụng JWT authentication
      const token = localStorage.getItem("token");
      if (!token) {
        return null;
      }

      const response = await axios.get(`${API_URL}/auth/check-session`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });

      if (response.data) {
        localStorage.setItem("user", JSON.stringify(response.data));
        return response.data;
      }
      return null;
    } catch (error) {
      console.error("Lỗi refresh user data:", error);
      return null;
    }
  },

  // Kiểm tra user có đăng nhập không
  isAuthenticated: () => {
    const user = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    return !!(user && isLoggedIn === "true");
  },

  // Quên mật khẩu
  forgotPassword: async (email) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/forgot-password`,
        {
          email,
        },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi quên mật khẩu:", error);
      throw error;
    }
  },

  // Đặt lại mật khẩu
  resetPassword: async (token, newPassword) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/reset-password`,
        {
          token,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi đặt lại mật khẩu:", error);
      throw error;
    }
  },

  // Cập nhật thông tin profile
  updateProfile: async (userData) => {
    try {
      const response = await axios.put(`${API_URL}/auth/profile`, userData, {
        withCredentials: true,
      });

      // Update local storage with new user data
      if (response.data) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = { ...currentUser, ...response.data };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }

      return response.data;
    } catch (error) {
      console.error("Lỗi cập nhật profile:", error);
      throw error;
    }
  },

  // Đổi mật khẩu
  changePassword: async (oldPassword, newPassword) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/change-password`,
        {
          oldPassword,
          newPassword,
        },
        {
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi đổi mật khẩu:", error);
      throw error;
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_URL}/auth/refresh-token`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      console.error("Lỗi refresh token:", error);
      throw error;
    }
  },

  // Lấy headers cho authentication (customer sử dụng session-based)
  getAuthHeaders: () => {
    return {}; // Customer authentication là session-based, không cần token
  },

  // Force update localStorage với token (để fix vấn đề)
  forceUpdateToken: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      try {
        const userData = JSON.parse(userStr);
        if (!userData.token && userData.id) {
          userData.token = `customer-token-${userData.id}`;
          localStorage.setItem("user", JSON.stringify(userData));
          console.log("🔧 Force updated token:", userData.token);
          return true;
        }
      } catch (e) {
        console.error("Error updating token:", e);
      }
    }
    return false;
  },
};

export default authService;
