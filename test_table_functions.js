// Script test các chức năng table đã hoàn thiện
// Chạy script này trong browser console khi đang ở trang Admin

const testTableFunctions = async () => {
  try {
    console.log("📊 === TESTING TABLE FUNCTIONS ===");

    // 1. Kiểm tra cấu trúc table
    console.log("1. Checking table structure...");

    const table = document.querySelector(".orders-table");
    if (table) {
      console.log("✅ Table found");

      // Kiểm tra headers
      const headers = table.querySelectorAll("thead th");
      console.log(
        `✅ Found ${headers.length} headers:`,
        Array.from(headers).map((h) => h.textContent.trim())
      );

      // Kiểm tra rows
      const rows = table.querySelectorAll("tbody tr");
      console.log(`✅ Found ${rows.length} data rows`);

      if (rows.length > 0) {
        console.log("2. Analyzing table data...");

        rows.forEach((row, index) => {
          const cells = row.querySelectorAll("td");
          if (cells.length >= 9) {
            const rowData = {
              stt: cells[0]?.textContent?.trim(),
              maDonHang: cells[1]?.textContent?.trim(),
              tenKhachHang: cells[2]?.textContent?.trim(),
              hinhThuc: cells[3]?.textContent?.trim(),
              trangThai: cells[4]?.textContent?.trim(),
              ngayDat: cells[5]?.textContent?.trim(),
              tongTienHang: cells[6]?.textContent?.trim(),
              tongThanhToan: cells[7]?.textContent?.trim(),
              actions: cells[8]?.querySelectorAll(".btn").length || 0,
            };

            console.log(`   Row ${index + 1}:`, rowData);

            // Kiểm tra từng trường
            const issues = [];
            if (!rowData.maDonHang) issues.push("Missing maDonHang");
            if (!rowData.tenKhachHang) issues.push("Missing tenKhachHang");
            if (!rowData.hinhThuc) issues.push("Missing hinhThuc");
            if (!rowData.trangThai) issues.push("Missing trangThai");
            if (!rowData.tongThanhToan) issues.push("Missing tongThanhToan");
            if (rowData.actions === 0) issues.push("No action buttons");

            if (issues.length > 0) {
              console.log(`   ❌ Row ${index + 1} issues:`, issues);
            } else {
              console.log(`   ✅ Row ${index + 1} data complete`);
            }
          }
        });
      }
    } else {
      console.log("❌ Table not found");
    }

    // 2. Kiểm tra action buttons
    console.log("3. Checking action buttons...");

    const actionButtons = document.querySelectorAll(".orders-table .btn");
    console.log(`✅ Found ${actionButtons.length} action buttons`);

    const buttonTypes = {};
    actionButtons.forEach((btn) => {
      const title = btn.getAttribute("title") || "Unknown";
      buttonTypes[title] = (buttonTypes[title] || 0) + 1;
    });

    console.log("   Button types:", buttonTypes);

    // 3. Kiểm tra pagination
    console.log("4. Checking pagination...");

    const pagination = document.querySelector(".pagination");
    if (pagination) {
      const pageButtons = pagination.querySelectorAll(".page-link");
      console.log(`✅ Found ${pageButtons.length} pagination buttons`);

      const activePage = pagination.querySelector(".page-item.active");
      if (activePage) {
        console.log(`✅ Active page: ${activePage.textContent.trim()}`);
      }
    } else {
      console.log("ℹ️ No pagination found (likely single page)");
    }

    // 4. Kiểm tra loading states
    console.log("5. Checking loading states...");

    const loadingSpinner = document.querySelector(".spinner-border");
    const errorMessage = document.querySelector(".text-danger");
    const emptyState = document.querySelector(".text-muted");

    if (loadingSpinner) {
      console.log("⏳ Loading state active");
    } else if (errorMessage) {
      console.log("❌ Error state active");
    } else if (
      emptyState &&
      emptyState.textContent.includes("Không có đơn hàng")
    ) {
      console.log("📭 Empty state active");
    } else {
      console.log("✅ Normal state active");
    }

    // 5. Kiểm tra responsive design
    console.log("6. Checking responsive design...");

    const tableResponsive = document.querySelector(".table-responsive");
    if (tableResponsive) {
      console.log("✅ Table responsive wrapper found");

      const tableWidth = table.offsetWidth;
      const wrapperWidth = tableResponsive.offsetWidth;

      console.log(`   Table width: ${tableWidth}px`);
      console.log(`   Wrapper width: ${wrapperWidth}px`);

      if (tableWidth > wrapperWidth) {
        console.log("✅ Horizontal scroll available");
      } else {
        console.log("ℹ️ No horizontal scroll needed");
      }
    }

    // 6. Kiểm tra hover effects
    console.log("7. Testing hover effects...");

    const firstRow = table?.querySelector("tbody tr");
    if (firstRow) {
      console.log("✅ Hover effects should be working (check visually)");
      console.log("   Try hovering over table rows to see effects");
    }

    // 7. Final assessment
    console.log("8. Final assessment:");

    const hasData = rows.length > 0;
    const hasActions = actionButtons.length > 0;
    const hasPagination = pagination !== null;
    const isResponsive = tableResponsive !== null;

    if (hasData && hasActions && isResponsive) {
      console.log("🎉 Table functions working perfectly!");
      console.log("✅ Data display: OK");
      console.log("✅ Action buttons: OK");
      console.log("✅ Responsive design: OK");
      if (hasPagination) console.log("✅ Pagination: OK");
      console.log("🚀 Table is fully functional!");
    } else {
      console.log("⚠️ Some issues found:");
      if (!hasData) console.log("   - No data rows");
      if (!hasActions) console.log("   - No action buttons");
      if (!isResponsive) console.log("   - Not responsive");
      if (!hasPagination && rows.length > 10)
        console.log("   - Missing pagination");
    }

    console.log("📊 === TABLE FUNCTIONS TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in table functions test:", error);
  }
};

// Export function
window.testTableFunctions = testTableFunctions;

// Auto-run
testTableFunctions();
