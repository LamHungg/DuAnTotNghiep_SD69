const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testLoginFlow() {
  try {
    console.log("🔍 Testing complete login flow...");

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
    console.log("🔍 Response data type:", typeof loginResponse.data);
    console.log(
      "🔍 Response data keys:",
      Object.keys(loginResponse.data || {})
    );

    // Step 2: Simulate localStorage save
    console.log("\n2. Simulating localStorage save...");
    const userData = loginResponse.data;
    console.log("💾 Would save to localStorage:", JSON.stringify(userData));

    // Step 3: Test cartService logic
    console.log("\n3. Testing cartService logic...");
    if (userData && userData.token) {
      console.log("🔑 Token found:", userData.token);
      console.log("📤 Auth header would be:", `Bearer ${userData.token}`);
    } else {
      console.log("❌ No token in response data");
    }

    // Step 4: Test add to cart
    console.log("\n4. Testing add to cart...");
    if (userData && userData.token) {
      try {
        const cartResponse = await axios.post(
          `${API_URL}/cart/add`,
          {
            chiTietSanPhamId: 1,
            soLuong: 1,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.token}`,
            },
            withCredentials: true,
          }
        );
        console.log("✅ Add to cart successful:", cartResponse.data);
      } catch (error) {
        console.log(
          "❌ Add to cart failed:",
          error.response?.data || error.message
        );
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testLoginFlow();
