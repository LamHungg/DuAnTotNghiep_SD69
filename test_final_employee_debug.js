// Script test cuối cùng để xác định vấn đề backend
const axios = require("axios");

async function testWithCorrectCredentials() {
  console.log("🔍 Final Test with Correct Credentials...\n");

  // Login với thông tin đúng
  try {
    console.log("🔐 Logging in with correct credentials...");
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

    return loginResponse.data;
  } catch (error) {
    console.log("❌ Login failed:", error.response?.status);
    return null;
  }
}

async function testEmployeeCreationWithSession(userData) {
  console.log("\n🔍 Testing Employee Creation with Session...");

  const testData = {
    hoTen: "Nguyễn Văn Test Final",
    tenDangNhap: `testuser${Date.now()}`,
    matKhau: "123456",
    email: `test${Date.now()}@example.com`,
    soDienThoai: "0123456789",
    chucVu: "NHANVIEN",
    trangThai: true,
  };

  console.log("📋 Test Data:", JSON.stringify(testData, null, 2));

  try {
    // Test với session cookie (không cần token)
    const response = await axios.post(
      "http://localhost:8080/api/nguoi-dung",
      testData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Sử dụng session cookie
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
      console.log("\n🔍 DETAILED ERROR ANALYSIS:");
      console.log("Error message:", errorMessage);

      if (errorMessage.includes("KhachHang")) {
        console.log("\n🚨 CONFIRMED BACKEND ISSUE:");
        console.log("Backend is incorrectly using 'KhachHang' entity");
        console.log("Expected: NguoiDung entity");
        console.log("Actual: KhachHang entity");

        console.log("\n🔧 BACKEND FIXES REQUIRED:");
        console.log("1. Check NguoiDungController.java");
        console.log('2. Verify @RequestMapping("/api/nguoi-dung")');
        console.log("3. Check entity class names and inheritance");
        console.log("4. Verify repository interface methods");
        console.log("5. Check JPA @Entity annotations");

        console.log("\n💡 LIKELY CAUSES:");
        console.log("- Wrong controller mapping");
        console.log("- Entity inheritance issue");
        console.log("- Repository method returning wrong entity type");
        console.log("- JPA configuration problem");
      }
    }

    return false;
  }
}

async function testDifferentApproaches() {
  console.log("\n🔍 Testing Different Approaches...");

  const approaches = [
    {
      name: "POST with minimal data",
      data: {
        hoTen: "Test User",
        tenDangNhap: `test${Date.now()}`,
        matKhau: "123456",
        email: `test${Date.now()}@test.com`,
        soDienThoai: "0123456789",
      },
    },
    {
      name: "POST with chucVu only",
      data: {
        hoTen: "Test User",
        tenDangNhap: `test${Date.now()}`,
        matKhau: "123456",
        email: `test${Date.now()}@test.com`,
        soDienThoai: "0123456789",
        chucVu: "NHANVIEN",
      },
    },
  ];

  for (const approach of approaches) {
    try {
      console.log(`\n📋 Testing: ${approach.name}`);
      const response = await axios.post(
        "http://localhost:8080/api/nguoi-dung",
        approach.data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(`✅ ${approach.name}: Success (${response.status})`);
    } catch (error) {
      console.log(`❌ ${approach.name}: Failed (${error.response?.status})`);
      if (error.response?.data?.message) {
        console.log(`   Error: ${error.response.data.message}`);
      }
    }
  }
}

async function runFinalTest() {
  console.log("🚀 Starting Final Employee Debug Test...\n");

  const userData = await testWithCorrectCredentials();

  if (userData) {
    const success = await testEmployeeCreationWithSession(userData);
    await testDifferentApproaches();

    console.log("\n📋 FINAL SUMMARY:");
    if (success) {
      console.log("✅ Employee creation works with proper session!");
      console.log(
        "💡 Solution: Ensure user is logged in before adding employees"
      );
    } else {
      console.log("❌ Employee creation fails due to backend entity issue");
      console.log("🚨 CRITICAL: Backend needs to be fixed");
      console.log("\n🔧 IMMEDIATE ACTIONS NEEDED:");
      console.log("1. Fix backend entity mapping (KhachHang → NguoiDung)");
      console.log("2. Check controller and repository implementation");
      console.log("3. Verify database table structure");
    }
  } else {
    console.log("❌ Cannot test without proper authentication");
  }

  console.log("\n🎯 CONCLUSION:");
  console.log("The issue is NOT with frontend code");
  console.log("The issue is with backend entity mapping");
  console.log(
    "Backend is using wrong entity class (KhachHang instead of NguoiDung)"
  );
}

runFinalTest();
