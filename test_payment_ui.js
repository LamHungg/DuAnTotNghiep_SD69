// Script để test giao diện phương thức thanh toán mới
console.log("🎨 Testing new payment methods UI...");

// Tạo dữ liệu test
const testPaymentMethods = [
  {
    id: 1,
    ten: "Tiền mặt",
    moTa: "Thanh toán khi nhận hàng",
  },
  {
    id: 2,
    ten: "Chuyển khoản",
    moTa: "Chuyển khoản ngân hàng",
  },
];

// Test responsive design
function testResponsiveDesign() {
  console.log("📱 Testing responsive design...");

  const paymentList = document.querySelector(".payment-list");
  if (paymentList) {
    const computedStyle = window.getComputedStyle(paymentList);
    const display = computedStyle.display;
    const gridTemplateColumns = computedStyle.gridTemplateColumns;

    console.log("✅ Payment list display:", display);
    console.log("✅ Grid template columns:", gridTemplateColumns);

    if (display === "grid" && gridTemplateColumns === "1fr 1fr") {
      console.log("✅ Desktop layout: 2 columns grid");
    } else if (display === "grid" && gridTemplateColumns === "1fr") {
      console.log("✅ Mobile layout: 1 column grid");
    }
  }
}

// Test payment items
function testPaymentItems() {
  console.log("🔍 Testing payment items...");

  const paymentItems = document.querySelectorAll(".payment-item");
  console.log("📊 Found payment items:", paymentItems.length);

  paymentItems.forEach((item, index) => {
    const icon = item.querySelector(".payment-icon");
    const name = item.querySelector(".payment-name");
    const description = item.querySelector(".payment-description");

    console.log(`Item ${index + 1}:`);
    console.log("  - Icon:", icon ? "✅" : "❌");
    console.log("  - Name:", name ? name.textContent : "❌");
    console.log(
      "  - Description:",
      description ? description.textContent : "❌"
    );

    // Test click functionality
    item.addEventListener("click", () => {
      console.log(`🎯 Clicked payment method ${index + 1}:`, name.textContent);
    });
  });
}

// Test selected state
function testSelectedState() {
  console.log("✅ Testing selected state...");

  const selectedItems = document.querySelectorAll(".payment-item.selected");
  console.log("📊 Selected items:", selectedItems.length);

  if (selectedItems.length > 0) {
    selectedItems.forEach((item, index) => {
      const name = item.querySelector(".payment-name");
      console.log(`Selected item ${index + 1}:`, name.textContent);
    });
  } else {
    console.log("ℹ️ No items selected");
  }
}

// Test hover effects
function testHoverEffects() {
  console.log("🎯 Testing hover effects...");

  const paymentItems = document.querySelectorAll(".payment-item");
  paymentItems.forEach((item, index) => {
    item.addEventListener("mouseenter", () => {
      console.log(`🖱️ Hovered payment method ${index + 1}`);
    });
  });
}

// Run all tests
function runAllTests() {
  console.log("🚀 Running payment UI tests...");

  setTimeout(() => {
    testResponsiveDesign();
    testPaymentItems();
    testSelectedState();
    testHoverEffects();

    console.log("✅ All tests completed!");
    console.log("💡 Tips:");
    console.log("  - Try clicking on payment methods");
    console.log("  - Resize browser window to test responsive design");
    console.log("  - Hover over payment methods to see effects");
  }, 1000);
}

// Auto-run tests
runAllTests();

// Export functions for manual testing
window.testPaymentUI = {
  testResponsiveDesign,
  testPaymentItems,
  testSelectedState,
  testHoverEffects,
  runAllTests,
};
