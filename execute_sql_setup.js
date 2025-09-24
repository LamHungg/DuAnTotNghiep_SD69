const axios = require("axios");

async function executeSQLSetup() {
  console.log("🔧 Executing SQL Setup for POS Entities...");

  // Since we can't directly execute SQL from Node.js without a database connection,
  // we'll create a simple test to verify the entities exist by calling the backend APIs

  const baseURL = "http://localhost:8080/api";

  try {
    // Test if the required entities exist by trying to access them
    console.log("🔍 Testing if required entities exist...");

    // Test TrangThaiDonHang ID=5
    try {
      const trangThaiResponse = await axios.get(`${baseURL}/trang-thai/5`);
      console.log("✅ TrangThaiDonHang ID=5 exists:", trangThaiResponse.data);
    } catch (error) {
      console.log(
        "❌ TrangThaiDonHang ID=5 does not exist:",
        error.response?.status
      );
    }

    // Test DiaChi ID=1
    try {
      const diaChiResponse = await axios.get(`${baseURL}/dia-chi/1`);
      console.log("✅ DiaChi ID=1 exists:", diaChiResponse.data);
    } catch (error) {
      console.log("❌ DiaChi ID=1 does not exist:", error.response?.status);
    }

    // Test PhuongThucThanhToan ID=1
    try {
      const paymentResponse = await axios.get(
        `${baseURL}/phuong-thuc-thanh-toan/1`
      );
      console.log("✅ PhuongThucThanhToan ID=1 exists:", paymentResponse.data);
    } catch (error) {
      console.log(
        "❌ PhuongThucThanhToan ID=1 does not exist:",
        error.response?.status
      );
    }

    console.log("\n📋 INSTRUCTIONS:");
    console.log(
      "1. Open your database management tool (SQL Server Management Studio, etc.)"
    );
    console.log("2. Connect to your database: abcd8");
    console.log("3. Execute the SQL script: create_pos_entities.sql");
    console.log("4. Or manually run these commands:");
    console.log("");
    console.log("-- Insert TrangThaiDonHang for POS");
    console.log(
      "INSERT INTO trang_thai_don_hang (id, ten_trang_thai, mo_ta) VALUES (5, N'Hoàn thành', N'Đơn hàng đã hoàn thành')"
    );
    console.log("");
    console.log("-- Insert DiaChi for POS");
    console.log(
      "INSERT INTO dia_chi (id, dia_chi_chi_tiet, phuong_xa, quan_huyen, tinh_thanh, loai_dia_chi) VALUES (1, N'Tại cửa hàng', N'Phường 1', N'Quận 1', N'TP.HCM', N'Cửa hàng')"
    );
    console.log("");
    console.log("-- Insert PhuongThucThanhToan for POS");
    console.log(
      "INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc, mo_ta, trang_thai) VALUES (1, N'Tiền mặt', N'Thanh toán bằng tiền mặt', 1)"
    );
    console.log("");
    console.log("5. After executing the SQL, run: node test_pos_after_sql.js");
  } catch (error) {
    console.error("❌ Error during setup check:", error.message);
  }
}

executeSQLSetup();
