// Script debug authentication trong checkout
console.log("🔍 Debug authentication trong checkout...");

const API_URL = "http://localhost:8080/api";

// Kiểm tra localStorage
function checkLocalStorage() {
  console.log("📦 Kiểm tra localStorage:");

  const userStr = localStorage.getItem("user");
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const token = localStorage.getItem("customer-token");

  console.log("- user:", userStr ? "✅ Có" : "❌ Không có");
  console.log("- isLoggedIn:", isLoggedIn);
  console.log("- customer-token:", token ? "✅ Có" : "❌ Không có");

  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      console.log("- User data:", userData);
      console.log("- User token:", userData.token ? "✅ Có" : "❌ Không có");
      console.log("- User ID:", userData.id);
    } catch (e) {
      console.error("❌ Error parsing user data:", e);
    }
  }
}

// Test session endpoint
async function testSession() {
  console.log("🔐 Testing session...");

  try {
    const response = await fetch(`${API_URL}/auth/check-session`, {
      method: "GET",
      credentials: "include",
    });

    console.log("Session response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Session valid:", data);
    } else {
      console.log("❌ Session invalid");
    }
  } catch (error) {
    console.error("❌ Session test error:", error);
  }
}

// Test checkout test endpoint
async function testCheckoutEndpoint() {
  console.log("🛒 Testing checkout endpoint...");

  try {
    const response = await fetch(`${API_URL}/checkout/test`, {
      method: "GET",
      credentials: "include",
    });

    console.log("Checkout test response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Checkout test success:", data);
    } else {
      const errorData = await response.json();
      console.log("❌ Checkout test failed:", errorData);
    }
  } catch (error) {
    console.error("❌ Checkout test error:", error);
  }
}

// Test với JWT token
async function testWithJWT() {
  console.log("🔑 Testing with JWT token...");

  const userStr = localStorage.getItem("user");
  if (!userStr) {
    console.log("❌ No user data found");
    return;
  }

  try {
    const userData = JSON.parse(userStr);
    const token = userData.token;

    if (!token) {
      console.log("❌ No token found in user data");
      return;
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

    console.log("JWT test response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ JWT test success:", data);
    } else {
      const errorData = await response.json();
      console.log("❌ JWT test failed:", errorData);
    }
  } catch (error) {
    console.error("❌ JWT test error:", error);
  }
}

// Test login status
async function testLoginStatus() {
  console.log("👤 Testing login status...");

  try {
    const response = await fetch(`${API_URL}/auth/check-session`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Login status response:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ User is logged in:", data);
    } else {
      console.log("❌ User is not logged in");
    }
  } catch (error) {
    console.error("❌ Login status error:", error);
  }
}

// Fix authentication issues
function fixAuthentication() {
  console.log("🔧 Attempting to fix authentication...");

  const userStr = localStorage.getItem("user");
  if (!userStr) {
    console.log("❌ No user data found - need to login again");
    return false;
  }

  try {
    const userData = JSON.parse(userStr);

    // Đảm bảo có token
    if (!userData.token && userData.id) {
      userData.token = `customer-token-${userData.id}`;
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("✅ Fixed missing token");
    }

    // Đảm bảo isLoggedIn
    if (!localStorage.getItem("isLoggedIn")) {
      localStorage.setItem("isLoggedIn", "true");
      console.log("✅ Fixed missing isLoggedIn");
    }

    console.log("✅ Authentication data fixed");
    return true;
  } catch (error) {
    console.error("❌ Error fixing authentication:", error);
    return false;
  }
}

// Run all tests
async function runAuthDebug() {
  console.log("🚀 Running authentication debug...");

  checkLocalStorage();
  await testSession();
  await testLoginStatus();
  await testCheckoutEndpoint();
  await testWithJWT();

  console.log("🔧 Attempting to fix issues...");
  fixAuthentication();

  console.log("✅ Authentication debug completed");
}

// Auto-run
runAuthDebug();

// Export functions
window.authDebug = {
  checkLocalStorage,
  testSession,
  testCheckoutEndpoint,
  testWithJWT,
  testLoginStatus,
  fixAuthentication,
  runAuthDebug,
};
