// Script test API thống kê
const axios = require("axios");

async function testStatisticsAPI() {
  console.log("🔍 Testing Statistics API...\n");

  const baseURL = "http://localhost:8080/api";

  // Test endpoints
  const endpoints = [
    {
      name: "Thống kê tổng quan",
      url: `${baseURL}/thong-ke/tong-quan`,
      method: "GET",
    },
    {
      name: "Biểu đồ doanh thu",
      url: `${baseURL}/thong-ke/doanh-thu`,
      method: "GET",
      params: { loai: "thang", nam: 2024, thang: 12 },
    },
    {
      name: "Sản phẩm bán chạy",
      url: `${baseURL}/thong-ke/san-pham-ban-chay`,
      method: "GET",
      params: { thang: 12, nam: 2024 },
    },
    {
      name: "Doanh thu theo danh mục",
      url: `${baseURL}/thong-ke/doanh-thu-danh-muc`,
      method: "GET",
      params: { nam: 2024, thang: 12 },
    },
    {
      name: "Thống kê thanh toán",
      url: `${baseURL}/thong-ke/thanh-toan`,
      method: "GET",
      params: { nam: 2024, thang: 12 },
    },
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`📋 Testing: ${endpoint.name}`);
      console.log(`🔗 URL: ${endpoint.url}`);

      const config = {
        method: endpoint.method,
        url: endpoint.url,
        timeout: 5000,
      };

      if (endpoint.params) {
        config.params = endpoint.params;
      }

      const response = await axios(config);

      console.log(`✅ Status: ${response.status}`);
      console.log(`📊 Data:`, JSON.stringify(response.data, null, 2));
      console.log("─".repeat(50));
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log(
          `📊 Error Data:`,
          JSON.stringify(error.response.data, null, 2)
        );
      }
      console.log("─".repeat(50));
    }
  }
}

async function testAlternativeEndpoints() {
  console.log("\n🔍 Testing Alternative Endpoints...\n");

  const alternativeEndpoints = [
    {
      name: "Thống kê controller",
      url: "http://localhost:8080/api/thong-ke",
      method: "GET",
    },
    {
      name: "Dashboard stats",
      url: "http://localhost:8080/api/dashboard/stats",
      method: "GET",
    },
    {
      name: "Analytics endpoint",
      url: "http://localhost:8080/api/analytics",
      method: "GET",
    },
  ];

  for (const endpoint of alternativeEndpoints) {
    try {
      console.log(`📋 Testing: ${endpoint.name}`);
      console.log(`🔗 URL: ${endpoint.url}`);

      const response = await axios.get(endpoint.url, { timeout: 5000 });

      console.log(`✅ Status: ${response.status}`);
      console.log(`📊 Data:`, JSON.stringify(response.data, null, 2));
      console.log("─".repeat(50));
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status || error.message}`);
      if (error.response?.data) {
        console.log(
          `📊 Error Data:`,
          JSON.stringify(error.response.data, null, 2)
        );
      }
      console.log("─".repeat(50));
    }
  }
}

async function testBackendStatistics() {
  console.log("\n🔍 Testing Backend Statistics Controller...\n");

  // Check if ThongKeController exists
  const controllerEndpoints = [
    "http://localhost:8080/api/thong-ke/test",
    "http://localhost:8080/api/thong-ke/doanh-thu",
    "http://localhost:8080/api/thong-ke/san-pham",
    "http://localhost:8080/api/thong-ke/nhan-vien",
    "http://localhost:8080/api/thong-ke/khach-hang",
  ];

  for (const url of controllerEndpoints) {
    try {
      console.log(`📋 Testing: ${url}`);

      const response = await axios.get(url, { timeout: 5000 });

      console.log(`✅ Status: ${response.status}`);
      console.log(`📊 Data:`, JSON.stringify(response.data, null, 2));
      console.log("─".repeat(50));
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status || error.message}`);
      console.log("─".repeat(50));
    }
  }
}

async function runStatisticsTest() {
  console.log("🚀 Starting Statistics API Test...\n");

  await testStatisticsAPI();
  await testAlternativeEndpoints();
  await testBackendStatistics();

  console.log("\n📋 SUMMARY:");
  console.log("If all endpoints return 404:");
  console.log("1. Backend doesn't have statistics endpoints");
  console.log("2. Need to create ThongKeController");
  console.log("3. Need to implement statistics services");

  console.log("\n🔧 NEXT STEPS:");
  console.log("1. Check if ThongKeController exists in backend");
  console.log("2. Create statistics endpoints if missing");
  console.log("3. Implement statistics services");
  console.log("4. Test with frontend dashboard");

  console.log("\n💡 RECOMMENDATION:");
  console.log("Since dashboard shows placeholder, likely need to:");
  console.log("1. Create backend statistics API");
  console.log("2. Or use demo data for now");
  console.log("3. Or connect to existing data endpoints");
}

runStatisticsTest();
