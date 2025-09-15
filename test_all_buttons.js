// Script test tất cả button trong trang Statistics
// Copy và paste vào Console của browser khi đang ở trang Statistics

const testAllButtons = () => {
  console.log("🔍 Test Tất Cả Button Trong Trang Statistics...\n");

  try {
    // Test 1: Header buttons
    console.log("1️⃣ Test Header Buttons:");
    const headerButtons = document.querySelectorAll(".header-actions .btn");
    console.log(`✅ Tìm thấy ${headerButtons.length} button trong header`);

    headerButtons.forEach((btn, index) => {
      const text = btn.textContent.trim();
      const isDisabled = btn.disabled;
      const hasOnClick = btn.onclick !== null;
      const className = btn.className;
      console.log(
        `   ${
          index + 1
        }. "${text}" - Disabled: ${isDisabled} - Has onClick: ${hasOnClick} - Class: ${className}`
      );
    });

    // Test 2: Filter buttons
    console.log("\n2️⃣ Test Filter Buttons:");
    const filterButtons = document.querySelectorAll(".filter-btn");
    console.log(`✅ Tìm thấy ${filterButtons.length} button filter`);

    filterButtons.forEach((btn, index) => {
      const text = btn.textContent.trim();
      const isActive = btn.classList.contains("active");
      const hasOnClick = btn.onclick !== null;
      console.log(
        `   ${
          index + 1
        }. "${text}" - Active: ${isActive} - Has onClick: ${hasOnClick}`
      );
    });

    // Test 3: Chart action buttons
    console.log("\n3️⃣ Test Chart Action Buttons:");
    const chartButtons = document.querySelectorAll(".chart-actions .btn");
    console.log(
      `✅ Tìm thấy ${chartButtons.length} button trong chart actions`
    );

    chartButtons.forEach((btn, index) => {
      const text = btn.textContent.trim();
      const hasOnClick = btn.onclick !== null;
      console.log(`   ${index + 1}. "${text}" - Has onClick: ${hasOnClick}`);
    });

    // Test 4: Table export buttons
    console.log("\n4️⃣ Test Table Export Buttons:");
    const tableExportButtons = document.querySelectorAll(".table-header .btn");
    console.log(
      `✅ Tìm thấy ${tableExportButtons.length} button export trong tables`
    );

    tableExportButtons.forEach((btn, index) => {
      const text = btn.textContent.trim();
      const isDisabled = btn.disabled;
      const hasOnClick = btn.onclick !== null;
      const parentHeader =
        btn.closest(".table-header")?.querySelector("h3")?.textContent ||
        "Unknown";
      console.log(
        `   ${
          index + 1
        }. "${text}" (${parentHeader}) - Disabled: ${isDisabled} - Has onClick: ${hasOnClick}`
      );
    });

    // Test 5: Table action buttons
    console.log("\n5️⃣ Test Table Action Buttons:");
    const tableActionButtons = document.querySelectorAll("tbody .btn");
    console.log(
      `✅ Tìm thấy ${tableActionButtons.length} button action trong table rows`
    );

    tableActionButtons.forEach((btn, index) => {
      const text = btn.textContent.trim();
      const hasOnClick = btn.onclick !== null;
      const title = btn.title || "No title";
      console.log(
        `   ${
          index + 1
        }. "${text}" - Title: "${title}" - Has onClick: ${hasOnClick}`
      );
    });

    // Test 6: Pagination buttons
    console.log("\n6️⃣ Test Pagination Buttons:");
    const paginationButtons = document.querySelectorAll(
      ".pagination-container button"
    );
    console.log(`✅ Tìm thấy ${paginationButtons.length} button pagination`);

    paginationButtons.forEach((btn, index) => {
      const text = btn.textContent.trim();
      const isDisabled = btn.disabled;
      const hasOnClick = btn.onclick !== null;
      console.log(
        `   ${
          index + 1
        }. "${text}" - Disabled: ${isDisabled} - Has onClick: ${hasOnClick}`
      );
    });

    // Test 7: All buttons summary
    console.log("\n7️⃣ Tổng Kết Tất Cả Button:");
    const allButtons = document.querySelectorAll("button");
    const buttonsWithOnClick = Array.from(allButtons).filter(
      (btn) => btn.onclick !== null
    );
    const buttonsWithoutOnClick = Array.from(allButtons).filter(
      (btn) => btn.onclick === null
    );

    console.log(`📊 Tổng số button: ${allButtons.length}`);
    console.log(`✅ Button có onClick: ${buttonsWithOnClick.length}`);
    console.log(`❌ Button không có onClick: ${buttonsWithoutOnClick.length}`);

    if (buttonsWithoutOnClick.length > 0) {
      console.log("\n❌ Danh sách button không có onClick:");
      buttonsWithoutOnClick.forEach((btn, index) => {
        const text = btn.textContent.trim();
        const className = btn.className;
        console.log(`   ${index + 1}. "${text}" - Class: ${className}`);
      });
    }
  } catch (error) {
    console.log("❌ Lỗi test buttons:", error.message);
  }
};

// Function để test click button cụ thể
const testClickSpecificButton = (buttonText, buttonType = "any") => {
  console.log(`🖱️ Test click button: "${buttonText}" (${buttonType})`);

  let selector = "button";
  if (buttonType === "header") {
    selector = ".header-actions button";
  } else if (buttonType === "filter") {
    selector = ".filter-btn";
  } else if (buttonType === "chart") {
    selector = ".chart-actions button";
  } else if (buttonType === "table-export") {
    selector = ".table-header button";
  } else if (buttonType === "table-action") {
    selector = "tbody button";
  } else if (buttonType === "pagination") {
    selector = ".pagination-container button";
  }

  const buttons = Array.from(document.querySelectorAll(selector));
  const targetButton = buttons.find((btn) =>
    btn.textContent.trim().includes(buttonText)
  );

  if (targetButton) {
    console.log("✅ Tìm thấy button, thử click...");
    if (!targetButton.disabled) {
      targetButton.click();
      console.log("✅ Đã click button");
      return true;
    } else {
      console.log("❌ Button bị disabled");
      return false;
    }
  } else {
    console.log("❌ Không tìm thấy button");
    return false;
  }
};

// Function để test tất cả button có onClick
const testAllClickableButtons = () => {
  console.log("🖱️ Test click tất cả button có onClick...");

  const allButtons = Array.from(document.querySelectorAll("button"));
  const clickableButtons = allButtons.filter(
    (btn) => btn.onclick !== null && !btn.disabled
  );

  console.log(`📊 Tìm thấy ${clickableButtons.length} button có thể click`);

  clickableButtons.forEach((btn, index) => {
    const text = btn.textContent.trim();
    console.log(`   ${index + 1}. "${text}"`);
  });

  return clickableButtons;
};

// Function để test export functionality
const testExportFunctionality = async () => {
  console.log("📤 Test Export Functionality...");

  try {
    // Test Excel export
    console.log("1️⃣ Test Excel Export...");
    const excelResponse = await fetch(
      "http://localhost:8080/zmen/export/thong-ke-excel",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filterType: "thang-nay",
          year: 2025,
          month: 8,
          kpiData: {},
          doanhThuChart: [],
          doanhThuTheoDanhMuc: [],
          topSanPham: [],
          topKhachHang: [],
          donHangList: [],
        }),
      }
    );

    if (excelResponse.ok) {
      console.log("✅ Excel Export API thành công");
    } else {
      console.log("❌ Excel Export API thất bại:", excelResponse.status);
    }

    // Test PDF export
    console.log("2️⃣ Test PDF Export...");
    const pdfResponse = await fetch(
      "http://localhost:8080/zmen/export/thong-ke-pdf",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filterType: "thang-nay",
          year: 2025,
          month: 8,
          kpiData: {},
          doanhThuChart: [],
          doanhThuTheoDanhMuc: [],
          topSanPham: [],
          topKhachHang: [],
          donHangList: [],
        }),
      }
    );

    if (pdfResponse.ok) {
      console.log("✅ PDF Export API thành công");
    } else {
      console.log("❌ PDF Export API thất bại:", pdfResponse.status);
    }
  } catch (error) {
    console.log("❌ Lỗi test export:", error.message);
  }
};

// Chạy test
testAllButtons();

// Export functions
window.testAllButtons = testAllButtons;
window.testClickSpecificButton = testClickSpecificButton;
window.testAllClickableButtons = testAllClickableButtons;
window.testExportFunctionality = testExportFunctionality;
