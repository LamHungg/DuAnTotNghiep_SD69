// Script test đơn giản cho browser console
// Copy và paste toàn bộ script này vào browser console

(async () => {
  try {
    console.log("=== SIMPLE BROWSER TEST ===");

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

      console.log("Payment methods status:", paymentResponse.status);
      if (paymentResponse.ok) {
        const paymentData = await paymentResponse.json();
        console.log("✅ Payment methods:", paymentData);
      } else {
        const error = await paymentResponse.text();
        console.log("❌ Payment methods error:", error);
      }
    } catch (error) {
      console.log("❌ Payment methods fetch error:", error);
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

      console.log("Checkout test status:", checkoutTestResponse.status);
      if (checkoutTestResponse.ok) {
        const testData = await checkoutTestResponse.json();
        console.log("✅ Checkout test:", testData);
      } else {
        const error = await checkoutTestResponse.text();
        console.log("❌ Checkout test error:", error);
      }
    } catch (error) {
      console.log("❌ Checkout test fetch error:", error);
    }

    console.log("=== TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in test:", error);
  }
})();
