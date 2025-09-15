// Script test API endpoints cho order status updates
// Chạy script này trong browser console khi đang ở trang Admin

const testAPIEndpoints = async () => {
  try {
    console.log("🔍 === TESTING API ENDPOINTS ===");

    // 1. Kiểm tra authentication
    console.log("1. Checking authentication...");
    const token = localStorage.getItem("token");
    if (!token) {
      console.log("❌ No token found - please login first");
      return;
    }
    console.log("✅ Token found");

    // 2. Lấy danh sách đơn hàng để tìm đơn hàng test
    console.log("2. Fetching orders to find testable order...");

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

    // 3. Tìm đơn hàng có thể test (trạng thái "Chờ xác nhận")
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

    // 4. Test confirm order endpoint
    console.log("3. Testing confirm order endpoint...");

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
      console.log("✅ Confirm order successful:", confirmResult);
    } else {
      const errorText = await confirmResponse.text();
      console.log("❌ Confirm order failed:", errorText);
    }

    // 5. Test các endpoints khác
    console.log("4. Testing other endpoints...");

    const endpoints = [
      { name: "Ship Order", url: `/ship`, method: "POST" },
      { name: "Deliver Order", url: `/deliver`, method: "POST" },
      { name: "Complete Order", url: `/complete`, method: "POST" },
      { name: "Cancel Order", url: `/cancel`, method: "POST" },
    ];

    for (const endpoint of endpoints) {
      try {
        const response = await fetch(
          `http://localhost:8080/ZMEN/Admin/DonHang/${testableOrder.id}${endpoint.url}`,
          {
            method: endpoint.method,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(`${endpoint.name} status: ${response.status}`);

        if (response.ok) {
          const result = await response.json();
          console.log(`✅ ${endpoint.name} successful`);
        } else {
          const errorText = await response.text();
          console.log(`❌ ${endpoint.name} failed: ${errorText}`);
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name} error: ${error.message}`);
      }
    }

    // 6. Kiểm tra lại trạng thái đơn hàng sau khi test
    console.log("5. Checking order status after tests...");

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
      const updatedOrder = finalOrders.find((o) => o.id === testableOrder.id);

      if (updatedOrder) {
        console.log(
          `✅ Order ${testableOrder.id} final status: ${
            updatedOrder.trangThai || updatedOrder.tenTrangThai
          }`
        );
      }
    }

    console.log("🔍 === API ENDPOINTS TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in API endpoints test:", error);
  }
};

// Export function
window.testAPIEndpoints = testAPIEndpoints;

// Auto-run
testAPIEndpoints();
