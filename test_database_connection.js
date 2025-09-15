const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testDatabaseConnection() {
  try {
    console.log("🔍 Testing database connection...");

    // Test các endpoint khác để xem có hoạt động không
    const endpoints = ["/cart/test-no-auth", "/products", "/chi-tiet-san-pham"];

    for (const endpoint of endpoints) {
      try {
        console.log(`\nTesting ${endpoint}...`);
        const response = await axios.get(`${API_URL}${endpoint}`);
        console.log(`✅ ${endpoint} works:`, response.status);
      } catch (error) {
        console.log(
          `❌ ${endpoint} failed:`,
          error.response?.status || error.message
        );
      }
    }
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  }
}

testDatabaseConnection();
