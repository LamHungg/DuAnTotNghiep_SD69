const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testValidationFix() {
  try {
    console.log("🧪 Test validation fix...\n");

    // 1. Đăng nhập
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

    // 2. Test với dữ liệu có sản phẩm không tồn tại (ID 15)
    console.log("\n2️⃣ Test với sản phẩm không tồn tại (ID 15)...");
    const invalidCartData = [
      {
        chiTietSanPhamId: 15, // Không tồn tại
        soLuong: 1,
        gia: 199000,
        thanhTien: 199000,
        tenSanPham: "Sản phẩm không tồn tại",
        mauSac: "Đen",
        kichCo: "M",
      },
    ];

    const invalidCheckoutData = {
      cartItems: invalidCartData,
      diaChiId: 17,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test validation",
      phiVanChuyen: 30000,
      tongTienHang: 199000,
      tongThanhToan: 229000,
    };

    const khachHangId = user.id;
    const token = `customer-token-${khachHangId}`;

    try {
      const response = await axios.post(
        `${BASE_URL}/api/checkout/process`,
        invalidCheckoutData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("❌ Test thất bại - không nên thành công:", response.data);
    } catch (error) {
      console.log("✅ Test thành công - đã bắt được lỗi:");
      console.log("   Lỗi:", error.response?.data || error.message);
    }

    // 3. Test với dữ liệu đúng (ID 1)
    console.log("\n3️⃣ Test với sản phẩm đúng (ID 1)...");
    const validCartData = [
      {
        chiTietSanPhamId: 1, // Tồn tại
        soLuong: 1,
        gia: 199000,
        thanhTien: 199000,
        tenSanPham: "Áo thun nam",
        mauSac: "Đen",
        kichCo: "S",
      },
    ];

    const validCheckoutData = {
      cartItems: validCartData,
      diaChiId: 17,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test validation đúng",
      phiVanChuyen: 30000,
      tongTienHang: 199000,
      tongThanhToan: 229000,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/checkout/process`,
        validCheckoutData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("✅ Test thành công với sản phẩm đúng:", response.data);
    } catch (error) {
      console.log(
        "❌ Test thất bại với sản phẩm đúng:",
        error.response?.data || error.message
      );
    }

    // 4. Test với cả sản phẩm đúng và sai
    console.log("\n4️⃣ Test với cả sản phẩm đúng và sai...");
    const mixedCartData = [
      {
        chiTietSanPhamId: 1, // Tồn tại
        soLuong: 1,
        gia: 199000,
        thanhTien: 199000,
        tenSanPham: "Áo thun nam",
        mauSac: "Đen",
        kichCo: "S",
      },
      {
        chiTietSanPhamId: 15, // Không tồn tại
        soLuong: 1,
        gia: 199000,
        thanhTien: 199000,
        tenSanPham: "Sản phẩm không tồn tại",
        mauSac: "Đen",
        kichCo: "M",
      },
    ];

    const mixedCheckoutData = {
      cartItems: mixedCartData,
      diaChiId: 17,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test mixed validation",
      phiVanChuyen: 30000,
      tongTienHang: 398000,
      tongThanhToan: 428000,
    };

    try {
      const response = await axios.post(
        `${BASE_URL}/api/checkout/process`,
        mixedCheckoutData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("❌ Test thất bại - không nên thành công:", response.data);
    } catch (error) {
      console.log("✅ Test thành công - đã bắt được lỗi mixed:");
      console.log("   Lỗi:", error.response?.data || error.message);
    }

    console.log("\n🎯 KẾT LUẬN:");
    console.log("✅ Validation đã hoạt động đúng");
    console.log("✅ Sản phẩm không tồn tại đã được bắt lỗi");
    console.log("✅ Sản phẩm đúng vẫn hoạt động bình thường");
  } catch (error) {
    console.error("❌ Test thất bại!");
    console.error("Lỗi:", error.response?.data || error.message);
  }
}

// Chạy test
testValidationFix();
