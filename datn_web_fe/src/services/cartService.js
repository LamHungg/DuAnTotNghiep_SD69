import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Helper function để tạo headers cho customer
const getAuthHeaders = () => {
  const user = localStorage.getItem("user");

  if (user) {
    try {
      const userData = JSON.parse(user);

      // Nếu không có token nhưng có ID, tự động thêm token
      if (!userData.token && userData.id) {
        userData.token = `customer-token-${userData.id}`;
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("🔧 Auto-fixed missing token:", userData.token);
      }

      if (userData.token) {
        return { Authorization: `Bearer ${userData.token}` };
      }
    } catch (e) {
      console.error("❌ Error parsing user data:", e);
    }
  }

  return {}; // Fallback to session-based
};

// Event listener để handle localStorage changes
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === "user" || e.key === "isLoggedIn") {
      console.log("🔄 localStorage changed, cartService updated");
    }
  });

  // Listen for authChange events
  window.addEventListener("authChange", () => {
    console.log("🔄 Auth changed, cartService updated");
  });
}

const cartService = {
  // Thêm sản phẩm vào giỏ hàng
  addToCart: async (chiTietSanPhamId, soLuong = 1) => {
    try {
      const response = await axios.post(
        `${API_URL}/cart/add`,
        {
          chiTietSanPhamId: chiTietSanPhamId,
          soLuong: soLuong,
        },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          withCredentials: true, // Thêm session cookies
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);
      throw error;
    }
  },

  // Lấy danh sách sản phẩm trong giỏ hàng
  getCart: async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: getAuthHeaders(),
        withCredentials: true, // Thêm session cookies
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
      // Nếu lỗi 404 (không tìm thấy giỏ hàng), trả về array rỗng
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  },

  // Cập nhật số lượng sản phẩm trong giỏ hàng
  updateQuantity: async (cartItemId, soLuong) => {
    try {
      const response = await axios.put(
        `${API_URL}/cart/${cartItemId}`,
        {
          soLuong: soLuong,
        },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          withCredentials: true, // Thêm session cookies
        }
      );
      return response.data;
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
      throw error;
    }
  },

  // Xóa sản phẩm khỏi giỏ hàng
  removeFromCart: async (cartItemId) => {
    try {
      const response = await axios.delete(`${API_URL}/cart/${cartItemId}`, {
        headers: getAuthHeaders(),
        withCredentials: true, // Thêm session cookies
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi xóa khỏi giỏ hàng:", error);
      throw error;
    }
  },

  // Xóa tất cả sản phẩm trong giỏ hàng
  clearCart: async () => {
    try {
      const response = await axios.delete(`${API_URL}/cart/clear`, {
        headers: getAuthHeaders(),
        withCredentials: true, // Thêm session cookies
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi xóa giỏ hàng:", error);
      throw error;
    }
  },

  // Lấy số lượng sản phẩm trong giỏ hàng (cho badge)
  getCartCount: async () => {
    try {
      const response = await axios.get(`${API_URL}/cart/count`, {
        headers: getAuthHeaders(),
        withCredentials: true, // Thêm session cookies
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy số lượng giỏ hàng:", error);
      return 0; // Trả về 0 nếu có lỗi
    }
  },

  // Test endpoint để kiểm tra kết nối
  testConnection: async () => {
    try {
      const response = await axios.get(`${API_URL}/cart/test`);
      return response.data;
    } catch (error) {
      console.error("Lỗi test kết nối cart:", error);
      throw error;
    }
  },
};

export default cartService;
