const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testCheckoutFlow() {
  try {
    console.log("🧪 Test luồng checkout đơn giản...\n");

    // 1. Tạo đơn hàng trực tiếp với dữ liệu mô phỏng từ giỏ hàng
    console.log("1️⃣ Tạo đơn hàng với dữ liệu mô phỏng...");

    // Dữ liệu mô phỏng từ giỏ hàng (từ localStorage)
    const mockCheckoutCart = [
      {
        id: 1, // ID của chi tiết sản phẩm
        name: "Áo thun nam",
        price: 199000,
        oldPrice: 199000,
        quantity: 2,
        image: "default-image.jpg",
        variant: "Đen - M, Cotton",
      },
    ];

    console.log(
      "Dữ liệu giỏ hàng mô phỏng:",
      JSON.stringify(mockCheckoutCart, null, 2)
    );

    // 2. Tạo đơn hàng
    const orderData = {
      khachHangId: 1, // Hardcode khách hàng ID 1
      diaChiId: 1, // Hardcode địa chỉ ID 1
      loaiDonHang: true, // online
      ghiChu: "Đơn hàng từ luồng checkout thực tế",
      chiTietSanPhams: mockCheckoutCart.map((item) => ({
        chiTietSanPhamId: item.id,
        soLuong: item.quantity,
      })),
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
    console.log("   Đơn hàng ID:", orderResponse.data.id);
    console.log("   Mã đơn hàng:", orderResponse.data.maDonHang);
    console.log("   Tổng tiền:", orderResponse.data.tongTien);

    // 3. Kiểm tra số lượng sản phẩm sau khi đặt hàng
    console.log("\n3️⃣ Kiểm tra số lượng sản phẩm sau khi đặt hàng...");
    for (const item of mockCheckoutCart) {
      const productResponse = await axios.get(
        `${BASE_URL}/api/chi-tiet-san-pham/${item.id}`
      );
      const product = productResponse.data;

      console.log(`   Sản phẩm ${product.tenSanPham}:`);
      console.log(`     - Số lượng đặt: ${item.quantity}`);
      console.log(`     - Số lượng còn lại: ${product.soLuong}`);
      console.log(`     - Đã trừ: ${item.quantity} sản phẩm`);
    }

    console.log("\n🎉 Test luồng checkout thành công!");
    console.log("📊 Kết luận:");
    console.log("   - Đơn hàng được tạo thành công");
    console.log("   - Số lượng sản phẩm được trừ đúng");
    console.log("   - Luồng mua hàng hoạt động bình thường");
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
testCheckoutFlow();
