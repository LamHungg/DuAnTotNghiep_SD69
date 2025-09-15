// Script để sửa mapping ID trong cart data
console.log("🔧 Fixing Cart ID Mapping");

// Hàm để sửa mapping ID trong cart data
function fixCartIdMapping() {
  console.log("🔧 Fixing cart ID mapping...");

  try {
    // Lấy cart data hiện tại
    const cartData = JSON.parse(localStorage.getItem("cart") || "[]");
    console.log("Current cart data:", cartData);

    // Sửa mapping ID - sử dụng chiTietSanPhamId thay vì id
    const fixedCartData = cartData.map((item) => {
      console.log(`Processing item:`, item);

      // Đảm bảo sử dụng chiTietSanPhamId cho checkout
      const fixedItem = {
        ...item,
        // Giữ nguyên id cho cart operations
        id: item.id,
        // Đảm bảo chiTietSanPhamId được sử dụng cho checkout
        chiTietSanPhamId: item.chiTietSanPhamId || item.id,
        // Thêm các field cần thiết cho checkout
        soLuong: item.soLuong || item.quantity || 1,
        gia: item.gia || item.price || 100000,
        thanhTien:
          item.thanhTien ||
          (item.gia || item.price || 100000) *
            (item.soLuong || item.quantity || 1),
      };

      console.log(`Fixed item:`, fixedItem);
      return fixedItem;
    });

    // Lưu lại cart data đã sửa
    localStorage.setItem("cart", JSON.stringify(fixedCartData));
    localStorage.setItem("checkout_cart", JSON.stringify(fixedCartData));

    console.log("✅ Fixed cart data:", fixedCartData);
    console.log("💡 Now try checkout again!");

    return fixedCartData;
  } catch (error) {
    console.error("❌ Error fixing cart ID mapping:", error);
    return [];
  }
}

// Hàm để kiểm tra và sửa dữ liệu từ backend
async function fixCartFromBackend() {
  console.log("🔧 Fixing cart from backend data...");

  try {
    // Lấy dữ liệu cart từ backend
    const response = await fetch("http://localhost:8080/api/cart", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (response.ok) {
      const backendCartData = await response.json();
      console.log("Backend cart data:", backendCartData);

      // Chuyển đổi dữ liệu từ backend format sang frontend format
      const convertedCartData = backendCartData.map((item) => ({
        id: item.id, // ID của ChiTietGioHang
        chiTietSanPhamId: item.chiTietSanPhamId, // ID của ChiTietSanPham
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

      // Lưu dữ liệu đã chuyển đổi
      localStorage.setItem("cart", JSON.stringify(convertedCartData));
      localStorage.setItem("checkout_cart", JSON.stringify(convertedCartData));

      console.log("✅ Converted cart data:", convertedCartData);
      console.log("💡 Now try checkout again!");

      return convertedCartData;
    } else {
      console.error("❌ Failed to get cart from backend:", response.status);
      return [];
    }
  } catch (error) {
    console.error("❌ Error fixing cart from backend:", error);
    return [];
  }
}

// Hàm để tạo cart data mẫu với mapping đúng
function createSampleCartData() {
  console.log("🆕 Creating sample cart data with correct mapping...");

  try {
    // Tạo dữ liệu mẫu với mapping đúng
    const sampleCartData = [
      {
        id: 1, // ID của ChiTietGioHang
        chiTietSanPhamId: 1, // ID của ChiTietSanPham (quan trọng cho checkout)
        tenSanPham: "Sản phẩm test",
        hinhAnh: "/images/default.jpg",
        kichCo: "M",
        mauSac: "Đen",
        chatLieu: "Cotton",
        soLuong: 1,
        gia: 100000,
        thanhTien: 100000,
        soLuongTonKho: 10,
      },
    ];

    localStorage.setItem("cart", JSON.stringify(sampleCartData));
    localStorage.setItem("checkout_cart", JSON.stringify(sampleCartData));

    console.log("✅ Sample cart data created:", sampleCartData);
    console.log("💡 Now try checkout again!");

    return sampleCartData;
  } catch (error) {
    console.error("❌ Error creating sample cart data:", error);
    return [];
  }
}

// Hàm để kiểm tra dữ liệu cart hiện tại
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
          `  - chiTietSanPhamId: ${item.chiTietSanPhamId} (ChiTietSanPham ID - used for checkout)`
        );
        console.log(`  - tenSanPham: ${item.tenSanPham}`);
        console.log(`  - soLuong: ${item.soLuong}`);
        console.log(`  - gia: ${item.gia}`);
      });
    } else {
      console.log("Cart is empty");
    }
  } catch (error) {
    console.error("❌ Error checking cart data:", error);
  }
}

// Auto-run fix
console.log("🚀 Auto-fixing cart ID mapping...");
fixCartIdMapping();

// Export functions
window.cartIdFix = {
  fixCartIdMapping,
  fixCartFromBackend,
  createSampleCartData,
  checkCurrentCartData,
};

console.log("💡 Use cartIdFix.fixCartIdMapping() to fix ID mapping");
console.log(
  "💡 Use cartIdFix.fixCartFromBackend() to get fresh data from backend"
);
console.log("💡 Use cartIdFix.createSampleCartData() to create sample data");
console.log("💡 Use cartIdFix.checkCurrentCartData() to check current data");
