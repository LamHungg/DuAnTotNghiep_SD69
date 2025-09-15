// Script tạo đơn hàng test cho hôm nay
// Copy và paste vào Console của browser khi đang ở trang Statistics

const createTodayOrder = () => {
  console.log("🔧 Tạo Đơn Hàng Test Cho Hôm Nay...\n");

  // Tạo đơn hàng test cho hôm nay
  const createTestOrder = async () => {
    try {
      console.log("1️⃣ Tạo đơn hàng test cho hôm nay...");
      
      // Dữ liệu đơn hàng test
      const orderData = {
        maDonHang: `DH${Date.now()}`,
        loaiDonHang: false, // offline
        ngayDat: new Date().toISOString(), // Hôm nay
        tongTienHang: 750000,
        tongThanhToan: 750000,
        khachHang: {
          id: 1, // ID khách hàng test
          hoTen: "Khách hàng Test",
          email: "test@example.com",
          soDienThoai: "0123456789"
        },
        chiTietDonHang: [
          {
            idChiTietSanPham: 1, // ID chi tiết sản phẩm test
            soLuong: 3,
            gia: 250000,
            tienGiamGia: 0,
            phiVanChuyen: 0
          }
        ],
        trangThai: 5, // Hoàn thành
        phuongThucThanhToan: 1, // Tiền mặt
        ghiChuKhachHang: "Đơn hàng test cho hôm nay"
      };

      console.log("📋 Dữ liệu đơn hàng:", orderData);
      
      // Gọi API tạo đơn hàng
      const response = await fetch("http://localhost:8080/api/pos/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Tạo đơn hàng thành công:", result);
        return true;
      } else {
        const error = await response.text();
        console.log("❌ Lỗi tạo đơn hàng:", error);
        return false;
      }
    } catch (error) {
      console.log("❌ Lỗi tạo đơn hàng:", error.message);
      return false;
    }
  };

  // Kiểm tra lại thống kê sau khi tạo đơn hàng
  const checkStatisticsAfter = async () => {
    try {
      console.log("2️⃣ Kiểm tra thống kê sau khi tạo đơn hàng...");
      
      const today = new Date().toISOString().split("T")[0];
      console.log("📅 Ngày hôm nay:", today);
      
      // Đợi một chút để database cập nhật
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Kiểm tra top sản phẩm
      const topProductsResponse = await fetch(`http://localhost:8080/zmen/san-pham/ngay?ngay=${today}`);
      const topProducts = await topProductsResponse.json();
      console.log("🏆 Top sản phẩm:", topProducts);
      
      // Kiểm tra top khách hàng
      const topCustomersResponse = await fetch(`http://localhost:8080/zmen/khach-hang/ngay?ngay=${today}`);
      const topCustomers = await topCustomersResponse.json();
      console.log("👥 Top khách hàng:", topCustomers);
      
      // Kiểm tra doanh thu hôm nay
      const tongQuanResponse = await fetch("http://localhost:8080/zmen/tong-quan");
      const tongQuanData = await tongQuanResponse.json();
      console.log("💰 Doanh thu hôm nay:", tongQuanData.doanhThuHomNay);
      
      return {
        products: topProducts.length,
        customers: topCustomers.length,
        revenue: tongQuanData.doanhThuHomNay
      };
    } catch (error) {
      console.log("❌ Lỗi kiểm tra thống kê:", error.message);
      return { products: 0, customers: 0, revenue: 0 };
    }
  };

  // Chạy toàn bộ quy trình
  const runFullProcess = async () => {
    console.log("🚀 Bắt đầu tạo đơn hàng test cho hôm nay...\n");
    
    // Tạo đơn hàng test
    const orderCreated = await createTestOrder();
    
    if (orderCreated) {
      console.log("✅ Đã tạo đơn hàng test thành công!");
      
      // Kiểm tra lại thống kê
      const stats = await checkStatisticsAfter();
      console.log(`\n📊 Kết quả thống kê:`);
      console.log(`   - Sản phẩm bán chạy: ${stats.products}`);
      console.log(`   - Khách hàng chi tiêu: ${stats.customers}`);
      console.log(`   - Doanh thu hôm nay: ${stats.revenue?.toLocaleString('vi-VN')} VND`);
      
      if (stats.products > 0 && stats.customers > 0) {
        console.log("🎉 Thống kê đã hoạt động bình thường!");
        console.log("💡 Bây giờ bạn có thể refresh trang Statistics để xem dữ liệu");
      } else {
        console.log("⚠️ Vẫn chưa có dữ liệu thống kê");
        console.log("💡 Có thể cần:");
        console.log("   1. Kiểm tra trạng thái đơn hàng");
        console.log("   2. Kiểm tra dữ liệu khách hàng");
        console.log("   3. Kiểm tra chi tiết đơn hàng");
      }
    } else {
      console.log("❌ Không thể tạo đơn hàng test");
    }
  };

  runFullProcess();
};

// Chạy script
createTodayOrder();
