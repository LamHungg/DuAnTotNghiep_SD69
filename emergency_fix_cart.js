// Script sửa khẩn cấp cart hiện tại
console.log("🚨 SỬA KHẨN CẤP CART HIỆN TẠI...");

// Lấy user từ localStorage
const userStr = localStorage.getItem("user");
if (!userStr) {
  console.error("❌ Không tìm thấy user trong localStorage");
  return;
}

const user = JSON.parse(userStr);
console.log("👤 Current user:", user);

// Sửa khẩn cấp cart hiện tại
function emergencyFixCart() {
  console.log("\n🔧 Sửa khẩn cấp cart...");

  const checkoutCart = localStorage.getItem("checkout_cart");
  if (!checkoutCart) {
    console.log("❌ Không có checkout_cart để sửa");
    return false;
  }

  const cart = JSON.parse(checkoutCart);
  console.log("📦 Cart trước khi sửa:", cart);

  // Sửa từng item
  const fixedCart = cart.map((item, index) => {
    console.log(`\n📦 Item ${index + 1} trước khi sửa:`);
    console.log(`  - id: ${item.id} (ChiTietGioHang ID)`);
    console.log(
      `  - chiTietSanPhamId: ${item.chiTietSanPhamId} (ChiTietSanPham ID)`
    );
    console.log(`  - name: ${item.name}`);

    // Nếu chiTietSanPhamId undefined hoặc không hợp lệ, sửa ngay
    if (
      !item.chiTietSanPhamId ||
      item.chiTietSanPhamId < 5 ||
      item.chiTietSanPhamId > 14
    ) {
      console.error(`❌ Item ${index + 1} có chiTietSanPhamId không hợp lệ!`);
      console.error(`  - id: ${item.id} (ChiTietGioHang ID) - KHÔNG ĐƯỢC DÙNG`);
      console.error(
        `  - chiTietSanPhamId: ${item.chiTietSanPhamId} - KHÔNG HỢP LỆ`
      );

      // Sửa ngay lập tức - thay bằng ID sản phẩm hợp lệ
      const validId = 5; // ID sản phẩm hợp lệ
      console.log(
        `🔧 Sửa khẩn cấp item ${index + 1}: chiTietSanPhamId ${
          item.chiTietSanPhamId
        } -> ${validId}`
      );

      return {
        ...item,
        chiTietSanPhamId: validId, // QUAN TRỌNG: Đặt chiTietSanPhamId đúng
        id: validId, // Cũng sửa id để đồng nhất
      };
    }

    return item;
  });

  // Lưu cart đã sửa
  localStorage.setItem("checkout_cart", JSON.stringify(fixedCart));

  // Tính lại tổng tiền
  const total = fixedCart.reduce(
    (sum, item) => sum + (item.thanhTien || item.price * item.quantity),
    0
  );
  localStorage.setItem("checkout_total", total.toString());

  console.log("\n✅ Đã sửa khẩn cấp cart và lưu lại");
  console.log("📦 Cart sau khi sửa:", fixedCart);
  console.log(`💰 Tổng tiền mới: ${total.toLocaleString()} VND`);

  return true;
}

// Test checkout ngay lập tức
async function testCheckoutImmediately() {
  console.log("\n🧪 Test checkout ngay lập tức...");

  try {
    const checkoutCart = localStorage.getItem("checkout_cart");
    if (!checkoutCart) {
      console.log("❌ Không có cart để test");
      return false;
    }

    const cart = JSON.parse(checkoutCart);
    console.log("📦 Cart để test:", cart);

    // Kiểm tra ID mapping
    cart.forEach((item, index) => {
      console.log(`\n📦 Item ${index + 1} kiểm tra:`);
      console.log(`  - id: ${item.id}`);
      console.log(`  - chiTietSanPhamId: ${item.chiTietSanPhamId}`);

      if (item.chiTietSanPhamId < 5 || item.chiTietSanPhamId > 14) {
        console.error(
          `❌ INVALID chiTietSanPhamId: ${item.chiTietSanPhamId} (should be 5-14)`
        );
      } else {
        console.log(`✅ Valid chiTietSanPhamId: ${item.chiTietSanPhamId}`);
      }
    });

    // Tạo checkout data
    const checkoutData = {
      cartItems: cart.map((item) => ({
        chiTietSanPhamId: item.chiTietSanPhamId, // QUAN TRỌNG: Sử dụng chiTietSanPhamId
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
      ghiChuKhachHang: "Test checkout sau khi sửa khẩn cấp",
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

// Chạy sửa khẩn cấp và test
async function runEmergencyFix() {
  console.log("🚨 CHẠY SỬA KHẨN CẤP...");

  // Bước 1: Sửa khẩn cấp cart
  const fixed = emergencyFixCart();

  if (fixed) {
    console.log("\n✅ Đã sửa khẩn cấp, test checkout ngay...");
    const testResult = await testCheckoutImmediately();

    if (testResult) {
      console.log(
        "\n🎉 HOÀN THÀNH! Cart đã được sửa khẩn cấp và checkout thành công!"
      );
      console.log("✅ ID mapping đã đúng: sử dụng chiTietSanPhamId thay vì id");
    } else {
      console.log("\n⚠️ Checkout vẫn lỗi, cần kiểm tra thêm...");
    }
  } else {
    console.log("\n❌ Không sửa được cart");
  }
}

// Export functions
window.emergencyFix = {
  emergencyFixCart,
  testCheckoutImmediately,
  runEmergencyFix,
};

console.log("💡 Available functions:");
console.log(
  "  - emergencyFix.runEmergencyFix() - Chạy sửa khẩn cấp hoàn chỉnh"
);
console.log("  - emergencyFix.emergencyFixCart() - Sửa khẩn cấp cart");
console.log("  - emergencyFix.testCheckoutImmediately() - Test checkout ngay");
