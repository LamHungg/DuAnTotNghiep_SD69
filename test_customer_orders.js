const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testCustomerOrders() {
  try {
    console.log("🧪 Testing Customer Orders API...");

    // First, login to get a token
    console.log("1. Logging in to get token...");
    const loginResponse = await axios.post(`${API_URL}/auth/login`, {
      email: "testcustomer@example.com",
      matKhau: "123456789",
    });

    const token = loginResponse.data.token;
    console.log("✅ Login successful, token:", token);

    // Test orders API with token
    console.log("\n2. Testing orders API...");
    const ordersResponse = await axios.get(`${API_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    console.log("✅ Orders API successful!");
    console.log("📥 Orders data:", ordersResponse.data);
    console.log("📊 Number of orders:", ordersResponse.data.length);

    // Test orders test endpoint
    console.log("\n3. Testing orders test endpoint...");
    const testResponse = await axios.get(`${API_URL}/orders/test`, {
      withCredentials: true,
    });

    console.log("✅ Orders test endpoint successful!");
    console.log("📥 Test response:", testResponse.data);

    return ordersResponse.data;
  } catch (error) {
    console.error("❌ Customer orders test failed!");
    console.error("🔍 Error details:");
    console.error("Status:", error.response?.status);
    console.error("Status Text:", error.response?.statusText);
    console.error("Response Data:", error.response?.data);
    console.error("Request Data:", error.config?.data);
    console.error("URL:", error.config?.url);
    console.error("Headers:", error.config?.headers);

    throw error;
  }
}

async function testOrdersWithoutAuth() {
  try {
    console.log("\n🧪 Testing Orders API without authentication...");

    const response = await axios.get(`${API_URL}/orders/test`, {
      withCredentials: true,
    });

    console.log("✅ Orders test endpoint works without auth!");
    console.log("📥 Response:", response.data);
  } catch (error) {
    console.error("❌ Orders test endpoint failed:", error.message);
  }
}

async function runTests() {
  console.log("🚀 Starting Customer Orders Tests...\n");

  try {
    // Test 1: Orders test endpoint (no auth required)
    await testOrdersWithoutAuth();
    console.log("\n");

    // Test 2: Customer orders with authentication
    await testCustomerOrders();
    console.log("\n");

    console.log("🎉 All tests completed!");
    console.log(
      "💡 Nếu test thành công, customer orders sẽ hoạt động bình thường!"
    );
  } catch (error) {
    console.error("💥 Test suite failed:", error.message);
    console.log("\n🔧 Hướng dẫn khắc phục:");
    console.log("1. Restart backend server");
    console.log("2. Kiểm tra CustomerOrderController đã được tạo");
    console.log("3. Kiểm tra KhachHangService.getAllChiTietDonHangByKhachHang");
  }
}

// Chạy tests
runTests();
