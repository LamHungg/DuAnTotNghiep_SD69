// Script để kiểm tra sản phẩm ID 18
console.log("🔍 Checking Product ID 18");

// Hàm để kiểm tra sản phẩm trong database
async function checkProductInDatabase(productId) {
  try {
    console.log(`🔍 Checking product ID ${productId} in database...`);

    const response = await fetch(
      `http://localhost:8080/api/products/${productId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );

    if (response.ok) {
      const product = await response.json();
      console.log(`✅ Product ${productId} found:`, product);
      return product;
    } else {
      console.log(
        `❌ Product ${productId} not found in database (Status: ${response.status})`
      );
      return null;
    }
  } catch (error) {
    console.error(`❌ Error checking product ${productId}:`, error);
    return null;
  }
}

// Hàm để lấy tất cả sản phẩm có sẵn
async function getAvailableProducts() {
  try {
    console.log("🔍 Getting all available products...");

    const response = await fetch("http://localhost:8080/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const products = await response.json();
      console.log("✅ Available products:", products);
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

// Hàm để sửa cart data với sản phẩm hợp lệ
async function fixCartWithValidProducts() {
  console.log("🔧 Fixing cart with valid products...");

  try {
    // Lấy sản phẩm có sẵn
    const availableProducts = await getAvailableProducts();

    if (availableProducts.length === 0) {
      console.log("⚠️ No available products found");
      return;
    }

    // Lấy cart data hiện tại
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Current cart data:", cartData);

    // Kiểm tra từng sản phẩm trong cart
    const fixedCartData = [];

    for (const cartItem of cartData) {
      console.log(`Checking cart item:`, cartItem);

      // Kiểm tra sản phẩm có tồn tại trong database không
      const productExists = await checkProductInDatabase(
        cartItem.chiTietSanPhamId
      );

      if (productExists) {
        console.log(
          `✅ Product ${cartItem.chiTietSanPhamId} exists, keeping it`
        );
        fixedCartData.push(cartItem);
      } else {
        console.log(
          `❌ Product ${cartItem.chiTietSanPhamId} doesn't exist, replacing with valid product`
        );

        // Thay thế bằng sản phẩm đầu tiên có sẵn
        const replacementProduct = availableProducts[0];
        const fixedItem = {
          ...cartItem,
          id: replacementProduct.id,
          chiTietSanPhamId: replacementProduct.id,
          tenSanPham: replacementProduct.tenSanPham || "Sản phẩm thay thế",
          gia: replacementProduct.gia || 100000,
          thanhTien: (replacementProduct.gia || 100000) * cartItem.soLuong,
        };

        fixedCartData.push(fixedItem);
        console.log(`✅ Replaced with:`, fixedItem);
      }
    }

    // Lưu cart data đã sửa
    localStorage.setItem("cart", JSON.stringify(fixedCartData));
    localStorage.setItem("checkout_cart", JSON.stringify(fixedCartData));

    console.log("✅ Fixed cart data:", fixedCartData);
    console.log("💡 Now try checkout again!");
  } catch (error) {
    console.error("❌ Error fixing cart:", error);
  }
}

// Hàm để xóa sản phẩm không hợp lệ
function removeInvalidProducts() {
  console.log("🧹 Removing invalid products from cart...");

  try {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Current cart data:", cartData);

    // Lọc ra sản phẩm có ID hợp lệ (không phải 18)
    const validCartData = cartData.filter(
      (item) => item.id !== 18 && item.chiTietSanPhamId !== 18
    );

    console.log("Valid cart data:", validCartData);

    // Lưu lại
    localStorage.setItem("cart", JSON.stringify(validCartData));
    localStorage.setItem("checkout_cart", JSON.stringify(validCartData));

    console.log("✅ Invalid products removed!");
    console.log("💡 Now try checkout again!");
  } catch (error) {
    console.error("❌ Error removing invalid products:", error);
  }
}

// Export functions
window.productCheck = {
  checkProductInDatabase,
  getAvailableProducts,
  fixCartWithValidProducts,
  removeInvalidProducts,
};

console.log(
  "💡 Use productCheck.checkProductInDatabase(18) to check product 18"
);
console.log("💡 Use productCheck.getAvailableProducts() to get valid products");
console.log("💡 Use productCheck.fixCartWithValidProducts() to fix cart");
console.log(
  "💡 Use productCheck.removeInvalidProducts() to remove invalid products"
);

// Auto-check product 18
checkProductInDatabase(18);
