// Script debug toàn bộ luồng từ đăng nhập đến checkout
console.log("🔍 Debug Login to Checkout Flow");

// Hàm kiểm tra localStorage
function checkLocalStorage() {
  console.log("=== Kiểm tra localStorage ===");

  const user = localStorage.getItem("user");
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  console.log("📋 localStorage.user:", user);
  console.log("📋 localStorage.isLoggedIn:", isLoggedIn);

  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log("👤 User data:", userData);
      console.log("🆔 User ID:", userData.id);
      console.log("📧 User email:", userData.email);
      console.log("🔑 Token:", userData.token);
      console.log("👤 Họ tên:", userData.hoTen);
    } catch (e) {
      console.error("❌ Error parsing user data:", e);
    }
  }

  const isAuthenticated = !!(user && isLoggedIn === "true");
  console.log("✅ Is authenticated:", isAuthenticated);

  return { user, isLoggedIn, isAuthenticated };
}

// Hàm test đăng nhập
async function testLogin() {
  console.log("\n=== Test Login ===");

  try {
    const loginData = {
      email: "test@example.com", // Thay bằng email thực tế
      matKhau: "password123", // Thay bằng password thực tế
    };

    console.log("🔐 Attempting login with:", {
      email: loginData.email,
      password: "***",
    });

    const response = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(loginData),
    });

    console.log("📡 Login response status:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Login successful:", result);

      // Kiểm tra localStorage sau khi đăng nhập
      console.log("\n📋 Checking localStorage after login...");
      checkLocalStorage();

      return result;
    } else {
      const error = await response.text();
      console.error("❌ Login failed:", error);
      return null;
    }
  } catch (error) {
    console.error("❌ Error during login:", error);
    return null;
  }
}

// Hàm kiểm tra session
async function checkSession() {
  console.log("\n=== Kiểm tra Session ===");

  try {
    const response = await fetch(
      "http://localhost:8080/api/auth/check-session",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    console.log("📡 Check-session status:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Session valid:", result);
      return result;
    } else {
      const error = await response.text();
      console.log("❌ Session invalid:", error);
      return null;
    }
  } catch (error) {
    console.error("❌ Error checking session:", error);
    return null;
  }
}

// Hàm test checkout với session
async function testCheckoutWithSession() {
  console.log("\n=== Test Checkout với Session ===");

  try {
    // Kiểm tra session trước
    const sessionData = await checkSession();
    if (!sessionData) {
      console.error("❌ Session không hợp lệ, không thể checkout");
      return false;
    }

    console.log("✅ Session hợp lệ, tiếp tục checkout...");

    // Dữ liệu checkout test
    const checkoutData = {
      cartItems: [
        {
          chiTietSanPhamId: 1,
          soLuong: 1,
          gia: 100000,
          thanhTien: 100000,
        },
      ],
      diaChiId: 1,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test checkout với session validation",
      phiVanChuyen: 30000,
      tongTienHang: 100000,
      tongThanhToan: 130000,
    };

    console.log("📋 Checkout data:", checkoutData);

    const response = await fetch("http://localhost:8080/api/checkout/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(checkoutData),
    });

    console.log("📡 Checkout response status:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Checkout successful:", result);
      return true;
    } else {
      const error = await response.text();
      console.error("❌ Checkout failed:", error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error during checkout:", error);
    return false;
  }
}

// Hàm test checkout test-process endpoint
async function testCheckoutTestProcess() {
  console.log("\n=== Test Checkout Test-Process Endpoint ===");

  try {
    const checkoutData = {
      cartItems: [
        {
          chiTietSanPhamId: 1,
          soLuong: 1,
          gia: 100000,
          thanhTien: 100000,
        },
      ],
      diaChiId: 1,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test checkout test-process endpoint",
      phiVanChuyen: 30000,
      tongTienHang: 100000,
      tongThanhToan: 130000,
    };

    console.log("📋 Test-process data:", checkoutData);

    const response = await fetch(
      "http://localhost:8080/api/checkout/test-process",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(checkoutData),
      }
    );

    console.log("📡 Test-process response status:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Test-process successful:", result);
      return true;
    } else {
      const error = await response.text();
      console.error("❌ Test-process failed:", error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error during test-process:", error);
    return false;
  }
}

// Hàm kiểm tra session trong backend
async function checkBackendSession() {
  console.log("\n=== Kiểm tra Session trong Backend ===");

  try {
    // Test endpoint đơn giản
    const testResponse = await fetch(
      "http://localhost:8080/api/checkout/test",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    console.log("📡 Test endpoint status:", testResponse.status);

    if (testResponse.ok) {
      const result = await testResponse.text();
      console.log("✅ Test endpoint result:", result);
      return true;
    } else {
      const error = await testResponse.text();
      console.log("❌ Test endpoint error:", error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error checking backend session:", error);
    return false;
  }
}

// Hàm force update token
function forceUpdateToken() {
  console.log("\n=== Force Update Token ===");

  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      if (userData.id) {
        // Force update token
        userData.token = `customer-token-${userData.id}`;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");

        console.log("🔧 Force updated token:", userData.token);
        console.log("👤 User ID:", userData.id);
        console.log("✅ isLoggedIn: true");

        return true;
      }
    } catch (e) {
      console.error("❌ Error updating token:", e);
    }
  }

  console.log("❌ No user data found for force update");
  return false;
}

// Hàm test toàn bộ luồng
async function testCompleteFlow() {
  console.log("🚀 Testing Complete Login to Checkout Flow...\n");

  try {
    // 1. Kiểm tra localStorage hiện tại
    console.log("=== Step 1: Check Current localStorage ===");
    const localStorageStatus = checkLocalStorage();

    // 2. Force update token nếu cần
    if (!localStorageStatus.isAuthenticated) {
      console.log("\n=== Step 2: Force Update Token ===");
      forceUpdateToken();
      checkLocalStorage();
    }

    // 3. Kiểm tra session
    console.log("\n=== Step 3: Check Session ===");
    const sessionData = await checkSession();

    // 4. Kiểm tra backend session
    console.log("\n=== Step 4: Check Backend Session ===");
    const backendSessionOk = await checkBackendSession();

    // 5. Test checkout với session
    console.log("\n=== Step 5: Test Checkout with Session ===");
    const checkoutOk = await testCheckoutWithSession();

    // 6. Test checkout test-process endpoint
    console.log("\n=== Step 6: Test Checkout Test-Process ===");
    const testProcessOk = await testCheckoutTestProcess();

    // Tổng kết
    console.log("\n=== Tổng kết ===");
    console.log(
      "✅ localStorage:",
      localStorageStatus.isAuthenticated ? "OK" : "FAILED"
    );
    console.log("✅ Session:", sessionData ? "OK" : "FAILED");
    console.log("✅ Backend Session:", backendSessionOk ? "OK" : "FAILED");
    console.log("✅ Checkout:", checkoutOk ? "OK" : "FAILED");
    console.log("✅ Test-Process:", testProcessOk ? "OK" : "FAILED");

    const allOk =
      localStorageStatus.isAuthenticated &&
      sessionData &&
      backendSessionOk &&
      checkoutOk &&
      testProcessOk;

    if (allOk) {
      console.log(
        "🎉 Tất cả đều thành công! Luồng login đến checkout hoạt động tốt"
      );
    } else {
      console.log("⚠️ Có vấn đề trong luồng login đến checkout");
    }

    return allOk;
  } catch (error) {
    console.error("❌ Error in complete flow:", error);
    return false;
  }
}

// Hàm debug session chi tiết
async function debugSessionDetails() {
  console.log("\n=== Debug Session Details ===");

  try {
    // Kiểm tra session với JWT token
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const userData = JSON.parse(userStr);
      if (userData.token) {
        console.log("🔑 Using JWT token:", userData.token);

        const jwtResponse = await fetch(
          "http://localhost:8080/api/auth/check-session",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${userData.token}`,
            },
            credentials: "include",
          }
        );

        console.log("📡 JWT session check status:", jwtResponse.status);

        if (jwtResponse.ok) {
          const result = await jwtResponse.json();
          console.log("✅ JWT session valid:", result);
        } else {
          const error = await jwtResponse.text();
          console.log("❌ JWT session invalid:", error);
        }
      }
    }

    // Kiểm tra session thông thường
    console.log("\n🌐 Checking regular session...");
    const regularResponse = await fetch(
      "http://localhost:8080/api/auth/check-session",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    console.log("📡 Regular session check status:", regularResponse.status);

    if (regularResponse.ok) {
      const result = await regularResponse.json();
      console.log("✅ Regular session valid:", result);
    } else {
      const error = await regularResponse.text();
      console.log("❌ Regular session invalid:", error);
    }
  } catch (error) {
    console.error("❌ Error debugging session details:", error);
  }
}

// Export functions để sử dụng trong console
window.loginCheckoutDebug = {
  checkLocalStorage,
  testLogin,
  checkSession,
  testCheckoutWithSession,
  testCheckoutTestProcess,
  checkBackendSession,
  forceUpdateToken,
  testCompleteFlow,
  debugSessionDetails,
};

console.log(
  "💡 Sử dụng loginCheckoutDebug.testCompleteFlow() để test toàn bộ luồng"
);
console.log(
  "💡 Sử dụng loginCheckoutDebug.debugSessionDetails() để debug session chi tiết"
);
console.log(
  "💡 Sử dụng loginCheckoutDebug.forceUpdateToken() để force update token"
);

// Auto-run test
console.log("\n🚀 Tự động test luồng login đến checkout...");
testCompleteFlow();
