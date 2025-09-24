// Script test session debugging
const axios = require("axios");

async function testSessionDebug() {
  console.log("🔍 Testing Session Debug...\n");

  // Tạo axios instance với cookie jar
  const axiosInstance = axios.create({
    withCredentials: true,
    timeout: 10000,
  });

  try {
    // Step 1: Login
    console.log("🔐 Step 1: Logging in...");
    const loginResponse = await axiosInstance.post(
      "http://localhost:8080/api/auth/login",
      {
        email: "admin@example.com",
        matKhau: "123456",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Login successful!");
    console.log(
      "📊 User:",
      loginResponse.data.hoTen,
      `(${loginResponse.data.chucVu})`
    );
    console.log("📊 Session cookies:", loginResponse.headers["set-cookie"]);

    // Step 2: Check session
    console.log("\n🔍 Step 2: Checking session...");
    try {
      const sessionResponse = await axiosInstance.get(
        "http://localhost:8080/api/auth/check-session"
      );
      console.log("✅ Session check successful:", sessionResponse.status);
      console.log(
        "📊 Session data:",
        JSON.stringify(sessionResponse.data, null, 2)
      );
    } catch (error) {
      console.log("❌ Session check failed:", error.response?.status);
      console.log("📊 Error:", error.response?.data);
    }

    // Step 3: Test employee creation
    console.log("\n🔍 Step 3: Testing employee creation...");

    const employeeData = {
      hoTen: "Nguyễn Văn Session Test",
      tenDangNhap: `sessiontest${Date.now()}`,
      matKhau: "123456",
      email: `sessiontest${Date.now()}@example.com`,
      soDienThoai: "0123456789",
      chucVu: "NHANVIEN",
      trangThai: true,
    };

    try {
      const employeeResponse = await axiosInstance.post(
        "http://localhost:8080/api/nguoi-dung",
        employeeData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Employee creation successful:", employeeResponse.status);
      console.log(
        "📊 Response:",
        JSON.stringify(employeeResponse.data, null, 2)
      );
    } catch (error) {
      console.log("❌ Employee creation failed:", error.response?.status);
      console.log("📊 Error:", error.response?.data);
    }
  } catch (error) {
    console.log("❌ Login failed:", error.response?.status);
    console.log("📊 Error:", error.response?.data);
  }
}

async function testDifferentApproaches() {
  console.log("\n🔍 Testing Different Approaches...");

  const axiosInstance = axios.create({
    withCredentials: true,
  });

  // Approach 1: Login and immediate test
  try {
    console.log("\n📋 Approach 1: Login and immediate test");

    // Login
    await axiosInstance.post(
      "http://localhost:8080/api/auth/login",
      {
        email: "admin@example.com",
        matKhau: "123456",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Immediate test
    const response = await axiosInstance.post(
      "http://localhost:8080/api/nguoi-dung",
      {
        hoTen: "Test User",
        tenDangNhap: `test${Date.now()}`,
        matKhau: "123456",
        email: `test${Date.now()}@example.com`,
        soDienThoai: "0123456789",
        chucVu: "NHANVIEN",
        trangThai: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Approach 1: Success");
  } catch (error) {
    console.log("❌ Approach 1: Failed -", error.response?.status);
  }

  // Approach 2: With delay
  try {
    console.log("\n📋 Approach 2: Login with delay");

    // Login
    await axiosInstance.post(
      "http://localhost:8080/api/auth/login",
      {
        email: "admin@example.com",
        matKhau: "123456",
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Wait a bit
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Test
    const response = await axiosInstance.post(
      "http://localhost:8080/api/nguoi-dung",
      {
        hoTen: "Test User 2",
        tenDangNhap: `test2${Date.now()}`,
        matKhau: "123456",
        email: `test2${Date.now()}@example.com`,
        soDienThoai: "0123456789",
        chucVu: "NHANVIEN",
        trangThai: true,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Approach 2: Success");
  } catch (error) {
    console.log("❌ Approach 2: Failed -", error.response?.status);
  }
}

async function runSessionDebug() {
  console.log("🚀 Starting Session Debug Test...\n");

  await testSessionDebug();
  await testDifferentApproaches();

  console.log("\n📋 SUMMARY:");
  console.log("If all approaches fail with 401:");
  console.log("1. Backend server needs restart");
  console.log("2. Session configuration issue");
  console.log("3. CORS or cookie issue");
  console.log("4. Database connection issue");

  console.log("\n🔧 NEXT STEPS:");
  console.log("1. Restart backend server");
  console.log("2. Check backend logs for debug messages");
  console.log("3. Verify session configuration");
  console.log("4. Test with Postman or curl");
}

runSessionDebug();
