// Script để test endpoint với debug mapper
// Chạy script này trong browser console sau khi backend restart

const testDebugMapper = async () => {
  try {
    console.log("Testing endpoint with debug mapper...");

    // Test 1: Lấy chi tiết sản phẩm ID 27
    console.log("1. Testing GET /api/chi-tiet-san-pham/27");
    const response = await fetch(
      "http://localhost:8080/api/chi-tiet-san-pham/27"
    );
    console.log("Response status:", response.status);

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Success - Data:", data);
    } else {
      const error = await response.text();
      console.log("❌ Error:", error);
    }

    // Test 2: Lấy chi tiết sản phẩm ID 1 (để so sánh)
    console.log("2. Testing GET /api/chi-tiet-san-pham/1");
    const response2 = await fetch(
      "http://localhost:8080/api/chi-tiet-san-pham/1"
    );
    console.log("Response 2 status:", response2.status);

    if (response2.ok) {
      const data2 = await response2.json();
      console.log("✅ Success - Data 2:", data2);
    } else {
      const error2 = await response2.text();
      console.log("❌ Error 2:", error2);
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Chạy test
testDebugMapper();
