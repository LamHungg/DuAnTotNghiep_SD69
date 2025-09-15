// Script để debug và sửa lỗi ID 24
console.log("🔍 Debug ID 24 Issue");

// Hàm để kiểm tra sản phẩm ID 24 trong database
async function checkProduct24InDatabase() {
  console.log("🔍 Checking if product ID 24 exists in database...");

  try {
    const response = await fetch("http://localhost:8080/api/products/24", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const product = await response.json();
      console.log("✅ Product ID 24 exists in database:", product);
      return product;
    } else {
      console.log(
        "❌ Product ID 24 does NOT exist in database (Status:",
        response.status,
        ")"
      );
      return null;
    }
  } catch (error) {
    console.error("❌ Error checking product 24:", error);
    return null;
  }
}

// Hàm để lấy tất cả sản phẩm có sẵn từ backend
async function getAvailableProducts() {
  console.log("🔍 Getting all available products from backend...");

  try {
    const response = await fetch("http://localhost:8080/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const products = await response.json();
      console.log("✅ Available products from backend:", products);
      return products;
    } else {
      console.error("❌ Failed to get products:", response.status);
      return [];
    }
  } catch (error) {
    console.error("❌ Error getting products:", error);
    return [];
  }
}

// Hàm để kiểm tra cart data hiện tại
function checkCurrentCartData() {
  console.log("🔍 Checking current cart data...");

  try {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Current cart data:", cartData);

    if (cartData.length > 0) {
      console.log("Cart items analysis:");
      cartData.forEach((item, index) => {
        console.log(`Item ${index + 1}:`);
        console.log(`  - id: ${item.id} (ChiTietGioHang ID)`);
        console.log(
          `  - chiTietSanPhamId: ${item.chiTietSanPhamId} (ChiTietSanPham ID)`
        );
        console.log(`  - tenSanPham: ${item.tenSanPham}`);
        console.log(`  - soLuong: ${item.soLuong}`);
        console.log(`  - gia: ${item.gia}`);

        // Kiểm tra xem có sử dụng sai ID không
        if (item.id === 24 && item.chiTietSanPhamId === 24) {
          console.log(
            "⚠️ WARNING: Item is using ChiTietGioHang ID as chiTietSanPhamId!"
          );
        }
      });
    } else {
      console.log("Cart is empty");
    }
  } catch (error) {
    console.error("❌ Error checking cart data:", error);
  }
}

// Hàm để sửa lỗi ID 24
async function fixId24Issue() {
  console.log("🔧 Fixing ID 24 issue...");

  try {
    // 1. Kiểm tra sản phẩm ID 24 có tồn tại không
    const product24 = await checkProduct24InDatabase();

    if (product24) {
      console.log("✅ Product ID 24 exists, no need to fix");
      return;
    }

    // 2. Lấy danh sách sản phẩm có sẵn
    const availableProducts = await getAvailableProducts();

    if (availableProducts.length === 0) {
      console.log("❌ No available products found");
      return;
    }

    // 3. Lấy cart data hiện tại
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Current cart data:", cartData);

    // 4. Sửa cart data - thay thế ID 24 bằng sản phẩm hợp lệ
    const fixedCartData = cartData.map((item) => {
      if (item.id === 24 || item.chiTietSanPhamId === 24) {
        console.log(`🔧 Fixing item with ID 24:`, item);

        // Sử dụng sản phẩm đầu tiên có sẵn
        const replacementProduct = availableProducts[0];

        return {
          ...item,
          id: replacementProduct.id,
          chiTietSanPhamId: replacementProduct.id,
          tenSanPham: replacementProduct.tenSanPham || "Sản phẩm thay thế",
          gia: replacementProduct.gia || 100000,
          thanhTien: (replacementProduct.gia || 100000) * (item.soLuong || 1),
        };
      }
      return item;
    });

    // 5. Lưu cart data đã sửa
    localStorage.setItem("cart", JSON.stringify(fixedCartData));
    localStorage.setItem("checkout_cart", JSON.stringify(fixedCartData));

    console.log("✅ Fixed cart data:", fixedCartData);
    console.log("💡 Now try checkout again!");

    return fixedCartData;
  } catch (error) {
    console.error("❌ Error fixing ID 24 issue:", error);
    return [];
  }
}

// Hàm để xóa sản phẩm ID 24
function removeProduct24() {
  console.log("🧹 Removing product ID 24...");

  try {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Current cart data:", cartData);

    // Lọc ra sản phẩm không phải ID 24
    const filteredCartData = cartData.filter(
      (item) => item.id !== 24 && item.chiTietSanPhamId !== 24
    );

    console.log("Filtered cart data:", filteredCartData);

    // Lưu lại
    localStorage.setItem("cart", JSON.stringify(filteredCartData));
    localStorage.setItem("checkout_cart", JSON.stringify(filteredCartData));

    console.log("✅ Product ID 24 removed!");
    console.log("💡 Now try checkout again!");

    return filteredCartData;
  } catch (error) {
    console.error("❌ Error removing product 24:", error);
    return [];
  }
}

// Hàm để đồng bộ cart từ backend
async function syncCartFromBackend() {
  console.log("🔄 Syncing cart from backend...");

  try {
    const response = await fetch("http://localhost:8080/api/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const backendData = await response.json();
      console.log("Backend cart data:", backendData);

      // Chuyển đổi dữ liệu từ backend format
      const convertedData = backendData.map((item) => ({
        id: item.id,
        chiTietSanPhamId: item.chiTietSanPhamId,
        tenSanPham: item.tenSanPham,
        hinhAnh: item.hinhAnh,
        kichCo: item.kichCo,
        mauSac: item.mauSac,
        chatLieu: item.chatLieu,
        soLuong: item.soLuong,
        gia: item.gia,
        thanhTien: item.thanhTien,
        soLuongTonKho: item.soLuongTonKho,
      }));

      localStorage.setItem("cart", JSON.stringify(convertedData));
      localStorage.setItem("checkout_cart", JSON.stringify(convertedData));

      console.log("✅ Synced cart from backend:", convertedData);
      console.log("💡 Now try checkout again!");

      return convertedData;
    } else {
      console.error("❌ Failed to sync from backend:", response.status);
      return [];
    }
  } catch (error) {
    console.error("❌ Error syncing from backend:", error);
    return [];
  }
}

// Auto-run debug
console.log("🚀 Auto-debugging ID 24 issue...");
checkProduct24InDatabase();
checkCurrentCartData();

// Export functions
window.id24Fix = {
  checkProduct24InDatabase,
  getAvailableProducts,
  checkCurrentCartData,
  fixId24Issue,
  removeProduct24,
  syncCartFromBackend,
};

console.log(
  "💡 Use id24Fix.checkProduct24InDatabase() to check if product 24 exists"
);
console.log("💡 Use id24Fix.getAvailableProducts() to get valid products");
console.log("💡 Use id24Fix.checkCurrentCartData() to check current cart");
console.log("💡 Use id24Fix.fixId24Issue() to fix ID 24 issue");
console.log("💡 Use id24Fix.removeProduct24() to remove product 24");
console.log("💡 Use id24Fix.syncCartFromBackend() to sync from backend");
