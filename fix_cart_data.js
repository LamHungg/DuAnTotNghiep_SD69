// Script để sửa dữ liệu giỏ hàng với ID hợp lệ
console.log("🔧 Fixing Cart Data");

// Hàm để lấy danh sách sản phẩm hợp lệ từ backend
async function getValidProducts() {
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
      console.log("✅ Valid products from backend:", products);
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

// Hàm để sửa cart data với ID hợp lệ
function fixCartData(validProducts) {
  console.log("🔧 Fixing cart data...");

  try {
    // Lấy cart data hiện tại
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    const checkoutCartData = JSON.parse(
      localStorage.getItem("checkout_cart") || "[]"
    );

    console.log("Current cart data:", cartData);
    console.log("Current checkout cart data:", checkoutCartData);

    if (validProducts.length === 0) {
      console.log("⚠️ No valid products available, using fallback data");
      // Sử dụng dữ liệu fallback với ID 1
      const fallbackData = [
        {
          id: 1,
          chiTietSanPhamId: 1,
          name: "Sản phẩm test",
          price: 100000,
          quantity: 1,
          thanhTien: 100000,
        },
      ];

      localStorage.setItem("cart", JSON.stringify(fallbackData));
      localStorage.setItem("checkout_cart", JSON.stringify(fallbackData));
      console.log("✅ Set fallback cart data:", fallbackData);
      return;
    }

    // Lấy sản phẩm đầu tiên làm sản phẩm mặc định
    const defaultProduct = validProducts[0];
    console.log("Default product:", defaultProduct);

    // Sửa cart data
    const fixedCartData = cartData.map((item) => ({
      ...item,
      id: defaultProduct.id,
      chiTietSanPhamId: defaultProduct.id,
      name: defaultProduct.tenSanPham || "Sản phẩm",
      price: defaultProduct.gia || 100000,
      thanhTien: (defaultProduct.gia || 100000) * (item.quantity || 1),
    }));

    const fixedCheckoutCartData = checkoutCartData.map((item) => ({
      ...item,
      id: defaultProduct.id,
      chiTietSanPhamId: defaultProduct.id,
      name: defaultProduct.tenSanPham || "Sản phẩm",
      price: defaultProduct.gia || 100000,
      thanhTien: (defaultProduct.gia || 100000) * (item.quantity || 1),
    }));

    // Lưu lại cart data đã sửa
    localStorage.setItem("cart", JSON.stringify(fixedCartData));
    localStorage.setItem(
      "checkout_cart",
      JSON.stringify(fixedCheckoutCartData)
    );

    console.log("✅ Fixed cart data:", fixedCartData);
    console.log("✅ Fixed checkout cart data:", fixedCheckoutCartData);
  } catch (error) {
    console.error("❌ Error fixing cart data:", error);
  }
}

// Hàm để clear và tạo cart data mới
function createNewCartData() {
  console.log("🆕 Creating new cart data...");

  // Clear cart data cũ
  localStorage.removeItem("cart");
  localStorage.removeItem("checkout_cart");

  // Tạo cart data mới với ID hợp lệ
  const newCartData = [
    {
      id: 1,
      chiTietSanPhamId: 1,
      name: "Sản phẩm test",
      price: 100000,
      quantity: 1,
      thanhTien: 100000,
    },
  ];

  localStorage.setItem("cart", JSON.stringify(newCartData));
  localStorage.setItem("checkout_cart", JSON.stringify(newCartData));

  console.log("✅ New cart data created:", newCartData);
}

// Hàm chính để sửa lỗi
async function fixCartIssue() {
  console.log("🚀 Starting cart fix process...");

  try {
    // Lấy danh sách sản phẩm hợp lệ
    const validProducts = await getValidProducts();

    // Sửa cart data
    fixCartData(validProducts);

    console.log("✅ Cart fix completed!");
    console.log("💡 Now try checkout again");
  } catch (error) {
    console.error("❌ Error in cart fix process:", error);
    console.log("🆕 Creating new cart data as fallback...");
    createNewCartData();
  }
}

// Export functions
window.cartFix = {
  fixCartIssue,
  createNewCartData,
  getValidProducts,
};

console.log("💡 Use cartFix.fixCartIssue() to fix cart data");
console.log("💡 Use cartFix.createNewCartData() to create new cart");
console.log("💡 Use cartFix.getValidProducts() to get valid products");

// Auto-run fix
fixCartIssue();
