const axios = require("axios");

async function createPosEntitiesViaAPI() {
  console.log("🔧 Tạo POS entities thông qua API...");

  const baseURL = "http://localhost:8080/api";

  try {
    // 1. Tạo TrangThaiDonHang ID=5
    console.log("📝 Tạo TrangThaiDonHang ID=5...");
    try {
      const trangThaiData = {
        id: 5,
        tenTrangThai: "Hoàn thành",
        moTa: "Đơn hàng đã hoàn thành tại quầy POS",
      };
      const trangThaiResponse = await axios.post(
        `${baseURL}/trang-thai`,
        trangThaiData
      );
      console.log(
        "✅ TrangThaiDonHang ID=5 đã được tạo:",
        trangThaiResponse.data
      );
    } catch (error) {
      if (error.response?.status === 409) {
        console.log("ℹ️ TrangThaiDonHang ID=5 đã tồn tại");
      } else {
        console.log(
          "❌ Lỗi tạo TrangThaiDonHang:",
          error.response?.data || error.message
        );
      }
    }

    // 2. Tạo DiaChi ID=1
    console.log("📝 Tạo DiaChi ID=1...");
    try {
      const diaChiData = {
        id: 1,
        diaChiChiTiet: "Tại cửa hàng",
        phuongXa: "Phường 1",
        quanHuyen: "Quận 1",
        tinhThanh: "TP. Hồ Chí Minh",
        loaiDiaChi: "Cửa hàng",
        idKhachHang: null,
      };
      const diaChiResponse = await axios.post(`${baseURL}/dia-chi`, diaChiData);
      console.log("✅ DiaChi ID=1 đã được tạo:", diaChiResponse.data);
    } catch (error) {
      if (error.response?.status === 409) {
        console.log("ℹ️ DiaChi ID=1 đã tồn tại");
      } else {
        console.log(
          "❌ Lỗi tạo DiaChi:",
          error.response?.data || error.message
        );
      }
    }

    // 3. Tạo PhuongThucThanhToan ID=1
    console.log("📝 Tạo PhuongThucThanhToan ID=1...");
    try {
      const paymentData = {
        id: 1,
        tenPhuongThuc: "Tiền mặt",
        moTa: "Thanh toán bằng tiền mặt",
        trangThai: 1,
      };
      const paymentResponse = await axios.post(
        `${baseURL}/phuong-thuc-thanh-toan`,
        paymentData
      );
      console.log(
        "✅ PhuongThucThanhToan ID=1 đã được tạo:",
        paymentResponse.data
      );
    } catch (error) {
      if (error.response?.status === 409) {
        console.log("ℹ️ PhuongThucThanhToan ID=1 đã tồn tại");
      } else {
        console.log(
          "❌ Lỗi tạo PhuongThucThanhToan:",
          error.response?.data || error.message
        );
      }
    }

    // 4. Kiểm tra lại
    console.log("\n🔍 Kiểm tra lại các entity...");
    await executeSQLSetup();
  } catch (error) {
    console.error("❌ Lỗi trong quá trình tạo entities:", error.message);
  }
}

async function executeSQLSetup() {
  const baseURL = "http://localhost:8080/api";

  try {
    // Test TrangThaiDonHang ID=5
    try {
      const trangThaiResponse = await axios.get(`${baseURL}/trang-thai/5`);
      console.log("✅ TrangThaiDonHang ID=5 tồn tại:", trangThaiResponse.data);
    } catch (error) {
      console.log(
        "❌ TrangThaiDonHang ID=5 không tồn tại:",
        error.response?.status
      );
    }

    // Test DiaChi ID=1
    try {
      const diaChiResponse = await axios.get(`${baseURL}/dia-chi/1`);
      console.log("✅ DiaChi ID=1 tồn tại:", diaChiResponse.data);
    } catch (error) {
      console.log("❌ DiaChi ID=1 không tồn tại:", error.response?.status);
    }

    // Test PhuongThucThanhToan ID=1
    try {
      const paymentResponse = await axios.get(
        `${baseURL}/phuong-thuc-thanh-toan/1`
      );
      console.log("✅ PhuongThucThanhToan ID=1 tồn tại:", paymentResponse.data);
    } catch (error) {
      console.log(
        "❌ PhuongThucThanhToan ID=1 không tồn tại:",
        error.response?.status
      );
    }
  } catch (error) {
    console.error("❌ Lỗi kiểm tra entities:", error.message);
  }
}

createPosEntitiesViaAPI();
