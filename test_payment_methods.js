// Script để test API phương thức thanh toán
const API_URL = "http://localhost:8080/api";

async function testPaymentMethods() {
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

    paymentMethods.forEach((method, index) => {
      console.log(
        `${index + 1}. ID: ${method.id}, Name: ${
          method.ten || method.tenPhuongThuc
        }`
      );
    });

    // Kiểm tra xem có đúng 2 phương thức không
    if (paymentMethods.length === 2) {
      console.log("✅ Đúng 2 phương thức thanh toán!");

      const method1 = paymentMethods.find((m) => m.id === 1);
      const method2 = paymentMethods.find((m) => m.id === 2);

      if (method1 && method2) {
        console.log("✅ Có đủ ID 1 và 2");
        console.log("💰 Tiền mặt:", method1.ten || method1.tenPhuongThuc);
        console.log("🏦 Chuyển khoản:", method2.ten || method2.tenPhuongThuc);
      } else {
        console.log("❌ Thiếu ID 1 hoặc 2");
      }
    } else {
      console.log("❌ Không đúng 2 phương thức thanh toán!");
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

// Test payment endpoint
async function testPaymentEndpoint() {
  console.log("🔍 Testing payment endpoint...");

  try {
    const response = await fetch(`${API_URL}/payment/test`, {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.text();
    console.log("✅ Payment endpoint test:", result);
  } catch (error) {
    console.error("❌ Error testing payment endpoint:", error);
  }
}

// Chạy test
console.log("🚀 Starting payment methods test...");
testPaymentEndpoint().then(() => {
  testPaymentMethods();
});

// Export functions để có thể chạy từ console
window.testPaymentMethods = testPaymentMethods;
window.testPaymentEndpoint = testPaymentEndpoint;
