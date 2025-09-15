// Script test checkout với authentication
const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testCheckoutWithAuth() {
  try {
    console.log("=== TESTING CHECKOUT WITH AUTH ===");

    // Test 1: Test checkout endpoint với token
    console.log("1. Testing checkout test endpoint with token...");
    try {
      const testResponse = await axios.get(`${API_URL}/checkout/test`, {
        headers: {
          Authorization: "Bearer customer-token-1",
          "Content-Type": "application/json",
        },
        timeout: 5000,
      });
      console.log("✅ Checkout test response:", testResponse.data);
    } catch (error) {
      console.log("❌ Checkout test error:", error.message);
      if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Data:", error.response.data);
      }
    }

    // Test 2: Test checkout test-process endpoint
    console.log("2. Testing checkout test-process endpoint...");
    const testProcessData = {
      cartItems: [
        {
          chiTietSanPhamId: 1,
          soLuong: 2,
          gia: 100000,
          thanhTien: 200000,
        },
      ],
      diaChiId: 1,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test order",
      phiVanChuyen: 30000,
      tongTienHang: 200000,
      tongThanhToan: 230000,
    };

    try {
      const processResponse = await axios.post(
        `${API_URL}/checkout/test-process`,
        testProcessData,
        {
          headers: {
            Authorization: "Bearer customer-token-1",
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );
      console.log("✅ Test process response:", processResponse.data);
    } catch (error) {
      console.log("❌ Test process error:", error.message);
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
testCheckoutWithAuth();
