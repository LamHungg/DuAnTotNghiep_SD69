const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testCompleteCartFlow() {
  try {
    console.log("🔍 Testing complete cart flow...");

    // Step 1: Login
    console.log("\n1. Testing login...");
    const loginData = {
      email: "test2@example.com",
      matKhau: "123456",
    };

    const loginResponse = await axios.post(`${API_URL}/auth/login`, loginData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    console.log("✅ Login response:", loginResponse.data);
    const userData = loginResponse.data;

    if (!userData.token) {
      console.log("❌ No token in login response!");
      return;
    }

    // Step 2: Test cart add with token
    console.log("\n2. Testing add to cart with token...");
    const cartData = {
      chiTietSanPhamId: 1,
      soLuong: 1,
    };

    try {
      const cartResponse = await axios.post(`${API_URL}/cart/add`, cartData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
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

    // Step 3: Test get cart
    console.log("\n3. Testing get cart...");
    try {
      const getCartResponse = await axios.get(`${API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
        withCredentials: true,
      });
      console.log("✅ Get cart successful:", getCartResponse.data);
    } catch (error) {
      console.log("❌ Get cart failed:");
      console.log("   Status:", error.response?.status);
      console.log("   Data:", error.response?.data);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testCompleteCartFlow();
