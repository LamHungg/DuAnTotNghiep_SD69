// Script tạo dữ liệu test cho thống kê
// Copy và paste vào Console của browser khi đang ở trang Statistics

const createTestData = () => {
  console.log("🔧 Tạo Dữ Liệu Test Cho Thống Kê...\n");

  // Tạo đơn hàng test
  const createTestOrder = async () => {
    try {
      console.log("1️⃣ Tạo đơn hàng test...");

      // Dữ liệu đơn hàng test
      const orderData = {
        maDonHang: `DH${Date.now()}`,
        loaiDonHang: false, // offline
        ngayDat: new Date().toISOString(),
        tongTienHang: 500000,
        tongThanhToan: 500000,
        khachHang: {
          id: 1, // ID khách hàng test
          hoTen: "Khách hàng Test",
          email: "test@example.com",
          soDienThoai: "0123456789",
        },
        chiTietDonHang: [
          {
            idChiTietSanPham: 1, // ID chi tiết sản phẩm test
            soLuong: 2,
            gia: 250000,
            tienGiamGia: 0,
            phiVanChuyen: 0,
          },
        ],
        trangThai: 5, // Hoàn thành
        phuongThucThanhToan: 1, // Tiền mặt
        ghiChuKhachHang: "Đơn hàng test cho thống kê",
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

  // Kiểm tra dữ liệu hiện tại
  const checkCurrentData = async () => {
    try {
      console.log("2️⃣ Kiểm tra dữ liệu hiện tại...");

      const response = await fetch("http://localhost:8080/zmen/tong-quan");
      const data = await response.json();

      console.log("📊 Dữ liệu hiện tại:");
      console.log(`   - Tổng đơn hàng: ${data.tongDonHang || 0}`);
      console.log(`   - Tổng khách hàng: ${data.tongKhachHang || 0}`);
      console.log(`   - Tổng sản phẩm: ${data.tongSanPham || 0}`);
      console.log(`   - Doanh thu hôm nay: ${data.doanhThuHomNay || 0}`);

      return data;
    } catch (error) {
      console.log("❌ Lỗi kiểm tra dữ liệu:", error.message);
      return null;
    }
  };

  // Tạo khách hàng test nếu cần
  const createTestCustomer = async () => {
    try {
      console.log("3️⃣ Tạo khách hàng test...");

      const customerData = {
        hoTen: "Khách hàng Test",
        email: "test@example.com",
        soDienThoai: "0123456789",
        ngaySinh: "1990-01-01",
        gioiTinh: "NAM",
      };

      const response = await fetch("http://localhost:8080/api/customers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(customerData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("✅ Tạo khách hàng thành công:", result);
        return result.id;
      } else {
        console.log("⚠️ Khách hàng đã tồn tại hoặc lỗi");
        return 1; // Sử dụng ID mặc định
      }
    } catch (error) {
      console.log("❌ Lỗi tạo khách hàng:", error.message);
      return 1;
    }
  };

  // Cập nhật trạng thái đơn hàng
  const updateOrderStatus = async (orderId, status) => {
    try {
      console.log(
        `4️⃣ Cập nhật trạng thái đơn hàng ${orderId} thành ${status}...`
      );

      const response = await fetch(
        `http://localhost:8080/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ trangThai: status }),
        }
      );

      if (response.ok) {
        console.log("✅ Cập nhật trạng thái thành công");
        return true;
      } else {
        console.log("❌ Lỗi cập nhật trạng thái");
        return false;
      }
    } catch (error) {
      console.log("❌ Lỗi cập nhật trạng thái:", error.message);
      return false;
    }
  };

  // Kiểm tra lại thống kê sau khi tạo dữ liệu
  const checkStatisticsAfter = async () => {
    try {
      console.log("5️⃣ Kiểm tra thống kê sau khi tạo dữ liệu...");

      const today = new Date().toISOString().split("T")[0];

      // Kiểm tra top sản phẩm
      const topProductsResponse = await fetch(
        `http://localhost:8080/zmen/san-pham/ngay?ngay=${today}`
      );
      const topProducts = await topProductsResponse.json();
      console.log("🏆 Top sản phẩm:", topProducts);

      // Kiểm tra top khách hàng
      const topCustomersResponse = await fetch(
        `http://localhost:8080/zmen/khach-hang/ngay?ngay=${today}`
      );
      const topCustomers = await topCustomersResponse.json();
      console.log("👥 Top khách hàng:", topCustomers);

      return {
        products: topProducts.length,
        customers: topCustomers.length,
      };
    } catch (error) {
      console.log("❌ Lỗi kiểm tra thống kê:", error.message);
      return { products: 0, customers: 0 };
    }
  };

  // Chạy toàn bộ quy trình
  const runFullProcess = async () => {
    console.log("🚀 Bắt đầu tạo dữ liệu test...\n");

    // Kiểm tra dữ liệu hiện tại
    const currentData = await checkCurrentData();

    if (currentData && currentData.tongDonHang > 0) {
      console.log("✅ Đã có dữ liệu đơn hàng trong hệ thống");
      console.log("💡 Nếu vẫn không hiển thị thống kê, có thể do:");
      console.log(
        "   - Đơn hàng chưa có trạng thái 'Hoàn thành' (id_trang_thai = 5)"
      );
      console.log("   - Đơn hàng không có khách hàng");
      console.log("   - Không có chi tiết đơn hàng");
    } else {
      console.log("⚠️ Chưa có dữ liệu đơn hàng, tạo dữ liệu test...");

      // Tạo khách hàng test
      const customerId = await createTestCustomer();

      // Tạo đơn hàng test
      const orderCreated = await createTestOrder();

      if (orderCreated) {
        console.log("✅ Đã tạo dữ liệu test thành công!");

        // Đợi một chút để database cập nhật
        setTimeout(async () => {
          const stats = await checkStatisticsAfter();
          console.log(`\n📊 Kết quả thống kê:`);
          console.log(`   - Sản phẩm bán chạy: ${stats.products}`);
          console.log(`   - Khách hàng chi tiêu: ${stats.customers}`);

          if (stats.products > 0 && stats.customers > 0) {
            console.log("🎉 Thống kê đã hoạt động bình thường!");
          } else {
            console.log("⚠️ Vẫn chưa có dữ liệu thống kê");
            console.log("💡 Có thể cần:");
            console.log("   1. Kiểm tra trạng thái đơn hàng");
            console.log("   2. Kiểm tra dữ liệu khách hàng");
            console.log("   3. Kiểm tra chi tiết đơn hàng");
          }
        }, 2000);
      }
    }
  };

  runFullProcess();
};

// Chạy script
createTestData();
