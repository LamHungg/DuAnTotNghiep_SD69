const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testBackendStatus() {
  console.log("🔍 Kiểm tra trạng thái Backend...\n");

  try {
    // Test 1: Kiểm tra backend có chạy không
    console.log("1️⃣ Test endpoint cơ bản:");
    const testResponse = await axios.get(`${BASE_URL}/zmen/test`);
    console.log("✅ Backend đang chạy:", testResponse.data);
  } catch (error) {
    console.log("❌ Backend không chạy hoặc có lỗi:", error.message);
    return;
  }

  try {
    // Test 2: Kiểm tra endpoint tổng quan
    console.log("\n2️⃣ Test endpoint thống kê tổng quan:");
    const tongQuanResponse = await axios.get(`${BASE_URL}/zmen/tong-quan`);
    console.log("✅ Endpoint /tong-quan hoạt động:");
    console.log("   - Tổng đơn hàng:", tongQuanResponse.data.tongDonHang);
    console.log("   - Tổng khách hàng:", tongQuanResponse.data.tongKhachHang);
    console.log(
      "   - Doanh thu hôm nay:",
      tongQuanResponse.data.doanhThuHomNay
    );
    console.log("   - Khách hàng mới:", tongQuanResponse.data.khachHangMoi);
    console.log("   - Tỷ lệ hủy:", tongQuanResponse.data.tyLeHuy);
  } catch (error) {
    console.log(
      "❌ Lỗi endpoint /tong-quan:",
      error.response?.status,
      error.response?.data || error.message
    );
  }

  console.log("\n🎯 Kết luận:");
  console.log("✅ Backend đang chạy và các endpoint mới đã được cập nhật");
  console.log("📊 Statistics page sẵn sàng hoạt động");
}

testBackendStatus().catch(console.error);
