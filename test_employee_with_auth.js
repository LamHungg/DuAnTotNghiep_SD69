// Test script với authentication để thêm nhân viên
const axios = require("axios");

async function loginAndGetToken() {
  console.log("🔐 Logging in to get authentication token...");

  try {
    const loginData = {
      tenDangNhap: "admin", // Thay đổi theo tài khoản admin của bạn
      matKhau: "admin123", // Thay đổi theo mật khẩu admin của bạn
    };

    const response = await axios.post(
      "http://localhost:8080/api/auth/login",
      loginData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log("✅ Login successful:", response.status);
    console.log("📊 User data:", JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.log("❌ Login failed:", error.response?.status);
    console.log("📊 Error:", error.response?.data);
    return null;
  }
}

async function testEmployeeCreationWithAuth(token) {
  console.log("\n🔍 Testing Employee Creation with Authentication...");

  const testEmployeeData = {
    hoTen: "Nguyễn Văn Test Auth",
    tenDangNhap: `testuser${Date.now()}`,
    matKhau: "123456",
    email: `test${Date.now()}@example.com`,
    soDienThoai: "0123456789",
    chucVu: "NHANVIEN",
    trangThai: true,
  };

  console.log("📋 Test Data:", JSON.stringify(testEmployeeData, null, 2));

  try {
    const response = await axios.post(
      "http://localhost:8080/api/nguoi-dung",
      testEmployeeData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    console.log("✅ Employee creation successful:", response.status);
    console.log("📊 Response:", JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.log("❌ Employee creation failed:");
    console.log("📊 Status:", error.response?.status);
    console.log("📊 Data:", JSON.stringify(error.response?.data, null, 2));

    // Phân tích lỗi chi tiết
    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      console.log("\n🔍 Detailed Error Analysis:");
      console.log("Error message:", errorMessage);

      if (errorMessage.includes("KhachHang")) {
        console.log("\n🚨 CRITICAL ISSUE FOUND:");
        console.log(
          "Backend is trying to use 'KhachHang' entity instead of 'NguoiDung'"
        );
        console.log("This suggests:");
        console.log("1. Wrong controller mapping");
        console.log("2. Entity inheritance issue");
        console.log("3. Repository method mismatch");

        console.log("\n💡 SOLUTIONS:");
        console.log("1. Check backend controller @RequestMapping");
        console.log("2. Verify entity class names");
        console.log("3. Check repository interface");
        console.log("4. Verify JPA annotations");
      }

      if (errorMessage.includes("cannot be cast")) {
        console.log("\n🚨 TYPE CASTING ERROR:");
        console.log("Entity type casting failed");
        console.log("Check entity inheritance hierarchy");
      }
    }

    return false;
  }
}

async function testDifferentEndpoints() {
  console.log("\n🔍 Testing different endpoints to identify the issue...");

  const endpoints = [
    { url: "/api/nguoi-dung", method: "GET", name: "Get all users" },
    { url: "/api/nguoi-dung", method: "POST", name: "Create user" },
    { url: "/api/customer", method: "GET", name: "Customer endpoint" },
    { url: "/api/auth/check-session", method: "GET", name: "Check session" },
  ];

  for (const endpoint of endpoints) {
    try {
      if (endpoint.method === "GET") {
        const response = await axios.get(
          `http://localhost:8080${endpoint.url}`
        );
        console.log(`✅ ${endpoint.name}: ${response.status}`);
      }
    } catch (error) {
      console.log(
        `❌ ${endpoint.name}: ${error.response?.status || "No response"}`
      );
    }
  }
}

async function runEmployeeAuthTest() {
  console.log("🚀 Starting Employee Authentication Test...\n");

  // Step 1: Login
  const userData = await loginAndGetToken();
  if (!userData) {
    console.log("❌ Cannot proceed without authentication");
    return;
  }

  // Step 2: Test employee creation with auth
  const success = await testEmployeeCreationWithAuth(userData.token);

  // Step 3: Test other endpoints
  await testDifferentEndpoints();

  console.log("\n📋 FINAL SUMMARY:");
  if (success) {
    console.log("✅ Employee creation works with proper authentication");
    console.log(
      "💡 Solution: Ensure user is logged in before adding employees"
    );
  } else {
    console.log("❌ Employee creation still fails even with authentication");
    console.log("🚨 Backend issue: Check entity mapping and controller");
    console.log("\n🔧 BACKEND FIXES NEEDED:");
    console.log("1. Check NguoiDungController.java");
    console.log("2. Verify entity class names");
    console.log("3. Check repository methods");
    console.log("4. Verify database table structure");
  }
}

runEmployeeAuthTest();
