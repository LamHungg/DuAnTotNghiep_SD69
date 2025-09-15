// Script kiểm tra backend status
// Chạy script này trong browser console

const checkBackendStatus = async () => {
  try {
    console.log("🔍 === CHECKING BACKEND STATUS ===");

    // 1. Test basic connectivity
    console.log("1. Testing basic connectivity...");

    const response = await fetch("http://localhost:8080/actuator/health", {
      method: "GET",
    });

    console.log(`Backend status: ${response.status}`);

    if (response.ok) {
      console.log("✅ Backend is running!");
    } else {
      console.log("❌ Backend not responding");
      return;
    }

    // 2. Test Admin endpoint
    console.log("2. Testing Admin endpoint...");

    const adminResponse = await fetch(
      "http://localhost:8080/ZMEN/Admin/DonHang",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`Admin endpoint status: ${adminResponse.status}`);

    if (adminResponse.status === 401) {
      console.log("✅ Admin endpoint exists (requires authentication)");
    } else if (adminResponse.ok) {
      console.log("✅ Admin endpoint accessible");
    } else {
      console.log("❌ Admin endpoint issue");
    }

    // 3. Check authentication
    console.log("3. Checking authentication...");

    const token = localStorage.getItem("token");
    if (token) {
      console.log("✅ Token found in localStorage");
      console.log("Token preview:", token.substring(0, 20) + "...");
    } else {
      console.log("❌ No token found - please login first");
      console.log("💡 Go to http://localhost:3001 and login as admin");
    }

    console.log("🔍 === BACKEND STATUS CHECK COMPLETED ===");
  } catch (error) {
    console.error("❌ Error checking backend:", error);
  }
};

// Export function
window.checkBackendStatus = checkBackendStatus;

// Auto-run
checkBackendStatus();
