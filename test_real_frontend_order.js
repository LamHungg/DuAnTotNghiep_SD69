const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testRealFrontendOrder() {
  try {
    console.log("🧪 Test luồng đặt hàng thực tế từ frontend...\n");

    // 1. Đăng nhập để lấy token (giống như frontend)
    console.log("1️⃣ Đăng nhập...");
    const loginResponse = await axios.post(
      `${BASE_URL}/zmen/dang-nhap`,
      {
        taiKhoan: "test2@example.com", // Sử dụng khách hàng mới tạo
        matKhau: "123456",
      },
      {
        withCredentials: true,
      }
    );

    const user = loginResponse.data;
    console.log("✅ Đăng nhập thành công!");
    console.log("   User ID:", user.id);
    console.log("   Email:", user.email);

    // 2. Kiểm tra số lượng sản phẩm trước khi đặt hàng
    console.log("\n2️⃣ Kiểm tra số lượng sản phẩm trước khi đặt hàng...");
    const productBeforeResponse = await axios.get(
      `${BASE_URL}/api/chi-tiet-san-pham/1`
    );
    const productBefore = productBeforeResponse.data;
    console.log("   Sản phẩm:", productBefore.tenSanPham);
    console.log("   Số lượng trước:", productBefore.soLuong);

    // 3. Mô phỏng dữ liệu từ frontend (giống như localStorage)
    console.log("\n3️⃣ Mô phỏng dữ liệu từ frontend...");
    const frontendCartData = [
      {
        id: 1, // ID của chi tiết sản phẩm
        name: "Áo thun nam",
        price: 199000,
        oldPrice: 199000,
        quantity: 1,
        image: "default-image.jpg",
        variant: "Đen - M, Cotton",
      },
    ];

    console.log(
      "Dữ liệu từ frontend:",
      JSON.stringify(frontendCartData, null, 2)
    );

    // 4. Tạo đơn hàng với authentication (giống như frontend)
    console.log("\n4️⃣ Tạo đơn hàng với authentication...");
    const orderData = {
      khachHangId: user.id,
      diaChiId: 1,
      loaiDonHang: true,
      ghiChu: "Đơn hàng từ frontend thực tế",
      chiTietSanPhams: frontendCartData.map((item) => ({
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
        withCredentials: true,
      }
    );

    console.log("✅ Tạo đơn hàng thành công!");
    console.log("   Đơn hàng ID:", orderResponse.data.id);
    console.log("   Mã đơn hàng:", orderResponse.data.maDonHang);
    console.log("   Tổng tiền:", orderResponse.data.tongTien);

    // 5. Kiểm tra số lượng sản phẩm sau khi đặt hàng
    console.log("\n5️⃣ Kiểm tra số lượng sản phẩm sau khi đặt hàng...");
    const productAfterResponse = await axios.get(
      `${BASE_URL}/api/chi-tiet-san-pham/1`
    );
    const productAfter = productAfterResponse.data;

    console.log("   Số lượng sau:", productAfter.soLuong);
    console.log("   Đã trừ:", productBefore.soLuong - productAfter.soLuong);
    console.log("   Số lượng đặt:", frontendCartData[0].quantity);

    // 6. Kết luận
    console.log("\n📊 KẾT QUẢ:");
    if (
      productBefore.soLuong - productAfter.soLuong ===
      frontendCartData[0].quantity
    ) {
      console.log("✅ SUCCESS: Số lượng sản phẩm đã được trừ đúng!");
      console.log("   Luồng đặt hàng từ frontend hoạt động bình thường.");
    } else {
      console.log("❌ FAILED: Số lượng sản phẩm không được trừ!");
      console.log("   Có vấn đề với luồng đặt hàng từ frontend.");
    }
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
testRealFrontendOrder();
