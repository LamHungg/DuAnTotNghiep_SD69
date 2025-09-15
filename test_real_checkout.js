const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testRealCheckout() {
  try {
    console.log("🧪 Test luồng mua hàng thực tế...\n");

    // 1. Đăng nhập
    console.log("1️⃣ Đăng nhập...");
    const loginResponse = await axios.post(
      `${BASE_URL}/api/auth/login`,
      {
        email: "le.b@example.com",
        matKhau: "abc123",
      },
      {
        withCredentials: true,
      }
    );

    const token = loginResponse.data.token;
    const user = loginResponse.data.user;
    console.log("✅ Đăng nhập thành công! User ID:", user.id);

    // 2. Lấy giỏ hàng
    console.log("\n2️⃣ Lấy giỏ hàng...");
    const cartResponse = await axios.get(`${BASE_URL}/api/gio-hang`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    const cartItems = cartResponse.data;
    console.log("✅ Giỏ hàng:", cartItems.length, "sản phẩm");

    if (cartItems.length === 0) {
      console.log("❌ Giỏ hàng trống! Thêm sản phẩm vào giỏ hàng trước.");
      return;
    }

    // 3. Mô phỏng dữ liệu checkout từ localStorage
    console.log("\n3️⃣ Mô phỏng dữ liệu checkout...");
    const checkoutCart = cartItems.map((item) => ({
      id: item.id, // ID của chi tiết sản phẩm
      name: item.tenSanPham,
      price: item.gia,
      oldPrice: item.gia,
      quantity: item.soLuong,
      image: item.hinhAnh || "default-image.jpg",
      variant: `${item.mauSac} - ${item.kichCo}, ${item.chatLieu}`,
    }));

    console.log("Dữ liệu checkout:", JSON.stringify(checkoutCart, null, 2));

    // 4. Tạo đơn hàng với dữ liệu thực tế
    console.log("\n4️⃣ Tạo đơn hàng...");
    const orderData = {
      khachHangId: user.id,
      diaChiId: 1, // Tạm thời hardcode
      loaiDonHang: true, // online
      ghiChu: "Đơn hàng từ luồng mua hàng thực tế",
      chiTietSanPhams: checkoutCart.map((item) => ({
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
          Authorization: `Bearer ${token}`,
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
    for (const item of checkoutCart) {
      const productResponse = await axios.get(
        `${BASE_URL}/api/chi-tiet-san-pham/${item.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      const product = productResponse.data;
      console.log(`   Sản phẩm ${product.tenSanPham}:`);
      console.log(`     - Số lượng đặt: ${item.quantity}`);
      console.log(`     - Số lượng còn lại: ${product.soLuong}`);
    }

    console.log("\n🎉 Test luồng mua hàng thành công!");
  } catch (error) {
    console.error("❌ Test thất bại!");
    console.error("Lỗi:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);
    console.error("URL:", error.config?.url);
  }
}

// Chạy test
testRealCheckout();
