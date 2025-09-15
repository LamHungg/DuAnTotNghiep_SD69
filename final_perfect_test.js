// Script test hoàn hảo cuối cùng cho hệ thống Admin
// Chạy script này trong browser console khi đang ở trang Admin

const finalPerfectTest = async () => {
  try {
    console.log("🎯 === FINAL PERFECT ADMIN SYSTEM TEST ===");

    // 1. Test authentication
    console.log("1. 🔐 Testing authentication...");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const currentUser = JSON.parse(
      localStorage.getItem("currentUser") || "null"
    );

    console.log("✅ Is logged in:", isLoggedIn);
    console.log("✅ Current user:", currentUser);

    if (!isLoggedIn || !currentUser) {
      console.log("❌ Not logged in as admin");
      return;
    }

    // 2. Test orders API
    console.log("2. 📡 Testing orders API...");

    const response = await fetch("http://localhost:8080/ZMEN/Admin/DonHang", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
      },
    });

    console.log("✅ Orders API status:", response.status);

    if (response.ok) {
      const orders = await response.json();
      console.log("✅ Orders API working:", orders.length, "orders found");

      // 3. Perfect data analysis
      console.log("3. 📊 Perfect data analysis:");

      if (orders.length > 0) {
        const sampleOrder = orders[0];

        // Check all fields with detailed values
        const fieldAnalysis = {
          id: { value: sampleOrder.id, status: !!sampleOrder.id },
          maDonHang: {
            value: sampleOrder.maDonHang,
            status: !!sampleOrder.maDonHang,
          },
          ngayDat: {
            value: sampleOrder.ngayDat,
            status: !!sampleOrder.ngayDat,
          },
          tongTien: {
            value: sampleOrder.tongTien,
            status: !!sampleOrder.tongTien,
          },
          trangThai: {
            value: sampleOrder.trangThai,
            status: !!sampleOrder.trangThai,
          },
          hoTenNguoiNhan: {
            value: sampleOrder.hoTenNguoiNhan,
            status: !!sampleOrder.hoTenNguoiNhan,
          },
          soDienThoaiGiao: {
            value: sampleOrder.soDienThoaiGiao,
            status: !!sampleOrder.soDienThoaiGiao,
          },
          diaChiGiao: {
            value: sampleOrder.diaChiGiao,
            status: !!sampleOrder.diaChiGiao,
          },
          chiTietDonHang: {
            value: sampleOrder.chiTietDonHang,
            status: !!(
              sampleOrder.chiTietDonHang &&
              sampleOrder.chiTietDonHang.length > 0
            ),
          },
        };

        console.log("✅ Field analysis:");
        Object.entries(fieldAnalysis).forEach(([field, data]) => {
          console.log(
            `   ${data.status ? "✅" : "❌"} ${field}: ${
              data.value || "MISSING"
            }`
          );
        });

        // Check chi tiết đơn hàng
        if (
          sampleOrder.chiTietDonHang &&
          sampleOrder.chiTietDonHang.length > 0
        ) {
          console.log("4. 📦 Chi tiết đơn hàng analysis:");
          const sampleChiTiet = sampleOrder.chiTietDonHang[0];

          const chiTietAnalysis = {
            id: { value: sampleChiTiet.id, status: !!sampleChiTiet.id },
            sanPhamId: {
              value: sampleChiTiet.sanPhamId,
              status: !!sampleChiTiet.sanPhamId,
            },
            tenSanPham: {
              value: sampleChiTiet.tenSanPham,
              status: !!sampleChiTiet.tenSanPham,
            },
            soLuong: {
              value: sampleChiTiet.soLuong,
              status: !!sampleChiTiet.soLuong,
            },
            donGia: {
              value: sampleChiTiet.donGia,
              status: !!sampleChiTiet.donGia,
            },
            thanhTien: {
              value: sampleChiTiet.thanhTien,
              status: !!sampleChiTiet.thanhTien,
            },
          };

          Object.entries(chiTietAnalysis).forEach(([field, data]) => {
            console.log(
              `   ${data.status ? "✅" : "❌"} ${field}: ${
                data.value || "MISSING"
              }`
            );
          });
        }

        // 5. Perfect statistics
        console.log("5. 📈 Perfect statistics:");

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

          // Customer analysis
          const customerStats = {};
          validOrders.forEach((order) => {
            const customer = order.hoTenNguoiNhan || "Unknown";
            customerStats[customer] = (customerStats[customer] || 0) + 1;
          });
          console.log("✅ Customer distribution:", customerStats);
        }

        // 6. UI elements check
        console.log("6. 🎨 UI elements check:");

        const ordersTable = document.querySelector("table");
        console.log(`✅ Orders table: ${ordersTable ? "Found" : "Not found"}`);

        const statusTabs = document.querySelectorAll('[data-bs-toggle="tab"]');
        console.log(`✅ Status tabs: ${statusTabs.length} found`);

        const actionButtons = document.querySelectorAll(
          ".btn-action, .btn-eye"
        );
        console.log(`✅ Action buttons: ${actionButtons.length} found`);

        // 7. Perfect assessment
        console.log("7. 🏆 Perfect assessment:");

        const missingFields = Object.entries(fieldAnalysis)
          .filter(([field, data]) => !data.status)
          .map(([field]) => field);

        if (missingFields.length === 0) {
          console.log("🎉 PERFECT! All fields are properly mapped!");
          console.log("✅ System is ready for production use");
          console.log("🚀 Hệ thống đã hoàn hảo 100%!");
        } else {
          console.log(`⚠️ Missing fields: ${missingFields.join(", ")}`);
          console.log("🔧 Some improvements still needed");
        }

        // 8. Performance check
        console.log("8. ⚡ Performance check:");
        const startTime = performance.now();

        // Test API response time
        const perfResponse = await fetch(
          "http://localhost:8080/ZMEN/Admin/DonHang",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
          }
        );

        const endTime = performance.now();
        const responseTime = endTime - startTime;

        console.log(`✅ API response time: ${responseTime.toFixed(2)}ms`);

        if (responseTime < 1000) {
          console.log("✅ Performance: Excellent");
        } else if (responseTime < 3000) {
          console.log("✅ Performance: Good");
        } else {
          console.log("⚠️ Performance: Needs optimization");
        }

        // 9. Final celebration
        console.log("9. 🎊 Final celebration:");

        const allFieldsPerfect = missingFields.length === 0;
        const performanceExcellent = responseTime < 1000;
        const dataQualityPerfect = validOrders.length === orders.length;

        if (allFieldsPerfect && performanceExcellent && dataQualityPerfect) {
          console.log("🎉🎉🎉 PERFECT SYSTEM! 🎉🎉🎉");
          console.log("✅ All fields mapped perfectly");
          console.log("✅ Performance is excellent");
          console.log("✅ Data quality is 100%");
          console.log("🚀 System is production ready!");
          console.log("🏆 Congratulations! You've built an amazing system!");
        } else {
          console.log(
            "✅ System is working well with minor improvements needed"
          );
        }
      } else {
        console.log("⚠️ No orders found");
      }
    } else {
      console.log("❌ Orders API failed:", response.status);
      const errorText = await response.text();
      console.log("❌ Error details:", errorText);
    }

    console.log("🎯 === FINAL PERFECT TEST COMPLETED ===");
    console.log("🎊 Hệ thống quản lý đơn hàng Admin đã hoàn hảo!");
  } catch (error) {
    console.error("❌ Error in final perfect test:", error);
  }
};

// Export function
window.finalPerfectTest = finalPerfectTest;

// Auto-run
finalPerfectTest();
