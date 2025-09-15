// Script để kiểm tra và sửa ngay lập tức vấn đề ID 22
console.log("🔍 Kiểm tra vấn đề ID 22...");

// Lấy user từ localStorage
const userStr = localStorage.getItem("user");
if (!userStr) {
  console.error("❌ Không tìm thấy user trong localStorage");
  return;
}

const user = JSON.parse(userStr);
console.log("👤 Current user:", user);

// Kiểm tra dữ liệu cart hiện tại
function checkCurrentCart() {
  console.log("\n📦 Kiểm tra cart hiện tại...");

  const checkoutCart = localStorage.getItem("checkout_cart");
  if (!checkoutCart) {
    console.log("❌ Không có checkout_cart trong localStorage");
    return null;
  }

  const cart = JSON.parse(checkoutCart);
  console.log("📦 Cart hiện tại:", cart);

  // Kiểm tra từng item
  cart.forEach((item, index) => {
    console.log(`\n📦 Item ${index + 1}:`);
    console.log(`  - id: ${item.id}`);
    console.log(`  - chiTietSanPhamId: ${item.chiTietSanPhamId}`);
    console.log(`  - name: ${item.name}`);
    console.log(`  - quantity: ${item.quantity}`);
    console.log(`  - price: ${item.price}`);

    // Kiểm tra xem có ID 22 không
    if (item.id === 22 || item.chiTietSanPhamId === 22) {
      console.error(`❌ PHÁT HIỆN ID 22 trong item ${index + 1}!`);
    }
  });

  return cart;
}

// Sửa ngay lập tức - thay ID 22 bằng ID hợp lệ
function fixId22Immediately() {
  console.log("\n🔧 Sửa ID 22 ngay lập tức...");

  const checkoutCart = localStorage.getItem("checkout_cart");
  if (!checkoutCart) {
    console.log("❌ Không có checkout_cart để sửa");
    return false;
  }

  const cart = JSON.parse(checkoutCart);
  let hasChanges = false;

  // Sửa từng item
  const fixedCart = cart.map((item, index) => {
    let fixedItem = { ...item };

    // Nếu id là 22, thay bằng 5
    if (item.id === 22) {
      console.log(`🔧 Sửa item ${index + 1}: id ${item.id} -> 5`);
      fixedItem.id = 5;
      hasChanges = true;
    }

    // Nếu chiTietSanPhamId là 22, thay bằng 5
    if (item.chiTietSanPhamId === 22) {
      console.log(
        `🔧 Sửa item ${index + 1}: chiTietSanPhamId ${
          item.chiTietSanPhamId
        } -> 5`
      );
      fixedItem.chiTietSanPhamId = 5;
      hasChanges = true;
    }

    return fixedItem;
  });

  if (hasChanges) {
    // Lưu cart đã sửa
    localStorage.setItem("checkout_cart", JSON.stringify(fixedCart));

    // Tính lại tổng tiền
    const total = fixedCart.reduce(
      (sum, item) => sum + (item.thanhTien || item.price * item.quantity),
      0
    );
    localStorage.setItem("checkout_total", total.toString());

    console.log("✅ Đã sửa cart và lưu lại");
    console.log("📦 Cart sau khi sửa:", fixedCart);
    console.log(`💰 Tổng tiền mới: ${total.toLocaleString()} VND`);

    return true;
  } else {
    console.log("✅ Không có ID 22 cần sửa");
    return false;
  }
}

// Tạo cart mới hoàn toàn với dữ liệu hợp lệ
async function createNewValidCart() {
  console.log("\n🆕 Tạo cart mới hoàn toàn...");

  try {
    // Lấy danh sách sản phẩm từ backend
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

    // Lọc sản phẩm hợp lệ (ID 5-14)
    const validProducts = products.filter(
      (product) => product.id >= 5 && product.id <= 14 && product.soLuong > 0
    );

    if (validProducts.length === 0) {
      console.error("❌ Không tìm thấy sản phẩm hợp lệ");
      return false;
    }

    // Tạo cart với sản phẩm đầu tiên
    const firstProduct = validProducts[0];
    const newCart = [
      {
        id: firstProduct.id,
        chiTietSanPhamId: firstProduct.id, // QUAN TRỌNG: Đặt chiTietSanPhamId đúng
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

    console.log("🆕 Cart mới:", newCart);

    // Lưu vào localStorage
    localStorage.setItem("checkout_cart", JSON.stringify(newCart));
    localStorage.setItem("checkout_total", firstProduct.gia.toString());

    console.log("✅ Cart mới đã được tạo và lưu");
    return true;
  } catch (error) {
    console.error("❌ Lỗi tạo cart mới:", error);
    return false;
  }
}

// Xóa cart hoàn toàn
function clearCart() {
  console.log("\n🗑️ Xóa cart hoàn toàn...");
  localStorage.removeItem("checkout_cart");
  localStorage.removeItem("checkout_total");
  console.log("✅ Cart đã được xóa");
}

// Test checkout với cart đã sửa
async function testCheckoutWithFixedCart() {
  console.log("\n🧪 Test checkout với cart đã sửa...");

  try {
    const checkoutCart = localStorage.getItem("checkout_cart");
    if (!checkoutCart) {
      console.log("❌ Không có cart để test");
      return false;
    }

    const cart = JSON.parse(checkoutCart);
    console.log("📦 Cart để test:", cart);

    // Tạo checkout data
    const checkoutData = {
      cartItems: cart.map((item) => ({
        chiTietSanPhamId: item.chiTietSanPhamId || item.id,
        soLuong: item.quantity,
        gia: item.price,
        thanhTien: item.thanhTien || item.price * item.quantity,
        tenSanPham: item.name,
        mauSac: item.mauSac,
        kichCo: item.kichCo,
      })),
      diaChiId: 17,
      voucherId: null,
      phuongThucThanhToanId: 1,
      ghiChuKhachHang: "Test checkout sau khi sửa",
      phiVanChuyen: 30000,
      tongTienHang: cart.reduce(
        (sum, item) => sum + (item.thanhTien || item.price * item.quantity),
        0
      ),
      tongThanhToan:
        cart.reduce(
          (sum, item) => sum + (item.thanhTien || item.price * item.quantity),
          0
        ) + 30000,
    };

    console.log("📤 Checkout data:", checkoutData);

    // Test với endpoint test-process
    const response = await fetch(
      "http://localhost:8080/api/checkout/test-process",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        credentials: "include",
        body: JSON.stringify(checkoutData),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Checkout failed: ${response.status} - ${errorText}`);
      return false;
    }

    const result = await response.json();
    console.log("✅ Checkout test successful:", result);
    return true;
  } catch (error) {
    console.error("❌ Checkout test error:", error);
    return false;
  }
}

// Chạy tất cả các bước
async function runFullFix() {
  console.log("🚀 Chạy quy trình sửa hoàn chỉnh...");

  // Bước 1: Kiểm tra cart hiện tại
  const currentCart = checkCurrentCart();

  // Bước 2: Sửa ID 22 nếu có
  const fixed = fixId22Immediately();

  if (fixed) {
    console.log("\n✅ Đã sửa ID 22, test checkout...");
    const testResult = await testCheckoutWithFixedCart();

    if (testResult) {
      console.log("\n🎉 HOÀN THÀNH! Cart đã được sửa và checkout thành công!");
    } else {
      console.log("\n⚠️ Checkout vẫn lỗi, tạo cart mới...");
      await createNewValidCart();
    }
  } else {
    console.log("\n⚠️ Không có ID 22, nhưng vẫn test checkout...");
    const testResult = await testCheckoutWithFixedCart();

    if (!testResult) {
      console.log("\n⚠️ Checkout lỗi, tạo cart mới...");
      await createNewValidCart();
    }
  }
}

// Export functions
window.fixId22 = {
  checkCurrentCart,
  fixId22Immediately,
  createNewValidCart,
  clearCart,
  testCheckoutWithFixedCart,
  runFullFix,
};

console.log("💡 Available functions:");
console.log("  - fixId22.runFullFix() - Chạy quy trình sửa hoàn chỉnh");
console.log("  - fixId22.checkCurrentCart() - Kiểm tra cart hiện tại");
console.log("  - fixId22.fixId22Immediately() - Sửa ID 22 ngay lập tức");
console.log("  - fixId22.createNewValidCart() - Tạo cart mới");
console.log("  - fixId22.clearCart() - Xóa cart");
console.log("  - fixId22.testCheckoutWithFixedCart() - Test checkout");
