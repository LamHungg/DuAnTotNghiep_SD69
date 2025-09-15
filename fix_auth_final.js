// Script fix authentication cuối cùng
console.log("🔧 Fix authentication cuối cùng...");

const API_URL = "http://localhost:8080/api";

// Fix authentication data
function fixAuthData() {
  console.log("🔧 Fixing authentication data...");

  const userStr = localStorage.getItem("user");
  if (!userStr) {
    console.log("❌ No user data found - need to login again");
    return false;
  }

  try {
    const userData = JSON.parse(userStr);
    let needsUpdate = false;

    // Đảm bảo có token
    if (!userData.token && userData.id) {
      userData.token = `customer-token-${userData.id}`;
      needsUpdate = true;
      console.log("✅ Added missing token");
    }

    // Đảm bảo có phone field
    if (!userData.phone && userData.soDienThoai) {
      userData.phone = userData.soDienThoai;
      needsUpdate = true;
      console.log("✅ Added missing phone field");
    }

    // Đảm bảo có role
    if (!userData.role) {
      userData.role = "CUSTOMER";
      needsUpdate = true;
      console.log("✅ Added missing role");
    }

    if (needsUpdate) {
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("✅ Updated user data in localStorage");
    }

    // Đảm bảo isLoggedIn
    if (!localStorage.getItem("isLoggedIn")) {
      localStorage.setItem("isLoggedIn", "true");
      console.log("✅ Added missing isLoggedIn");
    }

    console.log("✅ Authentication data fixed");
    return true;
  } catch (error) {
    console.error("❌ Error fixing authentication:", error);
    return false;
  }
}

// Test authentication với xử lý response empty
async function testAuth() {
  console.log("🔐 Testing authentication...");

  try {
    const response = await fetch(`${API_URL}/auth/check-session`, {
      method: "GET",
      credentials: "include",
    });

    console.log("Auth test response status:", response.status);

    if (response.ok) {
      // Kiểm tra content length
      const contentLength = response.headers.get("content-length");
      if (contentLength === "0" || contentLength === null) {
        console.log("✅ Authentication successful (empty response)");
        return true;
      }

      try {
        const data = await response.json();
        console.log("✅ Authentication successful:", data);
        return true;
      } catch (e) {
        console.log("✅ Authentication successful (non-JSON response)");
        return true;
      }
    } else {
      console.log("❌ Authentication failed");
      return false;
    }
  } catch (error) {
    console.error("❌ Auth test error:", error);
    return false;
  }
}

// Test checkout với JWT
async function testCheckoutWithJWT() {
  console.log("🛒 Testing checkout with JWT...");

  const userStr = localStorage.getItem("user");
  if (!userStr) {
    console.log("❌ No user data found");
    return false;
  }

  try {
    const userData = JSON.parse(userStr);
    const token = userData.token;

    if (!token) {
      console.log("❌ No token found");
      return false;
    }

    console.log("Using token:", token);

    const response = await fetch(`${API_URL}/checkout/test`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    console.log("Checkout test response status:", response.status);

    if (response.ok) {
      try {
        const data = await response.json();
        console.log("✅ Checkout test successful:", data);
        return true;
      } catch (e) {
        console.log("✅ Checkout test successful (non-JSON response)");
        return true;
      }
    } else {
      try {
        const errorData = await response.json();
        console.log("❌ Checkout test failed:", errorData);
      } catch (e) {
        console.log("❌ Checkout test failed (non-JSON error)");
      }
      return false;
    }
  } catch (error) {
    console.error("❌ Checkout test error:", error);
    return false;
  }
}

// Test checkout process với dữ liệu mẫu
async function testCheckoutProcess() {
  console.log("🛒 Testing checkout process...");

  const userStr = localStorage.getItem("user");
  if (!userStr) {
    console.log("❌ No user data found");
    return false;
  }

  try {
    const userData = JSON.parse(userStr);
    const token = userData.token;

    if (!token) {
      console.log("❌ No token found");
      return false;
    }

    // Dữ liệu checkout mẫu
    const checkoutData = {
      cartItems: [
        {
          chiTietSanPhamId: 5, // Sử dụng ID hợp lệ
          soLuong: 1,
          gia: 100000,
          thanhTien: 100000,
        },
      ],
      diaChiId: 17, // Sử dụng ID địa chỉ hợp lệ
      voucherId: null,
      phuongThucThanhToanId: 1, // Tiền mặt
      ghiChuKhachHang: "Test checkout",
      phiVanChuyen: 30000,
      tongTienHang: 100000,
      tongThanhToan: 130000,
    };

    console.log("Test checkout data:", checkoutData);

    const response = await fetch(`${API_URL}/checkout/test-process`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(checkoutData),
    });

    console.log("Checkout process response status:", response.status);

    if (response.ok) {
      try {
        const data = await response.json();
        console.log("✅ Checkout process test successful:", data);
        return true;
      } catch (e) {
        console.log("✅ Checkout process test successful (non-JSON response)");
        return true;
      }
    } else {
      try {
        const errorData = await response.json();
        console.log("❌ Checkout process test failed:", errorData);
      } catch (e) {
        console.log("❌ Checkout process test failed (non-JSON error)");
      }
      return false;
    }
  } catch (error) {
    console.error("❌ Checkout process test error:", error);
    return false;
  }
}

// Test session authentication
async function testSessionAuth() {
  console.log("🔐 Testing session authentication...");

  try {
    const response = await fetch(`${API_URL}/checkout/test`, {
      method: "GET",
      credentials: "include",
    });

    console.log("Session auth response status:", response.status);

    if (response.ok) {
      try {
        const data = await response.json();
        console.log("✅ Session auth successful:", data);
        return true;
      } catch (e) {
        console.log("✅ Session auth successful (non-JSON response)");
        return true;
      }
    } else {
      try {
        const errorData = await response.json();
        console.log("❌ Session auth failed:", errorData);
      } catch (e) {
        console.log("❌ Session auth failed (non-JSON error)");
      }
      return false;
    }
  } catch (error) {
    console.error("❌ Session auth error:", error);
    return false;
  }
}

// Run all tests
async function runFixAndTest() {
  console.log("🚀 Running fix and test...");

  // Fix authentication data
  const authFixed = fixAuthData();
  if (!authFixed) {
    console.log("❌ Failed to fix authentication data");
    return;
  }

  // Test authentication
  const authSuccess = await testAuth();
  if (!authSuccess) {
    console.log("❌ Authentication test failed");
    return;
  }

  // Test session authentication
  const sessionSuccess = await testSessionAuth();
  if (!sessionSuccess) {
    console.log("❌ Session authentication failed");
    return;
  }

  // Test checkout with JWT
  const checkoutSuccess = await testCheckoutWithJWT();
  if (!checkoutSuccess) {
    console.log("❌ Checkout test failed");
    return;
  }

  // Test checkout process
  const processSuccess = await testCheckoutProcess();
  if (!processSuccess) {
    console.log("❌ Checkout process test failed");
    return;
  }

  console.log("✅ All tests passed! Checkout should work now.");
}

// Auto-run
runFixAndTest();

// Export functions
window.fixAuthFinal = {
  fixAuthData,
  testAuth,
  testCheckoutWithJWT,
  testCheckoutProcess,
  testSessionAuth,
  runFixAndTest,
};
