// Script test POS order sau khi chạy SQL tạo entities
const axios = require("axios");

async function testPOSOrderAfterSQL() {
  console.log("🔍 Testing POS Order After SQL Setup...\n");

  const baseURL = "http://localhost:8080/api";

  // Test data cho đơn hàng POS
  const orderData = {
    maDonHang: "POS" + Date.now(),
    tongThanhToan: 670000,
    phuongThucThanhToan: "cash",
    ghiChu: "Đơn hàng test POS sau khi setup SQL",
    khachHangId: null, // Có thể null cho khách vãng lai
    voucherId: null,
    chiTietDonHang: [
      {
        chiTietSanPhamId: 1, // ID sản phẩm thực tế
        soLuong: 1,
        giaBan: 670000,
      },
    ],
  };

  try {
    console.log("📋 Testing: Tạo đơn hàng POS");
    console.log("🔗 URL: " + baseURL + "/pos/orders");
    console.log("📊 Data:", JSON.stringify(orderData, null, 2));

    const response = await axios.post(`${baseURL}/pos/orders`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 15000,
    });

    console.log("✅ Status: " + response.status);
    console.log("📊 Response:", JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      console.log("🎉 Đơn hàng tạo thành công!");
      console.log("📋 Order ID: " + response.data.donHangId);
      console.log("📋 Order Code: " + response.data.maDonHang);

      // Test Statistics API để xem đơn hàng có xuất hiện không
      console.log("\n🔍 Testing Statistics API...");
      await testStatisticsAfterOrder();
    }
  } catch (error) {
    console.log("❌ Error: " + (error.response?.status || error.message));
    if (error.response?.data) {
      console.log(
        "📊 Error Data:",
        JSON.stringify(error.response.data, null, 2)
      );
    }
  }
}

async function testStatisticsAfterOrder() {
  const baseURL = "http://localhost:8080/zmen";

  try {
    console.log("📋 Testing: Thống kê tổng quan");
    const response = await axios.get(`${baseURL}/tong-quan`, { timeout: 5000 });
    console.log("✅ Status: " + response.status);
    console.log("📊 Data:", JSON.stringify(response.data, null, 2));

    if (response.data.doanhThuHomNay > 0) {
      console.log("🎉 Doanh thu hôm nay > 0 - Đơn hàng POS đã được tính!");
    } else {
      console.log(
        "⚠️ Doanh thu hôm nay = 0 - Có thể cần thời gian để cập nhật"
      );
    }
  } catch (error) {
    console.log("❌ Error testing statistics: " + error.message);
  }
}

async function runPOSTestAfterSQL() {
  console.log("🚀 Starting POS Order Test After SQL Setup...\n");

  await testPOSOrderAfterSQL();

  console.log("\n📋 SUMMARY:");
  console.log("If successful:");
  console.log("1. POS order created successfully");
  console.log("2. Order details saved to database");
  console.log("3. Stock updated");
  console.log("4. Statistics should show real data");

  console.log("\n🔧 NEXT STEPS:");
  console.log("1. Check Statistics page for real data");
  console.log("2. Verify order appears in order management");
  console.log("3. Test multiple POS orders");
  console.log("4. Verify stock updates correctly");
}

runPOSTestAfterSQL();
