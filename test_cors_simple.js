// Script test CORS đơn giản và chính xác
// Chạy script này trong browser console sau khi backend restart

const testCorsSimple = async () => {
  try {
    console.log("=== TESTING CORS SIMPLE ===");

    // Test 1: Kiểm tra backend có hoạt động không
    console.log("1. Testing backend connection...");
    const healthResponse = await fetch("http://localhost:8080/api/nguoi-dung", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Backend status:", healthResponse.status);
    console.log("All response headers:");
    for (let [key, value] of healthResponse.headers.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Test 2: Test API voucher
    console.log("\n2. Testing voucher API...");
    const voucherResponse = await fetch("http://localhost:8080/api/voucher", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Voucher API status:", voucherResponse.status);
    console.log("Voucher response headers:");
    for (let [key, value] of voucherResponse.headers.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Test 3: Test OPTIONS preflight request
    console.log("\n3. Testing OPTIONS preflight...");
    const optionsResponse = await fetch("http://localhost:8080/api/voucher", {
      method: "OPTIONS",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });
    console.log("OPTIONS status:", optionsResponse.status);
    console.log("OPTIONS response headers:");
    for (let [key, value] of optionsResponse.headers.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Test 4: Test POST request (như khi thêm voucher)
    console.log("\n4. Testing POST request...");
    const postData = {
      maVoucher: "TEST001",
      tenVoucher: "Test Voucher",
      loaiGiamGia: "GIA_TIEN",
      giaTriGiam: 10000,
      trangThai: 1,
    };

    const postResponse = await fetch("http://localhost:8080/api/voucher", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData),
    });
    console.log("POST status:", postResponse.status);
    console.log("POST response headers:");
    for (let [key, value] of postResponse.headers.entries()) {
      console.log(`${key}: ${value}`);
    }

    console.log("\n=== CORS TEST COMPLETED ===");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testCorsSimple();
