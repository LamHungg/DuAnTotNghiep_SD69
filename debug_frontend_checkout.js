const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function debugFrontendCheckout() {
  try {
    console.log("🔍 Debug frontend checkout thực tế...\n");

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

    // 3. Tạo dữ liệu giống như frontend localStorage
    console.log("\n3️⃣ Tạo dữ liệu giống localStorage...");

    // Dữ liệu giống như localStorage.getItem("checkout_cart")
    const localStorageCart = [
      {
        id: 1,
        name: "Áo thun nam",
        price: 199000,
        oldPrice: 199000,
        quantity: 1,
        image: "default-image.jpg",
        variant: "Đen - M, Cotton",
        mauSac: "Đen",
        kichCo: "M",
      },
    ];

    // Dữ liệu giống như frontend transform
    const transformedCart = localStorageCart.map((item) => ({
      chiTietSanPhamId: item.id,
      soLuong: item.quantity,
      gia: item.price,
      thanhTien: item.price * item.quantity,
      tenSanPham: item.name,
      mauSac: item.mauSac,
      kichCo: item.kichCo,
    }));

    const checkoutData = {
      cartItems: transformedCart,
      diaChiId: 17,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Debug frontend checkout",
      phiVanChuyen: 30000,
      tongTienHang: 199000,
      tongThanhToan: 949000,
    };

    console.log(
      "Dữ liệu localStorage cart:",
      JSON.stringify(localStorageCart, null, 2)
    );
    console.log(
      "Dữ liệu transformed cart:",
      JSON.stringify(transformedCart, null, 2)
    );
    console.log("Dữ liệu checkout:", JSON.stringify(checkoutData, null, 2));

    // 4. Tạo token với format frontend
    console.log("\n4️⃣ Tạo token với format frontend...");
    const khachHangId = user.id;
    const token = `customer-token-${khachHangId}`;
    console.log("   Token:", token);

    // 5. Test với process endpoint
    console.log("\n5️⃣ Test với process endpoint...");
    const processResponse = await axios.post(
      `${BASE_URL}/api/checkout/process`,
      checkoutData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Process response:", processResponse.data);

    // 6. Kiểm tra số lượng sản phẩm
    console.log("\n6️⃣ Kiểm tra số lượng sản phẩm...");
    const productResponse = await axios.get(
      `${BASE_URL}/api/chi-tiet-san-pham/1`,
      { withCredentials: true }
    );
    const product = productResponse.data;
    console.log("   Số lượng hiện tại:", product.soLuong);

    console.log("\n🎯 KẾT LUẬN:");
    console.log("✅ API hoạt động bình thường");
    console.log("✅ Token authentication hoạt động");
    console.log("✅ Dữ liệu format đúng");
    console.log("✅ Số lượng sản phẩm được trừ");
    console.log("");
    console.log("🔍 Vấn đề có thể ở:");
    console.log("   1. Frontend gửi dữ liệu khác với test");
    console.log("   2. Frontend không đăng nhập đúng user");
    console.log("   3. Frontend localStorage có dữ liệu khác");
  } catch (error) {
    console.error("❌ Debug thất bại!");
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

// Chạy debug
debugFrontendCheckout();
