const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testTokenAuth() {
  try {
    console.log("🔍 Testing token-based authentication...");

    // Test 1: Đăng nhập
    console.log("\n1. Testing login...");
    const loginData = {
      email: "test2@example.com",
      matKhau: "123456",
    };

    let token = null;
    try {
      const loginResponse = await axios.post(
        `${API_URL}/auth/login`,
        loginData,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      console.log("✅ Login successful:", loginResponse.data);
      token = loginResponse.data.token;
    } catch (error) {
      console.log("❌ Login failed:", error.response?.data || error.message);
      return;
    }

    // Test 2: Thêm vào giỏ hàng với token
    console.log("\n2. Testing add to cart with token...");
    const cartData = {
      chiTietSanPhamId: 1,
      soLuong: 1,
    };

    try {
      const cartResponse = await axios.post(`${API_URL}/cart/add`, cartData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("✅ Add to cart successful:", cartResponse.data);
    } catch (error) {
      console.log("❌ Add to cart failed:");
      console.log("   Status:", error.response?.status);
      console.log("   Data:", error.response?.data);
      console.log("   Message:", error.message);
    }

    // Test 3: Lấy giỏ hàng với token
    console.log("\n3. Testing get cart with token...");
    try {
      const getCartResponse = await axios.get(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      });
      console.log("✅ Get cart successful:", getCartResponse.data);
    } catch (error) {
      console.log("❌ Get cart failed:");
      console.log("   Status:", error.response?.status);
      console.log("   Data:", error.response?.data);
      console.log("   Message:", error.message);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testTokenAuth();
