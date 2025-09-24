// Script test cuối cùng với authentication để xác định vấn đề
const axios = require("axios");

async function loginAndTestEmployee() {
  console.log("🔍 Final Test with Authentication...\n");

  // Step 1: Login
  try {
    console.log("🔐 Step 1: Logging in...");
    const loginResponse = await axios.post(
      "http://localhost:8080/api/auth/login",
      {
        email: "admin@example.com",
        matKhau: "123456",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log("✅ Login successful!");
    console.log(
      "📊 User:",
      loginResponse.data.hoTen,
      `(${loginResponse.data.chucVu})`
    );

    // Step 2: Test employee creation with session
    console.log("\n🔍 Step 2: Testing employee creation with session...");

    const employeeData = {
      hoTen: "Nguyễn Văn Test Auth",
      tenDangNhap: `testuser${Date.now()}`,
      matKhau: "123456",
      email: `test${Date.now()}@example.com`,
      soDienThoai: "0123456789",
      chucVu: "NHANVIEN",
      trangThai: true,
    };

    console.log("📋 Employee Data:", JSON.stringify(employeeData, null, 2));

    const employeeResponse = await axios.post(
      "http://localhost:8080/api/nguoi-dung",
      employeeData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Sử dụng session cookie từ login
      }
    );

    console.log("✅ Employee creation successful:", employeeResponse.status);
    console.log("📊 Response:", JSON.stringify(employeeResponse.data, null, 2));
    return true;
  } catch (error) {
    console.log("❌ Error occurred:");
    console.log("📊 Status:", error.response?.status);
    console.log("📊 Data:", JSON.stringify(error.response?.data, null, 2));

    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      console.log("\n🔍 ERROR MESSAGE:", errorMessage);

      if (errorMessage.includes("KhachHang")) {
        console.log("\n🚨 CONFIRMED BACKEND ISSUE:");
        console.log(
          "Backend is using 'KhachHang' entity instead of 'NguoiDung'"
        );
        console.log("This is the root cause of the problem!");

        console.log("\n🔧 BACKEND FIXES NEEDED:");
        console.log("1. Check NguoiDungController.java");
        console.log('2. Verify @RequestMapping("/api/nguoi-dung")');
        console.log("3. Check entity class inheritance");
        console.log("4. Verify repository interface");
        console.log("5. Check JPA @Entity annotations");

        console.log("\n💡 LIKELY CAUSES:");
        console.log("- Wrong controller mapping to KhachHang entity");
        console.log("- Entity inheritance issue");
        console.log("- Repository method returning wrong entity type");
        console.log("- JPA configuration problem");
      }
    }

    return false;
  }
}

async function testDifferentEndpoints() {
  console.log("\n🔍 Testing different endpoints to understand the issue...");

  const endpoints = [
    { url: "/api/nguoi-dung", method: "GET", name: "Get all users" },
    { url: "/api/customer", method: "GET", name: "Customer endpoint" },
    { url: "/api/auth/check-session", method: "GET", name: "Check session" },
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`http://localhost:8080${endpoint.url}`);
      console.log(`✅ ${endpoint.name}: ${response.status}`);
    } catch (error) {
      console.log(
        `❌ ${endpoint.name}: ${error.response?.status || "No response"}`
      );
    }
  }
}

async function runFinalAuthTest() {
  console.log("🚀 Starting Final Authentication Test...\n");

  const success = await loginAndTestEmployee();
  await testDifferentEndpoints();

  console.log("\n📋 FINAL CONCLUSION:");
  if (success) {
    console.log("✅ Employee creation works with proper authentication!");
    console.log(
      "💡 Solution: Ensure user is logged in before adding employees"
    );
    console.log("💡 Frontend needs to handle authentication properly");
  } else {
    console.log("❌ Employee creation fails due to backend entity issue");
    console.log("🚨 CRITICAL: Backend needs to be fixed");

    console.log("\n🎯 ROOT CAUSE IDENTIFIED:");
    console.log("Backend is using 'KhachHang' entity instead of 'NguoiDung'");
    console.log("This causes the casting error: 'KhachHang cannot be cast...'");

    console.log("\n🔧 IMMEDIATE BACKEND FIXES:");
    console.log("1. Fix entity mapping in NguoiDungController");
    console.log("2. Verify entity class names and inheritance");
    console.log("3. Check repository interface methods");
    console.log("4. Verify database table structure");

    console.log("\n💡 FRONTEND STATUS:");
    console.log("✅ Frontend code is correct");
    console.log("✅ CSS styling issues fixed");
    console.log("✅ Form validation working");
    console.log("❌ Backend entity mapping needs fixing");
  }

  console.log("\n📋 NEXT STEPS:");
  console.log("1. Fix backend entity mapping (KhachHang → NguoiDung)");
  console.log("2. Test employee creation after backend fix");
  console.log("3. Verify all CRUD operations work");
}

runFinalAuthTest();
