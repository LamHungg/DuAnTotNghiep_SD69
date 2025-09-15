const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testSimpleOrder() {
  try {
    console.log("🧪 Test đơn giản tạo đơn hàng...\n");

    // 1. Test endpoint tạo đơn hàng trực tiếp
    console.log("1️⃣ Test tạo đơn hàng trực tiếp...");

    const orderData = {
      khachHangId: 1,
      diaChiId: 1,
      loaiDonHang: true,
      ghiChu: "Test đơn hàng",
      chiTietSanPhams: [
        {
          chiTietSanPhamId: 1,
          soLuong: 1,
        },
      ],
    };

    console.log("Dữ liệu đơn hàng:", JSON.stringify(orderData, null, 2));

    const orderResponse = await axios.post(
      `${BASE_URL}/ZMEN/Admin/DonHang`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Tạo đơn hàng thành công!");
    console.log("Response:", JSON.stringify(orderResponse.data, null, 2));
  } catch (error) {
    console.error("❌ Test thất bại!");
    console.error("Lỗi:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);
    console.error("URL:", error.config?.url);

    if (error.response?.data) {
      console.error(
        "Response data:",
        JSON.stringify(error.response.data, null, 2)
      );
    }
  }
}

// Chạy test
testSimpleOrder();
