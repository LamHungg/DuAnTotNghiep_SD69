const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testLoginResponse() {
  try {
    console.log("🔍 Testing login response...");

    const loginData = {
      email: "test2@example.com",
      matKhau: "123456",
    };

    const response = await axios.post(`${API_URL}/auth/login`, loginData, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });

    console.log("✅ Login response:", response.data);
    console.log("🔍 Response data type:", typeof response.data);
    console.log("🔍 Response data keys:", Object.keys(response.data || {}));
    console.log("🔍 Response data stringified:", JSON.stringify(response.data));

    if (response.data.token) {
      console.log("🔑 Token found in response:", response.data.token);
    } else {
      console.log("❌ No token in response data!");
    }

    // Simulate frontend localStorage save
    console.log("\n💾 Simulating localStorage save...");
    const userData = response.data;
    console.log("Would save to localStorage:", JSON.stringify(userData));

    if (userData.token) {
      console.log("✅ Token would be saved correctly");
    } else {
      console.log("❌ Token would NOT be saved!");
    }
  } catch (error) {
    console.error("❌ Test failed:", error.response?.data || error.message);
  }
}

testLoginResponse();
