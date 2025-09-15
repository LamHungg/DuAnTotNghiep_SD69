// Script test cuối cùng cho mapper
// Chạy script này trong browser console khi đang ở trang Admin

const finalMapperTest = async () => {
  try {
    console.log("=== FINAL MAPPER TEST ===");

    // 1. Test API lấy danh sách đơn hàng
    console.log("1. Testing orders API...");

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

      // 2. Phân tích chi tiết dữ liệu
      console.log("2. Detailed data analysis:");

      if (orders.length > 0) {
        const sampleOrder = orders[0];
        console.log("✅ Sample order data:", {
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

        // 3. Kiểm tra từng trường
        console.log("3. Field validation:");

        const fieldChecks = {
          id: !!sampleOrder.id,
          maDonHang: !!sampleOrder.maDonHang,
          ngayDat: !!sampleOrder.ngayDat,
          tongTien: !!sampleOrder.tongTien,
          trangThai: !!sampleOrder.trangThai,
          hoTenNguoiNhan: !!sampleOrder.hoTenNguoiNhan,
          soDienThoaiGiao: !!sampleOrder.soDienThoaiGiao,
          diaChiGiao: !!sampleOrder.diaChiGiao,
          chiTietDonHang: !!(
            sampleOrder.chiTietDonHang && sampleOrder.chiTietDonHang.length > 0
          ),
        };

        Object.entries(fieldChecks).forEach(([field, hasValue]) => {
          console.log(
            `${hasValue ? "✅" : "❌"} ${field}: ${hasValue ? "OK" : "MISSING"}`
          );
        });

        // 4. Kiểm tra chi tiết đơn hàng
        if (
          sampleOrder.chiTietDonHang &&
          sampleOrder.chiTietDonHang.length > 0
        ) {
          console.log("4. Chi tiết đơn hàng validation:");
          const sampleChiTiet = sampleOrder.chiTietDonHang[0];

          const chiTietChecks = {
            id: !!sampleChiTiet.id,
            sanPhamId: !!sampleChiTiet.sanPhamId,
            tenSanPham: !!sampleChiTiet.tenSanPham,
            soLuong: !!sampleChiTiet.soLuong,
            donGia: !!sampleChiTiet.donGia,
            thanhTien: !!sampleChiTiet.thanhTien,
          };

          Object.entries(chiTietChecks).forEach(([field, hasValue]) => {
            console.log(
              `${hasValue ? "✅" : "❌"} ${field}: ${
                hasValue ? "OK" : "MISSING"
              }`
            );
          });
        }

        // 5. Thống kê tổng quan
        console.log("5. Overall statistics:");

        const validOrders = orders.filter(
          (order) =>
            order.id && order.maDonHang && order.ngayDat && order.tongTien
        );

        console.log(`✅ Valid orders: ${validOrders.length}/${orders.length}`);
        console.log(
          `✅ Data quality: ${(
            (validOrders.length / orders.length) *
            100
          ).toFixed(1)}%`
        );

        if (validOrders.length > 0) {
          const totalRevenue = validOrders.reduce(
            (sum, order) => sum + (order.tongTien || 0),
            0
          );
          console.log(
            `✅ Total revenue: ${totalRevenue.toLocaleString("vi-VN")} VND`
          );

          const statusStats = {};
          validOrders.forEach((order) => {
            const status = order.trangThai || "Unknown";
            statusStats[status] = (statusStats[status] || 0) + 1;
          });
          console.log("✅ Status distribution:", statusStats);
        }

        // 6. Đề xuất cải thiện
        console.log("6. Improvement suggestions:");

        const missingFields = Object.entries(fieldChecks)
          .filter(([field, hasValue]) => !hasValue)
          .map(([field]) => field);

        if (missingFields.length > 0) {
          console.log("🔧 Missing fields to fix:", missingFields.join(", "));

          if (missingFields.includes("trangThai")) {
            console.log("   - Check TrangThaiDonHang mapping in mapper");
          }
          if (missingFields.includes("hoTenNguoiNhan")) {
            console.log("   - Check KhachHang mapping in mapper");
          }
          if (missingFields.includes("diaChiGiao")) {
            console.log("   - Check DiaChi mapping in mapper");
          }
        } else {
          console.log("🎉 All fields are properly mapped!");
        }
      } else {
        console.log("⚠️ No orders found");
      }
    } else {
      console.log("❌ Orders API failed:", response.status);
      const errorText = await response.text();
      console.log("❌ Error details:", errorText);
    }

    console.log("=== FINAL MAPPER TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in final mapper test:", error);
  }
};

// Export function
window.finalMapperTest = finalMapperTest;

// Auto-run
finalMapperTest();
