const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testFrontendCheckoutFlow() {
  try {
    console.log("🧪 Test luồng frontend checkout chính xác...\n");

    // 1. Đăng nhập để lấy user data (giống như frontend)
    console.log("1️⃣ Đăng nhập...");
    const loginResponse = await axios.post(
      `${BASE_URL}/zmen/dang-nhap`,
      {
        taiKhoan: "test2@example.com",
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
      `${BASE_URL}/api/chi-tiet-san-pham/1`,
      { withCredentials: true }
    );
    const productBefore = productBeforeResponse.data;
    console.log("   Sản phẩm:", productBefore.tenSanPham);
    console.log("   Số lượng trước:", productBefore.soLuong);

    // 3. Tạo dữ liệu checkout (giống như frontend)
    console.log("\n3️⃣ Tạo dữ liệu checkout...");
    const checkoutData = {
      cartItems: [
        {
          chiTietSanPhamId: 1,
          soLuong: 1,
          gia: 199000,
        },
      ],
      diaChiId: 17,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test frontend checkout flow",
      tongTienHang: 199000,
      tongThanhToan: 949000,
      phiVanChuyen: 30000,
    };

    console.log("Dữ liệu checkout:", JSON.stringify(checkoutData, null, 2));

    // 4. Tạo token với format mà frontend sử dụng
    console.log("\n4️⃣ Tạo token với format frontend...");
    const khachHangId = user.id;
    const token = `customer-token-${khachHangId}`;
    console.log("   Token:", token);

    // 5. Gọi API checkout với token đúng format
    console.log("\n5️⃣ Gọi API checkout...");
    const checkoutResponse = await axios.post(
      `${BASE_URL}/api/checkout/process`,
      checkoutData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Checkout thành công!");
    console.log("   Response:", JSON.stringify(checkoutResponse.data, null, 2));

    // 6. Kiểm tra số lượng sản phẩm sau khi đặt hàng
    console.log("\n6️⃣ Kiểm tra số lượng sản phẩm sau khi đặt hàng...");
    const productAfterResponse = await axios.get(
      `${BASE_URL}/api/chi-tiet-san-pham/1`,
      { withCredentials: true }
    );
    const productAfter = productAfterResponse.data;

    console.log("   Số lượng sau:", productAfter.soLuong);
    console.log("   Đã trừ:", productBefore.soLuong - productAfter.soLuong);
    console.log("   Số lượng đặt:", checkoutData.cartItems[0].soLuong);

    // 7. Kết luận
    console.log("\n📊 KẾT QUẢ:");
    if (
      productBefore.soLuong - productAfter.soLuong ===
      checkoutData.cartItems[0].soLuong
    ) {
      console.log("✅ SUCCESS: Số lượng sản phẩm đã được trừ đúng!");
      console.log("   Luồng frontend checkout hoạt động bình thường.");
      console.log("   Vấn đề có thể đã được giải quyết.");
    } else {
      console.log("❌ FAILED: Số lượng sản phẩm không được trừ!");
      console.log("   Có vấn đề với luồng frontend checkout.");
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
testFrontendCheckoutFlow();
