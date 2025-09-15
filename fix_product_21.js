// Script để thay thế sản phẩm ID 21 bằng sản phẩm hợp lệ
console.log("🔧 Fixing product ID 21 issue...");

// Hàm lấy sản phẩm hợp lệ từ backend
async function getValidProducts() {
  try {
    const response = await fetch("http://localhost:8080/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const products = await response.json();
      console.log("📦 Available products:", products);
      return products.filter(p => p.soLuong > 0 && p.trangThai === 1);
    }
  } catch (error) {
    console.error("❌ Error getting products:", error);
  }
  return [];
}

// Hàm thay thế sản phẩm trong cart
function replaceProductInCart(oldId, newId) {
  const cartData = localStorage.getItem("cart");
  if (cartData) {
    try {
      const cart = JSON.parse(cartData);
      const updatedCart = cart.map(item => {
        if (item.chiTietSanPhamId === oldId) {
          console.log(`🔄 Replacing product ${oldId} with ${newId}`);
          return { ...item, chiTietSanPhamId: newId };
        }
        return item;
      });
      
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      console.log("✅ Cart updated successfully");
      return true;
    } catch (e) {
      console.error("❌ Error updating cart:", e);
    }
  }
  return false;
}

// Hàm thay thế sản phẩm trong checkout cart
function replaceProductInCheckoutCart(oldId, newId) {
  const checkoutCartData = localStorage.getItem("checkout_cart");
  if (checkoutCartData) {
    try {
      const checkoutCart = JSON.parse(checkoutCartData);
      const updatedCheckoutCart = checkoutCart.map(item => {
        if (item.chiTietSanPhamId === oldId) {
          console.log(`🔄 Replacing product ${oldId} with ${newId} in checkout cart`);
          return { ...item, chiTietSanPhamId: newId };
        }
        return item;
      });
      
      localStorage.setItem("checkout_cart", JSON.stringify(updatedCheckoutCart));
      console.log("✅ Checkout cart updated successfully");
      return true;
    } catch (e) {
      console.error("❌ Error updating checkout cart:", e);
    }
  }
  return false;
}

// Hàm chính để fix
async function fixProduct21() {
  console.log("🔍 Checking current cart data...");
  
  // Kiểm tra cart hiện tại
  const cartData = localStorage.getItem("cart");
  const checkoutCartData = localStorage.getItem("checkout_cart");
  
  console.log("📋 Current cart:", cartData ? JSON.parse(cartData) : "No cart data");
  console.log("📋 Current checkout cart:", checkoutCartData ? JSON.parse(checkoutCartData) : "No checkout cart data");
  
  // Lấy sản phẩm hợp lệ
  const validProducts = await getValidProducts();
  
  if (validProducts.length === 0) {
    console.log("❌ No valid products found");
    return;
  }
  
  // Chọn sản phẩm đầu tiên làm thay thế
  const replacementProduct = validProducts[0];
  console.log(`✅ Using product ${replacementProduct.id} as replacement`);
  
  // Thay thế trong cart
  const cartUpdated = replaceProductInCart(21, replacementProduct.id);
  
  // Thay thế trong checkout cart
  const checkoutCartUpdated = replaceProductInCheckoutCart(21, replacementProduct.id);
  
  if (cartUpdated || checkoutCartUpdated) {
    console.log("🎉 Product replacement completed!");
    console.log("🔄 Please refresh the page and try checkout again");
  } else {
    console.log("⚠️ No cart data found to update");
  }
}

// Export functions
window.fixProduct21 = {
  fixProduct21,
  getValidProducts,
  replaceProductInCart,
  replaceProductInCheckoutCart
};

console.log("💡 Use fixProduct21.fixProduct21() to fix the issue");
