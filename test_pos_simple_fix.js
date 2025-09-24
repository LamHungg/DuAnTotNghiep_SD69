const axios = require("axios");

async function testPosSimpleFix() {
  console.log("🚨 TEST POS ORDER SAU KHI SỬA CODE...");

  const baseURL = "http://localhost:8080/api";

  try {
    const orderData = {
      maDonHang: `POS${Date.now()}`,
      tongThanhToan: 350000,
      phuongThucThanhToan: "cash",
      ghiChu: "Test đơn hàng POS sau khi sửa code",
      khachHangId: null,
      voucherId: null,
      chiTietDonHang: [
        {
          chiTietSanPhamId: 1,
          soLuong: 1,
          giaBan: 350000,
        },
      ],
    };

    console.log("📤 Gửi đơn hàng POS...");
    console.log("📊 Data:", JSON.stringify(orderData, null, 2));

    const response = await axios.post(`${baseURL}/pos/orders`, orderData, {
      timeout: 10000,
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Đơn hàng POS đã được tạo thành công!");
    console.log("📊 Response:", response.data);

    // Test statistics sau khi tạo đơn hàng
    console.log("\n📈 Kiểm tra thống kê...");
    try {
      const statsResponse = await axios.get(`${baseURL}/thong-ke/tong-quan`);
      console.log("✅ Thống kê tổng quan:", statsResponse.data);
    } catch (error) {
      console.log("⚠️ Lỗi thống kê:", error.response?.data || error.message);
    }
  } catch (error) {
    console.log("❌ Lỗi tạo đơn hàng POS:");
    console.log("   - Status:", error.response?.status);
    console.log("   - Status Text:", error.response?.statusText);
    console.log("   - Response Data:", error.response?.data);
    console.log("   - Error Message:", error.message);

    if (error.response?.status === 500) {
      console.log("\n🔧 HƯỚNG DẪN SỬA LỖI:");
      console.log("1. Backend có thể chưa được restart sau khi sửa code");
      console.log("2. Kiểm tra console backend để xem lỗi chi tiết");
      console.log("3. Đảm bảo tất cả service đã được inject đúng");
      console.log("4. Kiểm tra database connection");
    }
  }
}

testPosSimpleFix();
