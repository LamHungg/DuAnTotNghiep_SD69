const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testCheckoutSimple() {
  try {
    console.log("🧪 Test API checkout đơn giản...\n");

    // 1. Test ping endpoint
    console.log("1️⃣ Test ping endpoint...");
    const pingResponse = await axios.get(`${BASE_URL}/api/checkout/ping`);
    console.log("✅ Ping response:", pingResponse.data);

    // 2. Test generate order number
    console.log("\n2️⃣ Test generate order number...");
    const orderNumberResponse = await axios.get(
      `${BASE_URL}/api/checkout/generate-order-number`
    );
    console.log("✅ Order number response:", orderNumberResponse.data);

    // 3. Test test-process endpoint với mock data
    console.log("\n3️⃣ Test test-process endpoint...");
    const testData = {
      cartItems: [
        {
          chiTietSanPhamId: 1,
          soLuong: 1,
          gia: 199000,
        },
      ],
      diaChiId: 17,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test simple checkout",
      tongTienHang: 199000,
      tongThanhToan: 949000,
      phiVanChuyen: 30000,
    };

    const testProcessResponse = await axios.post(
      `${BASE_URL}/api/checkout/test-process`,
      testData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer customer-token-11", // Mock token cho user ID 11
        },
      }
    );

    console.log("✅ Test process response:", testProcessResponse.data);
  } catch (error) {
    console.error("❌ Test thất bại!");
    console.error("Lỗi:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);

    if (error.response?.data) {
      console.error(
        "Response data:",
        JSON.stringify(error.response.data, null, 2)
      );
    }
  }
}

// Chạy test
testCheckoutSimple();
