// Script debug trạng thái đăng nhập và session
console.log("🔍 Debug Session Status");

// Hàm kiểm tra trạng thái đăng nhập
function checkLoginStatus() {
  console.log("=== Kiểm tra trạng thái đăng nhập ===");

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
    } catch (e) {
      console.error("❌ Error parsing user data:", e);
    }
  }

  const isAuthenticated = !!(user && isLoggedIn === "true");
  console.log("✅ Is authenticated:", isAuthenticated);

  return isAuthenticated;
}

// Hàm kiểm tra session từ backend
async function checkBackendSession() {
  console.log("\n=== Kiểm tra session từ backend ===");

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
      const result = await testResponse.json();
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

// Hàm kiểm tra session với thông tin chi tiết
async function checkDetailedSession() {
  console.log("\n=== Kiểm tra session chi tiết ===");

  try {
    // Test endpoint với thông tin session
    const response = await fetch(
      "http://localhost:8080/api/checkout/test-process",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cartItems: [],
          diaChiId: 1,
          phuongThucThanhToanId: 1,
          ghiChuKhachHang: "Test session",
          phiVanChuyen: 0,
          tongTienHang: 0,
          tongThanhToan: 0,
        }),
      }
    );

    console.log("📡 Test-process status:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Test-process result:", result);
      return true;
    } else {
      const error = await response.text();
      console.log("❌ Test-process error:", error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error checking detailed session:", error);
    return false;
  }
}

// Hàm kiểm tra session từ AuthController
async function checkAuthSession() {
  console.log("\n=== Kiểm tra session từ AuthController ===");

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

    console.log("📡 Auth check-session status:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Auth session result:", result);
      return true;
    } else {
      const error = await response.text();
      console.log("❌ Auth session error:", error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error checking auth session:", error);
    return false;
  }
}

// Hàm kiểm tra toàn bộ
async function checkCompleteSessionStatus() {
  console.log("🚀 Bắt đầu kiểm tra toàn bộ trạng thái session...\n");

  // 1. Kiểm tra localStorage
  const isLoggedIn = checkLoginStatus();

  if (!isLoggedIn) {
    console.log("❌ User chưa đăng nhập!");
    console.log("💡 Hãy đăng nhập trước khi test checkout");
    return false;
  }

  // 2. Kiểm tra session backend
  const backendSessionOk = await checkBackendSession();

  // 3. Kiểm tra session chi tiết
  const detailedSessionOk = await checkDetailedSession();

  // 4. Kiểm tra auth session
  const authSessionOk = await checkAuthSession();

  console.log("\n=== Tổng kết ===");
  console.log("✅ Login status:", isLoggedIn);
  console.log("✅ Backend session:", backendSessionOk);
  console.log("✅ Detailed session:", detailedSessionOk);
  console.log("✅ Auth session:", authSessionOk);

  const allOk =
    isLoggedIn && backendSessionOk && detailedSessionOk && authSessionOk;

  if (allOk) {
    console.log("🎉 Tất cả đều OK! Có thể thực hiện checkout");
  } else {
    console.log("⚠️ Có vấn đề với session. Cần kiểm tra lại");
  }

  return allOk;
}

// Hàm force login (nếu cần)
function forceLogin() {
  console.log("\n=== Force Login ===");

  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      if (userData.id) {
        // Force update token
        userData.token = `customer-token-${userData.id}`;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");

        console.log("🔧 Force updated login status");
        console.log("👤 User ID:", userData.id);
        console.log("🔑 Token:", userData.token);

        return true;
      }
    } catch (e) {
      console.error("❌ Error in force login:", e);
    }
  }

  console.log("❌ No user data found for force login");
  return false;
}

// Export functions để sử dụng trong console
window.sessionDebug = {
  checkLoginStatus,
  checkBackendSession,
  checkDetailedSession,
  checkAuthSession,
  checkCompleteSessionStatus,
  forceLogin,
};

console.log(
  "💡 Sử dụng sessionDebug.checkCompleteSessionStatus() để kiểm tra toàn bộ"
);
console.log("💡 Sử dụng sessionDebug.forceLogin() để force login nếu cần");

// Auto-run check
console.log("\n🚀 Tự động kiểm tra session status...");
checkCompleteSessionStatus();
