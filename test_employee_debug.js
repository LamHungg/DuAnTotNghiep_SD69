// Debug script để test endpoint thêm nhân viên
const axios = require("axios");

async function testEmployeeEndpoint() {
  console.log("🔍 Testing Employee Creation Endpoint...\n");

  const testEmployeeData = {
    hoTen: "Nguyễn Văn Test",
    tenDangNhap: "testuser123",
    matKhau: "123456",
    email: "test@example.com",
    soDienThoai: "0123456789",
    chucVu: "NHANVIEN",
    trangThai: true,
  };

  console.log("📋 Test Data:", JSON.stringify(testEmployeeData, null, 2));

  try {
    // Test 1: Kiểm tra endpoint có tồn tại không
    console.log("\n🔍 Test 1: Check if endpoint exists");
    const response1 = await axios.get("http://localhost:8080/api/nguoi-dung");
    console.log("✅ Endpoint exists:", response1.status);
  } catch (error) {
    console.log(
      "❌ Endpoint check failed:",
      error.response?.status,
      error.response?.data
    );
  }

  try {
    // Test 2: Test POST request
    console.log("\n🔍 Test 2: POST request to create employee");
    const response2 = await axios.post(
      "http://localhost:8080/api/nguoi-dung",
      testEmployeeData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    console.log("✅ Employee creation successful:", response2.status);
    console.log("📊 Response:", JSON.stringify(response2.data, null, 2));
  } catch (error) {
    console.log("❌ Employee creation failed:");
    console.log("📊 Status:", error.response?.status);
    console.log("📊 Data:", JSON.stringify(error.response?.data, null, 2));

    // Phân tích lỗi
    if (error.response?.data?.message) {
      console.log("\n🔍 Error Analysis:");
      const errorMessage = error.response.data.message;
      console.log("Error message:", errorMessage);

      if (errorMessage.includes("KhachHang")) {
        console.log(
          "🚨 Issue: Backend is trying to use KhachHang entity instead of NguoiDung"
        );
        console.log("💡 Solution: Check backend controller mapping");
      }

      if (errorMessage.includes("cannot be cast")) {
        console.log("🚨 Issue: Type casting error in backend");
        console.log("💡 Solution: Check entity inheritance or mapping");
      }
    }
  }

  // Test 3: Kiểm tra các endpoint khác
  console.log("\n🔍 Test 3: Check other related endpoints");
  const endpoints = [
    "/api/nguoi-dung",
    "/api/auth/check-session",
    "/api/customer/products",
  ];

  for (const endpoint of endpoints) {
    try {
      const response = await axios.get(`http://localhost:8080${endpoint}`);
      console.log(`✅ ${endpoint}: ${response.status}`);
    } catch (error) {
      console.log(`❌ ${endpoint}: ${error.response?.status || "No response"}`);
    }
  }
}

async function testWithDifferentData() {
  console.log("\n🔍 Test 4: Test with different data formats");

  const testCases = [
    {
      name: "Minimal data",
      data: {
        hoTen: "Test User",
        tenDangNhap: "testuser",
        matKhau: "123456",
        email: "test@test.com",
        soDienThoai: "0123456789",
      },
    },
    {
      name: "With chucVu",
      data: {
        hoTen: "Test User",
        tenDangNhap: "testuser2",
        matKhau: "123456",
        email: "test2@test.com",
        soDienThoai: "0123456789",
        chucVu: "NHANVIEN",
      },
    },
    {
      name: "With trangThai",
      data: {
        hoTen: "Test User",
        tenDangNhap: "testuser3",
        matKhau: "123456",
        email: "test3@test.com",
        soDienThoai: "0123456789",
        chucVu: "NHANVIEN",
        trangThai: true,
      },
    },
  ];

  for (const testCase of testCases) {
    try {
      console.log(`\n📋 Testing: ${testCase.name}`);
      const response = await axios.post(
        "http://localhost:8080/api/nguoi-dung",
        testCase.data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log(`✅ ${testCase.name}: Success (${response.status})`);
    } catch (error) {
      console.log(`❌ ${testCase.name}: Failed (${error.response?.status})`);
      if (error.response?.data?.message) {
        console.log(`   Error: ${error.response.data.message}`);
      }
    }
  }
}

async function runEmployeeDebug() {
  console.log("🚀 Starting Employee Debug Tests...\n");

  await testEmployeeEndpoint();
  await testWithDifferentData();

  console.log("\n📋 Summary:");
  console.log("1. Check if backend endpoint is correctly mapped");
  console.log("2. Verify entity class names (NguoiDung vs KhachHang)");
  console.log("3. Check database table structure");
  console.log("4. Verify authentication/authorization");

  console.log("\n🔧 Common Solutions:");
  console.log("- Check backend controller @RequestMapping");
  console.log("- Verify entity class inheritance");
  console.log("- Check database table names");
  console.log("- Verify JPA annotations");
}

runEmployeeDebug();
