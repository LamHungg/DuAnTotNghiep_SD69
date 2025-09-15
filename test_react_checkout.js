// Script test trực tiếp trong React app checkout
// Chạy script này khi đang ở trang checkout

const testReactCheckout = async () => {
  try {
    console.log("=== TESTING REACT CHECKOUT ===");

    // 1. Kiểm tra React app state
    console.log("1. Checking React app state...");
    const reactRoot = document.querySelector("#root");
    if (reactRoot && reactRoot._reactInternalFiber) {
      console.log("✅ React internal fiber found");
    } else {
      console.log("❌ React internal fiber not found");
    }

    // 2. Tìm checkout component
    console.log("2. Looking for checkout component...");
    const checkoutDivs = document.querySelectorAll("div");
    const checkoutComponent = Array.from(checkoutDivs).find(
      (div) => div.textContent && div.textContent.includes("checkout")
    );
    console.log("Checkout component found:", !!checkoutComponent);

    // 3. Kiểm tra payment methods section
    console.log("3. Looking for payment methods section...");
    const paymentSections = Array.from(document.querySelectorAll("*")).filter(
      (el) =>
        el.textContent &&
        (el.textContent.includes("payment") ||
          el.textContent.includes("thanh toán") ||
          el.textContent.includes("Payment"))
    );
    console.log("Payment sections found:", paymentSections.length);

    // 4. Test API call trực tiếp
    console.log("4. Testing API call directly...");
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:8080/api/payment/methods",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log("✅ API call successful:", data);

        // Transform data như frontend service
        const transformedData = data.map((item) => ({
          id: item.id,
          ten: item.tenPhuongThuc,
          moTa: getPaymentMethodDescription(item.tenPhuongThuc),
        }));
        console.log("✅ Transformed data:", transformedData);

        // Tạo payment methods HTML
        console.log("5. Creating payment methods HTML...");
        const paymentHTML = transformedData
          .map(
            (method) => `
          <div class="payment-method" data-id="${method.id}">
            <input type="radio" name="payment" value="${method.id}" id="payment-${method.id}">
            <label for="payment-${method.id}">
              <strong>${method.ten}</strong>
              <br>
              <small>${method.moTa}</small>
            </label>
          </div>
        `
          )
          .join("");

        console.log("Payment HTML:", paymentHTML);

        // Tìm nơi để inject payment methods
        const checkoutContainer = document.querySelector(
          '.checkout-container, .checkout, [class*="checkout"]'
        );
        if (checkoutContainer) {
          console.log("✅ Found checkout container");
          // Tạo payment section
          const paymentSection = document.createElement("div");
          paymentSection.innerHTML = `
            <h3>Phương thức thanh toán</h3>
            <div class="payment-methods">
              ${paymentHTML}
            </div>
          `;
          checkoutContainer.appendChild(paymentSection);
          console.log("✅ Payment methods injected");
        } else {
          console.log("❌ Checkout container not found");
        }
      } else {
        console.log("❌ API call failed:", response.status);
      }
    } catch (error) {
      console.log("❌ API call error:", error);
    }

    console.log("=== REACT CHECKOUT TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in React checkout test:", error);
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
    case "Thanh toán khi nh?n hàng":
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

// Export function
window.testReactCheckout = testReactCheckout;

// Auto-run
testReactCheckout();
