// Script test API thống kê đơn giản
const axios = require("axios");

async function testSimpleStatistics() {
  console.log("🔍 Testing Simple Statistics API...\n");

  const baseURL = "http://localhost:8080/zmen";

  // Test basic endpoints
  const endpoints = [
    {
      name: "Test endpoint",
      url: `${baseURL}/test`,
      method: "GET",
    },
    {
      name: "Thống kê tổng quan",
      url: `${baseURL}/tong-quan`,
      method: "GET",
    },
    {
      name: "Sản phẩm bán chạy tháng này",
      url: `${baseURL}/san-pham/thang`,
      method: "GET",
      params: { thang: 12, nam: 2024 },
    },
    {
      name: "Doanh thu tháng này",
      url: `${baseURL}/doanh-thu/thang`,
      method: "GET",
      params: { thang: 12, nam: 2024 },
    },
  ];

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

async function testWithDemoData() {
  console.log("\n🔍 Testing with Demo Data...\n");

  // Test if we can get any data at all
  const testEndpoints = [
    "http://localhost:8080/api/nguoi-dung",
    "http://localhost:8080/api/don-hang",
    "http://localhost:8080/api/san-pham",
  ];

  for (const url of testEndpoints) {
    try {
      console.log(`📋 Testing: ${url}`);

      const response = await axios.get(url, { timeout: 5000 });

      console.log(`✅ Status: ${response.status}`);
      console.log(
        `📊 Data length: ${
          Array.isArray(response.data) ? response.data.length : "Not array"
        }`
      );
      console.log("─".repeat(50));
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status || error.message}`);
      console.log("─".repeat(50));
    }
  }
}

async function runSimpleTest() {
  console.log("🚀 Starting Simple Statistics Test...\n");

  await testSimpleStatistics();
  await testWithDemoData();

  console.log("\n📋 SUMMARY:");
  console.log("If test endpoint works but statistics fail:");
  console.log("1. Database connection issue");
  console.log("2. SQL query syntax error");
  console.log("3. Missing tables or data");
  console.log("4. Database permissions issue");

  console.log("\n🔧 NEXT STEPS:");
  console.log("1. Check database connection");
  console.log("2. Verify database tables exist");
  console.log("3. Check if there's any data in tables");
  console.log("4. Test SQL queries directly");

  console.log("\n💡 RECOMMENDATION:");
  console.log("For now, use demo data in frontend until backend is fixed");
}

runSimpleTest();
