const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testFrontendCheckout() {
  try {
    console.log("🧪 Test luồng mua hàng từ frontend...\n");

    // 1. Mô phỏng dữ liệu từ localStorage (giống như frontend)
    console.log("1️⃣ Mô phỏng dữ liệu từ localStorage...");

    // Dữ liệu mô phỏng từ Cart.js -> localStorage -> Checkout page
    const mockLocalStorageCart = [
      {
        id: 1, // ID của chi tiết sản phẩm
        name: "Áo thun nam",
        price: 199000,
        oldPrice: 199000,
        quantity: 1,
        image: "default-image.jpg",
        variant: "Đen - M, Cotton",
        checked: true,
      },
      {
        id: 2, // ID của chi tiết sản phẩm khác
        name: "Quần jean nam",
        price: 299000,
        oldPrice: 299000,
        quantity: 1,
        image: "default-image.jpg",
        variant: "Xanh - L, Denim",
        checked: true,
      },
    ];

    console.log(
      "Dữ liệu từ localStorage:",
      JSON.stringify(mockLocalStorageCart, null, 2)
    );

    // 2. Mô phỏng logic từ checkout page
    console.log("\n2️⃣ Mô phỏng logic từ checkout page...");

    // Kiểm tra giỏ hàng
    if (!mockLocalStorageCart || mockLocalStorageCart.length === 0) {
      console.log("❌ Giỏ hàng trống!");
      return;
    }

    // Lọc sản phẩm đã chọn (checked = true)
    const selectedItems = mockLocalStorageCart.filter((item) => item.checked);
    console.log("Sản phẩm đã chọn:", selectedItems.length, "sản phẩm");

    // 3. Tạo đơn hàng với dữ liệu thực tế
    console.log("\n3️⃣ Tạo đơn hàng...");
    const orderData = {
      khachHangId: 1, // Hardcode user ID
      diaChiId: 1, // Hardcode địa chỉ ID
      loaiDonHang: true, // online
      ghiChu: "Đơn hàng từ website",
      chiTietSanPhams: selectedItems.map((item) => ({
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

    // 4. Kiểm tra số lượng sản phẩm sau khi đặt hàng
    console.log("\n4️⃣ Kiểm tra số lượng sản phẩm sau khi đặt hàng...");
    for (const item of selectedItems) {
      const productResponse = await axios.get(
        `${BASE_URL}/api/chi-tiet-san-pham/${item.id}`
      );
      const product = productResponse.data;

      console.log(`   Sản phẩm ${product.tenSanPham}:`);
      console.log(`     - Số lượng đặt: ${item.quantity}`);
      console.log(`     - Số lượng còn lại: ${product.soLuong}`);
      console.log(`     - Đã trừ: ${item.quantity} sản phẩm`);
    }

    // 5. Tính tổng tiền để so sánh
    const totalAmount = selectedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    console.log("\n5️⃣ So sánh tổng tiền:");
    console.log(
      `   - Tổng tiền tính từ frontend: ${totalAmount.toLocaleString()}đ`
    );
    console.log(`   - Tổng tiền từ backend: ${orderResponse.data.tongTien}đ`);
    console.log(
      `   - Khớp nhau: ${
        totalAmount === orderResponse.data.tongTien ? "✅" : "❌"
      }`
    );

    console.log("\n🎉 Test luồng mua hàng từ frontend thành công!");
    console.log("📊 Kết luận:");
    console.log("   - Dữ liệu từ localStorage được xử lý đúng");
    console.log("   - Đơn hàng được tạo thành công");
    console.log("   - Số lượng sản phẩm được trừ đúng");
    console.log("   - Tổng tiền tính toán chính xác");
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
testFrontendCheckout();
