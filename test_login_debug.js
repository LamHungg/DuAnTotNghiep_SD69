const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testLogin() {
  try {
    console.log("🔍 Testing login endpoint...");

    // Test 1: Kiểm tra endpoint có hoạt động không
    console.log("\n1. Testing endpoint availability...");
    try {
      const response = await axios.get(`${API_URL}/zmen/dang-ky`);
      console.log("✅ Endpoint available");
    } catch (error) {
      console.log("❌ Endpoint not available:", error.message);
    }

    // Test 2: Test đăng ký user mới
    console.log("\n2. Testing registration...");
    const registerData = {
      email: "test4@example.com",
      tenDangNhap: "test4",
      matKhau: "123456",
      hoTen: "Test User 4",
      gioiTinh: "Nam",
      ngaySinh: "1990-01-01",
    };

    try {
      const registerResponse = await axios.post(
        `${API_URL}/zmen/dang-ky`,
        registerData,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("✅ Registration successful:", registerResponse.data);
    } catch (error) {
      console.log(
        "❌ Registration failed:",
        error.response?.data || error.message
      );
    }

    // Test 3: Test đăng nhập
    console.log("\n3. Testing login...");
    const loginData = {
      taiKhoan: "test4@example.com",
      matKhau: "123456",
    };

    try {
      const loginResponse = await axios.post(
        `${API_URL}/zmen/dang-nhap`,
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

testLogin();
