// Script để kiểm tra dữ liệu cart từ backend
console.log("🔍 Debugging cart data from backend...");

// Lấy user từ localStorage
const userStr = localStorage.getItem("user");
if (!userStr) {
  console.error("❌ Không tìm thấy user trong localStorage");
  return;
}

const user = JSON.parse(userStr);
console.log("👤 Current user:", user);

// Test API cart từ backend
async function checkBackendCart() {
  try {
    console.log("📡 Calling backend cart API...");

    const response = await fetch("http://localhost:8080/api/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const cartData = await response.json();
    console.log("✅ Backend cart data:", cartData);

    // Kiểm tra từng item
    cartData.forEach((item, index) => {
      console.log(`\n📦 Item ${index + 1}:`);
      console.log(`  - id: ${item.id} (ChiTietGioHang ID)`);
      console.log(
        `  - chiTietSanPhamId: ${item.chiTietSanPhamId} (ChiTietSanPham ID)`
      );
      console.log(`  - tenSanPham: ${item.tenSanPham}`);
      console.log(`  - soLuong: ${item.soLuong}`);
      console.log(`  - gia: ${item.gia}`);

      // Kiểm tra xem chiTietSanPhamId có hợp lệ không
      if (item.chiTietSanPhamId < 5 || item.chiTietSanPhamId > 14) {
        console.error(
          `❌ INVALID chiTietSanPhamId: ${item.chiTietSanPhamId} (should be 5-14)`
        );
      } else {
        console.log(`✅ Valid chiTietSanPhamId: ${item.chiTietSanPhamId}`);
      }
    });

    return cartData;
  } catch (error) {
    console.error("❌ Error fetching cart from backend:", error);
    return null;
  }
}

// Test localStorage cart data
function checkLocalStorageCart() {
  console.log("\n🔍 Checking localStorage cart data...");

  const checkoutCart = localStorage.getItem("checkout_cart");
  if (checkoutCart) {
    const cart = JSON.parse(checkoutCart);
    console.log("📦 localStorage checkout_cart:", cart);

    cart.forEach((item, index) => {
      console.log(`\n📦 localStorage Item ${index + 1}:`);
      console.log(`  - id: ${item.id}`);
      console.log(`  - chiTietSanPhamId: ${item.chiTietSanPhamId}`);
      console.log(`  - name: ${item.name}`);
      console.log(`  - quantity: ${item.quantity}`);
      console.log(`  - price: ${item.price}`);
    });
  } else {
    console.log("❌ Không có checkout_cart trong localStorage");
  }
}

// So sánh dữ liệu
async function compareCartData() {
  console.log("\n🔄 Comparing cart data...");

  const backendCart = await checkBackendCart();
  checkLocalStorageCart();

  if (backendCart) {
    console.log("\n📊 SUMMARY:");
    console.log(`Backend cart items: ${backendCart.length}`);

    const invalidItems = backendCart.filter(
      (item) => item.chiTietSanPhamId < 5 || item.chiTietSanPhamId > 14
    );

    if (invalidItems.length > 0) {
      console.error(`❌ Found ${invalidItems.length} invalid items:`);
      invalidItems.forEach((item) => {
        console.error(
          `  - Item ID ${item.id} has invalid chiTietSanPhamId: ${item.chiTietSanPhamId}`
        );
      });
    } else {
      console.log("✅ All items have valid chiTietSanPhamId");
    }
  }
}

// Export functions
window.debugCartData = {
  checkBackendCart,
  checkLocalStorageCart,
  compareCartData,
};

console.log("💡 Use debugCartData.compareCartData() to check cart data");
