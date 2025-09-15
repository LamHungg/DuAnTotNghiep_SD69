// Script để sửa dữ liệu cart ngay lập tức
console.log("🔧 Fixing cart data immediately...");

// Lấy user từ localStorage
const userStr = localStorage.getItem("user");
if (!userStr) {
  console.error("❌ Không tìm thấy user trong localStorage");
  return;
}

const user = JSON.parse(userStr);
console.log("👤 Current user:", user);

// Lấy dữ liệu cart từ backend và cập nhật localStorage
async function fixCartDataFromBackend() {
  try {
    console.log("📡 Fetching cart data from backend...");

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

    const backendCart = await response.json();
    console.log("✅ Backend cart data:", backendCart);

    if (backendCart.length === 0) {
      console.log("📦 Backend cart is empty, clearing localStorage");
      localStorage.removeItem("checkout_cart");
      return;
    }

    // Chuyển đổi dữ liệu từ backend sang format localStorage
    const fixedCart = backendCart.map((item) => ({
      id: item.chiTietSanPhamId, // Sử dụng chiTietSanPhamId làm id
      chiTietSanPhamId: item.chiTietSanPhamId, // Giữ nguyên chiTietSanPhamId
      name: item.tenSanPham,
      quantity: item.soLuong,
      price: item.gia,
      thanhTien: item.thanhTien,
      hinhAnh: item.hinhAnh,
      kichCo: item.kichCo,
      mauSac: item.mauSac,
      chatLieu: item.chatLieu,
    }));

    console.log("🔧 Fixed cart data:", fixedCart);

    // Cập nhật localStorage
    localStorage.setItem("checkout_cart", JSON.stringify(fixedCart));

    // Tính tổng tiền
    const total = fixedCart.reduce(
      (sum, item) => sum + (item.thanhTien || item.price * item.quantity),
      0
    );
    localStorage.setItem("checkout_total", total.toString());

    console.log("✅ Cart data fixed and saved to localStorage");
    console.log(`💰 Total: ${total.toLocaleString()} VND`);

    return fixedCart;
  } catch (error) {
    console.error("❌ Error fixing cart data:", error);
    return null;
  }
}

// Xóa cart cũ và tạo cart mới với sản phẩm hợp lệ
async function createNewValidCart() {
  try {
    console.log("🆕 Creating new valid cart...");

    // Lấy danh sách sản phẩm hợp lệ từ backend
    const response = await fetch("http://localhost:8080/api/products", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const products = await response.json();
    console.log("📦 Available products:", products);

    // Lọc sản phẩm có sẵn (ID từ 5-14)
    const validProducts = products.filter(
      (product) => product.id >= 5 && product.id <= 14 && product.soLuong > 0
    );

    if (validProducts.length === 0) {
      console.error("❌ No valid products found");
      return null;
    }

    // Tạo cart với sản phẩm đầu tiên
    const firstProduct = validProducts[0];
    const newCart = [
      {
        id: firstProduct.id,
        chiTietSanPhamId: firstProduct.id,
        name: firstProduct.tenSanPham,
        quantity: 1,
        price: firstProduct.gia,
        thanhTien: firstProduct.gia,
        hinhAnh: firstProduct.hinhAnh || "",
        kichCo: firstProduct.kichCo || "M",
        mauSac: firstProduct.mauSac || "Đen",
        chatLieu: firstProduct.chatLieu || "Cotton",
      },
    ];

    console.log("🆕 New cart created:", newCart);

    // Lưu vào localStorage
    localStorage.setItem("checkout_cart", JSON.stringify(newCart));
    localStorage.setItem("checkout_total", firstProduct.gia.toString());

    console.log("✅ New valid cart saved to localStorage");
    return newCart;
  } catch (error) {
    console.error("❌ Error creating new cart:", error);
    return null;
  }
}

// Xóa cart
function clearCart() {
  console.log("🗑️ Clearing cart...");
  localStorage.removeItem("checkout_cart");
  localStorage.removeItem("checkout_total");
  console.log("✅ Cart cleared");
}

// Export functions
window.fixCartData = {
  fixCartDataFromBackend,
  createNewValidCart,
  clearCart,
};

console.log("💡 Available functions:");
console.log(
  "  - fixCartData.fixCartDataFromBackend() - Fix cart from backend data"
);
console.log(
  "  - fixCartData.createNewValidCart() - Create new cart with valid products"
);
console.log("  - fixCartData.clearCart() - Clear cart");
