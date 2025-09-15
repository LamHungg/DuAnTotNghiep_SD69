// Script để test API endpoint trực tiếp
// Chạy script này trong browser console hoặc Node.js

const testAPI = async () => {
  try {
    console.log("Testing API endpoints...");

    // Test 1: Lấy tất cả chi tiết sản phẩm
    console.log("1. Testing GET /api/chi-tiet-san-pham");
    const response1 = await fetch(
      "http://localhost:8080/api/chi-tiet-san-pham"
    );
    console.log("Response 1 status:", response1.status);
    if (response1.ok) {
      const data1 = await response1.json();
      console.log("Response 1 data length:", data1.length);
      console.log("First item:", data1[0]);
    }

    // Test 2: Lấy chi tiết sản phẩm theo ID 27
    console.log("2. Testing GET /api/chi-tiet-san-pham/27");
    const response2 = await fetch(
      "http://localhost:8080/api/chi-tiet-san-pham/27"
    );
    console.log("Response 2 status:", response2.status);
    if (response2.ok) {
      const data2 = await response2.json();
      console.log("Response 2 data:", data2);
    } else {
      const error2 = await response2.text();
      console.log("Response 2 error:", error2);
    }

    // Test 3: Lấy sản phẩm theo ID 25
    console.log("3. Testing GET /api/san-pham/25");
    const response3 = await fetch("http://localhost:8080/api/san-pham/25");
    console.log("Response 3 status:", response3.status);
    if (response3.ok) {
      const data3 = await response3.json();
      console.log("Response 3 data:", data3);
    }
  } catch (error) {
    console.error("Error testing API:", error);
  }
};

// Chạy test
testAPI();
