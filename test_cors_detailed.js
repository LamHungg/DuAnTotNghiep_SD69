// Script test CORS chi tiết - kiểm tra CORS headers và sửa lỗi POST
// Chạy script này trong browser console

const testCorsDetailed = async () => {
  try {
    console.log("=== TESTING CORS DETAILED ===");

    // Test 1: Kiểm tra CORS headers bằng OPTIONS request
    console.log("1. Testing CORS headers with OPTIONS...");
    const optionsResponse = await fetch("http://localhost:8080/api/voucher", {
      method: "OPTIONS",
      credentials: "include",
      headers: {
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
        Origin: "http://localhost:3000",
      },
    });

    console.log("OPTIONS status:", optionsResponse.status);
    console.log("OPTIONS response headers:");
    for (let [key, value] of optionsResponse.headers.entries()) {
      console.log(`${key}: ${value}`);
    }

    // Test 2: Test POST với dữ liệu hợp lệ hơn
    console.log("\n2. Testing POST with valid data...");
    const postData = {
      maVoucher: "TEST001",
      tenVoucher: "Test Voucher",
      loaiGiamGia: "GIA_TIEN",
      giaTriGiam: 10000,
      giaTriToiThieu: 50000,
      giamToiDa: 5000,
      soLuong: 100,
      trangThai: 1,
      ngayBatDau: "2024-01-01",
      ngayKetThuc: "2024-12-31",
      moTa: "Voucher test",
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

    if (postResponse.status === 400) {
      const errorData = await postResponse.json();
      console.log("POST error details:", errorData);
    } else if (postResponse.ok) {
      const successData = await postResponse.json();
      console.log("POST success:", successData);
    }

    // Test 3: Kiểm tra CORS bằng cách xem có lỗi CORS không
    console.log("\n3. Testing CORS by checking for CORS errors...");
    try {
      const corsTestResponse = await fetch(
        "http://localhost:8080/api/voucher",
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (corsTestResponse.ok) {
        console.log("✅ CORS is working - no CORS errors detected");
        const data = await corsTestResponse.json();
        console.log(
          "Response data length:",
          Array.isArray(data) ? data.length : "Not an array"
        );
      }
    } catch (corsError) {
      console.log("❌ CORS error detected:", corsError.message);
    }

    // Test 4: Test với axios để so sánh
    console.log("\n4. Testing with axios...");
    try {
      // Sử dụng axios từ CDN nếu có
      if (typeof axios !== "undefined") {
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
        console.log("✅ Axios request successful - CORS working");
      } else {
        console.log("Axios not available, skipping axios test");
      }
    } catch (axiosError) {
      console.log("Axios error:", axiosError.message);
    }

    console.log("\n=== CORS DETAILED TEST COMPLETED ===");
    console.log("📝 Summary:");
    console.log("- If you see 'CORS is working' above, CORS is fixed!");
    console.log("- POST 400 error is likely a validation issue, not CORS");
    console.log(
      "- Try the actual application now to see if CORS errors are gone"
    );
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testCorsDetailed();
