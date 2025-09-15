// Script test dữ liệu database
// Copy và paste vào Console của browser khi đang ở trang Statistics

const testDatabaseData = () => {
  console.log("🔍 Test Dữ Liệu Database...\n");

  try {
    // Test 1: Kiểm tra trạng thái đơn hàng
    console.log("1️⃣ Test Trạng Thái Đơn Hàng:");

    const testOrderStatus = async () => {
      try {
        // Test endpoint để lấy tất cả đơn hàng
        const response = await fetch(
          "http://localhost:8080/zmen/don-hang/list?filterType=hom-nay"
        );
        const data = await response.json();
        console.log("✅ Danh sách đơn hàng:", data);
        console.log(`   Tổng số đơn hàng: ${data.length || 0}`);

        if (data.length > 0) {
          // Kiểm tra trạng thái của các đơn hàng
          const statusCount = {};
          data.forEach((order) => {
            const status = order.trangThai || order.idTrangThai || "unknown";
            statusCount[status] = (statusCount[status] || 0) + 1;
          });

          console.log("📊 Thống kê trạng thái đơn hàng:");
          Object.entries(statusCount).forEach(([status, count]) => {
            console.log(`   - Trạng thái ${status}: ${count} đơn hàng`);
          });
        }
      } catch (error) {
        console.log("❌ Lỗi test trạng thái đơn hàng:", error.message);
      }
    };

    testOrderStatus();

    // Test 2: Kiểm tra dữ liệu chi tiết đơn hàng
    console.log("\n2️⃣ Test Dữ Liệu Chi Tiết Đơn Hàng:");

    const testOrderDetails = async () => {
      try {
        // Test query đơn giản để lấy tất cả chi tiết đơn hàng
        const response = await fetch("http://localhost:8080/zmen/test-simple");
        const data = await response.json();
        console.log("✅ Test endpoint:", data);

        // Test endpoint tổng quan để xem có dữ liệu gì
        const tongQuanResponse = await fetch(
          "http://localhost:8080/zmen/tong-quan"
        );
        const tongQuanData = await tongQuanResponse.json();
        console.log("✅ Dữ liệu tổng quan:", tongQuanData);
      } catch (error) {
        console.log("❌ Lỗi test chi tiết đơn hàng:", error.message);
      }
    };

    testOrderDetails();

    // Test 3: Kiểm tra API không có điều kiện trạng thái
    console.log("\n3️⃣ Test API Không Có Điều Kiện Trạng Thái:");

    const testWithoutStatus = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        // Test các endpoint khác để xem có dữ liệu không
        const endpoints = [
          { name: "Tổng quan", url: "http://localhost:8080/zmen/tong-quan" },
          {
            name: "Biểu đồ doanh thu",
            url: `http://localhost:8080/zmen/doanh-thu/bieu-do?filterType=hom-nay&year=2025&month=8`,
          },
          {
            name: "Danh sách đơn hàng",
            url: `http://localhost:8080/zmen/don-hang/list?filterType=hom-nay`,
          },
        ];

        for (const endpoint of endpoints) {
          try {
            const response = await fetch(endpoint.url);
            const data = await response.json();
            console.log(`✅ ${endpoint.name}:`, data);

            if (data && typeof data === "object") {
              const keys = Object.keys(data);
              console.log(`   Keys: ${keys.join(", ")}`);
            }
          } catch (error) {
            console.log(`❌ ${endpoint.name}: ${error.message}`);
          }
        }
      } catch (error) {
        console.log("❌ Lỗi test API không có điều kiện:", error.message);
      }
    };

    testWithoutStatus();

    // Test 4: Kiểm tra dữ liệu theo tháng/năm
    console.log("\n4️⃣ Test Dữ Liệu Theo Tháng/Năm:");

    const testMonthlyYearly = async () => {
      try {
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        // Test top sản phẩm theo tháng
        console.log(
          `📅 Test Top Sản Phẩm theo tháng ${currentMonth}/${currentYear}:`
        );
        const sanPhamResponse = await fetch(
          `http://localhost:8080/zmen/san-pham/thang?thang=${currentMonth}&nam=${currentYear}`
        );
        const sanPhamData = await sanPhamResponse.json();
        console.log("✅ Top sản phẩm theo tháng:", sanPhamData);
        console.log(`   Số lượng: ${sanPhamData.length || 0}`);

        // Test top khách hàng theo tháng
        console.log(
          `📅 Test Top Khách Hàng theo tháng ${currentMonth}/${currentYear}:`
        );
        const khachHangResponse = await fetch(
          `http://localhost:8080/zmen/khach-hang/thang?thang=${currentMonth}&nam=${currentYear}`
        );
        const khachHangData = await khachHangResponse.json();
        console.log("✅ Top khách hàng theo tháng:", khachHangData);
        console.log(`   Số lượng: ${khachHangData.length || 0}`);

        // Test theo năm
        console.log(`📅 Test Top Sản Phẩm theo năm ${currentYear}:`);
        const sanPhamNamResponse = await fetch(
          `http://localhost:8080/zmen/san-pham/nam?nam=${currentYear}`
        );
        const sanPhamNamData = await sanPhamNamResponse.json();
        console.log("✅ Top sản phẩm theo năm:", sanPhamNamData);
        console.log(`   Số lượng: ${sanPhamNamData.length || 0}`);
      } catch (error) {
        console.log("❌ Lỗi test dữ liệu theo tháng/năm:", error.message);
      }
    };

    testMonthlyYearly();

    // Test 5: Kiểm tra trạng thái trong database
    console.log("\n5️⃣ Test Trạng Thái Trong Database:");

    const testDatabaseStatus = () => {
      console.log("💡 Có thể vấn đề là:");
      console.log("   1. Không có đơn hàng nào có trạng thái = 5");
      console.log('   2. Trạng thái 5 không phải là "đã hoàn thành"');
      console.log("   3. Không có dữ liệu trong database");
      console.log("   4. Ngày 2025-08-28 không có đơn hàng nào");

      console.log("\n🔧 Giải pháp đề xuất:");
      console.log("   1. Kiểm tra trạng thái đơn hàng trong database");
      console.log("   2. Sửa điều kiện trạng thái trong SQL query");
      console.log("   3. Thêm dữ liệu test vào database");
      console.log("   4. Sử dụng ngày khác có dữ liệu");
    };

    testDatabaseStatus();

    console.log("\n✅ Test hoàn thành! Kiểm tra kết quả ở trên");
  } catch (error) {
    console.log("❌ Lỗi test database data:", error.message);
  }
};

// Test backend endpoints
const testBackendDatabase = () => {
  console.log("\n🔍 Test Backend Database Endpoints...\n");

  try {
    const endpoints = [
      { name: "Test Simple", url: "http://localhost:8080/zmen/test-simple" },
      { name: "Tổng Quan", url: "http://localhost:8080/zmen/tong-quan" },
      {
        name: "Đơn Hàng List",
        url: "http://localhost:8080/zmen/don-hang/list?filterType=hom-nay",
      },
      {
        name: "Top Sản Phẩm Tháng",
        url: "http://localhost:8080/zmen/san-pham/thang?thang=8&nam=2025",
      },
      {
        name: "Top Khách Hàng Tháng",
        url: "http://localhost:8080/zmen/khach-hang/thang?thang=8&nam=2025",
      },
    ];

    endpoints.forEach(async (endpoint) => {
      try {
        const response = await fetch(endpoint.url);
        const data = await response.json();
        console.log(`✅ ${endpoint.name}: ${response.status}`);

        if (data && typeof data === "object") {
          if (Array.isArray(data)) {
            console.log(`   Array length: ${data.length}`);
            if (data.length > 0) {
              console.log(`   Sample:`, data[0]);
            }
          } else {
            const keys = Object.keys(data);
            console.log(`   Keys: ${keys.join(", ")}`);
          }
        }
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    });
  } catch (error) {
    console.log("❌ Lỗi test backend database:", error.message);
  }
};

// Chạy tests
testDatabaseData();
testBackendDatabase();

// Export functions
window.testDatabaseData = testDatabaseData;
window.testBackendDatabase = testBackendDatabase;
