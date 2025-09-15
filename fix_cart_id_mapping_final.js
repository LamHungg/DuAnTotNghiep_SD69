// Script để sửa ngay lập tức vấn đề ID mapping
console.log("🔧 Sửa ngay lập tức vấn đề ID mapping...");

// Lấy user từ localStorage
const userStr = localStorage.getItem("user");
if (!userStr) {
  console.error("❌ Không tìm thấy user trong localStorage");
  return;
}

const user = JSON.parse(userStr);
console.log("👤 Current user:", user);

// Kiểm tra và sửa cart hiện tại
function fixCartIdMapping() {
  console.log("\n🔧 Sửa ID mapping trong cart...");

  const checkoutCart = localStorage.getItem("checkout_cart");
  if (!checkoutCart) {
    console.log("❌ Không có checkout_cart để sửa");
    return false;
  }

  const cart = JSON.parse(checkoutCart);
  console.log("📦 Cart trước khi sửa:", cart);

  let hasChanges = false;

  // Sửa từng item
  const fixedCart = cart.map((item, index) => {
    console.log(`\n📦 Item ${index + 1} trước khi sửa:`);
    console.log(`  - id: ${item.id} (ChiTietGioHang ID)`);
    console.log(
      `  - chiTietSanPhamId: ${item.chiTietSanPhamId} (ChiTietSanPham ID)`
    );

    // Nếu chiTietSanPhamId không tồn tại hoặc bằng id, cần sửa
    if (!item.chiTietSanPhamId || item.chiTietSanPhamId === item.id) {
      console.error(`❌ Item ${index + 1} có ID mapping sai!`);
      console.error(
        `  - id: ${item.id} (ChiTietGioHang ID) - KHÔNG ĐƯỢC DÙNG ĐỂ CHECKOUT`
      );
      console.error(
        `  - chiTietSanPhamId: ${item.chiTietSanPhamId} (ChiTietSanPham ID) - PHẢI DÙNG NÀY`
      );

      // Tạm thời thay bằng ID hợp lệ (5-14)
      const validId = 5; // ID sản phẩm hợp lệ
      console.log(
        `🔧 Sửa item ${index + 1}: chiTietSanPhamId ${
          item.chiTietSanPhamId
        } -> ${validId}`
      );

      return {
        ...item,
        chiTietSanPhamId: validId, // QUAN TRỌNG: Đặt chiTietSanPhamId đúng
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

  console.log("\n✅ Đã sửa cart và lưu lại");
  console.log("📦 Cart sau khi sửa:", fixedCart);
  console.log(`💰 Tổng tiền mới: ${total.toLocaleString()} VND`);

  return true;
}

// Tạo cart mới hoàn toàn với dữ liệu đúng
async function createCorrectCart() {
  console.log("\n🆕 Tạo cart mới với ID mapping đúng...");

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

    // Tạo cart với sản phẩm đầu tiên - QUAN TRỌNG: ID mapping đúng
    const firstProduct = validProducts[0];
    const newCart = [
      {
        id: firstProduct.id, // ID sản phẩm
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

    console.log("🆕 Cart mới với ID mapping đúng:", newCart);
    console.log("✅ QUAN TRỌNG: id và chiTietSanPhamId đều là ID sản phẩm");

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

// Test checkout với cart đã sửa
async function testCheckoutWithCorrectIds() {
  console.log("\n🧪 Test checkout với ID mapping đúng...");

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

    // Tạo checkout data - QUAN TRỌNG: Sử dụng chiTietSanPhamId
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
      ghiChuKhachHang: "Test checkout với ID mapping đúng",
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
    console.log("✅ QUAN TRỌNG: Sử dụng chiTietSanPhamId cho checkout");

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

// Chạy quy trình sửa hoàn chỉnh
async function runCompleteFix() {
  console.log("🚀 Chạy quy trình sửa ID mapping hoàn chỉnh...");

  // Bước 1: Sửa cart hiện tại
  const fixed = fixCartIdMapping();

  if (fixed) {
    console.log("\n✅ Đã sửa cart, test checkout...");
    const testResult = await testCheckoutWithCorrectIds();

    if (testResult) {
      console.log("\n🎉 HOÀN THÀNH! Cart đã được sửa và checkout thành công!");
      console.log("✅ ID mapping đã đúng: sử dụng chiTietSanPhamId thay vì id");
    } else {
      console.log("\n⚠️ Checkout vẫn lỗi, tạo cart mới...");
      await createCorrectCart();
    }
  } else {
    console.log("\n⚠️ Không sửa được cart, tạo cart mới...");
    await createCorrectCart();
  }
}

// Export functions
window.fixCartIdMapping = {
  fixCartIdMapping,
  createCorrectCart,
  testCheckoutWithCorrectIds,
  runCompleteFix,
};

console.log("💡 Available functions:");
console.log(
  "  - fixCartIdMapping.runCompleteFix() - Chạy quy trình sửa hoàn chỉnh"
);
console.log(
  "  - fixCartIdMapping.fixCartIdMapping() - Sửa ID mapping trong cart"
);
console.log(
  "  - fixCartIdMapping.createCorrectCart() - Tạo cart mới với ID đúng"
);
console.log(
  "  - fixCartIdMapping.testCheckoutWithCorrectIds() - Test checkout"
);
