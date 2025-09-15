// Script test toàn bộ luồng checkout
// Chạy script này trong browser console

const testCompleteFlow = async () => {
  try {
    console.log("=== TESTING COMPLETE CHECKOUT FLOW ===");

    // 1. Kiểm tra authentication
    console.log("1. Checking authentication...");
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token) {
      console.log("❌ No token found - please login first");
      return;
    }

    console.log("✅ Token found:", token);
    console.log("✅ User:", user ? JSON.parse(user) : null);

    // 2. Test payment methods API
    console.log("2. Testing payment methods API...");
    try {
      const paymentResponse = await fetch(
        "http://localhost:8080/api/payment/methods",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json();
        console.log("✅ Payment methods API:", paymentData);

        // Transform data
        const transformedData = paymentData.map((item) => ({
          id: item.id,
          ten: item.tenPhuongThuc,
          moTa: getPaymentMethodDescription(item.tenPhuongThuc),
        }));
        console.log("✅ Transformed payment methods:", transformedData);

        // Inject vào page
        injectPaymentMethods(transformedData);
      } else {
        console.log("❌ Payment methods API failed:", paymentResponse.status);
      }
    } catch (error) {
      console.log("❌ Payment methods API error:", error);
    }

    // 3. Test checkout test endpoint
    console.log("3. Testing checkout test endpoint...");
    try {
      const checkoutTestResponse = await fetch(
        "http://localhost:8080/api/checkout/test",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (checkoutTestResponse.ok) {
        const testData = await checkoutTestResponse.json();
        console.log("✅ Checkout test:", testData);
      } else {
        console.log("❌ Checkout test failed:", checkoutTestResponse.status);
      }
    } catch (error) {
      console.log("❌ Checkout test error:", error);
    }

    // 4. Test checkout test-process endpoint
    console.log("4. Testing checkout test-process endpoint...");
    const testProcessData = {
      cartItems: [
        {
          chiTietSanPhamId: 1,
          soLuong: 2,
          gia: 100000,
          thanhTien: 200000,
        },
      ],
      diaChiId: 1,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test order from complete flow",
      phiVanChuyen: 30000,
      tongTienHang: 200000,
      tongThanhToan: 230000,
    };

    try {
      const testProcessResponse = await fetch(
        "http://localhost:8080/api/checkout/test-process",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(testProcessData),
        }
      );

      if (testProcessResponse.ok) {
        const processData = await testProcessResponse.json();
        console.log("✅ Test process:", processData);
      } else {
        console.log("❌ Test process failed:", testProcessResponse.status);
      }
    } catch (error) {
      console.log("❌ Test process error:", error);
    }

    console.log("=== COMPLETE FLOW TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in complete flow test:", error);
  }
};

// Function để inject payment methods vào page
const injectPaymentMethods = (paymentMethods) => {
  console.log("5. Injecting payment methods into page...");

  // Tìm checkout container
  const checkoutContainer = document.querySelector(
    '.checkout-container, .checkout, [class*="checkout"], main, .container'
  );

  if (checkoutContainer) {
    console.log("✅ Found checkout container");

    // Tạo payment section
    const paymentSection = document.createElement("div");
    paymentSection.className = "payment-methods-section";
    paymentSection.style.cssText = `
      margin: 20px 0;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: #f9f9f9;
    `;

    paymentSection.innerHTML = `
      <h3 style="margin-bottom: 15px; color: #333;">Phương thức thanh toán</h3>
      <div class="payment-methods-list">
        ${paymentMethods
          .map(
            (method) => `
          <div class="payment-method-item" style="margin: 10px 0; padding: 10px; border: 1px solid #ccc; border-radius: 4px; background: white;">
            <input type="radio" name="payment" value="${method.id}" id="payment-${method.id}" style="margin-right: 10px;">
            <label for="payment-${method.id}" style="cursor: pointer;">
              <strong style="color: #333;">${method.ten}</strong>
              <br>
              <small style="color: #666;">${method.moTa}</small>
            </label>
          </div>
        `
          )
          .join("")}
      </div>
    `;

    // Thêm vào checkout container
    checkoutContainer.appendChild(paymentSection);
    console.log("✅ Payment methods injected successfully");

    // Thêm event listeners
    const radioButtons = paymentSection.querySelectorAll('input[type="radio"]');
    radioButtons.forEach((radio) => {
      radio.addEventListener("change", (e) => {
        console.log("Selected payment method:", e.target.value);
        // Có thể thêm logic xử lý khi chọn payment method
      });
    });
  } else {
    console.log("❌ Checkout container not found");
  }
};

// Helper function để tạo mô tả cho phương thức thanh toán
const getPaymentMethodDescription = (tenPhuongThuc) => {
  switch (tenPhuongThuc) {
    case "Tiền mặt":
      return "Thanh toán bằng tiền mặt";
    case "Chuyển khoản":
      return "Chuyển khoản qua tài khoản ngân hàng";
    case "Momo":
      return "Thanh toán qua ví điện tử Momo";
    case "Thẻ tín dụng":
      return "Thanh toán qua thẻ tín dụng";
    case "VNPay":
      return "Thanh toán qua cổng thanh toán VNPay";
    case "ZaloPay":
      return "Thanh toán qua ví điện tử ZaloPay";
    case "ShopeePay":
      return "Thanh toán qua ví điện tử ShopeePay";
    case "COD":
      return "Thanh toán khi nhận hàng (Cash On Delivery)";
    case "Thanh toán khi nhận hàng":
    case "Thanh toán khi n?n hàng":
      return "Thanh toán bằng tiền mặt khi nhận hàng";
    case "Chuyển khoản ngân hàng":
    case "Chuy?n kho?n ngân hàng":
      return "Chuyển khoản qua tài khoản ngân hàng";
    case "Ví điện tử":
    case "Ví di?n t?":
      return "Thanh toán qua ví điện tử";
    case "Thẻ tín dụng/ghi nợ":
    case "Th? tín d?ng/ghi n?":
      return "Thanh toán qua thẻ tín dụng hoặc thẻ ghi nợ";
    default:
      return `Phương thức thanh toán: ${tenPhuongThuc}`;
  }
};

// Export functions
window.testCompleteFlow = testCompleteFlow;
window.injectPaymentMethods = injectPaymentMethods;

// Auto-run
testCompleteFlow();
