const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function checkCustomers() {
  try {
    console.log("🔍 Kiểm tra danh sách khách hàng trong database...\n");

    // Thử lấy danh sách khách hàng
    const response = await axios.get(`${BASE_URL}/api/khach-hang`);

    console.log("✅ Danh sách khách hàng:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("❌ Lỗi khi lấy danh sách khách hàng:");
    console.error("Lỗi:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);

    // Thử endpoint khác
    try {
      console.log("\n🔄 Thử endpoint khác...");
      const response2 = await axios.get(`${BASE_URL}/api/customers`);
      console.log("✅ Danh sách khách hàng (endpoint khác):");
      console.log(JSON.stringify(response2.data, null, 2));
    } catch (error2) {
      console.error("❌ Cả hai endpoint đều lỗi:");
      console.error("Lỗi 2:", error2.response?.data || error2.message);
    }
  }
}

// Chạy test
checkCustomers();
