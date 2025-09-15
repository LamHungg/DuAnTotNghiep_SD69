import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Helper function để lấy token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Helper function để tạo headers với token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Helper function để lấy user ID từ localStorage
const getUserId = () => {
  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      return userData.id;
    } catch (e) {
      console.error("Error parsing user data:", e);
    }
  }
  return null;
};

// Helper function để tạo headers với user ID
const getSessionHeaders = () => {
  const userId = getUserId();
  return userId ? { "X-User-ID": userId.toString() } : {};
};

const addressService = {
  // Lấy tất cả địa chỉ của khách hàng
  getAddresses: async () => {
    try {
      // Sử dụng endpoint chính với session authentication
      console.log("Using main endpoint with session authentication...");
      const response = await axios.get(`${API_URL}/addresses`, {
        headers: {
          ...getSessionHeaders(),
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("Main endpoint response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy danh sách địa chỉ:", error);
      throw error;
    }
  },

  // Thêm địa chỉ mới
  addAddress: async (addressData) => {
    try {
      console.log("Testing with main endpoint...");
      // Sử dụng endpoint chính với session authentication
      const response = await axios.post(`${API_URL}/addresses`, addressData, {
        headers: {
          ...getSessionHeaders(),
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log("Main endpoint response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi thêm địa chỉ:", error);
      throw error;
    }
  },

  // Cập nhật địa chỉ
  updateAddress: async (id, addressData) => {
    try {
      // Sử dụng session authentication
      const response = await axios.put(
        `${API_URL}/addresses/${id}`,
        addressData,
        {
          headers: {
            ...getSessionHeaders(),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi cập nhật địa chỉ:", error);
      throw error;
    }
  },

  // Xóa địa chỉ
  deleteAddress: async (id) => {
    try {
      // Sử dụng session authentication
      const response = await axios.delete(`${API_URL}/addresses/${id}`, {
        headers: getSessionHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi xóa địa chỉ:", error);
      throw error;
    }
  },

  // Đặt địa chỉ làm mặc định
  setDefaultAddress: async (id) => {
    try {
      console.log("Debug - setDefaultAddress called with ID:", id);

      // Thử endpoint đơn giản trước (không cần authentication)
      const response = await axios.post(
        `${API_URL}/addresses/${id}/set-default-simple`,
        {},
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Debug - setDefaultAddress response:", response.data);
      return response.data;
    } catch (error) {
      console.error("Lỗi đặt địa chỉ mặc định:", error);

      // Nếu endpoint đơn giản lỗi, thử endpoint chính với session auth
      try {
        console.log("Debug - Retrying with main endpoint");
        const response = await axios.post(
          `${API_URL}/addresses/${id}/set-default`,
          {},
          {
            headers: getSessionHeaders(),
            withCredentials: true,
          }
        );
        return response.data;
      } catch (retryError) {
        console.error("Lỗi retry đặt địa chỉ mặc định:", retryError);
        throw retryError;
      }
    }
  },

  // Test endpoint để kiểm tra kết nối
  testConnection: async () => {
    try {
      const response = await axios.get(`${API_URL}/addresses/test`);
      return response.data;
    } catch (error) {
      console.error("Lỗi test kết nối:", error);
      throw error;
    }
  },

  // Debug function để test API
  debugApi: async () => {
    try {
      const response = await axios.get(`${API_URL}/addresses/debug`, {
        headers: getAuthHeaders(),
      });
      console.log("Debug info:", response.data);
      return response.data;
    } catch (error) {
      console.error("Debug error:", error.response?.data || error.message);
      return null;
    }
  },
};

export default addressService;
