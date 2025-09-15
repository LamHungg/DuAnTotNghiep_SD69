// Script test toàn bộ luồng checkout
// Chạy script này trong browser console sau khi đăng nhập

const testCompleteCheckoutFlow = async () => {
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

    // 2. Test payment methods
    console.log("2. Testing payment methods...");
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

    // 3. Test checkout test endpoint
    console.log("3. Testing checkout test endpoint...");
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
      ghiChuKhachHang: "Test order from browser",
      phiVanChuyen: 30000,
      tongTienHang: 200000,
      tongThanhToan: 230000,
    };

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

    console.log("Test process status:", testProcessResponse.status);
    if (testProcessResponse.ok) {
      const processData = await testProcessResponse.json();
      console.log("✅ Test process:", processData);
    } else {
      const error = await testProcessResponse.text();
      console.log("❌ Test process error:", error);
    }

    console.log("=== TEST COMPLETED ===");
  } catch (error) {
    console.error("❌ Error in test:", error);
  }
};

// Chạy test
testCompleteCheckoutFlow();
