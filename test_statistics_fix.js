// Script test và khắc phục vấn đề thống kê
// Copy và paste vào Console của browser khi đang ở trang Statistics

const testStatisticsFix = () => {
  console.log("🔍 Test và Khắc Phục Vấn Đề Thống Kê...\n");

  // Test 1: Kiểm tra backend có hoạt động không
  const testBackend = async () => {
    try {
      console.log("1️⃣ Test Backend Status:");
      const response = await fetch("http://localhost:8080/zmen/test");
      const data = await response.text();
      console.log("✅ Backend status:", data);
      return true;
    } catch (error) {
      console.log("❌ Backend không hoạt động:", error.message);
      return false;
    }
  };

  // Test 2: Kiểm tra dữ liệu đơn hàng
  const testOrderData = async () => {
    try {
      console.log("\n2️⃣ Test Dữ Liệu Đơn Hàng:");

      // Test endpoint tổng quan
      const tongQuanResponse = await fetch(
        "http://localhost:8080/zmen/tong-quan"
      );
      const tongQuanData = await tongQuanResponse.json();
      console.log("✅ Dữ liệu tổng quan:", tongQuanData);

      // Test endpoint đơn hàng
      const donHangResponse = await fetch(
        "http://localhost:8080/zmen/don-hang/list?filterType=hom-nay"
      );
      const donHangData = await donHangResponse.json();
      console.log("✅ Danh sách đơn hàng:", donHangData);
      console.log(`   Tổng số đơn hàng: ${donHangData.length || 0}`);

      return donHangData.length > 0;
    } catch (error) {
      console.log("❌ Lỗi test dữ liệu đơn hàng:", error.message);
      return false;
    }
  };

  // Test 3: Kiểm tra endpoint sản phẩm bán chạy
  const testTopProducts = async () => {
    try {
      console.log("\n3️⃣ Test Top Sản Phẩm Bán Chạy:");

      const today = new Date().toISOString().split("T")[0];
      console.log("📅 Ngày hôm nay:", today);

      // Test endpoint sản phẩm bán chạy theo ngày
      const response = await fetch(
        `http://localhost:8080/zmen/san-pham/ngay?ngay=${today}`
      );
      const data = await response.json();
      console.log("✅ Top sản phẩm theo ngày:", data);
      console.log(`   Số sản phẩm: ${data.length || 0}`);

      if (data.length === 0) {
        console.log("⚠️ Không có dữ liệu sản phẩm bán chạy");
        console.log("🔍 Nguyên nhân có thể:");
        console.log("   - Không có đơn hàng nào được tạo hôm nay");
        console.log(
          "   - Đơn hàng chưa có trạng thái hoàn thành (id_trang_thai = 5)"
        );
        console.log("   - Không có chi tiết đơn hàng");
      }

      return data.length > 0;
    } catch (error) {
      console.log("❌ Lỗi test top sản phẩm:", error.message);
      return false;
    }
  };

  // Test 4: Kiểm tra endpoint khách hàng chi tiêu
  const testTopCustomers = async () => {
    try {
      console.log("\n4️⃣ Test Top Khách Hàng Chi Tiêu:");

      const today = new Date().toISOString().split("T")[0];
      console.log("📅 Ngày hôm nay:", today);

      // Test endpoint khách hàng chi tiêu theo ngày
      const response = await fetch(
        `http://localhost:8080/zmen/khach-hang/ngay?ngay=${today}`
      );
      const data = await response.json();
      console.log("✅ Top khách hàng theo ngày:", data);
      console.log(`   Số khách hàng: ${data.length || 0}`);

      if (data.length === 0) {
        console.log("⚠️ Không có dữ liệu khách hàng chi tiêu");
        console.log("🔍 Nguyên nhân có thể:");
        console.log("   - Không có đơn hàng nào được tạo hôm nay");
        console.log("   - Đơn hàng không có khách hàng (id_khach_hang = null)");
        console.log("   - Đơn hàng chưa có trạng thái hoàn thành");
      }

      return data.length > 0;
    } catch (error) {
      console.log("❌ Lỗi test top khách hàng:", error.message);
      return false;
    }
  };

  // Test 5: Kiểm tra dữ liệu database
  const testDatabaseData = async () => {
    try {
      console.log("\n5️⃣ Test Dữ Liệu Database:");

      // Test query đơn giản để kiểm tra dữ liệu
      const response = await fetch("http://localhost:8080/zmen/test-simple");
      const data = await response.json();
      console.log("✅ Test endpoint:", data);

      // Kiểm tra các bảng chính
      const tables = [
        {
          name: "Đơn hàng",
          endpoint:
            "http://localhost:8080/zmen/don-hang/list?filterType=hom-nay",
        },
        { name: "Tổng quan", endpoint: "http://localhost:8080/zmen/tong-quan" },
      ];

      for (const table of tables) {
        try {
          const tableResponse = await fetch(table.endpoint);
          const tableData = await tableResponse.json();
          console.log(`✅ ${table.name}:`, tableData);
        } catch (error) {
          console.log(`❌ ${table.name}: ${error.message}`);
        }
      }
    } catch (error) {
      console.log("❌ Lỗi test database:", error.message);
    }
  };

  // Test 6: Tạo dữ liệu test nếu cần
  const createTestData = async () => {
    try {
      console.log("\n6️⃣ Tạo Dữ Liệu Test (Nếu Cần):");

      // Kiểm tra xem có cần tạo dữ liệu test không
      const tongQuanResponse = await fetch(
        "http://localhost:8080/zmen/tong-quan"
      );
      const tongQuanData = await tongQuanResponse.json();

      if (tongQuanData.tongDonHang === 0) {
        console.log("⚠️ Không có đơn hàng nào trong hệ thống");
        console.log("💡 Để có dữ liệu thống kê, bạn cần:");
        console.log("   1. Tạo sản phẩm trong hệ thống");
        console.log("   2. Tạo đơn hàng qua POS hoặc online");
        console.log("   3. Cập nhật trạng thái đơn hàng thành 'Hoàn thành'");
        console.log(
          "   4. Đảm bảo đơn hàng có khách hàng và chi tiết sản phẩm"
        );
      } else {
        console.log("✅ Đã có dữ liệu đơn hàng trong hệ thống");
      }
    } catch (error) {
      console.log("❌ Lỗi kiểm tra dữ liệu test:", error.message);
    }
  };

  // Chạy tất cả các test
  const runAllTests = async () => {
    const backendOk = await testBackend();
    if (!backendOk) {
      console.log(
        "❌ Backend không hoạt động. Vui lòng khởi động backend trước!"
      );
      return;
    }

    await testOrderData();
    await testTopProducts();
    await testTopCustomers();
    await testDatabaseData();
    await createTestData();

    console.log("\n🎯 Kết Luận:");
    console.log("Nếu không có dữ liệu hiển thị, có thể do:");
    console.log("1. Chưa có đơn hàng nào được tạo");
    console.log(
      "2. Đơn hàng chưa có trạng thái 'Hoàn thành' (id_trang_thai = 5)"
    );
    console.log("3. Đơn hàng không có khách hàng (id_khach_hang = null)");
    console.log("4. Không có chi tiết đơn hàng");
    console.log("\n💡 Giải pháp:");
    console.log("1. Tạo đơn hàng test qua POS");
    console.log("2. Cập nhật trạng thái đơn hàng thành 'Hoàn thành'");
    console.log("3. Đảm bảo đơn hàng có khách hàng và sản phẩm");
  };

  runAllTests();
};

// Chạy test
testStatisticsFix();
