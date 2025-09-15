// Script test checkout đã được cập nhật với session validation
console.log("🛒 Test Updated Checkout with Session Validation");

// Hàm test checkout với session validation mới
async function testUpdatedCheckout() {
  console.log("🚀 Testing updated checkout with session validation...");

  try {
    // 1. Kiểm tra session trước
    console.log("🔍 Step 1: Checking session...");
    const sessionResponse = await fetch(
      "http://localhost:8080/api/auth/check-session",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (sessionResponse.status !== 200) {
      console.error("❌ Session không hợp lệ, vui lòng đăng nhập lại");
      return false;
    }

    const sessionData = await sessionResponse.json();
    console.log("✅ Session validation passed:", sessionData);

    // 2. Lấy giỏ hàng
    console.log("🔍 Step 2: Getting cart...");
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
    console.log("🔍 Step 3: Checking stock...");
    const productIds = cartItems.map((item) => item.chiTietSanPhamId);
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

    // 4. Chuẩn bị dữ liệu checkout
    console.log("🔍 Step 4: Preparing checkout data...");
    const checkoutData = {
      cartItems: cartItems.map((item) => ({
        chiTietSanPhamId: item.chiTietSanPhamId,
        soLuong: item.soLuong,
        gia: item.gia,
        thanhTien: item.thanhTien,
      })),
      diaChiId: 1,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test checkout với session validation đã cập nhật",
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

    // 5. Thực hiện checkout
    console.log("🔍 Step 5: Processing checkout...");
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
    console.error("❌ Error in updated checkout:", error);
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

// Hàm test session thông thường
async function testRegularSession() {
  console.log("🌐 Testing regular session...");

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

    console.log("📡 Regular session check status:", response.status);

    if (response.ok) {
      const result = await response.json();
      console.log("✅ Regular session valid:", result);
      return true;
    } else {
      const error = await response.text();
      console.error("❌ Regular session invalid:", error);
      return false;
    }
  } catch (error) {
    console.error("❌ Error testing regular session:", error);
    return false;
  }
}

// Hàm test toàn bộ quy trình đã cập nhật
async function testCompleteUpdatedFlow() {
  console.log("🚀 Testing complete updated checkout flow...");

  try {
    // 1. Kiểm tra session với JWT
    console.log("\n=== Step 1: Check JWT Session ===");
    const jwtOk = await testSessionWithJWT();

    // 2. Kiểm tra session thông thường
    console.log("\n=== Step 2: Check Regular Session ===");
    const sessionOk = await testRegularSession();

    // 3. Test checkout với session validation đã cập nhật
    console.log("\n=== Step 3: Test Updated Checkout ===");
    const checkoutOk = await testUpdatedCheckout();

    console.log("\n=== Tổng kết ===");
    console.log("✅ JWT Session:", jwtOk ? "OK" : "FAILED");
    console.log("✅ Regular Session:", sessionOk ? "OK" : "FAILED");
    console.log("✅ Updated Checkout:", checkoutOk ? "OK" : "FAILED");

    const allOk = jwtOk && sessionOk && checkoutOk;

    if (allOk) {
      console.log(
        "🎉 Tất cả đều thành công! Checkout đã được cập nhật hoạt động tốt"
      );
    } else {
      console.log("⚠️ Có vấn đề trong quy trình checkout đã cập nhật");
    }

    return allOk;
  } catch (error) {
    console.error("❌ Error in complete updated flow:", error);
    return false;
  }
}

// Hàm force update token và test
async function forceUpdateTokenAndTestUpdated() {
  console.log("🔧 Force updating token and testing updated checkout...");

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
        return await testCompleteUpdatedFlow();
      }
    } catch (e) {
      console.error("❌ Error updating token:", e);
    }
  }

  console.log("❌ No user data found for force update");
  return false;
}

// Export functions để sử dụng trong console
window.updatedCheckoutTest = {
  testUpdatedCheckout,
  testSessionWithJWT,
  testRegularSession,
  testCompleteUpdatedFlow,
  forceUpdateTokenAndTestUpdated,
};

console.log(
  "💡 Sử dụng updatedCheckoutTest.testCompleteUpdatedFlow() để test toàn bộ"
);
console.log(
  "💡 Sử dụng updatedCheckoutTest.forceUpdateTokenAndTestUpdated() để force update token và test"
);

// Auto-run test
console.log("\n🚀 Tự động test checkout đã cập nhật...");
testCompleteUpdatedFlow();
