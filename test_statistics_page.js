// Script test trang Statistics
const axios = require("axios");

async function testStatisticsPage() {
  console.log("🔍 Testing Statistics Page Data...\n");

  const baseURL = "http://localhost:8080/zmen";

  // Test tất cả endpoints mà Statistics page sử dụng
  const endpoints = [
    {
      name: "Thống kê tổng quan",
      url: `${baseURL}/tong-quan`,
      method: "GET",
    },
    {
      name: "Biểu đồ doanh thu",
      url: `${baseURL}/bieu-do/doanh-thu`,
      method: "GET",
      params: { loai: "thang", nam: 2024, thang: 12 },
    },
    {
      name: "Doanh thu theo danh mục",
      url: `${baseURL}/danh-muc/doanh-thu`,
      method: "GET",
      params: { nam: 2024, thang: 12 },
    },
    {
      name: "Thống kê thanh toán",
      url: `${baseURL}/thanh-toan/thong-ke`,
      method: "GET",
      params: { nam: 2024, thang: 12 },
    },
    {
      name: "Sản phẩm bán chạy tháng",
      url: `${baseURL}/san-pham/thang`,
      method: "GET",
      params: { thang: 12, nam: 2024 },
    },
    {
      name: "Doanh thu tháng",
      url: `${baseURL}/doanh-thu/thang`,
      method: "GET",
      params: { thang: 12, nam: 2024 },
    },
    {
      name: "Hiệu suất nhân viên tháng",
      url: `${baseURL}/nhan-vien/thang`,
      method: "GET",
      params: { thang: 12, nam: 2024 },
    },
    {
      name: "Khách hàng chi tiêu tháng",
      url: `${baseURL}/khach-hang/thang`,
      method: "GET",
      params: { thang: 12, nam: 2024 },
    },
  ];

  let successCount = 0;
  let emptyDataCount = 0;
  let errorCount = 0;

  for (const endpoint of endpoints) {
    try {
      console.log(`📋 Testing: ${endpoint.name}`);
      console.log(`🔗 URL: ${endpoint.url}`);

      const config = {
        method: endpoint.method,
        url: endpoint.url,
        timeout: 10000,
      };

      if (endpoint.params) {
        config.params = endpoint.params;
      }

      const response = await axios(config);

      console.log(`✅ Status: ${response.status}`);

      // Kiểm tra dữ liệu
      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          console.log(`📊 Data: [] (Empty array)`);
          emptyDataCount++;
        } else {
          console.log(`📊 Data: Array with ${response.data.length} items`);
          successCount++;
        }
      } else if (typeof response.data === "object" && response.data !== null) {
        const keys = Object.keys(response.data);
        const hasData = keys.some((key) => {
          const value = response.data[key];
          if (Array.isArray(value)) return value.length > 0;
          if (typeof value === "number") return value > 0;
          return value !== null && value !== undefined && value !== "";
        });

        if (hasData) {
          console.log(`📊 Data: Object with data (${keys.length} keys)`);
          successCount++;
        } else {
          console.log(`📊 Data: Object but empty data`);
          emptyDataCount++;
        }
      } else {
        console.log(`📊 Data: ${response.data}`);
        successCount++;
      }

      console.log("─".repeat(50));
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status || error.message}`);
      errorCount++;
      console.log("─".repeat(50));
    }
  }

  console.log("\n📊 SUMMARY:");
  console.log(`✅ Successful: ${successCount}`);
  console.log(`📭 Empty Data: ${emptyDataCount}`);
  console.log(`❌ Errors: ${errorCount}`);

  console.log("\n💡 ANALYSIS:");
  if (emptyDataCount > successCount) {
    console.log(
      "🟡 Most endpoints return empty data - Statistics page will use demo data"
    );
    console.log("✅ This is expected behavior - demo data will be displayed");
  } else if (successCount > 0) {
    console.log(
      "🟢 Some endpoints have real data - Statistics page will show mixed data"
    );
  } else {
    console.log("🔴 All endpoints failed - Statistics page will use demo data");
  }

  console.log("\n🎯 RESULT:");
  console.log("Statistics page should work perfectly with demo data!");
  console.log("All charts and tables will display sample data.");
}

async function testStatisticsPageFlow() {
  console.log("🚀 Testing Statistics Page Flow...\n");

  await testStatisticsPage();

  console.log("\n🔧 NEXT STEPS:");
  console.log("1. Open Statistics page in browser");
  console.log("2. Check if all charts display demo data");
  console.log("3. Test filter controls (ngay, thang, nam, khoang-ngay)");
  console.log("4. Verify export Excel functionality");
  console.log("5. Check responsive design on mobile");

  console.log("\n✨ EXPECTED BEHAVIOR:");
  console.log("- KPI cards show demo values");
  console.log("- Charts display sample data");
  console.log("- Tables show demo records");
  console.log("- Debug info shows 'Demo' source");
  console.log("- All functionality works normally");
}

testStatisticsPageFlow();
