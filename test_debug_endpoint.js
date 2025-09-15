// Script để test endpoint với debug
// Chạy script này trong browser console sau khi backend restart

const testDebugEndpoint = async () => {
  try {
    console.log("Testing endpoint with debug...");

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

    // Test 2: Lấy tất cả để so sánh
    console.log("2. Testing GET /api/chi-tiet-san-pham");
    const response2 = await fetch(
      "http://localhost:8080/api/chi-tiet-san-pham"
    );
    const data2 = await response2.json();
    const item27 = data2.find((item) => item.id === 27);
    console.log("Item 27 from getAll:", item27);
  } catch (error) {
    console.error("Error:", error);
  }
};

// Chạy test
testDebugEndpoint();
