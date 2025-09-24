// Script test để xác định lỗi 400 Bad Request khi thêm nhân viên
const axios = require("axios");

async function testEmployeeCreationWithExactData() {
  console.log(
    "🔍 Testing Employee Creation with Exact Data from Frontend...\n"
  );

  // Dữ liệu chính xác từ frontend
  const exactData = {
    hoTen: "àksdfn",
    tenDangNhap: "long123",
    matKhau: "123456",
    email: "sdgkjas@gmail.com",
    soDienThoai: "0976895554",
    chucVu: "NHANVIEN",
    trangThai: true,
  };

  console.log(
    "📋 Exact Data from Frontend:",
    JSON.stringify(exactData, null, 2)
  );

  try {
    const response = await axios.post(
      "http://localhost:8080/api/nguoi-dung",
      exactData,
      {
        headers: {
          "Content-Type": "application/json",
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
      console.log("\n🔍 DETAILED ERROR ANALYSIS:");
      console.log("Error message:", errorMessage);

      if (errorMessage.includes("KhachHang")) {
        console.log("\n🚨 CONFIRMED: Backend Entity Issue");
        console.log("Backend is using 'KhachHang' instead of 'NguoiDung'");
      }

      if (errorMessage.includes("Chức vụ")) {
        console.log("\n🚨 VALIDATION ERROR: Missing chucVu");
      }

      if (errorMessage.includes("Email")) {
        console.log("\n🚨 VALIDATION ERROR: Email issue");
      }

      if (errorMessage.includes("Tên đăng nhập")) {
        console.log("\n🚨 VALIDATION ERROR: Username issue");
      }
    }

    return false;
  }
}

async function testWithValidatedData() {
  console.log("\n🔍 Testing with Validated Data...");

  const validatedData = {
    hoTen: "Nguyễn Văn Test",
    tenDangNhap: `testuser${Date.now()}`,
    matKhau: "123456",
    email: `test${Date.now()}@example.com`,
    soDienThoai: "0123456789",
    chucVu: "NHANVIEN",
    trangThai: true,
  };

  console.log("📋 Validated Data:", JSON.stringify(validatedData, null, 2));

  try {
    const response = await axios.post(
      "http://localhost:8080/api/nguoi-dung",
      validatedData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log("✅ Validated data creation successful:", response.status);
    return true;
  } catch (error) {
    console.log("❌ Validated data creation failed:", error.response?.status);
    console.log("📊 Error:", error.response?.data?.message);
    return false;
  }
}

async function testWithMinimalData() {
  console.log("\n🔍 Testing with Minimal Required Data...");

  const minimalData = {
    hoTen: "Test User",
    tenDangNhap: `test${Date.now()}`,
    matKhau: "123456",
    email: `test${Date.now()}@test.com`,
    soDienThoai: "0123456789",
  };

  console.log("📋 Minimal Data:", JSON.stringify(minimalData, null, 2));

  try {
    const response = await axios.post(
      "http://localhost:8080/api/nguoi-dung",
      minimalData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    console.log("✅ Minimal data creation successful:", response.status);
    return true;
  } catch (error) {
    console.log("❌ Minimal data creation failed:", error.response?.status);
    console.log("📊 Error:", error.response?.data?.message);
    return false;
  }
}

async function run400ErrorTest() {
  console.log("🚀 Starting 400 Error Analysis...\n");

  const exactResult = await testEmployeeCreationWithExactData();
  const validatedResult = await testWithValidatedData();
  const minimalResult = await testWithMinimalData();

  console.log("\n📋 TEST RESULTS SUMMARY:");
  console.log(
    `- Exact frontend data: ${exactResult ? "✅ Success" : "❌ Failed"}`
  );
  console.log(
    `- Validated data: ${validatedResult ? "✅ Success" : "❌ Failed"}`
  );
  console.log(`- Minimal data: ${minimalResult ? "✅ Success" : "❌ Failed"}`);

  console.log("\n🔍 ANALYSIS:");
  if (!exactResult && !validatedResult && !minimalResult) {
    console.log("🚨 ALL TESTS FAILED - Backend entity issue confirmed");
    console.log("💡 Backend is using wrong entity (KhachHang vs NguoiDung)");
  } else if (!exactResult && validatedResult) {
    console.log("🚨 Frontend data validation issue");
    console.log("💡 Check frontend form validation");
  } else if (exactResult) {
    console.log("✅ Frontend data is correct");
    console.log("💡 Issue might be authentication or session");
  }

  console.log("\n🔧 RECOMMENDED ACTIONS:");
  console.log("1. Check backend entity mapping");
  console.log("2. Verify authentication/session");
  console.log("3. Check database table structure");
  console.log("4. Verify controller implementation");
}

run400ErrorTest();
