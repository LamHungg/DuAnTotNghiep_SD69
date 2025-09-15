// Kiểm tra nhanh cart hiện tại
console.log("🔍 Kiểm tra nhanh cart hiện tại...");

const checkoutCart = localStorage.getItem("checkout_cart");
if (checkoutCart) {
  const cart = JSON.parse(checkoutCart);
  console.log("📦 Cart hiện tại:", cart);

  cart.forEach((item, index) => {
    console.log(`\n📦 Item ${index + 1}:`);
    console.log(`  - id: ${item.id} (ChiTietGioHang ID)`);
    console.log(
      `  - chiTietSanPhamId: ${item.chiTietSanPhamId} (ChiTietSanPham ID)`
    );
    console.log(`  - name: ${item.name}`);

    if (item.chiTietSanPhamId < 5 || item.chiTietSanPhamId > 14) {
      console.error(
        `❌ INVALID chiTietSanPhamId: ${item.chiTietSanPhamId} (should be 5-14)`
      );
      console.error(`❌ Đây là nguyên nhân gây lỗi checkout!`);
    } else {
      console.log(`✅ Valid chiTietSanPhamId: ${item.chiTietSanPhamId}`);
    }
  });
} else {
  console.log("❌ Không có checkout_cart trong localStorage");
}

console.log("\n💡 Chạy fixCartIdMapping.runCompleteFix() để sửa ngay!");
