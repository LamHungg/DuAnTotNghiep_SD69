// Script test chức năng tìm kiếm voucher
// Chạy script này trong browser console

const testSearchVoucher = async () => {
  try {
    console.log("=== TESTING VOUCHER SEARCH ===");

    // Test 1: Tìm kiếm theo tên voucher
    console.log("1. Testing search by voucher name...");
    const searchByNameResponse = await fetch(
      "http://localhost:8080/api/voucher/search?tenVoucher=Test",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Search by name status:", searchByNameResponse.status);
    if (searchByNameResponse.ok) {
      const results = await searchByNameResponse.json();
      console.log(
        "✅ Search by name results:",
        results.length,
        "vouchers found"
      );
    } else {
      console.log("❌ Search by name failed");
    }

    // Test 2: Tìm kiếm theo mã voucher
    console.log("\n2. Testing search by voucher code...");
    const searchByCodeResponse = await fetch(
      "http://localhost:8080/api/voucher/search?maVoucher=GT",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Search by code status:", searchByCodeResponse.status);
    if (searchByCodeResponse.ok) {
      const results = await searchByCodeResponse.json();
      console.log(
        "✅ Search by code results:",
        results.length,
        "vouchers found"
      );
    } else {
      console.log("❌ Search by code failed");
    }

    // Test 3: Tìm kiếm theo trạng thái
    console.log("\n3. Testing search by status...");
    const searchByStatusResponse = await fetch(
      "http://localhost:8080/api/voucher/search?trangThai=1",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Search by status status:", searchByStatusResponse.status);
    if (searchByStatusResponse.ok) {
      const results = await searchByStatusResponse.json();
      console.log(
        "✅ Search by status results:",
        results.length,
        "active vouchers found"
      );
    } else {
      console.log("❌ Search by status failed");
    }

    // Test 4: Tìm kiếm kết hợp
    console.log("\n4. Testing combined search...");
    const combinedSearchResponse = await fetch(
      "http://localhost:8080/api/voucher/search?tenVoucher=Test&trangThai=1",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Combined search status:", combinedSearchResponse.status);
    if (combinedSearchResponse.ok) {
      const results = await combinedSearchResponse.json();
      console.log(
        "✅ Combined search results:",
        results.length,
        "vouchers found"
      );
    } else {
      console.log("❌ Combined search failed");
    }

    // Test 5: Tìm kiếm không có kết quả
    console.log("\n5. Testing search with no results...");
    const noResultsResponse = await fetch(
      "http://localhost:8080/api/voucher/search?tenVoucher=NonExistentVoucher",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("No results search status:", noResultsResponse.status);
    if (noResultsResponse.ok) {
      const results = await noResultsResponse.json();
      console.log(
        "✅ No results search:",
        results.length,
        "vouchers found (expected 0)"
      );
    } else {
      console.log("❌ No results search failed");
    }

    console.log("\n=== SEARCH TEST COMPLETED ===");
    console.log("📝 Summary:");
    console.log("- If you see ✅ above, search functionality is working!");
    console.log("- Check the actual application search form now");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testSearchVoucher();
