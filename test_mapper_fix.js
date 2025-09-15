// Script test mapper đã được sửa
// Chạy script này trong browser console khi đang ở trang Admin

const testMapperFix = async () => {
  try {
    console.log("=== TESTING MAPPER FIX ===");

    // 1. Test API lấy danh sách đơn hàng
    console.log("1. Testing orders API after mapper fix...");

    const response = await fetch("http://localhost:8080/ZMEN/Admin/DonHang", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    console.log("Orders API status:", response.status);

    if (response.ok) {
      const orders = await response.json();
      console.log("✅ Orders API working:", orders.length, "orders found");

      // 2. Kiểm tra dữ liệu đơn hàng
      console.log("2. Checking order data structure:");

      if (orders.length > 0) {
        const sampleOrder = orders[0];
        console.log("✅ Sample order after mapper fix:", {
          id: sampleOrder.id,
          maDonHang: sampleOrder.maDonHang,
          ngayDat: sampleOrder.ngayDat,
          tongTien: sampleOrder.tongTien,
          trangThai: sampleOrder.trangThai,
          hoTenNguoiNhan: sampleOrder.hoTenNguoiNhan,
          soDienThoaiGiao: sampleOrder.soDienThoaiGiao,
          diaChiGiao: sampleOrder.diaChiGiao,
          chiTietDonHang: sampleOrder.chiTietDonHang,
        });

        // 3. Kiểm tra chi tiết đơn hàng
        if (
          sampleOrder.chiTietDonHang &&
          sampleOrder.chiTietDonHang.length > 0
        ) {
          const sampleChiTiet = sampleOrder.chiTietDonHang[0];
          console.log("✅ Sample chi tiết đơn hàng:", {
            id: sampleChiTiet.id,
            sanPhamId: sampleChiTiet.sanPhamId,
            tenSanPham: sampleChiTiet.tenSanPham,
            soLuong: sampleChiTiet.soLuong,
            donGia: sampleChiTiet.donGia,
            thanhTien: sampleChiTiet.thanhTien,
          });
        }

        // 4. Phân tích dữ liệu
        console.log("3. Data analysis:");

        const dataIssues = [];
        const validOrders = [];

        orders.forEach((order, index) => {
          const issues = [];

          if (!order.id) issues.push("Missing ID");
          if (!order.maDonHang) issues.push("Missing maDonHang");
          if (!order.ngayDat) issues.push("Missing ngayDat");
          if (!order.tongTien) issues.push("Missing tongTien");
          if (!order.trangThai) issues.push("Missing trangThai");

          if (issues.length > 0) {
            dataIssues.push({
              orderIndex: index,
              orderId: order.id,
              issues: issues,
            });
          } else {
            validOrders.push(order);
          }
        });

        console.log("✅ Valid orders:", validOrders.length);
        console.log("❌ Orders with issues:", dataIssues.length);

        if (dataIssues.length > 0) {
          console.log("❌ Issues found:");
          dataIssues.forEach((issue) => {
            console.log(
              `   Order ${issue.orderIndex} (ID: ${issue.orderId}):`,
              issue.issues.join(", ")
            );
          });
        } else {
          console.log("🎉 All orders have valid data structure!");
        }

        // 5. Thống kê
        if (validOrders.length > 0) {
          const totalRevenue = validOrders.reduce(
            (sum, order) => sum + (order.tongTien || 0),
            0
          );
          console.log(
            "✅ Total revenue:",
            totalRevenue.toLocaleString("vi-VN"),
            "VND"
          );

          const statusStats = {};
          validOrders.forEach((order) => {
            const status = order.trangThai || "Unknown";
            statusStats[status] = (statusStats[status] || 0) + 1;
          });
          console.log("✅ Status distribution:", statusStats);
        }
      } else {
        console.log("⚠️ No orders found");
      }
    } else {
      console.log("❌ Orders API failed:", response.status);
      const errorText = await response.text();
      console.log("❌ Error details:", errorText);
    }

    console.log("=== MAPPER FIX TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in mapper fix test:", error);
  }
};

// Export function
window.testMapperFix = testMapperFix;

// Auto-run
testMapperFix();
