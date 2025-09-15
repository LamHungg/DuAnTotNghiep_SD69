// Script đơn giản để sửa lỗi ID 24 ngay lập tức
console.log("🔧 Quick Fix ID 24");

// Hàm để sửa lỗi ID 24 ngay lập tức
function quickFixId24() {
  console.log("🔧 Quick fixing ID 24 issue...");

  try {
    // Lấy cart data hiện tại
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Current cart data:", cartData);

    // Sửa cart data - thay thế ID 24 bằng ID 1
    const fixedCartData = cartData.map((item) => {
      if (item.id === 24 || item.chiTietSanPhamId === 24) {
        console.log(`🔧 Fixing item with ID 24:`, item);
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
    console.error("❌ Error fixing ID 24:", error);
    return [];
  }
}

// Hàm để xóa sản phẩm ID 24
function removeId24() {
  console.log("🧹 Removing ID 24...");

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

    console.log("✅ ID 24 removed!");
    console.log("💡 Now try checkout again!");

    return filteredCartData;
  } catch (error) {
    console.error("❌ Error removing ID 24:", error);
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
console.log("🚀 Auto-fixing ID 24...");
const fixedCart = quickFixId24();

// Export functions
window.quickFix24 = {
  quickFixId24,
  removeId24,
  createNewCart,
};

console.log("💡 Use quickFix24.quickFixId24() to fix ID 24");
console.log("💡 Use quickFix24.removeId24() to remove ID 24");
console.log("💡 Use quickFix24.createNewCart() to create new cart");
