// Script test hiệu ứng loading khi tìm kiếm
// Chạy script này trong browser console

const testSearchLoading = async () => {
  try {
    console.log("=== TESTING SEARCH LOADING EFFECTS ===");

    // Test 1: Kiểm tra loading state khi tìm kiếm
    console.log("1. Testing search loading state...");

    // Tìm kiếm với delay để thấy loading effect
    const searchWithDelay = async () => {
      const searchParams = new URLSearchParams({
        tenVoucher: "Test",
        trangThai: "1",
      });

      console.log("Starting search with loading effect...");

      const response = await fetch(
        `http://localhost:8080/api/voucher/search?${searchParams}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Search completed, status:", response.status);

      if (response.ok) {
        const results = await response.json();
        console.log("✅ Search results:", results.length, "vouchers found");
      } else {
        console.log("❌ Search failed");
      }
    };

    // Chạy tìm kiếm
    await searchWithDelay();

    // Test 2: Kiểm tra multiple searches
    console.log("\n2. Testing multiple searches...");

    const searchTerms = ["Test", "GT", "PT", "Voucher"];

    for (const term of searchTerms) {
      console.log(`Searching for: ${term}`);

      const response = await fetch(
        `http://localhost:8080/api/voucher/search?tenVoucher=${term}`,
        {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const results = await response.json();
        console.log(`✅ Found ${results.length} vouchers for "${term}"`);
      } else {
        console.log(`❌ Search failed for "${term}"`);
      }

      // Delay giữa các lần tìm kiếm
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    // Test 3: Kiểm tra search với empty results
    console.log("\n3. Testing search with no results...");

    const emptyResponse = await fetch(
      "http://localhost:8080/api/voucher/search?tenVoucher=NonExistentVoucher123",
      {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (emptyResponse.ok) {
      const results = await emptyResponse.json();
      console.log(
        "✅ Empty search completed:",
        results.length,
        "results (expected 0)"
      );
    } else {
      console.log("❌ Empty search failed");
    }

    console.log("\n=== LOADING TEST COMPLETED ===");
    console.log("📝 Summary:");
    console.log("- Check the UI for loading spinners during search");
    console.log("- Verify buttons are disabled during loading");
    console.log("- Check for smooth fade-in animations");
    console.log("- Test the search form in the actual application");
  } catch (error) {
    console.error("Test error:", error);
  }
};

// Chạy test
testSearchLoading();
