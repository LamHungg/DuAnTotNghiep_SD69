// Script test hình thức đơn hàng
// Chạy script này trong browser console khi đang ở trang Admin

const testHinhThucDonHang = async () => {
  try {
    console.log("🛒 === TESTING HÌNH THỨC ĐƠN HÀNG ===");

    // 1. Test API call
    console.log("1. Testing API call...");

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

      if (orders.length > 0) {
        console.log("2. Analyzing order types:");

        orders.forEach((order, index) => {
          console.log(`   Order ${index + 1}:`, {
            id: order.id,
            maDonHang: order.maDonHang,
            hinhThucDonHang: order.hinhThucDonHang,
            loaiDonHang: order.loaiDonHang,
          });

          // Kiểm tra hình thức đơn hàng
          if (order.hinhThucDonHang) {
            console.log(
              `   ✅ Order ${index + 1} has hinhThucDonHang: ${
                order.hinhThucDonHang
              }`
            );
          } else {
            console.log(`   ❌ Order ${index + 1} missing hinhThucDonHang`);
          }
        });

        // 3. Thống kê hình thức đơn hàng
        console.log("3. Order type statistics:");

        const orderTypes = {};
        orders.forEach((order) => {
          const type = order.hinhThucDonHang || "Không xác định";
          orderTypes[type] = (orderTypes[type] || 0) + 1;
        });

        console.log("   Order types distribution:", orderTypes);

        // 4. Kiểm tra frontend display
        console.log("4. Checking frontend display...");

        const ordersTable = document.querySelector(".orders-table tbody");
        if (ordersTable) {
          const orderRows = ordersTable.querySelectorAll("tr");
          console.log(`   Found ${orderRows.length} rows in table`);

          orderRows.forEach((row, index) => {
            const cells = row.querySelectorAll("td");
            if (cells.length >= 8) {
              const hinhThucCell = cells[3]?.textContent?.trim();
              console.log(`   Row ${index + 1} hinhThuc: "${hinhThucCell}"`);

              if (hinhThucCell && hinhThucCell !== "") {
                console.log(
                  `   ✅ Row ${index + 1} displays order type correctly`
                );
              } else {
                console.log(
                  `   ❌ Row ${index + 1} missing order type display`
                );
              }
            }
          });
        } else {
          console.log("   ❌ Orders table not found");
        }

        // 5. Final assessment
        console.log("5. Final assessment:");

        const hasHinhThucInAPI = orders.some((order) => order.hinhThucDonHang);
        const hasHinhThucInUI = Array.from(
          document.querySelectorAll(".orders-table tbody tr")
        ).some((row) => {
          const cells = row.querySelectorAll("td");
          return cells.length >= 8 && cells[3]?.textContent?.trim() !== "";
        });

        if (hasHinhThucInAPI && hasHinhThucInUI) {
          console.log("🎉 Hình thức đơn hàng working perfectly!");
          console.log("✅ API returns hinhThucDonHang");
          console.log("✅ Frontend displays order types correctly");
          console.log("🚀 Feature is ready!");
        } else {
          console.log("⚠️ Issues found:");
          if (!hasHinhThucInAPI)
            console.log("   - API missing hinhThucDonHang");
          if (!hasHinhThucInUI)
            console.log("   - Frontend not displaying order types");
        }
      } else {
        console.log("⚠️ No orders found to analyze");
      }
    } else {
      console.log("❌ API call failed:", response.status);
    }

    console.log("🛒 === HÌNH THỨC ĐƠN HÀNG TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in hinhThucDonHang test:", error);
  }
};

// Export function
window.testHinhThucDonHang = testHinhThucDonHang;

// Auto-run
testHinhThucDonHang();
