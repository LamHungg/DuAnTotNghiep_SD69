// Script test đơn giản cho API
const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testSimpleAPI() {
  try {
    console.log("=== TESTING SIMPLE API ===");

    // Test 1: Kiểm tra backend có hoạt động không
    console.log("1. Testing if backend is running...");
    try {
      const response = await axios.get(`${API_URL}/checkout/ping`, {
        timeout: 5000,
      });
      console.log("✅ Backend is running:", response.data);
    } catch (error) {
      if (error.code === "ECONNREFUSED") {
        console.log("❌ Backend is not running on port 8080");
        console.log("Please start the backend first");
        return;
      } else {
        console.log("❌ Backend error:", error.message);
      }
    }

    // Test 2: Kiểm tra payment methods
    console.log("2. Testing payment methods...");
    try {
      const paymentResponse = await axios.get(`${API_URL}/payment/methods`, {
        timeout: 5000,
      });
      console.log("✅ Payment methods:", paymentResponse.data);
    } catch (error) {
      console.log("❌ Payment methods error:", error.message);
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }
    }
  } catch (error) {
    console.error("❌ General error:", error.message);
  }
}

// Chạy test
testSimpleAPI();
