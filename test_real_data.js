// Script test dữ liệu thực từ backend
const axios = require("axios");

async function testRealData() {
  console.log("🔍 Testing Real Data from Backend...\n");

  const baseURL = "http://localhost:8080/zmen";

  // Test các endpoints chính
  const endpoints = [
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
    {
      name: "Hiệu suất nhân viên tháng này",
      url: `${baseURL}/nhan-vien/thang`,
      method: "GET",
      params: { thang: 12, nam: 2024 },
    },
    {
      name: "Khách hàng chi tiêu tháng này",
      url: `${baseURL}/khach-hang/thang`,
      method: "GET",
      params: { thang: 12, nam: 2024 },
    },
  ];

  let hasRealData = false;
  let emptyDataCount = 0;

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
          hasRealData = true;
          console.log(
            `📊 Sample data:`,
            JSON.stringify(response.data[0], null, 2)
          );
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
          hasRealData = true;
          console.log(
            `📊 Sample data:`,
            JSON.stringify(response.data, null, 2)
          );
        } else {
          console.log(`📊 Data: Object but empty data`);
          emptyDataCount++;
        }
      } else {
        console.log(`📊 Data: ${response.data}`);
        hasRealData = true;
      }

      console.log("─".repeat(50));
    } catch (error) {
      console.log(`❌ Error: ${error.response?.status || error.message}`);
      console.log("─".repeat(50));
    }
  }

  console.log("\n📊 SUMMARY:");
  console.log(`✅ Has Real Data: ${hasRealData ? "YES" : "NO"}`);
  console.log(`📭 Empty Data Count: ${emptyDataCount}`);

  console.log("\n💡 ANALYSIS:");
  if (hasRealData) {
    console.log(
      "🟢 Backend has some real data - Statistics page will show real data"
    );
    console.log("✅ Some charts/tables will display real data");
    console.log("⚠️ Some charts/tables may show empty states");
  } else {
    console.log(
      "🟡 Backend has no real data - Statistics page will show empty states"
    );
    console.log("✅ All charts/tables will show 'Chưa có dữ liệu' messages");
    console.log("💡 This is expected when no orders are completed");
  }

  console.log("\n🎯 RESULT:");
  if (hasRealData) {
    console.log("Statistics page will display MIXED data:");
    console.log("- Real data where available");
    console.log("- Empty states where no data");
  } else {
    console.log("Statistics page will display EMPTY states:");
    console.log("- All charts show 'Chưa có dữ liệu'");
    console.log("- All tables show empty messages");
    console.log("- KPI cards show real counts (orders, customers, products)");
  }

  console.log("\n🔧 TO GET REAL DATA:");
  console.log("1. Create some orders in the system");
  console.log("2. Complete the orders (set status = 5)");
  console.log("3. Refresh the Statistics page");
  console.log("4. Real data will automatically appear");
}

testRealData();
