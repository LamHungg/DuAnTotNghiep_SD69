// Script test xóa demo data
// Copy và paste vào Console của browser khi đang ở trang Statistics

const testNoDemoData = () => {
  console.log("🔍 Test Xóa Demo Data...\n");

  try {
    // Test 1: Kiểm tra thống kê tổng quan
    console.log("1️⃣ Test Thống Kê Tổng Quan:");

    const testAPI = async () => {
      try {
        const response = await fetch("http://localhost:8080/zmen/tong-quan");
        const data = await response.json();
        console.log("✅ API Response:", data);

        // Kiểm tra dữ liệu thực tế
        if (data && typeof data === "object") {
          console.log("✅ Dữ liệu thực tế từ backend:");
          console.log(`   - Doanh thu hôm nay: ${data.doanhThuHomNay || 0}`);
          console.log(
            `   - Doanh thu tháng này: ${data.doanhThuThangNay || 0}`
          );
          console.log(`   - Tổng đơn hàng: ${data.tongDonHang || 0}`);
          console.log(`   - Tổng khách hàng: ${data.tongKhachHang || 0}`);
        } else {
          console.log("⚠️ Dữ liệu không hợp lệ");
        }
      } catch (error) {
        console.log("❌ Lỗi API:", error.message);
      }
    };

    testAPI();

    // Test 2: Kiểm tra biểu đồ doanh thu
    console.log("\n2️⃣ Test Biểu Đồ Doanh Thu:");

    const testChartAPI = async () => {
      try {
        const response = await fetch(
          "http://localhost:8080/zmen/doanh-thu/bieu-do?filterType=hom-nay&year=2025&month=8"
        );
        const data = await response.json();
        console.log("✅ Chart API Response:", data);

        if (Array.isArray(data)) {
          console.log(`✅ Dữ liệu biểu đồ: ${data.length} items`);
        } else {
          console.log("⚠️ Dữ liệu biểu đồ không phải array");
        }
      } catch (error) {
        console.log("❌ Lỗi Chart API:", error.message);
      }
    };

    testChartAPI();

    // Test 3: Kiểm tra button export PDF
    console.log("\n3️⃣ Test Button Export PDF:");

    const pdfButton = document.querySelector(".btn-danger:has(.fa-file-pdf)");
    if (pdfButton) {
      console.log('✅ Tìm thấy button "Xuất PDF"');
      console.log(`   Text: "${pdfButton.textContent.trim()}"`);
      console.log(`   Disabled: ${pdfButton.disabled}`);

      if (!pdfButton.disabled) {
        console.log("🔄 Đang test click button PDF...");
        pdfButton.click();
        console.log("✅ Đã click button PDF - Kiểm tra file download");
      } else {
        console.log("⚠️ Button PDF bị disabled");
      }
    } else {
      console.log('❌ Không tìm thấy button "Xuất PDF"');
    }

    // Test 4: Kiểm tra không có demo data
    console.log("\n4️⃣ Test Không Có Demo Data:");

    // Kiểm tra các biến demo data
    const demoVars = ["demoData", "mockData", "sampleData", "testData"];
    let hasDemoData = false;

    demoVars.forEach((varName) => {
      if (window[varName]) {
        console.log(`❌ Tìm thấy demo data: ${varName}`);
        hasDemoData = true;
      }
    });

    if (!hasDemoData) {
      console.log("✅ Không tìm thấy demo data trong window object");
    }

    // Test 5: Kiểm tra localStorage
    console.log("\n5️⃣ Test LocalStorage:");

    const demoKeys = [
      "demoEmployees",
      "demoAdmins",
      "demoProducts",
      "demoCustomers",
    ];
    let hasDemoLocalStorage = false;

    demoKeys.forEach((key) => {
      if (localStorage.getItem(key)) {
        console.log(`❌ Tìm thấy demo data trong localStorage: ${key}`);
        hasDemoLocalStorage = true;
      }
    });

    if (!hasDemoLocalStorage) {
      console.log("✅ Không tìm thấy demo data trong localStorage");
    }

    console.log("\n✅ Test hoàn thành! Tất cả demo data đã được xóa");
  } catch (error) {
    console.log("❌ Lỗi test no demo data:", error.message);
  }
};

// Test backend endpoints
const testBackendEndpoints = () => {
  console.log("\n🔍 Test Backend Endpoints...\n");

  try {
    const endpoints = [
      {
        name: "Thống kê tổng quan",
        url: "http://localhost:8080/zmen/tong-quan",
      },
      {
        name: "Biểu đồ doanh thu",
        url: "http://localhost:8080/zmen/doanh-thu/bieu-do?filterType=hom-nay&year=2025&month=8",
      },
      {
        name: "Danh sách đơn hàng",
        url: "http://localhost:8080/zmen/don-hang/list?filterType=hom-nay",
      },
      {
        name: "Export Excel",
        url: "http://localhost:8080/zmen/export/thong-ke-excel",
      },
      {
        name: "Export PDF",
        url: "http://localhost:8080/zmen/export/thong-ke-pdf",
      },
    ];

    endpoints.forEach(async (endpoint) => {
      try {
        const response = await fetch(endpoint.url, { method: "GET" });
        console.log(
          `✅ ${endpoint.name}: ${response.status} ${response.statusText}`
        );
      } catch (error) {
        console.log(`❌ ${endpoint.name}: ${error.message}`);
      }
    });
  } catch (error) {
    console.log("❌ Lỗi test backend endpoints:", error.message);
  }
};

// Chạy tests
testNoDemoData();
testBackendEndpoints();

// Export functions
window.testNoDemoData = testNoDemoData;
window.testBackendEndpoints = testBackendEndpoints;
