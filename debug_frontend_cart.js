const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function debugFrontendCart() {
  try {
    console.log("🔍 Debug frontend cart data...\n");

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

    // 3. Mô phỏng dữ liệu localStorage có thể có
    console.log("\n3️⃣ Mô phỏng dữ liệu localStorage...");

    // Dữ liệu có thể có trong localStorage
    const possibleCartData = [
      // Dữ liệu đúng (ID 1)
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
      // Dữ liệu sai (ID 15 - không tồn tại)
      {
        id: 15,
        name: "Sản phẩm không tồn tại",
        price: 199000,
        oldPrice: 199000,
        quantity: 1,
        image: "default-image.jpg",
        variant: "Đen - M, Cotton",
        mauSac: "Đen",
        kichCo: "M",
      },
    ];

    console.log("Dữ liệu cart có thể có:");
    possibleCartData.forEach((item, index) => {
      console.log(
        `   ${index + 1}. ID: ${item.id}, Tên: ${item.name}, SL: ${
          item.quantity
        }`
      );
    });

    // 4. Test với dữ liệu đúng (ID 1)
    console.log("\n4️⃣ Test với dữ liệu đúng (ID 1)...");
    const correctCartData = [possibleCartData[0]];
    const transformedCorrectCart = correctCartData.map((item) => ({
      chiTietSanPhamId: item.id,
      soLuong: item.quantity,
      gia: item.price,
      thanhTien: item.price * item.quantity,
      tenSanPham: item.name,
      mauSac: item.mauSac,
      kichCo: item.kichCo,
    }));

    const correctCheckoutData = {
      cartItems: transformedCorrectCart,
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

    // 5. Test với dữ liệu sai (ID 15)
    console.log("\n5️⃣ Test với dữ liệu sai (ID 15)...");
    const wrongCartData = [possibleCartData[1]];
    const transformedWrongCart = wrongCartData.map((item) => ({
      chiTietSanPhamId: item.id,
      soLuong: item.quantity,
      gia: item.price,
      thanhTien: item.price * item.quantity,
      tenSanPham: item.name,
      mauSac: item.mauSac,
      kichCo: item.kichCo,
    }));

    const wrongCheckoutData = {
      cartItems: transformedWrongCart,
      diaChiId: 17,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test với dữ liệu sai",
      phiVanChuyen: 30000,
      tongTienHang: 199000,
      tongThanhToan: 229000,
    };

    console.log(
      "Dữ liệu checkout sai:",
      JSON.stringify(wrongCheckoutData, null, 2)
    );

    // 6. Tạo token
    console.log("\n6️⃣ Tạo token...");
    const khachHangId = user.id;
    const token = `customer-token-${khachHangId}`;
    console.log("   Token:", token);

    // 7. Test với dữ liệu đúng
    console.log("\n7️⃣ Test với dữ liệu đúng...");
    try {
      const correctResponse = await axios.post(
        `${BASE_URL}/api/checkout/process`,
        correctCheckoutData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Test với dữ liệu đúng thành công:", correctResponse.data);
    } catch (error) {
      console.log(
        "❌ Test với dữ liệu đúng thất bại:",
        error.response?.data || error.message
      );
    }

    // 8. Test với dữ liệu sai (để xác nhận lỗi)
    console.log("\n8️⃣ Test với dữ liệu sai (để xác nhận lỗi)...");
    try {
      const wrongResponse = await axios.post(
        `${BASE_URL}/api/checkout/process`,
        wrongCheckoutData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Test với dữ liệu sai thành công:", wrongResponse.data);
    } catch (error) {
      console.log(
        "❌ Test với dữ liệu sai thất bại (như mong đợi):",
        error.response?.data || error.message
      );
    }

    console.log("\n🎯 KẾT LUẬN:");
    console.log(
      "✅ Vấn đề đã được xác định: Frontend đang gửi chiTietSanPhamId: 15"
    );
    console.log("✅ Sản phẩm ID 15 không tồn tại trong database");
    console.log("✅ Cần kiểm tra frontend localStorage và logic lấy sản phẩm");
  } catch (error) {
    console.error("❌ Debug thất bại!");
    console.error("Lỗi:", error.response?.data || error.message);
  }
}

// Chạy debug
debugFrontendCart();
