const axios = require("axios");

const API_URL = "http://localhost:8080/api";

// Mock cartService for testing
const cartService = {
  getAuthHeaders: () => {
    // Simulate localStorage
    const userData = {
      soDienThoai: "0987654321",
      role: "CUSTOMER",
      phone: "0987654321",
      id: 11,
      hoTen: "Test Customer 2",
      email: "test2@example.com",
      token: "customer-token-11",
    };

    if (userData.token) {
      return { Authorization: `Bearer ${userData.token}` };
    }
    return {};
  },

  getCart: async () => {
    try {
      const response = await axios.get(`${API_URL}/cart`, {
        headers: cartService.getAuthHeaders(),
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi lấy giỏ hàng:", error);
      if (error.response && error.response.status === 404) {
        return [];
      }
      throw error;
    }
  },
};

async function testCartService() {
  try {
    console.log("🔍 Testing cartService.getCart()...");

    const cartData = await cartService.getCart();
    console.log("✅ cartService.getCart() result:", cartData);
    console.log("📊 Data type:", typeof cartData);
    console.log("📊 Is array:", Array.isArray(cartData));
    console.log("📊 Length:", cartData?.length || 0);

    if (Array.isArray(cartData) && cartData.length > 0) {
      console.log("✅ Cart has items!");
      cartData.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, {
          id: item.id,
          name: item.tenSanPham,
          quantity: item.soLuong,
          price: item.gia,
          total: item.thanhTien,
        });
      });
    } else {
      console.log("❌ Cart is empty");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testCartService();
