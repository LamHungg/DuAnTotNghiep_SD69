// Script test đơn giản cho confirm endpoint
// Chạy script này trong browser console

const testSimpleConfirm = async () => {
  try {
    console.log("🔍 === TESTING SIMPLE CONFIRM ===");

    // 1. Login trước
    console.log("1. Logging in...");

    const loginResponse = await fetch("http://localhost:8080/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "admin@example.com",
        matKhau: "123456",
      }),
      credentials: "include",
    });

    if (!loginResponse.ok) {
      console.log("❌ Login failed");
      return;
    }

    const loginResult = await loginResponse.json();
    console.log("✅ Login successful");

    // 2. Test confirm endpoint
    console.log("2. Testing confirm endpoint...");

    const confirmResponse = await fetch(
      "http://localhost:8080/ZMEN/Admin/DonHang/8/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${loginResult.token}`,
        },
      }
    );

    console.log(`Confirm status: ${confirmResponse.status}`);
    console.log(
      `Confirm headers:`,
      Object.fromEntries(confirmResponse.headers.entries())
    );

    if (confirmResponse.ok) {
      const confirmResult = await confirmResponse.json();
      console.log("✅ Confirm successful:", confirmResult);
    } else {
      const errorText = await confirmResponse.text();
      console.log("❌ Confirm failed:", errorText);
    }

    console.log("🔍 === SIMPLE CONFIRM TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Export function
window.testSimpleConfirm = testSimpleConfirm;

// Auto-run
testSimpleConfirm();
