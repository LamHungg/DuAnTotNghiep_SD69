// Script test CORS sau khi sửa lỗi
// Chạy script này trong browser console sau khi backend restart

const testCorsFix = async () => {
  try {
    console.log("=== TESTING CORS FIX ===");

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
    console.log(
      "CORS headers:",
      healthResponse.headers.get("Access-Control-Allow-Credentials")
    );

    // Test 2: Test API voucher
    console.log("2. Testing voucher API...");
    const voucherResponse = await fetch("http://localhost:8080/api/voucher", {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("Voucher API status:", voucherResponse.status);

    // Test 3: Test OPTIONS preflight request
    console.log("3. Testing OPTIONS preflight...");
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
    console.log(
      "Allow-Credentials:",
      optionsResponse.headers.get("Access-Control-Allow-Credentials")
    );
    console.log(
      "Allow-Origin:",
      optionsResponse.headers.get("Access-Control-Allow-Origin")
    );

    // Test 4: Test với axios (như frontend sử dụng)
    console.log("4. Testing with axios...");
    try {
      const axios =
        window.axios ||
        (
          await import(
            "https://cdn.jsdelivr.net/npm/axios@1.9.0/dist/axios.min.js"
          )
        ).default;

      const axiosResponse = await axios.get(
        "http://localhost:8080/api/voucher",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Axios response status:", axiosResponse.status);
      console.log("Axios data length:", axiosResponse.data.length);
    } catch (error) {
      console.log("Axios error:", error.message);
    }

    console.log("=== CORS TEST COMPLETED ===");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testCorsFix();
