const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testCreateOrder() {
  try {
    console.log("🧪 Bắt đầu test tạo đơn hàng...\n");

    // 1. Đăng nhập để lấy token
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
    console.log("✅ Đăng nhập thành công!");
    console.log("   User ID:", user.id);
    console.log("   Token:", token);

    // 2. Kiểm tra số lượng sản phẩm trước khi đặt hàng
    console.log("\n2️⃣ Kiểm tra số lượng sản phẩm trước khi đặt hàng...");
    const productResponse = await axios.get(`${BASE_URL}/api/san-pham/1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    const product = productResponse.data;
    console.log("✅ Lấy thông tin sản phẩm thành công!");
    console.log("   Sản phẩm:", product.tenSanPham);
    console.log("   Số lượng trước:", product.soLuong);

    // 3. Tạo đơn hàng
    console.log("\n3️⃣ Tạo đơn hàng...");
    const orderData = {
      khachHangId: user.id,
      diaChiId: 1, // Tạm thời hardcode
      loaiDonHang: true, // online
      ghiChu: "Test đơn hàng",
      chiTietSanPhams: [
        {
          chiTietSanPhamId: 1, // ID của chi tiết sản phẩm
          soLuong: 2, // Số lượng đặt
        },
      ],
    };

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

    // 4. Kiểm tra số lượng sản phẩm sau khi đặt hàng
    console.log("\n4️⃣ Kiểm tra số lượng sản phẩm sau khi đặt hàng...");
    const productAfterResponse = await axios.get(`${BASE_URL}/api/san-pham/1`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    const productAfter = productAfterResponse.data;
    console.log("✅ Lấy thông tin sản phẩm sau khi đặt hàng!");
    console.log("   Số lượng sau:", productAfter.soLuong);
    console.log("   Đã trừ:", product.soLuong - productAfter.soLuong);

    // 5. Kiểm tra đơn hàng vừa tạo
    console.log("\n5️⃣ Kiểm tra đơn hàng vừa tạo...");
    const orderDetailResponse = await axios.get(
      `${BASE_URL}/ZMEN/Admin/DonHang/${orderResponse.data.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      }
    );

    console.log("✅ Lấy chi tiết đơn hàng thành công!");
    console.log("   Tổng tiền:", orderDetailResponse.data.tongTienHang);
    console.log(
      "   Số sản phẩm:",
      orderDetailResponse.data.chiTietDonHang?.length || 0
    );

    console.log("\n🎉 Test hoàn thành thành công!");
    console.log("📊 Kết quả:");
    console.log(`   - Số lượng sản phẩm trước: ${product.soLuong}`);
    console.log(`   - Số lượng sản phẩm sau: ${productAfter.soLuong}`);
    console.log(`   - Đã trừ: ${product.soLuong - productAfter.soLuong}`);
    console.log(`   - Đơn hàng ID: ${orderResponse.data.id}`);
  } catch (error) {
    console.error("❌ Test thất bại!");
    console.error("Lỗi:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);
    console.error("URL:", error.config?.url);
  }
}

// Chạy test
testCreateOrder();
