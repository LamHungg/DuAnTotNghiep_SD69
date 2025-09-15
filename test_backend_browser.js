// Script test backend có thể chạy trong browser console
// Copy và paste vào Console của browser

const testBackend = async () => {
  console.log("🔍 Kiểm tra Backend...\n");

  try {
    // Test 1: Endpoint cơ bản
    console.log("1️⃣ Test endpoint cơ bản:");
    const testResponse = await fetch("http://localhost:8080/zmen/test");
    console.log("✅ Backend đang chạy:", await testResponse.text());

    // Test 2: Endpoint test đơn giản
    console.log("\n2️⃣ Test endpoint đơn giản:");
    const simpleResponse = await fetch(
      "http://localhost:8080/zmen/test-simple"
    );
    const simpleData = await simpleResponse.json();
    console.log("✅ Endpoint test-simple:", simpleData);

    // Test 3: Endpoint tổng quan
    console.log("\n3️⃣ Test endpoint tổng quan:");
    const tongQuanResponse = await fetch(
      "http://localhost:8080/zmen/tong-quan"
    );
    if (tongQuanResponse.ok) {
      const tongQuanData = await tongQuanResponse.json();
      console.log("✅ Endpoint /tong-quan hoạt động:", tongQuanData);
    } else {
      const errorText = await tongQuanResponse.text();
      console.log("❌ Lỗi /tong-quan:", tongQuanResponse.status, errorText);
    }
  } catch (error) {
    console.log("❌ Backend không chạy:", error.message);
  }
};

// Chạy test
testBackend();
