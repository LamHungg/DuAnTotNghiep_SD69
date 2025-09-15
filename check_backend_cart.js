// Kiểm tra backend cart API
console.log("🔍 Kiểm tra backend cart API...");

// Lấy user từ localStorage
const userStr = localStorage.getItem("user");
if (!userStr) {
  console.error("❌ Không tìm thấy user trong localStorage");
  return;
}

const user = JSON.parse(userStr);
console.log("👤 Current user:", user);

// Kiểm tra backend cart
async function checkBackendCart() {
  try {
    console.log("📡 Gọi backend cart API...");

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
      console.log(`\n📦 Backend Item ${index + 1}:`);
      console.log(`  - id: ${item.id} (ChiTietGioHang ID)`);
      console.log(
        `  - chiTietSanPhamId: ${item.chiTietSanPhamId} (ChiTietSanPham ID)`
      );
      console.log(`  - tenSanPham: ${item.tenSanPham}`);
      console.log(`  - soLuong: ${item.soLuong}`);
      console.log(`  - gia: ${item.gia}`);

      // Kiểm tra xem có ID 22 không
      if (item.id === 22 || item.chiTietSanPhamId === 22) {
        console.error(`❌ PHÁT HIỆN ID 22 trong backend item ${index + 1}!`);
      }

      // Kiểm tra chiTietSanPhamId có hợp lệ không
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
    console.error("❌ Error fetching backend cart:", error);
    return null;
  }
}

// So sánh backend cart với localStorage cart
async function compareCarts() {
  console.log("\n🔄 So sánh backend cart với localStorage cart...");

  const backendCart = await checkBackendCart();
  const localStorageCart = localStorage.getItem("checkout_cart");

  if (localStorageCart) {
    const localCart = JSON.parse(localStorageCart);
    console.log("\n📦 localStorage cart:", localCart);

    console.log("\n📊 SO SÁNH:");
    console.log(`Backend cart items: ${backendCart ? backendCart.length : 0}`);
    console.log(`localStorage cart items: ${localCart.length}`);

    if (backendCart) {
      backendCart.forEach((backendItem, index) => {
        const localItem = localCart[index];
        if (localItem) {
          console.log(`\n📦 Item ${index + 1}:`);
          console.log(
            `  Backend: id=${backendItem.id}, chiTietSanPhamId=${backendItem.chiTietSanPhamId}`
          );
          console.log(
            `  Local:   id=${localItem.id}, chiTietSanPhamId=${localItem.chiTietSanPhamId}`
          );

          if (backendItem.chiTietSanPhamId !== localItem.chiTietSanPhamId) {
            console.error(
              `❌ MISMATCH: Backend chiTietSanPhamId=${backendItem.chiTietSanPhamId}, Local chiTietSanPhamId=${localItem.chiTietSanPhamId}`
            );
          }
        }
      });
    }
  }
}

// Xóa cart từ backend
async function clearBackendCart() {
  try {
    console.log("🗑️ Xóa cart từ backend...");

    const response = await fetch("http://localhost:8080/api/cart/clear", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log("✅ Backend cart đã được xóa");
    return true;
  } catch (error) {
    console.error("❌ Error clearing backend cart:", error);
    return false;
  }
}

// Export functions
window.checkBackendCart = {
  checkBackendCart,
  compareCarts,
  clearBackendCart,
};

console.log("💡 Available functions:");
console.log("  - checkBackendCart.checkBackendCart() - Kiểm tra backend cart");
console.log(
  "  - checkBackendCart.compareCarts() - So sánh backend vs localStorage"
);
console.log("  - checkBackendCart.clearBackendCart() - Xóa backend cart");
