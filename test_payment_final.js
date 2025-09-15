// Script test cuối cùng cho phương thức thanh toán
console.log("🎯 Testing payment methods - FINAL VERSION");

const API_URL = "http://localhost:8080/api";

async function testPaymentMethodsFinal() {
  console.log("🔍 Testing payment methods API...");

  try {
    const response = await fetch(`${API_URL}/payment/methods`, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const paymentMethods = await response.json();

    console.log("✅ Payment methods loaded successfully:");
    console.log("📊 Total methods:", paymentMethods.length);

    // Kiểm tra chính xác 2 phương thức
    if (paymentMethods.length === 2) {
      console.log("✅ ĐÚNG 2 PHƯƠNG THỨC THANH TOÁN!");

      const method1 = paymentMethods.find((m) => m.id === 1);
      const method2 = paymentMethods.find((m) => m.id === 2);

      if (method1 && method2) {
        console.log("✅ CÓ ĐỦ ID 1 VÀ 2");
        console.log("💰 Tiền mặt:", method1.ten || method1.tenPhuongThuc);
        console.log("🏦 Chuyển khoản:", method2.ten || method2.tenPhuongThuc);
        console.log("🎉 HỆ THỐNG HOẠT ĐỘNG TỐT!");
      } else {
        console.log("❌ THIẾU ID 1 HOẶC 2");
        console.log("Method 1:", method1);
        console.log("Method 2:", method2);
      }
    } else {
      console.log("❌ KHÔNG ĐÚNG 2 PHƯƠNG THỨC THANH TOÁN!");
      console.log("📊 Số lượng hiện tại:", paymentMethods.length);

      // Hiển thị tất cả phương thức để debug
      paymentMethods.forEach((method, index) => {
        console.log(
          `Method ${index + 1}: ID ${method.id}, Name: ${
            method.ten || method.tenPhuongThuc
          }`
        );
      });
    }
  } catch (error) {
    console.error("❌ Error testing payment methods:", error);
  }
}

// Test UI elements
function testPaymentUI() {
  console.log("🎨 Testing payment UI elements...");

  const paymentList = document.querySelector(".payment-list");
  const paymentItems = document.querySelectorAll(".payment-item");
  const paymentIcons = document.querySelectorAll(".payment-icon");

  console.log("📊 UI Elements found:");
  console.log("- Payment list:", paymentList ? "✅" : "❌");
  console.log("- Payment items:", paymentItems.length);
  console.log("- Payment icons:", paymentIcons.length);

  if (paymentItems.length === 2) {
    console.log("✅ UI hiển thị đúng 2 phương thức thanh toán!");
  } else {
    console.log("❌ UI không hiển thị đúng 2 phương thức!");
  }
}

// Run all tests
async function runFinalTests() {
  console.log("🚀 Running final payment tests...");

  await testPaymentMethodsFinal();
  setTimeout(() => {
    testPaymentUI();
    console.log("✅ All tests completed!");
  }, 1000);
}

// Auto-run tests
runFinalTests();

// Export functions
window.testPaymentFinal = {
  testPaymentMethodsFinal,
  testPaymentUI,
  runFinalTests,
};
