const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testFrontendData() {
  try {
    console.log("🧪 Test dữ liệu frontend gửi đi...\n");

    // 1. Đăng nhập để lấy user data
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

    // 2. Tạo dữ liệu giống như frontend
    console.log("\n2️⃣ Tạo dữ liệu giống frontend...");
    const frontendCartData = [
      {
        chiTietSanPhamId: 1,
        soLuong: 1,
        gia: 199000,
        thanhTien: 199000,
        tenSanPham: "Áo thun nam",
        mauSac: "Đen",
        kichCo: "M",
      },
    ];

    const checkoutData = {
      cartItems: frontendCartData,
      diaChiId: 17,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test frontend data",
      phiVanChuyen: 30000,
      tongTienHang: 199000,
      tongThanhToan: 949000,
    };

    console.log("Dữ liệu checkout:", JSON.stringify(checkoutData, null, 2));

    // 3. Tạo token với format frontend
    console.log("\n3️⃣ Tạo token với format frontend...");
    const khachHangId = user.id;
    const token = `customer-token-${khachHangId}`;
    console.log("   Token:", token);

    // 4. Test với test-process endpoint
    console.log("\n4️⃣ Test với test-process endpoint...");
    const testResponse = await axios.post(
      `${BASE_URL}/api/checkout/test-process`,
      checkoutData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log("✅ Test process response:", testResponse.data);

    // 5. Test với process endpoint thực tế
    console.log("\n5️⃣ Test với process endpoint thực tế...");
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
testFrontendData();
