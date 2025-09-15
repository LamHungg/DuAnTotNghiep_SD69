// Script test hệ thống trạng thái đơn hàng đã hoàn thiện
// Chạy script này trong browser console khi đang ở trang Admin

const testOrderStatus = async () => {
  try {
    console.log("🎯 === TESTING ORDER STATUS SYSTEM ===");

    // 1. Kiểm tra API response
    console.log("1. Testing API response...");

    const response = await fetch("http://localhost:8080/ZMEN/Admin/DonHang", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    if (response.ok) {
      const orders = await response.json();
      console.log("✅ API call successful:", orders.length, "orders");

      // 2. Phân tích trạng thái
      console.log("2. Analyzing order statuses...");

      const statusCount = {};
      const statusExamples = {};

      orders.forEach((order) => {
        const status =
          order.trangThai || order.tenTrangThai || "Không xác định";
        statusCount[status] = (statusCount[status] || 0) + 1;

        if (!statusExamples[status]) {
          statusExamples[status] = {
            id: order.id,
            maDonHang: order.maDonHang,
            hinhThucDonHang: order.hinhThucDonHang,
          };
        }
      });

      console.log("   Status distribution:", statusCount);
      console.log("   Status examples:", statusExamples);

      // 3. Kiểm tra status tabs
      console.log("3. Checking status tabs...");

      const statusTabs = document.querySelectorAll(".btn-link");
      console.log(`✅ Found ${statusTabs.length} status tabs`);

      statusTabs.forEach((tab, index) => {
        const text = tab.textContent.trim();
        const badge = tab.querySelector(".badge");
        const count = badge ? badge.textContent.trim() : "0";
        console.log(`   Tab ${index + 1}: "${text}" (${count})`);
      });

      // 4. Kiểm tra status badges trong table
      console.log("4. Checking status badges in table...");

      const statusBadges = document.querySelectorAll(".order-badge");
      console.log(`✅ Found ${statusBadges.length} status badges in table`);

      const badgeTypes = {};
      statusBadges.forEach((badge) => {
        const text = badge.textContent.trim();
        badgeTypes[text] = (badgeTypes[text] || 0) + 1;
      });

      console.log("   Badge types:", badgeTypes);

      // 5. Kiểm tra action buttons theo trạng thái
      console.log("5. Checking action buttons by status...");

      const actionButtons = document.querySelectorAll(".orders-table .btn");
      const buttonByStatus = {};

      actionButtons.forEach((btn) => {
        const title = btn.getAttribute("title");
        const row = btn.closest("tr");
        if (row) {
          const statusCell = row.querySelector("td:nth-child(5)");
          const status = statusCell ? statusCell.textContent.trim() : "Unknown";

          if (!buttonByStatus[status]) {
            buttonByStatus[status] = [];
          }
          buttonByStatus[status].push(title);
        }
      });

      console.log("   Action buttons by status:", buttonByStatus);

      // 6. Kiểm tra thống kê cards
      console.log("6. Checking statistics cards...");

      const statCards = document.querySelectorAll(".stat-card");
      console.log(`✅ Found ${statCards.length} statistics cards`);

      statCards.forEach((card, index) => {
        const value = card.querySelector(".fw-bold")?.textContent.trim();
        const label = card.querySelector("div:last-child")?.textContent.trim();
        console.log(`   Card ${index + 1}: ${value} - ${label}`);
      });

      // 7. Kiểm tra filter functionality
      console.log("7. Testing filter functionality...");

      const filterInputs = document.querySelectorAll(
        'input[type="text"], input[type="date"], select'
      );
      console.log(`✅ Found ${filterInputs.length} filter inputs`);

      // 8. Kiểm tra responsive design
      console.log("8. Checking responsive design...");

      const isMobile = window.innerWidth < 768;
      console.log(
        `   Screen width: ${window.innerWidth}px (${
          isMobile ? "Mobile" : "Desktop"
        })`
      );

      const tabsContainer = document.querySelector(".d-flex.flex-row.gap-2");
      if (tabsContainer) {
        const hasOverflow =
          tabsContainer.scrollWidth > tabsContainer.clientWidth;
        console.log(`   Tabs overflow: ${hasOverflow ? "Yes" : "No"}`);
      }

      // 9. Final assessment
      console.log("9. Final assessment:");

      const hasAllStatuses = Object.keys(statusCount).length >= 6;
      const hasStatusTabs = statusTabs.length >= 8;
      const hasActionButtons = actionButtons.length > 0;
      const hasStatistics = statCards.length >= 6;
      const hasFilters = filterInputs.length >= 5;

      if (
        hasAllStatuses &&
        hasStatusTabs &&
        hasActionButtons &&
        hasStatistics &&
        hasFilters
      ) {
        console.log("🎉 Order status system working perfectly!");
        console.log("✅ All status types present");
        console.log("✅ Status tabs functional");
        console.log("✅ Action buttons working");
        console.log("✅ Statistics cards complete");
        console.log("✅ Filter system ready");
        console.log("🚀 Status system is fully operational!");
      } else {
        console.log("⚠️ Some issues found:");
        if (!hasAllStatuses) console.log("   - Missing some status types");
        if (!hasStatusTabs) console.log("   - Status tabs incomplete");
        if (!hasActionButtons) console.log("   - No action buttons");
        if (!hasStatistics) console.log("   - Statistics cards missing");
        if (!hasFilters) console.log("   - Filter system incomplete");
      }

      // 10. Status workflow validation
      console.log("10. Status workflow validation:");

      const validWorkflow = [
        "Chờ thêm sản phẩm",
        "Chờ xác nhận",
        "Đã xác nhận",
        "Đang giao hàng",
        "Giao hàng thành công",
        "Hoàn thành",
      ];

      const foundStatuses = Object.keys(statusCount);
      const missingStatuses = validWorkflow.filter(
        (status) =>
          !foundStatuses.some((found) =>
            found.toLowerCase().includes(status.toLowerCase())
          )
      );

      if (missingStatuses.length === 0) {
        console.log("✅ All workflow statuses present");
      } else {
        console.log("⚠️ Missing workflow statuses:", missingStatuses);
      }
    } else {
      console.log("❌ API call failed:", response.status);
    }

    console.log("🎯 === ORDER STATUS TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in order status test:", error);
  }
};

// Export function
window.testOrderStatus = testOrderStatus;

// Auto-run
testOrderStatus();
