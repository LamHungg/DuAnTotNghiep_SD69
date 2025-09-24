// Test script để kiểm tra các endpoint login
const axios = require("axios");

async function testLoginEndpoints() {
  console.log("🔍 Testing Login Endpoints...\n");

  // Test 1: Kiểm tra endpoint login có tồn tại không
  try {
    console.log("🔍 Test 1: Check login endpoint");
    const response = await axios.get("http://localhost:8080/api/auth/login");
    console.log("✅ Login endpoint exists:", response.status);
  } catch (error) {
    console.log("❌ Login endpoint check failed:", error.response?.status);
  }

  // Test 2: Thử login với các tài khoản khác nhau
  const testAccounts = [
    { tenDangNhap: "admin", matKhau: "admin" },
    { tenDangNhap: "admin", matKhau: "admin123" },
    { tenDangNhap: "admin", matKhau: "123456" },
    { tenDangNhap: "root", matKhau: "root" },
    { tenDangNhap: "root", matKhau: "123456" },
    { tenDangNhap: "test", matKhau: "test" },
    { tenDangNhap: "test", matKhau: "123456" },
  ];

  console.log("\n🔍 Test 2: Try different login credentials");

  for (const account of testAccounts) {
    try {
      console.log(`\n📋 Trying: ${account.tenDangNhap} / ${account.matKhau}`);
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        account,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(`✅ Login successful: ${account.tenDangNhap}`);
      console.log("📊 User data:", JSON.stringify(response.data, null, 2));
      return response.data; // Return first successful login
    } catch (error) {
      console.log(
        `❌ Login failed: ${error.response?.status} - ${
          error.response?.data?.message || "Unknown error"
        }`
      );
    }
  }

  // Test 3: Kiểm tra các endpoint khác
  console.log("\n🔍 Test 3: Check other auth endpoints");
  const authEndpoints = [
    "/api/auth/check-session",
    "/api/auth/logout",
    "/api/auth/register",
  ];

  for (const endpoint of authEndpoints) {
    try {
      const response = await axios.get(`http://localhost:8080${endpoint}`);
      console.log(`✅ ${endpoint}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.response?.status || "No response"}`);
    }
  }

  return null;
}

async function testEmployeeWithoutAuth() {
  console.log("\n🔍 Test 4: Test employee creation without auth");

  const testData = {
    hoTen: "Test User No Auth",
    tenDangNhap: `testuser${Date.now()}`,
    matKhau: "123456",
    email: `test${Date.now()}@example.com`,
    soDienThoai: "0123456789",
    chucVu: "NHANVIEN",
    trangThai: true,
  };

  try {
    const response = await axios.post(
      "http://localhost:8080/api/nguoi-dung",
      testData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log(
      "✅ Employee creation without auth successful:",
      response.status
    );
  } catch (error) {
    console.log(
      "❌ Employee creation without auth failed:",
      error.response?.status
    );
    console.log("📊 Error:", error.response?.data?.message);
  }
}

async function runLoginTest() {
  console.log("🚀 Starting Login Endpoint Tests...\n");

  const userData = await testLoginEndpoints();
  await testEmployeeWithoutAuth();

  console.log("\n📋 SUMMARY:");
  if (userData) {
    console.log("✅ Found working login credentials");
    console.log("💡 Use these credentials for employee creation test");
  } else {
    console.log("❌ No working login credentials found");
    console.log("💡 Check backend for default admin account");
    console.log("💡 Or create a test account first");
  }

  console.log("\n🔧 NEXT STEPS:");
  console.log("1. Find correct admin credentials");
  console.log("2. Test employee creation with authentication");
  console.log("3. Fix backend entity mapping issue");
}

runLoginTest();
