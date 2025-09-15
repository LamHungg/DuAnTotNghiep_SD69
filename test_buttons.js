// Script test các button trong trang Statistics
// Copy và paste vào Console của browser khi đang ở trang Statistics

const testButtons = () => {
  console.log("🔍 Test Các Button Trong Trang Statistics...\n");

  try {
    // Test 1: Header buttons
    console.log("1️⃣ Test Header Buttons:");
    const headerButtons = document.querySelectorAll(".header-actions .btn");
    console.log(`✅ Tìm thấy ${headerButtons.length} button trong header`);

    headerButtons.forEach((btn, index) => {
      const text = btn.textContent.trim();
      const isDisabled = btn.disabled;
      const hasOnClick = btn.onclick !== null;
      console.log(
        `   ${
          index + 1
        }. "${text}" - Disabled: ${isDisabled} - Has onClick: ${hasOnClick}`
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
      console.log(
        `   ${
          index + 1
        }. "${text}" - Disabled: ${isDisabled} - Has onClick: ${hasOnClick}`
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
      console.log(`   ${index + 1}. "${text}" - Has onClick: ${hasOnClick}`);
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
  } catch (error) {
    console.log("❌ Lỗi test buttons:", error.message);
  }
};

// Function để test click button
const testClickButton = (buttonText) => {
  console.log(`🖱️ Test click button: "${buttonText}"`);

  const buttons = Array.from(document.querySelectorAll(".btn"));
  const targetButton = buttons.find((btn) =>
    btn.textContent.trim().includes(buttonText)
  );

  if (targetButton) {
    console.log("✅ Tìm thấy button, thử click...");
    if (!targetButton.disabled) {
      targetButton.click();
      console.log("✅ Đã click button");
    } else {
      console.log("❌ Button bị disabled");
    }
  } else {
    console.log("❌ Không tìm thấy button");
  }
};

// Function để test export
const testExport = async (type) => {
  console.log(`📤 Test export ${type}...`);

  try {
    const response = await fetch(
      `http://localhost:8080/zmen/export/thong-ke-excel`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filterType: "thang-nay",
          year: 2025,
          month: 8,
          type: type,
        }),
      }
    );

    if (response.ok) {
      console.log("✅ Export API thành công");
    } else {
      console.log("❌ Export API thất bại:", response.status);
    }
  } catch (error) {
    console.log("❌ Lỗi export:", error.message);
  }
};

// Chạy test
testButtons();

// Export functions
window.testButtons = testButtons;
window.testClickButton = testClickButton;
window.testExport = testExport;
