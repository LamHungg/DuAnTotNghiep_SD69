// Debug script để kiểm tra dữ liệu giỏ hàng
console.log("🔍 Debug Cart Data");

// Kiểm tra localStorage
console.log("=== LocalStorage Data ===");
console.log("Cart data:", localStorage.getItem("cart"));
console.log("Checkout cart data:", localStorage.getItem("checkout_cart"));

// Parse và hiển thị dữ liệu cart
try {
  const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
  console.log("Parsed cart data:", cartData);

  if (cartData.length > 0) {
    console.log("Cart items:");
    cartData.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        id: item.id,
        chiTietSanPhamId: item.chiTietSanPhamId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      });
    });
  }
} catch (error) {
  console.error("Error parsing cart data:", error);
}

// Kiểm tra checkout cart
try {
  const checkoutCartData = JSON.parse(
    localStorage.getItem("checkout_cart") || "[]"
  );
  console.log("Parsed checkout cart data:", checkoutCartData);

  if (checkoutCartData.length > 0) {
    console.log("Checkout cart items:");
    checkoutCartData.forEach((item, index) => {
      console.log(`Item ${index + 1}:`, {
        id: item.id,
        chiTietSanPhamId: item.chiTietSanPhamId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      });
    });
  }
} catch (error) {
  console.error("Error parsing checkout cart data:", error);
}

// Kiểm tra sessionStorage
console.log("=== SessionStorage Data ===");
console.log("Session cart data:", sessionStorage.getItem("cart"));

// Hàm để clear cart data nếu cần
function clearCartData() {
  console.log("🧹 Clearing cart data...");
  localStorage.removeItem("cart");
  localStorage.removeItem("checkout_cart");
  sessionStorage.removeItem("cart");
  console.log("✅ Cart data cleared");
}

// Hàm để test với dữ liệu hợp lệ
function testWithValidData() {
  console.log("🧪 Testing with valid data...");

  // Tạo dữ liệu test hợp lệ (ID 1 thay vì 18)
  const validCartData = [
    {
      id: 1,
      chiTietSanPhamId: 1,
      name: "Test Product",
      price: 100000,
      quantity: 2,
      thanhTien: 200000,
    },
  ];

  localStorage.setItem("checkout_cart", JSON.stringify(validCartData));
  console.log("✅ Test data set:", validCartData);
}

// Export functions để sử dụng trong console
window.debugCart = {
  clearCartData,
  testWithValidData,
};

console.log("💡 Use debugCart.clearCartData() to clear cart");
console.log("💡 Use debugCart.testWithValidData() to set test data");
