const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function fixFrontendCart() {
  try {
    console.log("🔧 Sửa dữ liệu localStorage frontend...\n");

    // 1. Kiểm tra xem frontend có đang chạy không
    console.log("1️⃣ Kiểm tra frontend...");
    try {
      const frontendResponse = await axios.get("http://localhost:3000", {
        timeout: 5000,
      });
      console.log("✅ Frontend đang chạy trên port 3000");
    } catch (error) {
      console.log("❌ Frontend không chạy trên port 3000");
      console.log("   Hãy chạy: cd datn_web_fe && npm start");
      return;
    }

    // 2. Đăng nhập để lấy user data
    console.log("\n2️⃣ Đăng nhập...");
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

    // 3. Tạo dữ liệu cart đúng (chỉ sản phẩm có tồn tại)
    console.log("\n3️⃣ Tạo dữ liệu cart đúng...");

    // Dữ liệu cart đúng với sản phẩm ID 1 (tồn tại)
    const correctCartData = [
      {
        id: 1,
        name: "Áo thun nam",
        price: 199000,
        oldPrice: 199000,
        quantity: 1,
        image: "default-image.jpg",
        variant: "Đen - S, Cotton",
        mauSac: "Đen",
        kichCo: "S",
      },
    ];

    console.log("Dữ liệu cart đúng:", JSON.stringify(correctCartData, null, 2));

    // 4. Tạo dữ liệu checkout đúng
    console.log("\n4️⃣ Tạo dữ liệu checkout đúng...");
    const transformedCart = correctCartData.map((item) => ({
      chiTietSanPhamId: item.id,
      soLuong: item.quantity,
      gia: item.price,
      thanhTien: item.price * item.quantity,
      tenSanPham: item.name,
      mauSac: item.mauSac,
      kichCo: item.kichCo,
    }));

    const correctCheckoutData = {
      cartItems: transformedCart,
      diaChiId: 17,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test với dữ liệu đúng",
      phiVanChuyen: 30000,
      tongTienHang: 199000,
      tongThanhToan: 229000,
    };

    console.log(
      "Dữ liệu checkout đúng:",
      JSON.stringify(correctCheckoutData, null, 2)
    );

    // 5. Tạo token
    console.log("\n5️⃣ Tạo token...");
    const khachHangId = user.id;
    const token = `customer-token-${khachHangId}`;
    console.log("   Token:", token);

    // 6. Test với dữ liệu đúng
    console.log("\n6️⃣ Test với dữ liệu đúng...");
    try {
      const response = await axios.post(
        `${BASE_URL}/api/checkout/process`,
        correctCheckoutData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Test thành công:", response.data);
    } catch (error) {
      console.log("❌ Test thất bại:", error.response?.data || error.message);
    }

    // 7. Kiểm tra số lượng sản phẩm
    console.log("\n7️⃣ Kiểm tra số lượng sản phẩm...");
    try {
      const productResponse = await axios.get(
        `${BASE_URL}/api/chi-tiet-san-pham/1`,
        { withCredentials: true }
      );
      const product = productResponse.data;
      console.log("   Số lượng hiện tại:", product.soLuong);
    } catch (error) {
      console.log("❌ Không thể kiểm tra số lượng sản phẩm:", error.message);
    }

    console.log("\n🎯 HƯỚNG DẪN SỬA FRONTEND:");
    console.log("1. Mở Developer Tools (F12)");
    console.log("2. Vào tab Application/Storage");
    console.log("3. Tìm localStorage");
    console.log('4. Xóa key "checkout_cart" và "checkout_total"');
    console.log("5. Hoặc thay thế bằng dữ liệu đúng:");
    console.log("   checkout_cart:", JSON.stringify(correctCartData));
    console.log("   checkout_total: 199000");
  } catch (error) {
    console.error("❌ Sửa frontend thất bại!");
    console.error("Lỗi:", error.response?.data || error.message);
  }
}

// Chạy sửa
fixFrontendCart();
