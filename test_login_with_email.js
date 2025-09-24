// Test script để login với email thay vì tên đăng nhập
const axios = require("axios");

async function testLoginWithEmail() {
  console.log("🔍 Testing Login with Email...\n");

  // Test với email thay vì tenDangNhap
  const testAccounts = [
    { email: "admin@admin.com", matKhau: "admin" },
    { email: "admin@admin.com", matKhau: "admin123" },
    { email: "admin@admin.com", matKhau: "123456" },
    { email: "admin@example.com", matKhau: "admin" },
    { email: "admin@example.com", matKhau: "123456" },
    { email: "root@root.com", matKhau: "root" },
    { email: "root@root.com", matKhau: "123456" },
    { email: "test@test.com", matKhau: "test" },
    { email: "test@test.com", matKhau: "123456" },
    { email: "admin@gmail.com", matKhau: "admin" },
    { email: "admin@gmail.com", matKhau: "123456" },
  ];

  console.log("🔍 Test: Try login with email instead of tenDangNhap");

  for (const account of testAccounts) {
    try {
      console.log(`\n📋 Trying: ${account.email} / ${account.matKhau}`);
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
      console.log(`✅ Login successful: ${account.email}`);
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

  return null;
}

async function testEmployeeCreationWithToken(token) {
  console.log("\n🔍 Test: Employee creation with authentication token");

  const testData = {
    hoTen: "Nguyễn Văn Test Token",
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
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );
    console.log("✅ Employee creation with token successful:", response.status);
    console.log("📊 Response:", JSON.stringify(response.data, null, 2));
    return true;
  } catch (error) {
    console.log(
      "❌ Employee creation with token failed:",
      error.response?.status
    );
    console.log("📊 Error:", JSON.stringify(error.response?.data, null, 2));

    // Phân tích lỗi chi tiết
    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      console.log("\n🔍 DETAILED ERROR ANALYSIS:");
      console.log("Error message:", errorMessage);

      if (errorMessage.includes("KhachHang")) {
        console.log("\n🚨 CRITICAL BACKEND ISSUE:");
        console.log(
          "Backend is using 'KhachHang' entity instead of 'NguoiDung'"
        );
        console.log("This indicates:");
        console.log("1. Wrong controller mapping");
        console.log("2. Entity inheritance problem");
        console.log("3. Repository method mismatch");

        console.log("\n💡 BACKEND FIXES NEEDED:");
        console.log("1. Check NguoiDungController.java");
        console.log("2. Verify @RequestMapping path");
        console.log("3. Check entity class names");
        console.log("4. Verify repository interface");
        console.log("5. Check JPA annotations");
      }
    }

    return false;
  }
}

async function runEmailLoginTest() {
  console.log("🚀 Starting Email Login Test...\n");

  const userData = await testLoginWithEmail();

  if (userData && userData.token) {
    console.log("\n✅ Login successful! Testing employee creation...");
    const success = await testEmployeeCreationWithToken(userData.token);

    if (success) {
      console.log(
        "\n🎉 SUCCESS: Employee creation works with proper authentication!"
      );
      console.log("💡 Solution: Use email for login, not tenDangNhap");
    } else {
      console.log(
        "\n❌ Employee creation still fails even with authentication"
      );
      console.log("🚨 Backend entity mapping issue needs to be fixed");
    }
  } else {
    console.log("\n❌ No working login credentials found");
    console.log("💡 Need to check backend for correct admin email");
    console.log("💡 Or create a test account first");
  }

  console.log("\n📋 FINAL RECOMMENDATIONS:");
  console.log("1. Check backend database for existing admin accounts");
  console.log("2. Verify login endpoint expects email, not tenDangNhap");
  console.log("3. Fix backend entity mapping (KhachHang vs NguoiDung)");
  console.log("4. Test with proper authentication flow");
}

runEmailLoginTest();
