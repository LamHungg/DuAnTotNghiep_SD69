// Script để test mua sản phẩm trực tiếp bằng ID
console.log("🛒 Test Direct Purchase Tool");

// Import checkoutService (nếu chạy trong browser)
// import checkoutService from './datn_web_fe/src/services/checkoutService.js';

// Hàm để test mua sản phẩm trực tiếp
async function testDirectPurchase(productId, quantity = 1) {
  console.log(
    `🛒 Testing direct purchase for product ID: ${productId}, quantity: ${quantity}`
  );

  try {
    // Tạo dữ liệu checkout trực tiếp
    const testCheckoutData = {
      cartItems: [
        {
          chiTietSanPhamId: productId,
          soLuong: quantity,
          gia: 100000,
          thanhTien: 100000 * quantity,
        },
      ],
      diaChiId: 1,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test mua trực tiếp",
      phiVanChuyen: 30000,
      tongTienHang: 100000 * quantity,
      tongThanhToan: 100000 * quantity + 30000,
    };

    console.log("📋 Test checkout data:", testCheckoutData);

    // Gọi API test checkout
    const response = await fetch(
      "http://localhost:8080/api/checkout/test-process",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(testCheckoutData),
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Direct purchase test successful:", result);
      return result;
    } else {
      const error = await response.text();
      console.error("❌ Direct purchase test failed:", response.status, error);
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
  } catch (error) {
    console.error("❌ Error in direct purchase test:", error);
    throw error;
  }
}

// Hàm để mua sản phẩm thực tế
async function buyProductDirectly(productId, quantity = 1) {
  console.log(
    `🛒 Buying product directly: ID ${productId}, quantity ${quantity}`
  );

  try {
    // Tạo dữ liệu checkout thực tế
    const checkoutData = {
      cartItems: [
        {
          chiTietSanPhamId: productId,
          soLuong: quantity,
          gia: 100000,
          thanhTien: 100000 * quantity,
        },
      ],
      diaChiId: 1,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Mua trực tiếp từ website",
      phiVanChuyen: 30000,
      tongTienHang: 100000 * quantity,
      tongThanhToan: 100000 * quantity + 30000,
    };

    console.log("📋 Real checkout data:", checkoutData);

    // Gọi API checkout thực tế
    const response = await fetch("http://localhost:8080/api/checkout/process", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(checkoutData),
    });

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Direct purchase successful:", result);
      return result;
    } else {
      const error = await response.text();
      console.error("❌ Direct purchase failed:", response.status, error);
      throw new Error(`HTTP ${response.status}: ${error}`);
    }
  } catch (error) {
    console.error("❌ Error in direct purchase:", error);
    throw error;
  }
}

// Hàm để kiểm tra sản phẩm có tồn tại không
async function checkProductExists(productId) {
  console.log(`🔍 Checking if product ${productId} exists...`);

  try {
    const response = await fetch(
      `http://localhost:8080/api/products/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      const product = await response.json();
      console.log("✅ Product exists:", product);
      return product;
    } else {
      console.log("❌ Product does not exist:", response.status);
      return null;
    }
  } catch (error) {
    console.error("❌ Error checking product:", error);
    return null;
  }
}

// Hàm để lấy danh sách sản phẩm có sẵn
async function getAvailableProducts() {
  console.log("🔍 Getting available products...");

  try {
    const response = await fetch("http://localhost:8080/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const products = await response.json();
      console.log("✅ Available products:", products);
      return products;
    } else {
      console.error("❌ Failed to get products:", response.status);
      return [];
    }
  } catch (error) {
    console.error("❌ Error getting products:", error);
    return [];
  }
}

// Auto-test với các ID khác nhau
async function runDirectPurchaseTests() {
  console.log("🚀 Running direct purchase tests...");

  // Test 1: Kiểm tra sản phẩm ID 1
  console.log("\n=== Test 1: Product ID 1 ===");
  await checkProductExists(1);
  await testDirectPurchase(1, 1);

  // Test 2: Kiểm tra sản phẩm ID 2
  console.log("\n=== Test 2: Product ID 2 ===");
  await checkProductExists(2);
  await testDirectPurchase(2, 2);

  // Test 3: Kiểm tra sản phẩm ID 24 (lỗi)
  console.log("\n=== Test 3: Product ID 24 (Expected Error) ===");
  await checkProductExists(24);
  try {
    await testDirectPurchase(24, 1);
  } catch (error) {
    console.log("✅ Expected error for ID 24:", error.message);
  }

  // Test 4: Lấy danh sách sản phẩm có sẵn
  console.log("\n=== Test 4: Available Products ===");
  await getAvailableProducts();
}

// Export functions để sử dụng trong console
window.directPurchase = {
  testDirectPurchase,
  buyProductDirectly,
  checkProductExists,
  getAvailableProducts,
  runDirectPurchaseTests,
};

console.log(
  "💡 Use directPurchase.testDirectPurchase(productId, quantity) to test"
);
console.log(
  "💡 Use directPurchase.buyProductDirectly(productId, quantity) to buy"
);
console.log(
  "💡 Use directPurchase.checkProductExists(productId) to check product"
);
console.log("💡 Use directPurchase.getAvailableProducts() to get all products");
console.log("💡 Use directPurchase.runDirectPurchaseTests() to run all tests");

// Auto-run tests
console.log("\n🚀 Auto-running tests...");
runDirectPurchaseTests();
