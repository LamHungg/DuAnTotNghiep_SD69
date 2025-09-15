// Script test validation và xử lý tình huống đặc biệt
// Chạy script này trong browser console

const testSearchValidation = async () => {
  try {
    console.log("=== TESTING SEARCH VALIDATION ===");

    // Test 1: Tìm kiếm với input quá ngắn
    console.log("1. Testing search with short input...");

    const shortInputResponse = await fetch(
      "http://localhost:8080/api/voucher/search?tenVoucher=a",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Short input status:", shortInputResponse.status);
    if (shortInputResponse.ok) {
      const results = await shortInputResponse.json();
      console.log("✅ Short input results:", results.length, "vouchers");
    } else {
      console.log("❌ Short input failed");
    }

    // Test 2: Tìm kiếm với input rỗng
    console.log("\n2. Testing search with empty input...");

    const emptyInputResponse = await fetch(
      "http://localhost:8080/api/voucher/search?tenVoucher=",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Empty input status:", emptyInputResponse.status);
    if (emptyInputResponse.ok) {
      const results = await emptyInputResponse.json();
      console.log("✅ Empty input results:", results.length, "vouchers");
    } else {
      console.log("❌ Empty input failed");
    }

    // Test 3: Tìm kiếm với ký tự đặc biệt
    console.log("\n3. Testing search with special characters...");

    const specialCharResponse = await fetch(
      "http://localhost:8080/api/voucher/search?tenVoucher=@#$%",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Special chars status:", specialCharResponse.status);
    if (specialCharResponse.ok) {
      const results = await specialCharResponse.json();
      console.log("✅ Special chars results:", results.length, "vouchers");
    } else {
      console.log("❌ Special chars failed");
    }

    // Test 4: Tìm kiếm với số
    console.log("\n4. Testing search with numbers...");

    const numberResponse = await fetch(
      "http://localhost:8080/api/voucher/search?tenVoucher=123",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Numbers status:", numberResponse.status);
    if (numberResponse.ok) {
      const results = await numberResponse.json();
      console.log("✅ Numbers results:", results.length, "vouchers");
    } else {
      console.log("❌ Numbers failed");
    }

    // Test 5: Tìm kiếm với trạng thái không hợp lệ
    console.log("\n5. Testing search with invalid status...");

    const invalidStatusResponse = await fetch(
      "http://localhost:8080/api/voucher/search?trangThai=999",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Invalid status status:", invalidStatusResponse.status);
    if (invalidStatusResponse.ok) {
      const results = await invalidStatusResponse.json();
      console.log("✅ Invalid status results:", results.length, "vouchers");
    } else {
      console.log("❌ Invalid status failed");
    }

    // Test 6: Tìm kiếm với nhiều parameters
    console.log("\n6. Testing search with multiple parameters...");

    const multipleParamsResponse = await fetch(
      "http://localhost:8080/api/voucher/search?tenVoucher=Test&trangThai=1&maVoucher=GT",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Multiple params status:", multipleParamsResponse.status);
    if (multipleParamsResponse.ok) {
      const results = await multipleParamsResponse.json();
      console.log("✅ Multiple params results:", results.length, "vouchers");
    } else {
      console.log("❌ Multiple params failed");
    }

    // Test 7: Tìm kiếm với URL encoding
    console.log("\n7. Testing search with URL encoding...");

    const encodedResponse = await fetch(
      "http://localhost:8080/api/voucher/search?tenVoucher=Test%20Voucher",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("URL encoded status:", encodedResponse.status);
    if (encodedResponse.ok) {
      const results = await encodedResponse.json();
      console.log("✅ URL encoded results:", results.length, "vouchers");
    } else {
      console.log("❌ URL encoded failed");
    }

    console.log("\n=== VALIDATION TEST COMPLETED ===");
    console.log("📝 Summary:");
    console.log("- Check frontend validation for short inputs");
    console.log("- Verify error handling for invalid inputs");
    console.log("- Test the no-results component");
    console.log("- Check input validation in the actual application");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testSearchValidation();
