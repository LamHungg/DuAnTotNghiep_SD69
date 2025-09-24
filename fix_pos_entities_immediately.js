const axios = require("axios");

async function fixPosEntitiesImmediately() {
  console.log("🚨 SỬA LỖI POS ENTITIES NGAY LẬP TỨC...");

  const baseURL = "http://localhost:8080/api";

  try {
    // 1. Tạo TrangThaiDonHang ID=5
    console.log("📝 1. Tạo TrangThaiDonHang ID=5...");
    try {
      const trangThaiData = {
        tenTrangThai: "Hoàn thành",
        moTa: "Đơn hàng đã hoàn thành tại quầy POS",
      };
      const response = await axios.post(`${baseURL}/trang-thai`, trangThaiData);
      console.log("✅ TrangThaiDonHang đã được tạo với ID:", response.data.id);
    } catch (error) {
      console.log(
        "⚠️ TrangThaiDonHang có thể đã tồn tại hoặc lỗi:",
        error.response?.data || error.message
      );
    }

    // 2. Tạo DiaChi ID=1
    console.log("📝 2. Tạo DiaChi ID=1...");
    try {
      const diaChiData = {
        diaChiChiTiet: "Tại cửa hàng",
        phuongXa: "Phường 1",
        quanHuyen: "Quận 1",
        tinhThanh: "TP. Hồ Chí Minh",
        loaiDiaChi: "Cửa hàng",
      };
      const response = await axios.post(`${baseURL}/dia-chi`, diaChiData);
      console.log("✅ DiaChi đã được tạo với ID:", response.data.id);
    } catch (error) {
      console.log(
        "⚠️ DiaChi có thể đã tồn tại hoặc lỗi:",
        error.response?.data || error.message
      );
    }

    // 3. Tạo PhuongThucThanhToan ID=1
    console.log("📝 3. Tạo PhuongThucThanhToan ID=1...");
    try {
      const paymentData = {
        tenPhuongThuc: "Tiền mặt",
        moTa: "Thanh toán bằng tiền mặt",
        trangThai: 1,
      };
      const response = await axios.post(
        `${baseURL}/phuong-thuc-thanh-toan`,
        paymentData
      );
      console.log(
        "✅ PhuongThucThanhToan đã được tạo với ID:",
        response.data.id
      );
    } catch (error) {
      console.log(
        "⚠️ PhuongThucThanhToan có thể đã tồn tại hoặc lỗi:",
        error.response?.data || error.message
      );
    }

    // 4. Kiểm tra lại
    console.log("\n🔍 4. Kiểm tra lại các entity...");
    await checkEntities();

    // 5. Test POS order ngay
    console.log("\n🧪 5. Test tạo đơn hàng POS...");
    await testPosOrder();
  } catch (error) {
    console.error("❌ Lỗi trong quá trình sửa:", error.message);
  }
}

async function checkEntities() {
  const baseURL = "http://localhost:8080/api";

  try {
    // Test TrangThaiDonHang
    try {
      const response = await axios.get(`${baseURL}/trang-thai`);
      const hoanThanh = response.data.find(
        (item) => item.tenTrangThai === "Hoàn thành"
      );
      if (hoanThanh) {
        console.log(
          '✅ TrangThaiDonHang "Hoàn thành" tồn tại với ID:',
          hoanThanh.id
        );
      } else {
        console.log('❌ TrangThaiDonHang "Hoàn thành" không tồn tại');
      }
    } catch (error) {
      console.log("❌ Lỗi kiểm tra TrangThaiDonHang:", error.response?.status);
    }

    // Test DiaChi
    try {
      const response = await axios.get(`${baseURL}/dia-chi`);
      const taiCuaHang = response.data.find(
        (item) => item.diaChiChiTiet === "Tại cửa hàng"
      );
      if (taiCuaHang) {
        console.log('✅ DiaChi "Tại cửa hàng" tồn tại với ID:', taiCuaHang.id);
      } else {
        console.log('❌ DiaChi "Tại cửa hàng" không tồn tại');
      }
    } catch (error) {
      console.log("❌ Lỗi kiểm tra DiaChi:", error.response?.status);
    }

    // Test PhuongThucThanhToan
    try {
      const response = await axios.get(`${baseURL}/phuong-thuc-thanh-toan`);
      const tienMat = response.data.find(
        (item) => item.tenPhuongThuc === "Tiền mặt"
      );
      if (tienMat) {
        console.log(
          '✅ PhuongThucThanhToan "Tiền mặt" tồn tại với ID:',
          tienMat.id
        );
      } else {
        console.log('❌ PhuongThucThanhToan "Tiền mặt" không tồn tại');
      }
    } catch (error) {
      console.log(
        "❌ Lỗi kiểm tra PhuongThucThanhToan:",
        error.response?.status
      );
    }
  } catch (error) {
    console.error("❌ Lỗi kiểm tra entities:", error.message);
  }
}

async function testPosOrder() {
  const baseURL = "http://localhost:8080/api";

  try {
    const orderData = {
      maDonHang: `POS${Date.now()}`,
      tongThanhToan: 350000,
      phuongThucThanhToan: "cash",
      ghiChu: "Test đơn hàng POS sau khi sửa",
      khachHangId: null,
      voucherId: null,
      chiTietDonHang: [
        {
          chiTietSanPhamId: 1,
          soLuong: 1,
          giaBan: 350000,
        },
      ],
    };

    console.log("📤 Gửi đơn hàng POS...");
    const response = await axios.post(`${baseURL}/pos/orders`, orderData);
    console.log("✅ Đơn hàng POS đã được tạo thành công!");
    console.log("📊 Response:", response.data);
  } catch (error) {
    console.log(
      "❌ Lỗi tạo đơn hàng POS:",
      error.response?.data || error.message
    );
  }
}

fixPosEntitiesImmediately();
