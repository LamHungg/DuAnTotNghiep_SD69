// Script test CORS cuối cùng - xác nhận CORS đã hoạt động
// Chạy script này trong browser console

const testCorsFinal = async () => {
  try {
    console.log("=== FINAL CORS TEST ===");
    console.log("Testing if CORS is actually working...");

    // Test 1: Kiểm tra xem có lỗi CORS không
    console.log("\n1. Testing for CORS errors...");

    const testUrls = [
      "http://localhost:8080/api/nguoi-dung",
      "http://localhost:8080/api/voucher",
      "http://localhost:8080/api/customer/products",
    ];

    for (const url of testUrls) {
      try {
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          console.log(`✅ ${url} - SUCCESS (Status: ${response.status})`);
        } else {
          console.log(`⚠️ ${url} - HTTP Error (Status: ${response.status})`);
        }
      } catch (error) {
        if (
          error.message.includes("CORS") ||
          error.message.includes("blocked")
        ) {
          console.log(`❌ ${url} - CORS ERROR: ${error.message}`);
        } else {
          console.log(`❌ ${url} - OTHER ERROR: ${error.message}`);
        }
      }
    }

    // Test 2: Kiểm tra OPTIONS preflight
    console.log("\n2. Testing OPTIONS preflight...");
    try {
      const optionsResponse = await fetch("http://localhost:8080/api/voucher", {
        method: "OPTIONS",
        credentials: "include",
        headers: {
          "Access-Control-Request-Method": "POST",
          "Access-Control-Request-Headers": "Content-Type",
          Origin: "http://localhost:3000",
        },
      });

      if (optionsResponse.ok) {
        console.log("✅ OPTIONS preflight - SUCCESS");

        // Kiểm tra CORS headers
        const corsHeaders = [
          "Access-Control-Allow-Origin",
          "Access-Control-Allow-Credentials",
          "Access-Control-Allow-Methods",
          "Access-Control-Allow-Headers",
        ];

        console.log("CORS Headers found:");
        corsHeaders.forEach((header) => {
          const value = optionsResponse.headers.get(header);
          if (value) {
            console.log(`  ${header}: ${value}`);
          }
        });
      } else {
        console.log(
          `⚠️ OPTIONS preflight - HTTP Error (Status: ${optionsResponse.status})`
        );
      }
    } catch (error) {
      console.log(`❌ OPTIONS preflight - ERROR: ${error.message}`);
    }

    // Test 3: Kết luận
    console.log("\n3. CONCLUSION:");
    console.log("🎉 If you see mostly ✅ SUCCESS above, CORS is FIXED!");
    console.log("🔧 If you see ❌ CORS ERROR, CORS is still broken.");
    console.log(
      "📝 The POST 400 error from previous test is likely a validation issue, not CORS."
    );

    console.log("\n🚀 NEXT STEPS:");
    console.log("1. Try your actual application now");
    console.log("2. Check if you can add vouchers without CORS errors");
    console.log("3. Check if you can access user APIs without CORS errors");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testCorsFinal();
