// Script test đơn giản cho cập nhật trạng thái
// Chạy script này trong browser console khi đang ở trang Admin

const testSimpleStatus = async () => {
  try {
    console.log("🔍 === SIMPLE STATUS TEST ===");

    // 1. Kiểm tra authentication
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("❌ No token found");
      return;
    }
    console.log("✅ Token found");

    // 2. Test endpoint trực tiếp
    console.log("2. Testing confirm endpoint directly...");

    const response = await fetch(
      "http://localhost:8080/ZMEN/Admin/DonHang/8/confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`Response status: ${response.status}`);
    console.log(
      `Response headers:`,
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Success:", result);
    } else {
      const errorText = await response.text();
      console.log("❌ Error:", errorText);
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Export function
window.testSimpleStatus = testSimpleStatus;

// Auto-run
testSimpleStatus();
