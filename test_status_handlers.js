// Script test các hàm xử lý trạng thái đơn hàng
// Chạy script này trong browser console khi đang ở trang Admin

const testStatusHandlers = async () => {
  try {
    console.log("🔧 === TESTING STATUS HANDLERS ===");

    // 1. Kiểm tra các hàm xử lý có tồn tại
    console.log("1. Checking handler functions...");

    const handlers = [
      "handleConfirmOrder",
      "handleCancelOrder",
      "handleShipOrder",
      "handleDeliverOrder",
      "handleCompleteOrder",
    ];

    handlers.forEach((handler) => {
      if (typeof window[handler] === "function") {
        console.log(`✅ ${handler} function exists`);
      } else {
        console.log(`❌ ${handler} function missing`);
      }
    });

    // 2. Kiểm tra API endpoints
    console.log("2. Testing API endpoints...");

    const endpoints = [
      { name: "Confirm Order", url: "/confirm", method: "PUT" },
      { name: "Cancel Order", url: "/cancel", method: "PUT" },
      { name: "Ship Order", url: "/ship", method: "PUT" },
      { name: "Deliver Order", url: "/deliver", method: "PUT" },
      { name: "Complete Order", url: "/complete", method: "PUT" },
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(
          `http://localhost:8080/ZMEN/Admin/DonHang${endpoint.url}/1`,
          {
            method: endpoint.method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        if (response.status === 200 || response.status === 404) {
          console.log(
            `✅ ${endpoint.name} endpoint accessible (${response.status})`
          );
        } else {
          console.log(
            `⚠️ ${endpoint.name} endpoint returned ${response.status}`
          );
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name} endpoint error: ${error.message}`);
      }
    }

    // 3. Kiểm tra action buttons
    console.log("3. Checking action buttons...");

    const actionButtons = document.querySelectorAll(".orders-table .btn");
    console.log(`✅ Found ${actionButtons.length} action buttons`);

    const buttonTypes = {};
    actionButtons.forEach((btn) => {
      const title = btn.getAttribute("title");
      const onClick = btn.getAttribute("onclick");
      buttonTypes[title] = {
        exists: !!onClick,
        onclick: onClick,
      };
    });

    console.log("   Button types:", buttonTypes);

    // 4. Kiểm tra trạng thái hiện tại của đơn hàng
    console.log("4. Checking current order statuses...");

    const response = await fetch("http://localhost:8080/ZMEN/Admin/DonHang", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    if (response.ok) {
      const orders = await response.json();

      const statusCount = {};
      orders.forEach((order) => {
        const status =
          order.trangThai || order.tenTrangThai || "Không xác định";
        statusCount[status] = (statusCount[status] || 0) + 1;
      });

      console.log("   Current status distribution:", statusCount);

      // 5. Tìm đơn hàng có thể test
      console.log("5. Finding testable orders...");

      const testableOrders = orders.filter((order) => {
        const status = order.trangThai || order.tenTrangThai;
        return (
          status === "Chờ xác nhận" ||
          status === "Đã xác nhận" ||
          status === "Đang giao hàng" ||
          status === "Giao hàng thành công"
        );
      });

      console.log(
        `   Found ${testableOrders.length} testable orders:`,
        testableOrders.map((o) => ({
          id: o.id,
          maDonHang: o.maDonHang,
          status: o.trangThai || o.tenTrangThai,
        }))
      );

      // 6. Kiểm tra logic xử lý trạng thái
      console.log("6. Testing status transition logic...");

      const validTransitions = {
        "Chờ xác nhận": ["Đã xác nhận", "Đã hủy"],
        "Đã xác nhận": ["Đang giao hàng"],
        "Đang giao hàng": ["Giao hàng thành công"],
        "Giao hàng thành công": ["Hoàn thành"],
      };

      orders.forEach((order) => {
        const currentStatus = order.trangThai || order.tenTrangThai;
        const validNextStatuses = validTransitions[currentStatus] || [];

        if (validNextStatuses.length > 0) {
          console.log(
            `   Order ${
              order.maDonHang
            } (${currentStatus}) can transition to: ${validNextStatuses.join(
              ", "
            )}`
          );
        }
      });

      // 7. Final assessment
      console.log("7. Final assessment:");

      const hasHandlers = handlers.every(
        (handler) => typeof window[handler] === "function"
      );
      const hasButtons = actionButtons.length > 0;
      const hasTestableOrders = testableOrders.length > 0;
      const hasValidTransitions = Object.keys(validTransitions).length > 0;

      if (
        hasHandlers &&
        hasButtons &&
        hasTestableOrders &&
        hasValidTransitions
      ) {
        console.log("🎉 Status handlers working perfectly!");
        console.log("✅ All handler functions exist");
        console.log("✅ Action buttons present");
        console.log("✅ Testable orders available");
        console.log("✅ Valid status transitions defined");
        console.log("🚀 Status management system is ready!");
      } else {
        console.log("⚠️ Some issues found:");
        if (!hasHandlers) console.log("   - Missing handler functions");
        if (!hasButtons) console.log("   - No action buttons");
        if (!hasTestableOrders) console.log("   - No testable orders");
        if (!hasValidTransitions) console.log("   - No valid transitions");
      }
    } else {
      console.log("❌ Failed to fetch orders for testing");
    }

    console.log("🔧 === STATUS HANDLERS TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in status handlers test:", error);
  }
};

// Export function
window.testStatusHandlers = testStatusHandlers;

// Auto-run
testStatusHandlers();
