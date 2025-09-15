// Script để test checkout sau khi đã sửa frontend
console.log("🧪 Testing fixed checkout system...");

// Lấy user từ localStorage
const userStr = localStorage.getItem("user");
if (!userStr) {
  console.error("❌ Không tìm thấy user trong localStorage");
  return;
}

const user = JSON.parse(userStr);
console.log("👤 Current user:", user);

// Test 1: Kiểm tra dữ liệu cart hiện tại
async function testCurrentCart() {
  console.log("\n📦 Test 1: Checking current cart data...");

  const checkoutCart = localStorage.getItem("checkout_cart");
  if (!checkoutCart) {
    console.log("❌ No checkout_cart found in localStorage");
    return false;
  }

  const cart = JSON.parse(checkoutCart);
  console.log("📦 Current cart:", cart);

  // Kiểm tra từng item
  let hasValidData = true;
  cart.forEach((item, index) => {
    console.log(`\n📦 Item ${index + 1}:`);
    console.log(`  - id: ${item.id}`);
    console.log(`  - chiTietSanPhamId: ${item.chiTietSanPhamId}`);
    console.log(`  - name: ${item.name}`);
    console.log(`  - quantity: ${item.quantity}`);
    console.log(`  - price: ${item.price}`);

    // Kiểm tra chiTietSanPhamId
    const chiTietSanPhamId = item.chiTietSanPhamId || item.id;
    if (!chiTietSanPhamId || chiTietSanPhamId < 5 || chiTietSanPhamId > 14) {
      console.error(`❌ INVALID chiTietSanPhamId: ${chiTietSanPhamId}`);
      hasValidData = false;
    } else {
      console.log(`✅ Valid chiTietSanPhamId: ${chiTietSanPhamId}`);
    }
  });

  return hasValidData;
}

// Test 2: Test checkout với dữ liệu hiện tại
async function testCheckout() {
  console.log("\n🛒 Test 2: Testing checkout process...");

  try {
    const checkoutCart = localStorage.getItem("checkout_cart");
    if (!checkoutCart) {
      console.log("❌ No checkout_cart found");
      return false;
    }

    const cart = JSON.parse(checkoutCart);

    // Tạo checkout data
    const checkoutData = {
      cartItems: cart.map((item) => ({
        chiTietSanPhamId: item.chiTietSanPhamId || item.id,
        soLuong: item.quantity,
        gia: item.price,
        thanhTien: item.thanhTien || item.price * item.quantity,
        tenSanPham: item.name,
        mauSac: item.mauSac,
        kichCo: item.kichCo,
      })),
      diaChiId: 17, // Tạm thời hardcode
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test checkout",
      phiVanChuyen: 30000,
      tongTienHang: cart.reduce(
        (sum, item) => sum + (item.thanhTien || item.price * item.quantity),
        0
      ),
      tongThanhToan:
        cart.reduce(
          (sum, item) => sum + (item.thanhTien || item.price * item.quantity),
          0
        ) + 30000,
    };

    console.log("📤 Checkout data:", checkoutData);

    // Test với endpoint test-process
    const response = await fetch(
      "http://localhost:8080/api/checkout/test-process",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        credentials: "include",
        body: JSON.stringify(checkoutData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Checkout failed: ${response.status} - ${errorText}`);
      return false;
    }

    const result = await response.json();
    console.log("✅ Checkout test successful:", result);
    return true;
  } catch (error) {
    console.error("❌ Checkout test error:", error);
    return false;
  }
}

// Test 3: Tạo cart mới với dữ liệu hợp lệ
async function createValidCart() {
  console.log("\n🆕 Test 3: Creating valid cart...");

  try {
    // Lấy danh sách sản phẩm từ backend
    const response = await fetch("http://localhost:8080/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const products = await response.json();
    console.log("📦 Available products:", products);

    // Lọc sản phẩm hợp lệ (ID 5-14)
    const validProducts = products.filter(
      (product) => product.id >= 5 && product.id <= 14 && product.soLuong > 0
    );

    if (validProducts.length === 0) {
      console.error("❌ No valid products found");
      return false;
    }

    // Tạo cart với sản phẩm đầu tiên
    const firstProduct = validProducts[0];
    const newCart = [
      {
        id: firstProduct.id,
        chiTietSanPhamId: firstProduct.id, // QUAN TRỌNG: Đặt chiTietSanPhamId
        name: firstProduct.tenSanPham,
        quantity: 1,
        price: firstProduct.gia,
        thanhTien: firstProduct.gia,
        hinhAnh: firstProduct.hinhAnh || "",
        kichCo: firstProduct.kichCo || "M",
        mauSac: firstProduct.mauSac || "Đen",
        chatLieu: firstProduct.chatLieu || "Cotton",
      },
    ];

    console.log("🆕 New valid cart:", newCart);

    // Lưu vào localStorage
    localStorage.setItem("checkout_cart", JSON.stringify(newCart));
    localStorage.setItem("checkout_total", firstProduct.gia.toString());

    console.log("✅ Valid cart created and saved");
    return true;
  } catch (error) {
    console.error("❌ Error creating valid cart:", error);
    return false;
  }
}

// Chạy tất cả tests
async function runAllTests() {
  console.log("🚀 Running all checkout tests...");

  // Test 1: Kiểm tra cart hiện tại
  const cartValid = await testCurrentCart();

  if (!cartValid) {
    console.log(
      "\n⚠️ Current cart has invalid data, creating new valid cart..."
    );
    const created = await createValidCart();
    if (!created) {
      console.error("❌ Failed to create valid cart");
      return;
    }
  }

  // Test 2: Test checkout
  const checkoutSuccess = await testCheckout();

  console.log("\n📊 Test Results:");
  console.log(`  - Cart valid: ${cartValid ? "✅" : "❌"}`);
  console.log(`  - Checkout success: ${checkoutSuccess ? "✅" : "❌"}`);

  if (checkoutSuccess) {
    console.log("\n🎉 All tests passed! Checkout system is working correctly.");
  } else {
    console.log("\n❌ Some tests failed. Check the logs above for details.");
  }
}

// Export functions
window.testCheckout = {
  testCurrentCart,
  testCheckout,
  createValidCart,
  runAllTests,
};

console.log("💡 Available functions:");
console.log("  - testCheckout.runAllTests() - Run all tests");
console.log("  - testCheckout.testCurrentCart() - Test current cart");
console.log("  - testCheckout.testCheckout() - Test checkout process");
console.log("  - testCheckout.createValidCart() - Create valid cart");
