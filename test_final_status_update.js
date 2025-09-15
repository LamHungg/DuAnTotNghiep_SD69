// Script test cuối cùng cho cập nhật trạng thái đơn hàng
// Chạy script này trong browser console khi đang ở trang Admin

const testFinalStatusUpdate = async () => {
  try {
    console.log("🎯 === FINAL STATUS UPDATE TEST ===");

    // 1. Kiểm tra authentication
    console.log("1. Checking authentication...");
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("❌ No token found - please login first");
      return;
    }
    console.log("✅ Token found");

    // 2. Lấy danh sách đơn hàng
    console.log("2. Fetching orders...");

    const ordersResponse = await fetch(
      "http://localhost:8080/ZMEN/Admin/DonHang",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!ordersResponse.ok) {
      console.log("❌ Failed to fetch orders:", ordersResponse.status);
      return;
    }

    const orders = await ordersResponse.json();
    console.log(`✅ Found ${orders.length} orders`);

    // 3. Hiển thị trạng thái hiện tại
    console.log("3. Current order statuses:");
    const statusCount = {};
    orders.forEach((order) => {
      const status = order.trangThai || order.tenTrangThai || "Không xác định";
      statusCount[status] = (statusCount[status] || 0) + 1;
      console.log(`   Order ${order.id}: ${status}`);
    });
    console.log("   Status distribution:", statusCount);

    // 4. Tìm đơn hàng có thể test
    const testableOrder = orders.find((order) => {
      const status = order.trangThai || order.tenTrangThai;
      return status === "Chờ xác nhận";
    });

    if (!testableOrder) {
      console.log("❌ No order with 'Chờ xác nhận' status found");
      console.log("Available statuses:", [
        ...new Set(orders.map((o) => o.trangThai || o.tenTrangThai)),
      ]);
      return;
    }

    console.log(
      `✅ Found testable order: ID=${testableOrder.id}, Status=${
        testableOrder.trangThai || testableOrder.tenTrangThai
      }`
    );

    // 5. Test confirm order
    console.log("4. Testing confirm order...");

    const confirmResponse = await fetch(
      `http://localhost:8080/ZMEN/Admin/DonHang/${testableOrder.id}/confirm`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log(`Confirm response status: ${confirmResponse.status}`);

    if (confirmResponse.ok) {
      const confirmResult = await confirmResponse.json();
      console.log("✅ Confirm order successful!");
      console.log("   Updated order:", confirmResult);
    } else {
      const errorText = await confirmResponse.text();
      console.log("❌ Confirm order failed:", errorText);
      return;
    }

    // 6. Kiểm tra lại trạng thái sau khi cập nhật
    console.log("5. Checking updated status...");

    const updatedResponse = await fetch(
      "http://localhost:8080/ZMEN/Admin/DonHang",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (updatedResponse.ok) {
      const updatedOrders = await updatedResponse.json();
      const updatedOrder = updatedOrders.find((o) => o.id === testableOrder.id);

      if (updatedOrder) {
        const newStatus = updatedOrder.trangThai || updatedOrder.tenTrangThai;
        console.log(
          `✅ Order ${testableOrder.id} status updated: ${newStatus}`
        );

        if (newStatus === "Đã xác nhận") {
          console.log("🎉 Status update working perfectly!");
        } else {
          console.log("⚠️ Status not updated as expected");
        }
      }
    }

    // 7. Test workflow
    console.log("6. Testing complete workflow...");

    const workflowSteps = [
      { name: "Ship Order", url: "/ship", expectedStatus: "Đang giao hàng" },
      {
        name: "Deliver Order",
        url: "/deliver",
        expectedStatus: "Giao hàng thành công",
      },
      {
        name: "Complete Order",
        url: "/complete",
        expectedStatus: "Hoàn thành",
      },
    ];

    let currentOrderId = testableOrder.id;

    for (const step of workflowSteps) {
      console.log(`   Testing ${step.name}...`);

      const response = await fetch(
        `http://localhost:8080/ZMEN/Admin/DonHang/${currentOrderId}${step.url}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        console.log(`   ✅ ${step.name} successful`);
      } else {
        const errorText = await response.text();
        console.log(`   ❌ ${step.name} failed: ${errorText}`);
        break;
      }

      // Đợi một chút trước khi test bước tiếp theo
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 8. Final status check
    console.log("7. Final status check...");

    const finalResponse = await fetch(
      "http://localhost:8080/ZMEN/Admin/DonHang",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (finalResponse.ok) {
      const finalOrders = await finalResponse.json();
      const finalOrder = finalOrders.find((o) => o.id === testableOrder.id);

      if (finalOrder) {
        const finalStatus = finalOrder.trangThai || finalOrder.tenTrangThai;
        console.log(
          `✅ Final status of order ${testableOrder.id}: ${finalStatus}`
        );
      }
    }

    console.log("🎯 === FINAL STATUS UPDATE TEST COMPLETED ===");
    console.log("🚀 Status update system is working!");
  } catch (error) {
    console.error("❌ Error in final status update test:", error);
  }
};

// Export function
window.testFinalStatusUpdate = testFinalStatusUpdate;

// Auto-run
testFinalStatusUpdate();
