// Script debug cart data từ backend
console.log("🔍 Debug cart data từ backend...");

// Lấy user từ localStorage
const userStr = localStorage.getItem("user");
if (!userStr) {
  console.error("❌ Không tìm thấy user trong localStorage");
  return;
}

const user = JSON.parse(userStr);
console.log("👤 Current user:", user);

// Debug cart data từ backend
async function debugBackendCart() {
  try {
    console.log("\n📤 Gọi API cart từ backend...");

    const response = await fetch("http://localhost:8080/api/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error(
        `❌ API call failed: ${response.status} - ${response.statusText}`
      );
      return;
    }

    const cartData = await response.json();
    console.log("📥 Cart data từ backend:", cartData);

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

      // Kiểm tra chiTietSanPhamId
      if (!item.chiTietSanPhamId) {
        console.error(`❌ Item ${index + 1} KHÔNG có chiTietSanPhamId!`);
      } else if (item.chiTietSanPhamId < 5 || item.chiTietSanPhamId > 14) {
        console.error(
          `❌ Item ${index + 1} có chiTietSanPhamId không hợp lệ: ${
            item.chiTietSanPhamId
          }`
        );
      } else {
        console.log(
          `✅ Item ${index + 1} có chiTietSanPhamId hợp lệ: ${
            item.chiTietSanPhamId
          }`
        );
      }
    });

    return cartData;
  } catch (error) {
    console.error("❌ Lỗi debug cart:", error);
    return null;
  }
}

// Debug localStorage cart
function debugLocalStorageCart() {
  console.log("\n🔍 Debug localStorage cart...");

  const checkoutCart = localStorage.getItem("checkout_cart");
  if (!checkoutCart) {
    console.log("❌ Không có checkout_cart trong localStorage");
    return;
  }

  const cart = JSON.parse(checkoutCart);
  console.log("📦 localStorage checkout_cart:", cart);

  // Kiểm tra từng item
  cart.forEach((item, index) => {
    console.log(`\n📦 Item ${index + 1}:`);
    console.log(`  - id: ${item.id} (ChiTietGioHang ID)`);
    console.log(
      `  - chiTietSanPhamId: ${item.chiTietSanPhamId} (ChiTietSanPham ID)`
    );
    console.log(`  - name: ${item.name}`);
    console.log(`  - quantity: ${item.quantity}`);
    console.log(`  - price: ${item.price}`);

    // Kiểm tra chiTietSanPhamId
    if (!item.chiTietSanPhamId) {
      console.error(`❌ Item ${index + 1} KHÔNG có chiTietSanPhamId!`);
    } else if (item.chiTietSanPhamId < 5 || item.chiTietSanPhamId > 14) {
      console.error(
        `❌ Item ${index + 1} có chiTietSanPhamId không hợp lệ: ${
          item.chiTietSanPhamId
        }`
      );
    } else {
      console.log(
        `✅ Item ${index + 1} có chiTietSanPhamId hợp lệ: ${
          item.chiTietSanPhamId
        }`
      );
    }
  });
}

// So sánh backend và localStorage
async function compareBackendAndLocalStorage() {
  console.log("\n🔄 So sánh backend và localStorage...");

  const backendCart = await debugBackendCart();
  debugLocalStorageCart();

  if (backendCart && backendCart.length > 0) {
    console.log("\n📊 So sánh:");
    console.log(`  - Backend cart items: ${backendCart.length}`);

    const checkoutCart = localStorage.getItem("checkout_cart");
    if (checkoutCart) {
      const localStorageCart = JSON.parse(checkoutCart);
      console.log(`  - localStorage cart items: ${localStorageCart.length}`);

      // So sánh từng item
      backendCart.forEach((backendItem, index) => {
        const localStorageItem = localStorageCart[index];
        if (localStorageItem) {
          console.log(`\n📦 Item ${index + 1} so sánh:`);
          console.log(
            `  - Backend chiTietSanPhamId: ${backendItem.chiTietSanPhamId}`
          );
          console.log(
            `  - localStorage chiTietSanPhamId: ${localStorageItem.chiTietSanPhamId}`
          );

          if (
            backendItem.chiTietSanPhamId === localStorageItem.chiTietSanPhamId
          ) {
            console.log(`  ✅ chiTietSanPhamId khớp nhau`);
          } else {
            console.error(`  ❌ chiTietSanPhamId KHÔNG khớp nhau!`);
          }
        }
      });
    }
  }
}

// Export functions
window.debugCart = {
  debugBackendCart,
  debugLocalStorageCart,
  compareBackendAndLocalStorage,
};

console.log("💡 Available functions:");
console.log("  - debugCart.debugBackendCart() - Debug cart từ backend");
console.log("  - debugCart.debugLocalStorageCart() - Debug localStorage cart");
console.log("  - debugCart.compareBackendAndLocalStorage() - So sánh cả hai");
