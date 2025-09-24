// Test script để kiểm tra backend POS order creation
const axios = require("axios");

async function testPOSOrderCreation() {
  try {
    console.log("🔍 Testing POS order creation...");

    // Test data
    const orderData = {
      maDonHang: `POS${Date.now()}`,
      khachHangId: null,
      chiTietDonHang: [
        {
          chiTietSanPhamId: 1,
          soLuong: 1,
          gia: 150000,
          thanhTien: 150000,
        },
      ],
      tongThanhToan: 150000,
      phuongThucThanhToan: "Tiền mặt",
      ghiChu: "Test order",
      voucherId: null,
      nguoiTaoId: 1,
    };

    console.log("📊 Sending order data:", JSON.stringify(orderData, null, 2));

    const response = await axios.post(
      "http://localhost:8080/api/pos/orders",
      orderData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ POS order creation successful!");
    console.log("📊 Response:", response.data);
    console.log("📊 Status:", response.status);

    return response.data;
  } catch (error) {
    console.error("❌ Error testing POS order creation:");
    console.error("📊 Status:", error.response?.status);
    console.error("📊 Data:", error.response?.data);
    console.error("📊 Message:", error.message);
    return null;
  }
}

async function testProductData() {
  try {
    console.log("\n🔍 Testing product data...");

    const response = await axios.get("http://localhost:8080/api/pos/products");

    console.log("✅ Product data retrieved!");
    console.log("📊 Status:", response.status);
    console.log("📊 Product count:", response.data.length);

    if (response.data.length > 0) {
      console.log("📊 Sample product:", {
        id: response.data[0].id,
        tenSanPham: response.data[0].tenSanPham,
        soLuong: response.data[0].soLuong,
        gia: response.data[0].gia,
      });
    }

    return response.data;
  } catch (error) {
    console.error("❌ Error testing product data:");
    console.error("📊 Status:", error.response?.status);
    console.error("📊 Data:", error.response?.data);
    return null;
  }
}

async function runTests() {
  console.log("🚀 Starting POS Backend Tests...\n");

  const products = await testProductData();
  if (products && products.length > 0) {
    console.log("\n✅ Products available, testing order creation...");
    await testPOSOrderCreation();
  } else {
    console.log("\n❌ No products available, cannot test order creation");
  }

  console.log("\n✅ Tests completed!");
}

runTests();
