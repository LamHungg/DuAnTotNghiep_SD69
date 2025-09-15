const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function createTestCustomer() {
  try {
    console.log("🔧 Tạo khách hàng test mới...\n");

    const customerData = {
      hoTen: "Test Customer 2",
      soDienThoai: "0987654321",
      email: "test2@example.com",
      tenDangNhap: "testuser2",
      matKhau: "123456",
    };

    console.log("Dữ liệu khách hàng:", JSON.stringify(customerData, null, 2));

    const response = await axios.post(
      `${BASE_URL}/zmen/dang-ky`,
      customerData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Tạo khách hàng thành công!");
    console.log("Response:", JSON.stringify(response.data, null, 2));

    // Test đăng nhập ngay
    console.log("\n🧪 Test đăng nhập...");
    const loginResponse = await axios.post(
      `${BASE_URL}/zmen/dang-nhap`,
      {
        taiKhoan: "test2@example.com",
        matKhau: "123456",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Đăng nhập thành công!");
    console.log("User data:", JSON.stringify(loginResponse.data, null, 2));
  } catch (error) {
    console.error("❌ Lỗi:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);
  }
}

// Chạy test
createTestCustomer();
