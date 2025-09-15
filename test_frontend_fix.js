const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testFrontendLogin() {
  try {
    console.log("🧪 Testing Frontend Login (after CORS fix)...");

    // Test data
    const loginData = {
      email: "testcustomer@example.com",
      matKhau: "123456789",
    };

    console.log("📤 Sending request to:", `${API_URL}/auth/login`);
    console.log("📦 Request data:", { email: loginData.email, matKhau: "***" });

    const response = await axios.post(`${API_URL}/auth/login`, loginData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
    });

    console.log("✅ Frontend login successful!");
    console.log("📥 Response:", response.data);

    // Test localStorage simulation
    if (response.data.token) {
      console.log("💾 Token received:", response.data.token);
      console.log("👤 User data:", {
        id: response.data.id,
        email: response.data.email,
        hoTen: response.data.hoTen,
        role: response.data.role,
      });
    }

    return response.data;
  } catch (error) {
    console.error("❌ Frontend login failed!");
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

async function testCORS() {
  try {
    console.log("🔍 Testing CORS configuration...");

    // Test OPTIONS request
    const optionsResponse = await axios.options(`${API_URL}/auth/login`, {
      headers: {
        Origin: "http://localhost:3000",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });

    console.log("✅ CORS preflight successful!");
    console.log("📥 CORS Headers:", optionsResponse.headers);
  } catch (error) {
    console.error("❌ CORS test failed:", error.message);
  }
}

async function runTests() {
  console.log("🚀 Starting Frontend Login Tests (After CORS Fix)...\n");

  try {
    // Test 1: CORS configuration
    await testCORS();
    console.log("\n");

    // Test 2: Frontend login
    await testFrontendLogin();
    console.log("\n");

    console.log("🎉 All tests completed!");
    console.log(
      "💡 Nếu test thành công, frontend login sẽ hoạt động bình thường!"
    );
  } catch (error) {
    console.error("💥 Test suite failed:", error.message);
    console.log("\n🔧 Hướng dẫn khắc phục:");
    console.log("1. Restart backend server");
    console.log("2. Kiểm tra port frontend có đúng không");
    console.log("3. Kiểm tra CORS configuration");
  }
}

// Chạy tests
runTests();
