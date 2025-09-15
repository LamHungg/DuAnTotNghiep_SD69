// Test script để kiểm tra chức năng tạo đơn hàng POS
const axios = require("axios");

const API_URL = "http://localhost:8080/api";

async function testCreatePOSOrder() {
  try {
    console.log("🔄 Đang test tạo đơn hàng POS...");

    // Test data cho đơn hàng
    const orderData = {
      maDonHang: `POS-TEST-${Date.now()}`,
      khachHangId: null, // Khách lẻ
      voucherId: null,
      phuongThucThanhToan: "Tiền mặt",
      tongThanhToan: 199000,
      ghiChu: "Test đơn hàng POS",
      chiTietDonHang: [
        {
          chiTietSanPhamId: 1,
          soLuong: 1,
          giaBan: 199000,
        },
      ],
    };

    console.log("📦 Dữ liệu đơn hàng:", JSON.stringify(orderData, null, 2));

    // Gọi API tạo đơn hàng
    const response = await axios.post(`${API_URL}/pos/orders`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Tạo đơn hàng thành công!");
    console.log("📋 Response:", JSON.stringify(response.data, null, 2));

    return response.data;
  } catch (error) {
    console.error("❌ Lỗi tạo đơn hàng:");
    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    } else {
      console.error("Error:", error.message);
    }
    throw error;
  }
}

async function testGetProducts() {
  try {
    console.log("🔄 Đang test lấy danh sách sản phẩm...");

    const response = await axios.get(`${API_URL}/pos/products`);

    console.log("✅ Lấy sản phẩm thành công!");
    console.log(`📦 Tổng số sản phẩm: ${response.data.length}`);

    if (response.data.length > 0) {
      console.log(
        "📋 Sản phẩm đầu tiên:",
        JSON.stringify(response.data[0], null, 2)
      );
    }

    return response.data;
  } catch (error) {
    console.error("❌ Lỗi lấy sản phẩm:", error.message);
    throw error;
  }
}

async function runTests() {
  try {
    console.log("🚀 Bắt đầu test POS API...\n");

    // Test 1: Lấy sản phẩm
    await testGetProducts();
    console.log("\n" + "=".repeat(50) + "\n");

    // Test 2: Tạo đơn hàng
    await testCreatePOSOrder();

    console.log("\n🎉 Tất cả test đều thành công!");
  } catch (error) {
    console.error("\n💥 Có lỗi xảy ra trong quá trình test!");
    process.exit(1);
  }
}

// Chạy test
runTests();
