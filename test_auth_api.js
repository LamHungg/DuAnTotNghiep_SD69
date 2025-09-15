// Test script để kiểm tra API authentication
const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testRegister() {
  try {
    console.log("🧪 Testing Register API...");

    const registerData = {
      firstName: "Test",
      lastName: "User",
      email: "testuser@example.com",
      password: "123456789",
      confirmPassword: "123456789",
      phone: "0123456789",
    };

    const response = await axios.post(`${API_URL}/auth/register`, registerData);
    console.log("✅ Register successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Register failed:", error.response?.data || error.message);
    throw error;
  }
}

async function testLogin() {
  try {
    console.log("🧪 Testing Login API...");

    const loginData = {
      email: "testuser@example.com",
      matKhau: "123456789",
    };

    const response = await axios.post(`${API_URL}/auth/login`, loginData);
    console.log("✅ Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Login failed:", error.response?.data || error.message);
    throw error;
  }
}

async function testForgotPassword() {
  try {
    console.log("🧪 Testing Forgot Password API...");

    const forgotData = {
      email: "testuser@example.com",
    };

    const response = await axios.post(
      `${API_URL}/auth/forgot-password`,
      forgotData
    );
    console.log("✅ Forgot password successful:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Forgot password failed:",
      error.response?.data || error.message
    );
    throw error;
  }
}

async function runTests() {
  console.log("🚀 Starting Authentication API Tests...\n");

  try {
    // Test 1: Register
    await testRegister();
    console.log("\n");

    // Test 2: Login
    await testLogin();
    console.log("\n");

    // Test 3: Forgot Password
    await testForgotPassword();
    console.log("\n");

    console.log("🎉 All tests completed successfully!");
  } catch (error) {
    console.error("💥 Test suite failed:", error.message);
  }
}

// Chạy tests nếu file được execute trực tiếp
if (require.main === module) {
  runTests();
}

module.exports = { testRegister, testLogin, testForgotPassword };
