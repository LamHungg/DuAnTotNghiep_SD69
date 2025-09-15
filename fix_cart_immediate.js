// Script đơn giản để sửa cart ngay lập tức
console.log("🔧 Quick Cart Fix");

// Hàm để sửa cart data ngay lập tức
function fixCartImmediate() {
  console.log("🔧 Fixing cart immediately...");

  try {
    // Lấy cart data hiện tại
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Current cart data:", cartData);

    // Sửa cart data - thay thế ID 18 bằng ID 1
    const fixedCartData = cartData.map((item) => {
      if (item.id === 18 || item.chiTietSanPhamId === 18) {
        console.log(`🔧 Fixing item with ID 18:`, item);
        return {
          ...item,
          id: 1,
          chiTietSanPhamId: 1,
          tenSanPham: "Sản phẩm thay thế",
          gia: 100000,
          thanhTien: 100000 * (item.soLuong || 1),
        };
      }
      return item;
    });

    // Lưu lại cart data đã sửa
    localStorage.setItem("cart", JSON.stringify(fixedCartData));
    localStorage.setItem("checkout_cart", JSON.stringify(fixedCartData));

    console.log("✅ Fixed cart data:", fixedCartData);
    console.log("💡 Now try checkout again!");

    return fixedCartData;
  } catch (error) {
    console.error("❌ Error fixing cart:", error);
    return [];
  }
}

// Hàm để xóa sản phẩm ID 18
function removeProduct18() {
  console.log("🧹 Removing product ID 18...");

  try {
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Current cart data:", cartData);

    // Lọc ra sản phẩm không phải ID 18
    const filteredCartData = cartData.filter(
      (item) => item.id !== 18 && item.chiTietSanPhamId !== 18
    );

    console.log("Filtered cart data:", filteredCartData);

    // Lưu lại
    localStorage.setItem("cart", JSON.stringify(filteredCartData));
    localStorage.setItem("checkout_cart", JSON.stringify(filteredCartData));

    console.log("✅ Product ID 18 removed!");
    console.log("💡 Now try checkout again!");

    return filteredCartData;
  } catch (error) {
    console.error("❌ Error removing product 18:", error);
    return [];
  }
}

// Hàm để tạo cart data mới hoàn toàn
function createNewCart() {
  console.log("🆕 Creating new cart...");

  try {
    // Xóa cart cũ
    localStorage.removeItem("cart");
    localStorage.removeItem("checkout_cart");

    // Tạo cart mới với sản phẩm hợp lệ
    const newCartData = [
      {
        id: 1,
        chiTietSanPhamId: 1,
        tenSanPham: "Sản phẩm test",
        hinhAnh: "/images/default.jpg",
        kichCo: "M",
        mauSac: "Đen",
        gia: 100000,
        soLuong: 1,
        thanhTien: 100000,
      },
    ];

    localStorage.setItem("cart", JSON.stringify(newCartData));
    localStorage.setItem("checkout_cart", JSON.stringify(newCartData));

    console.log("✅ New cart created:", newCartData);
    console.log("💡 Now try checkout again!");

    return newCartData;
  } catch (error) {
    console.error("❌ Error creating new cart:", error);
    return [];
  }
}

// Auto-run fix
console.log("🚀 Auto-fixing cart...");
const fixedCart = fixCartImmediate();

// Export functions
window.quickFix = {
  fixCartImmediate,
  removeProduct18,
  createNewCart,
};

console.log("💡 Use quickFix.fixCartImmediate() to fix cart");
console.log("💡 Use quickFix.removeProduct18() to remove product 18");
console.log("💡 Use quickFix.createNewCart() to create new cart");
