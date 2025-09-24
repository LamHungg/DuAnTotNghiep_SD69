// Script test tạo đơn hàng POS
const axios = require("axios");

async function testPOSOrder() {
  console.log("🔍 Testing POS Order Creation...\n");

  const baseURL = "http://localhost:8080/api";

  // Test data cho đơn hàng POS
  const orderData = {
    maDonHang: "POS" + Date.now(),
    tongThanhToan: 670000,
    phuongThucThanhToan: "cash",
    ghiChu: "Đơn hàng test POS",
    khachHangId: null, // Có thể null cho khách vãng lai
    voucherId: null,
    chiTietDonHang: [
      {
        chiTietSanPhamId: 1, // ID sản phẩm thực tế
        soLuong: 2,
        giaBan: 335000,
      },
    ],
  };

  try {
    console.log("📋 Testing: Tạo đơn hàng POS");
    console.log("🔗 URL: " + baseURL + "/pos/orders");
    console.log("📊 Data:", JSON.stringify(orderData, null, 2));

    const response = await axios.post(`${baseURL}/pos/orders`, orderData, {
      headers: {
        "Content-Type": "application/json",
      },
      timeout: 10000,
    });

    console.log("✅ Status: " + response.status);
    console.log("📊 Response:", JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      console.log("🎉 Đơn hàng tạo thành công!");
      console.log("📋 Order ID: " + response.data.donHangId);
      console.log("📋 Order Code: " + response.data.maDonHang);
    }
  } catch (error) {
    console.log("❌ Error: " + (error.response?.status || error.message));
    if (error.response?.data) {
      console.log(
        "📊 Error Data:",
        JSON.stringify(error.response.data, null, 2)
      );
    }
    if (error.response?.status === 500) {
      console.log("\n🔧 DEBUGGING 500 ERROR:");
      console.log("1. Check if all required entities exist in database");
      console.log("2. Check if TrangThaiDonHang with ID=5 exists");
      console.log("3. Check if DiaChi with ID=1 exists");
      console.log("4. Check if PhuongThucThanhToan with ID=1 exists");
      console.log("5. Check if ChiTietSanPham with ID=1 exists");
    }
  }
}

async function testDatabaseEntities() {
  console.log("\n🔍 Testing Database Entities...\n");

  const baseURL = "http://localhost:8080/api";

  // Test các entity cần thiết
  const entities = [
    { name: "ChiTietSanPham", url: `${baseURL}/chi-tiet-san-pham/1` },
    { name: "TrangThaiDonHang", url: `${baseURL}/trang-thai/5` },
    { name: "DiaChi", url: `${baseURL}/dia-chi/1` },
    { name: "PhuongThucThanhToan", url: `${baseURL}/phuong-thuc-thanh-toan/1` },
  ];

  for (const entity of entities) {
    try {
      console.log(`📋 Testing: ${entity.name}`);
      const response = await axios.get(entity.url, { timeout: 5000 });
      console.log(`✅ Status: ${response.status} - ${entity.name} exists`);
    } catch (error) {
      console.log(
        `❌ Status: ${error.response?.status} - ${entity.name} NOT FOUND`
      );
      if (error.response?.status === 404) {
        console.log(
          `   💡 Need to create ${entity.name} with ID ${entity.url
            .split("/")
            .pop()}`
        );
      }
    }
  }
}

async function runPOSTest() {
  console.log("🚀 Starting POS Order Test...\n");

  await testDatabaseEntities();
  await testPOSOrder();

  console.log("\n📋 SUMMARY:");
  console.log("If 500 error persists:");
  console.log("1. Check database for missing entities");
  console.log("2. Verify all required fields are set");
  console.log("3. Check foreign key constraints");
  console.log("4. Verify ChiTietSanPham exists and has stock");

  console.log("\n🔧 NEXT STEPS:");
  console.log("1. Fix missing database entities");
  console.log("2. Test POS order creation again");
  console.log("3. Verify order appears in Statistics page");
}

runPOSTest();
