const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testAuthLogin() {
  try {
    console.log("🔍 Testing /api/auth/login endpoint...");

    // Test đăng nhập với user có sẵn
    const loginData = {
      email: "test2@example.com",
      matKhau: "123456",
    };

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
    } catch (error) {
      console.log("❌ Login failed:");
      console.log("   Status:", error.response?.status);
      console.log("   Data:", error.response?.data);
      console.log("   Message:", error.message);
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testAuthLogin();
