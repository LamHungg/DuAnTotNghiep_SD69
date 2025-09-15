import axios from "axios";

const API_URL = "http://localhost:8080/api";

// Helper function để lấy user từ localStorage
const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Helper function để tạo headers với session authentication
const getAuthHeaders = () => {
  const user = getUser();
  return user
    ? {
        "Content-Type": "application/json",
        "X-User-ID": user.id,
      }
    : {};
};

const orderService = {
  // Lấy tất cả đơn hàng của khách hàng
  getOrders: async () => {
    try {
      console.log("🔍 Fetching customer orders...");
      console.log("📤 User:", getUser());

      // Sử dụng JWT authentication với withCredentials
      const response = await axios.get(`${API_URL}/customer-orders`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      console.log("✅ Orders response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi lấy danh sách đơn hàng:", error);
      console.error("🔍 Error details:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
      });
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng theo ID
  getOrderById: async (orderId) => {
    try {
      console.log("🔍 Fetching order details for ID:", orderId);

      const response = await axios.get(
        `${API_URL}/customer-orders/${orderId}`,
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      console.log("✅ Order details response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi lấy chi tiết đơn hàng:", error);
      throw error;
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId) => {
    try {
      console.log("🔍 Cancelling order ID:", orderId);

      const response = await axios.put(
        `${API_URL}/customer-orders/${orderId}/cancel`,
        {},
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      console.log("✅ Cancel order response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi hủy đơn hàng:", error);
      throw error;
    }
  },

  // Xác nhận đã nhận hàng
  confirmReceived: async (orderId) => {
    try {
      console.log("🔍 Confirming received order ID:", orderId);

      const response = await axios.put(
        `${API_URL}/customer-orders/${orderId}/confirm-received`,
        {},
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      console.log("✅ Confirm received response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi xác nhận nhận hàng:", error);
      throw error;
    }
  },

  // Lấy chi tiết đơn hàng theo ID
  getOrderById: async (id) => {
    try {
      console.log("🔍 Fetching order detail for ID:", id);

      // Sử dụng JWT authentication với withCredentials
      const response = await axios.get(`${API_URL}/customer-orders/${id}`, {
        headers: getAuthHeaders(),
        withCredentials: true,
      });

      console.log("✅ Order detail response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi lấy chi tiết đơn hàng:", error);
      throw error;
    }
  },

  // Lấy đơn hàng theo trạng thái
  getOrdersByStatus: async (status) => {
    try {
      console.log("🔍 Fetching orders by status:", status);

      // Sử dụng JWT authentication với withCredentials
      const response = await axios.get(
        `${API_URL}/customer-orders/status/${status}`,
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      console.log("✅ Orders by status response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi lấy đơn hàng theo trạng thái:", error);
      throw error;
    }
  },

  // Test endpoint để kiểm tra kết nối
  testConnection: async () => {
    try {
      console.log("🔍 Testing orders API connection...");

      const response = await axios.get(`${API_URL}/customer-orders/test`, {
        withCredentials: true,
      });

      console.log("✅ Orders API test response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi test kết nối orders API:", error);
      throw error;
    }
  },

  // Debug function để kiểm tra authentication
  debugAuth: () => {
    const user = getUser();
    console.log("🔍 Debug Auth Info:");
    console.log("User:", user);
    return { user };
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (orderId, statusId, note = "") => {
    try {
      console.log("🔍 Updating order status:", { orderId, statusId, note });

      const response = await axios.put(
        `${API_URL}/customer-orders/${orderId}/status`,
        {
          trangThaiId: statusId,
          ghiChu: note,
        },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("✅ Order status update response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi cập nhật trạng thái đơn hàng:", error);
      throw error;
    }
  },

  // Hủy đơn hàng
  cancelOrder: async (orderId, reason = "") => {
    try {
      console.log("🔍 Cancelling order:", { orderId, reason });

      const response = await axios.put(
        `${API_URL}/customer-orders/${orderId}/cancel`,
        {
          lyDoHuy: reason,
        },
        {
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      console.log("✅ Order cancellation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi hủy đơn hàng:", error);
      throw error;
    }
  },

  // Xác nhận đã nhận hàng
  confirmReceived: async (orderId) => {
    try {
      console.log("🔍 Confirming order received:", orderId);

      const response = await axios.put(
        `${API_URL}/customer-orders/${orderId}/confirm-received`,
        {},
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      console.log("✅ Order received confirmation response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi xác nhận đã nhận hàng:", error);
      throw error;
    }
  },

  // Lấy lịch sử đơn hàng
  getOrderHistory: async (orderId) => {
    try {
      console.log("🔍 Fetching order history:", orderId);

      const response = await axios.get(
        `${API_URL}/customer-orders/${orderId}/history`,
        {
          headers: getAuthHeaders(),
          withCredentials: true,
        }
      );

      console.log("✅ Order history response:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ Lỗi lấy lịch sử đơn hàng:", error);
      throw error;
    }
  },
};

export default orderService;
