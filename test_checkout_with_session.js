// Script test checkout với session đã được kiểm tra
console.log("🛒 Test Checkout with Session Validation");

// Hàm kiểm tra session trước khi checkout
async function checkSessionBeforeCheckout() {
  console.log("🔍 Checking session before checkout...");

  try {
    const response = await fetch(
      "http://localhost:8080/api/auth/check-session",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    console.log("📡 Check-session status:", response.status);

    if (response.ok) {
      const userData = await response.json();
      console.log("✅ Session valid, user data:", userData);
      return userData;
    } else {
      console.log("❌ Session invalid or expired");
      return null;
    }
  } catch (error) {
    console.error("❌ Error checking session:", error);
    return null;
  }
}

// Hàm test checkout với session validation
async function testCheckoutWithSessionValidation() {
  console.log("🚀 Testing checkout with session validation...");

  try {
    // 1. Kiểm tra session trước
    const userData = await checkSessionBeforeCheckout();
    if (!userData) {
      console.error("❌ Session không hợp lệ, không thể checkout");
      return false;
    }

    console.log("✅ Session hợp lệ, tiếp tục checkout...");

    // 2. Lấy giỏ hàng
    const cartResponse = await fetch("http://localhost:8080/api/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!cartResponse.ok) {
      console.error("❌ Không thể lấy giỏ hàng");
      return false;
    }

    const cartItems = await cartResponse.json();
    console.log("📋 Cart items:", cartItems);

    if (cartItems.length === 0) {
      console.log("⚠️ Giỏ hàng trống, thêm sản phẩm test...");

      // Thêm sản phẩm test
      const addToCartResponse = await fetch(
        "http://localhost:8080/api/cart/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            chiTietSanPhamId: 1,
            soLuong: 1,
          }),
        }
      );

      if (addToCartResponse.ok) {
        console.log("✅ Đã thêm sản phẩm test vào giỏ hàng");
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
      } else {
        console.error("❌ Không thể thêm sản phẩm test");
        return false;
      }
    }

    // 3. Kiểm tra tồn kho
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
      console.error("❌ Không thể kiểm tra tồn kho");
      return false;
    }

    const stockData = await stockResponse.json();
    console.log("📊 Stock validation result:", stockData);

    const invalidItems = stockData.stockInfo.filter((info) => !info.available);
    if (invalidItems.length > 0) {
      console.error("❌ Có sản phẩm không đủ số lượng:", invalidItems);
      return false;
    }

    console.log("✅ Tất cả sản phẩm đều có đủ số lượng");

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
      ghiChuKhachHang: "Test checkout với session validation",
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

    console.log("📡 Checkout response status:", checkoutResponse.status);

    if (checkoutResponse.ok) {
      const result = await checkoutResponse.json();
      console.log("✅ Checkout thành công:", result);
      return true;
    } else {
      const error = await checkoutResponse.text();
      console.error("❌ Checkout thất bại:", error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error in checkout with session validation:", error);
    return false;
  }
}

// Hàm test session với JWT token
async function testSessionWithJWT() {
  console.log("🔐 Testing session with JWT token...");

  const userStr = localStorage.getItem("user");
  if (!userStr) {
    console.error("❌ Không có thông tin user trong localStorage");
    return false;
  }

  try {
    const userData = JSON.parse(userStr);
    if (!userData.token) {
      console.error("❌ Không có token trong user data");
      return false;
    }

    console.log("🔑 Using token:", userData.token);

    const response = await fetch(
      "http://localhost:8080/api/auth/check-session",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData.token}`,
        },
        credentials: "include",
      }
    );

    console.log("📡 JWT session check status:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ JWT session valid:", result);
      return true;
    } else {
      const error = await response.text();
      console.error("❌ JWT session invalid:", error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing JWT session:", error);
    return false;
  }
}

// Hàm test toàn bộ quy trình
async function testCompleteCheckoutFlow() {
  console.log("🚀 Testing complete checkout flow...");

  try {
    // 1. Kiểm tra session với JWT
    console.log("\n=== Step 1: Check JWT Session ===");
    const jwtOk = await testSessionWithJWT();

    // 2. Kiểm tra session thông thường
    console.log("\n=== Step 2: Check Regular Session ===");
    const sessionOk = await checkSessionBeforeCheckout();

    // 3. Test checkout với session validation
    console.log("\n=== Step 3: Test Checkout with Session ===");
    const checkoutOk = await testCheckoutWithSessionValidation();

    console.log("\n=== Tổng kết ===");
    console.log("✅ JWT Session:", jwtOk ? "OK" : "FAILED");
    console.log("✅ Regular Session:", sessionOk ? "OK" : "FAILED");
    console.log("✅ Checkout:", checkoutOk ? "OK" : "FAILED");

    const allOk = jwtOk && sessionOk && checkoutOk;

    if (allOk) {
      console.log("🎉 Tất cả đều thành công!");
    } else {
      console.log("⚠️ Có vấn đề trong quy trình checkout");
    }

    return allOk;
  } catch (error) {
    console.error("❌ Error in complete checkout flow:", error);
    return false;
  }
}

// Hàm force update token và test
async function forceUpdateTokenAndTest() {
  console.log("🔧 Force updating token and testing...");

  const userStr = localStorage.getItem("user");
  if (userStr) {
    try {
      const userData = JSON.parse(userStr);
      if (userData.id) {
        // Force update token
        userData.token = `customer-token-${userData.id}`;
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");

        console.log("🔧 Force updated token:", userData.token);

        // Test ngay sau khi update
        return await testCompleteCheckoutFlow();
      }
    } catch (e) {
      console.error("❌ Error updating token:", e);
    }
  }

  console.log("❌ No user data found for force update");
  return false;
}

// Export functions để sử dụng trong console
window.checkoutSessionTest = {
  checkSessionBeforeCheckout,
  testCheckoutWithSessionValidation,
  testSessionWithJWT,
  testCompleteCheckoutFlow,
  forceUpdateTokenAndTest,
};

console.log(
  "💡 Sử dụng checkoutSessionTest.testCompleteCheckoutFlow() để test toàn bộ"
);
console.log(
  "💡 Sử dụng checkoutSessionTest.forceUpdateTokenAndTest() để force update token và test"
);

// Auto-run test
console.log("\n🚀 Tự động test checkout với session validation...");
testCompleteCheckoutFlow();
