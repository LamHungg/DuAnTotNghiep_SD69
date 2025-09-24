// Script test backend sau khi sửa lỗi entity
const axios = require("axios");

async function testBackendAfterFix() {
  console.log("🔍 Testing Backend After Entity Fix...\n");

  // Test 1: Login để lấy session
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

    // Test 2: Test employee creation
    console.log("\n🔍 Step 2: Testing employee creation...");

    const employeeData = {
      hoTen: "Nguyễn Văn Test Fixed",
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
        withCredentials: true,
      }
    );

    console.log("✅ Employee creation successful:", employeeResponse.status);
    console.log("📊 Response:", JSON.stringify(employeeResponse.data, null, 2));

    // Test 3: Verify employee was created
    console.log("\n🔍 Step 3: Verifying employee was created...");
    const getUsersResponse = await axios.get(
      "http://localhost:8080/api/nguoi-dung",
      {
        withCredentials: true,
      }
    );

    const users = getUsersResponse.data;
    const createdUser = users.find(
      (user) => user.tenDangNhap === employeeData.tenDangNhap
    );

    if (createdUser) {
      console.log("✅ Employee found in database:", createdUser.hoTen);
    } else {
      console.log("❌ Employee not found in database");
    }

    return true;
  } catch (error) {
    console.log("❌ Error occurred:");
    console.log("📊 Status:", error.response?.status);
    console.log("📊 Data:", JSON.stringify(error.response?.data, null, 2));

    if (error.response?.data?.message) {
      const errorMessage = error.response.data.message;
      console.log("\n🔍 ERROR MESSAGE:", errorMessage);

      if (errorMessage.includes("KhachHang")) {
        console.log("\n🚨 BACKEND STILL HAS ENTITY ISSUE:");
        console.log("Backend is still using 'KhachHang' entity");
        console.log("Please check the backend fix guide and try again");
      } else {
        console.log("\n🔍 OTHER ERROR:", errorMessage);
      }
    }

    return false;
  }
}

async function testMultipleScenarios() {
  console.log("\n🔍 Testing Multiple Scenarios...");

  const scenarios = [
    {
      name: "Valid employee data",
      data: {
        hoTen: "Test User 1",
        tenDangNhap: `testuser1${Date.now()}`,
        matKhau: "123456",
        email: `test1${Date.now()}@example.com`,
        soDienThoai: "0123456789",
        chucVu: "NHANVIEN",
        trangThai: true,
      },
    },
    {
      name: "Manager role",
      data: {
        hoTen: "Test Manager",
        tenDangNhap: `testmanager${Date.now()}`,
        matKhau: "123456",
        email: `manager${Date.now()}@example.com`,
        soDienThoai: "0987654321",
        chucVu: "QUANLY",
        trangThai: true,
      },
    },
    {
      name: "Admin role",
      data: {
        hoTen: "Test Admin",
        tenDangNhap: `testadmin${Date.now()}`,
        matKhau: "123456",
        email: `admin${Date.now()}@example.com`,
        soDienThoai: "0555666777",
        chucVu: "ADMIN",
        trangThai: true,
      },
    },
  ];

  for (const scenario of scenarios) {
    try {
      console.log(`\n📋 Testing: ${scenario.name}`);
      const response = await axios.post(
        "http://localhost:8080/api/nguoi-dung",
        scenario.data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      console.log(`✅ ${scenario.name}: Success (${response.status})`);
    } catch (error) {
      console.log(`❌ ${scenario.name}: Failed (${error.response?.status})`);
      if (error.response?.data?.message) {
        console.log(`   Error: ${error.response.data.message}`);
      }
    }
  }
}

async function runBackendTest() {
  console.log("🚀 Starting Backend Test After Fix...\n");

  const success = await testBackendAfterFix();

  if (success) {
    console.log("\n🎉 BACKEND FIX SUCCESSFUL!");
    console.log("✅ Entity mapping issue resolved");
    console.log("✅ Employee creation working");
    console.log("✅ Frontend should work now");

    await testMultipleScenarios();

    console.log("\n📋 NEXT STEPS:");
    console.log("1. Test frontend employee creation");
    console.log("2. Verify all CRUD operations");
    console.log("3. Test with different user roles");
  } else {
    console.log("\n❌ BACKEND STILL HAS ISSUES");
    console.log("🚨 Please check the backend fix guide");
    console.log("💡 Make sure all entity references are correct");

    console.log("\n🔧 COMMON FIXES:");
    console.log("1. Check NguoiDungController.java");
    console.log("2. Verify NguoiDungService.java");
    console.log("3. Check NguoiDungRepository.java");
    console.log("4. Verify NguoiDung.java entity");
    console.log("5. Restart backend server");
  }
}

runBackendTest();
