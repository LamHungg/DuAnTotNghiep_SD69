// Test script để kiểm tra authentication cho checkout
const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testCheckoutAuthentication() {
  console.log("🔍 Testing checkout authentication...");

  try {
    // Test 1: Kiểm tra endpoint test mà không có authentication
    console.log("\n1. Testing checkout endpoint without authentication...");
    try {
      const response = await axios.post(
        `${API_URL}/checkout/test-process`,
        {
          cartItems: [],
          diaChiId: 1,
          phuongThucThanhToanId: 1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log("❌ Should have failed but got:", response.data);
    } catch (error) {
      console.log("✅ Correctly got 401 error:", error.response?.status);
      console.log("Error message:", error.response?.data);
    }

    // Test 2: Đăng nhập trước
    console.log("\n2. Logging in...");
    const loginResponse = await axios.post(
      `${API_URL}/auth/login`,
      {
        email: "test@example.com",
        matKhau: "password123",
      },
      {
        withCredentials: true,
      }
    );
    console.log("✅ Login successful:", loginResponse.data);

    // Test 3: Kiểm tra session sau khi đăng nhập
    console.log("\n3. Testing session check...");
    const sessionResponse = await axios.get(`${API_URL}/auth/check-session`, {
      withCredentials: true,
    });
    console.log("✅ Session check successful:", sessionResponse.data);

    // Test 4: Test checkout với authentication
    console.log("\n4. Testing checkout with authentication...");
    const checkoutResponse = await axios.post(
      `${API_URL}/checkout/test-process`,
      {
        cartItems: [
          {
            chiTietSanPhamId: 1,
            soLuong: 2,
            gia: 100000,
            thanhTien: 200000,
          },
        ],
        diaChiId: 1,
        phuongThucThanhToanId: 1,
        ghiChuKhachHang: "Test order",
        phiVanChuyen: 30000,
        tongTienHang: 200000,
        tongThanhToan: 230000,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    console.log("✅ Checkout test successful:", checkoutResponse.data);
  } catch (error) {
    console.error("❌ Test failed:", error.message);
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
}

// Chạy test
testCheckoutAuthentication();
