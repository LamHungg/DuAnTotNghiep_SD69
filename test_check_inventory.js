const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function testInventory() {
  try {
    console.log("🧪 Test kiểm tra tồn kho...\n");

    // 1. Kiểm tra số lượng chi tiết sản phẩm trước khi đặt hàng
    console.log("1️⃣ Kiểm tra số lượng chi tiết sản phẩm trước khi đặt hàng...");

    const chiTietSanPhamBeforeResponse = await axios.get(
      `${BASE_URL}/api/chi-tiet-san-pham/1`
    );
    const chiTietSanPhamBefore = chiTietSanPhamBeforeResponse.data;

    console.log("✅ Thông tin chi tiết sản phẩm trước:");
    console.log("   Tên sản phẩm:", chiTietSanPhamBefore.tenSanPham);
    console.log("   Số lượng tồn kho:", chiTietSanPhamBefore.soLuong);

    // 2. Tạo đơn hàng mới
    console.log("\n2️⃣ Tạo đơn hàng mới...");

    const orderData = {
      khachHangId: 1,
      diaChiId: 1,
      loaiDonHang: true,
      ghiChu: "Test trừ tồn kho",
      chiTietSanPhams: [
        {
          chiTietSanPhamId: 1,
          soLuong: 2, // Đặt 2 sản phẩm
        },
      ],
    };

    const orderResponse = await axios.post(
      `${BASE_URL}/ZMEN/Admin/DonHang`,
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Tạo đơn hàng thành công!");
    console.log("   Đơn hàng ID:", orderResponse.data.id);
    console.log("   Mã đơn hàng:", orderResponse.data.maDonHang);
    console.log("   Tổng tiền:", orderResponse.data.tongTien);

    // 3. Kiểm tra số lượng chi tiết sản phẩm sau khi đặt hàng
    console.log("\n3️⃣ Kiểm tra số lượng chi tiết sản phẩm sau khi đặt hàng...");

    const chiTietSanPhamAfterResponse = await axios.get(
      `${BASE_URL}/api/chi-tiet-san-pham/1`
    );
    const chiTietSanPhamAfter = chiTietSanPhamAfterResponse.data;

    console.log("✅ Thông tin chi tiết sản phẩm sau:");
    console.log("   Số lượng tồn kho:", chiTietSanPhamAfter.soLuong);

    // 4. Tính toán kết quả
    console.log("\n📊 KẾT QUẢ:");
    console.log(`   Số lượng trước: ${chiTietSanPhamBefore.soLuong}`);
    console.log(`   Số lượng sau: ${chiTietSanPhamAfter.soLuong}`);
    console.log(
      `   Đã trừ: ${chiTietSanPhamBefore.soLuong - chiTietSanPhamAfter.soLuong}`
    );
    console.log(`   Số lượng đặt: 2`);

    if (chiTietSanPhamBefore.soLuong - chiTietSanPhamAfter.soLuong === 2) {
      console.log("✅ SUCCESS: Số lượng sản phẩm đã được trừ đúng!");
    } else {
      console.log("❌ FAILED: Số lượng sản phẩm không được trừ!");
    }
  } catch (error) {
    console.error("❌ Test thất bại!");
    console.error("Lỗi:", error.response?.data || error.message);
    console.error("Status:", error.response?.status);
  }
}

// Chạy test
testInventory();
