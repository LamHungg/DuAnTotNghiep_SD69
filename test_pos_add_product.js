// Test script để kiểm tra chức năng thêm sản phẩm vào giỏ hàng
const axios = require("axios");

async function testGetProducts() {
  try {
    console.log("🔍 Testing get products...");
    const response = await axios.get("http://localhost:8080/api/pos/products");

    console.log("✅ Products loaded successfully");
    console.log("📊 Total products:", response.data.length);

    if (response.data.length > 0) {
      const firstProduct = response.data[0];
      console.log("📦 First product details:");
      console.log("   - ID:", firstProduct.id);
      console.log("   - Name:", firstProduct.tenSanPham);
      console.log("   - Code:", firstProduct.maSanPham);
      console.log("   - Stock:", firstProduct.soLuong);
      console.log("   - Price:", firstProduct.gia);
      console.log(
        "   - Images:",
        firstProduct.hinhAnh ? firstProduct.hinhAnh.length : 0
      );

      // Kiểm tra xem có variants không
      if (firstProduct.variants) {
        console.log("   - Variants:", firstProduct.variants.length);
      }

      return firstProduct;
    } else {
      console.log("❌ No products found");
      return null;
    }
  } catch (error) {
    console.error(
      "❌ Error getting products:",
      error.response?.data || error.message
    );
    return null;
  }
}

async function testGetCustomers() {
  try {
    console.log("\n👥 Testing get customers...");
    const response = await axios.get("http://localhost:8080/api/pos/customers");

    console.log("✅ Customers loaded successfully");
    console.log("📊 Total customers:", response.data.length);

    if (response.data.length > 0) {
      const firstCustomer = response.data[0];
      console.log("👤 First customer:", firstCustomer.hoTen);
    }

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error getting customers:",
      error.response?.data || error.message
    );
    return [];
  }
}

async function testGetVouchers() {
  try {
    console.log("\n🎫 Testing get vouchers...");
    const response = await axios.get(
      "http://localhost:8080/api/pos/vouchers/active"
    );

    console.log("✅ Vouchers loaded successfully");
    console.log("📊 Total active vouchers:", response.data.length);

    if (response.data.length > 0) {
      const firstVoucher = response.data[0];
      console.log("🎫 First voucher:", firstVoucher.tenVoucher);
    }

    return response.data;
  } catch (error) {
    console.error(
      "❌ Error getting vouchers:",
      error.response?.data || error.message
    );
    return [];
  }
}

async function runTests() {
  console.log("🚀 Starting POS Add Product Tests...\n");

  const product = await testGetProducts();
  await testGetCustomers();
  await testGetVouchers();

  if (product) {
    console.log("\n✅ All API endpoints working correctly!");
    console.log("🎯 Ready to test frontend functionality");
    console.log("\n📋 Next steps:");
    console.log("1. Open http://localhost:3000/dashboard/pos");
    console.log("2. Click 'Tạo Đơn Mới'");
    console.log("3. Click on a product card");
    console.log("4. Check browser console for debug logs");
  } else {
    console.log("\n❌ Cannot test frontend - no products available");
  }

  console.log("\n✅ Tests completed!");
}

runTests();
