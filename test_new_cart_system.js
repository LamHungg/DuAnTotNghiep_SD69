// Script test cho hệ thống giỏ hàng và mua hàng mới với kiểm tra tồn kho
console.log("🛒 Test New Cart System with Stock Management");

// Hàm test kiểm tra tồn kho
async function testStockCheck(productId) {
  console.log(`🔍 Testing stock check for product ID: ${productId}`);

  try {
    const response = await fetch(
      `http://localhost:8080/api/cart/check-stock/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Stock check result:", result);
      return result;
    } else {
      const error = await response.text();
      console.error("❌ Stock check failed:", response.status, error);
      return null;
    }
  } catch (error) {
    console.error("❌ Error in stock check:", error);
    return null;
  }
}

// Hàm test thêm vào giỏ hàng với kiểm tra tồn kho
async function testAddToCartWithStockCheck(productId, quantity = 1) {
  console.log(
    `🛒 Testing add to cart with stock check: ID ${productId}, quantity ${quantity}`
  );

  try {
    // 1. Kiểm tra tồn kho trước
    const stockInfo = await testStockCheck(productId);
    if (!stockInfo) {
      console.error("❌ Cannot check stock");
      return false;
    }

    if (!stockInfo.available) {
      console.error(`❌ Product not available: ${stockInfo.message}`);
      return false;
    }

    if (stockInfo.canAdd < quantity) {
      console.error(
        `❌ Not enough stock. Can add: ${stockInfo.canAdd}, Requested: ${quantity}`
      );
      return false;
    }

    console.log("✅ Stock check passed, proceeding to add to cart");

    // 2. Thêm vào giỏ hàng
    const addToCartData = {
      chiTietSanPhamId: productId,
      soLuong: quantity,
    };

    const response = await fetch("http://localhost:8080/api/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(addToCartData),
    });

    if (response.ok) {
      console.log("✅ Successfully added to cart");
      return true;
    } else {
      const error = await response.text();
      console.error("❌ Add to cart failed:", response.status, error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error in add to cart:", error);
    return false;
  }
}

// Hàm test checkout với kiểm tra tồn kho
async function testCheckoutWithStockValidation() {
  console.log("🛒 Testing checkout with stock validation");

  try {
    // 1. Lấy giỏ hàng hiện tại
    const cartResponse = await fetch("http://localhost:8080/api/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!cartResponse.ok) {
      console.error("❌ Cannot get cart");
      return false;
    }

    const cartItems = await cartResponse.json();
    console.log("📋 Current cart items:", cartItems);

    if (cartItems.length === 0) {
      console.log("⚠️ Cart is empty, adding test item first");
      const added = await testAddToCartWithStockCheck(1, 1);
      if (!added) {
        console.error("❌ Cannot add test item to cart");
        return false;
      }
      // Lấy lại giỏ hàng
      const newCartResponse = await fetch("http://localhost:8080/api/cart", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });
      const newCartItems = await newCartResponse.json();
      cartItems.push(...newCartItems);
    }

    // 2. Kiểm tra tồn kho cho tất cả sản phẩm trong giỏ
    const productIds = cartItems.map((item) => item.chiTietSanPhamId);
    console.log("🔍 Checking stock for products:", productIds);

    const stockResponse = await fetch(
      "http://localhost:8080/api/cart/check-stock-batch",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(productIds),
      }
    );

    if (!stockResponse.ok) {
      console.error("❌ Cannot check stock batch");
      return false;
    }

    const stockData = await stockResponse.json();
    console.log("📊 Stock validation result:", stockData);

    // 3. Kiểm tra xem tất cả sản phẩm có đủ số lượng không
    const invalidItems = stockData.stockInfo.filter((info) => !info.available);
    if (invalidItems.length > 0) {
      console.error("❌ Some products are not available:", invalidItems);
      return false;
    }

    console.log("✅ All products are available for checkout");

    // 4. Thực hiện checkout
    const checkoutData = {
      cartItems: cartItems.map((item) => ({
        chiTietSanPhamId: item.chiTietSanPhamId,
        soLuong: item.soLuong,
        gia: item.gia,
        thanhTien: item.thanhTien,
      })),
      diaChiId: 1,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test checkout với kiểm tra tồn kho",
      phiVanChuyen: 30000,
      tongTienHang: cartItems.reduce(
        (sum, item) => sum + parseFloat(item.thanhTien),
        0
      ),
      tongThanhToan:
        cartItems.reduce((sum, item) => sum + parseFloat(item.thanhTien), 0) +
        30000,
    };

    console.log("📋 Checkout data:", checkoutData);

    const checkoutResponse = await fetch(
      "http://localhost:8080/api/checkout/process",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(checkoutData),
      }
    );

    if (checkoutResponse.ok) {
      const result = await checkoutResponse.json();
      console.log("✅ Checkout successful:", result);
      return true;
    } else {
      const error = await checkoutResponse.text();
      console.error("❌ Checkout failed:", checkoutResponse.status, error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error in checkout:", error);
    return false;
  }
}

// Hàm test toàn bộ hệ thống
async function testCompleteSystem() {
  console.log("🚀 Testing complete cart and checkout system");

  try {
    // Test 1: Kiểm tra tồn kho sản phẩm ID 1
    console.log("\n=== Test 1: Stock Check ===");
    await testStockCheck(1);

    // Test 2: Thêm vào giỏ hàng với kiểm tra tồn kho
    console.log("\n=== Test 2: Add to Cart with Stock Check ===");
    await testAddToCartWithStockCheck(1, 1);

    // Test 3: Kiểm tra tồn kho sau khi thêm vào giỏ
    console.log("\n=== Test 3: Stock Check After Adding to Cart ===");
    await testStockCheck(1);

    // Test 4: Thử thêm quá số lượng tồn kho
    console.log("\n=== Test 4: Try to Add More Than Available ===");
    await testAddToCartWithStockCheck(1, 999);

    // Test 5: Checkout với kiểm tra tồn kho
    console.log("\n=== Test 5: Checkout with Stock Validation ===");
    await testCheckoutWithStockValidation();

    console.log("\n✅ All tests completed!");
  } catch (error) {
    console.error("❌ Error in complete system test:", error);
  }
}

// Export functions để sử dụng trong console
window.newCartSystem = {
  testStockCheck,
  testAddToCartWithStockCheck,
  testCheckoutWithStockValidation,
  testCompleteSystem,
};

console.log("💡 Use newCartSystem.testStockCheck(productId) to check stock");
console.log(
  "💡 Use newCartSystem.testAddToCartWithStockCheck(productId, quantity) to add to cart"
);
console.log(
  "💡 Use newCartSystem.testCheckoutWithStockValidation() to test checkout"
);
console.log("💡 Use newCartSystem.testCompleteSystem() to run all tests");

// Auto-run test
console.log("\n🚀 Auto-running complete system test...");
testCompleteSystem();
