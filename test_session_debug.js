const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testSessionDebug() {
  try {
    console.log("🔍 Testing session persistence...");

    // Tạo axios instance với withCredentials
    const axiosInstance = axios.create({
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Test 1: Đăng nhập
    console.log("\n1. Testing login...");
    const loginData = {
      email: "test2@example.com",
      matKhau: "123456",
    };

    try {
      const loginResponse = await axiosInstance.post(
        `${API_URL}/auth/login`,
        loginData
      );
      console.log("✅ Login successful:", loginResponse.data);
    } catch (error) {
      console.log("❌ Login failed:", error.response?.data || error.message);
      return;
    }

    // Test 2: Kiểm tra session
    console.log("\n2. Testing session check...");
    try {
      const sessionResponse = await axiosInstance.get(
        `${API_URL}/auth/check-session`
      );
      console.log("✅ Session check successful:", sessionResponse.data);
    } catch (error) {
      console.log(
        "❌ Session check failed:",
        error.response?.data || error.message
      );
    }

    // Test 3: Thêm vào giỏ hàng
    console.log("\n3. Testing add to cart...");
    const cartData = {
      chiTietSanPhamId: 1,
      soLuong: 1,
    };

    try {
      const cartResponse = await axiosInstance.post(
        `${API_URL}/cart/add`,
        cartData
      );
      console.log("✅ Add to cart successful:", cartResponse.data);
    } catch (error) {
      console.log("❌ Add to cart failed:");
      console.log("   Status:", error.response?.status);
      console.log("   Data:", error.response?.data);
      console.log("   Message:", error.message);
    }

    // Test 4: Lấy giỏ hàng
    console.log("\n4. Testing get cart...");
    try {
      const getCartResponse = await axiosInstance.get(`${API_URL}/cart`);
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

testSessionDebug();
