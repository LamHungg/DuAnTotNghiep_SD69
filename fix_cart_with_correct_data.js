const axios = require("axios");

const BASE_URL = "http://localhost:8080";

async function fixCartWithCorrectData() {
  try {
    console.log("🔧 Sửa localStorage với dữ liệu đúng từ API...\n");

    // 1. Lấy dữ liệu sản phẩm từ API
    console.log("1️⃣ Lấy dữ liệu sản phẩm từ API...");
    const productResponse = await axios.get(
      `${BASE_URL}/api/customer/products/1`,
      {
        withCredentials: true,
      }
    );

    const productData = productResponse.data;
    console.log("✅ Dữ liệu sản phẩm:", JSON.stringify(productData, null, 2));

    if (!productData.variants || productData.variants.length === 0) {
      console.log("❌ Không có variants cho sản phẩm này");
      return;
    }

    // 2. Tạo dữ liệu cart đúng
    console.log("\n2️⃣ Tạo dữ liệu cart đúng...");
    const correctCartData = productData.variants.map((variant) => ({
      id: variant.id, // ID đúng từ API
      name: productData.name,
      price: variant.price,
      oldPrice: variant.oldPrice || variant.price,
      quantity: 1,
      image: variant.image || "default-image.jpg",
      variant: `${variant.color} - ${variant.size}`,
      mauSac: variant.color,
      kichCo: variant.size,
      stock: variant.stock,
    }));

    console.log(
      "✅ Dữ liệu cart đúng:",
      JSON.stringify(correctCartData, null, 2)
    );

    // 3. Tạo script JavaScript để chạy trong browser
    console.log("\n3️⃣ Tạo script JavaScript cho browser...");
    const jsScript = `
// Script sửa localStorage với dữ liệu đúng từ API
console.log('🔧 Đang sửa localStorage với dữ liệu đúng...');

// Xóa dữ liệu cũ
localStorage.removeItem('checkout_cart');
localStorage.removeItem('checkout_total');

// Dữ liệu cart đúng từ API
const correctCartData = ${JSON.stringify(correctCartData)};

// Lưu dữ liệu mới
localStorage.setItem('checkout_cart', JSON.stringify(correctCartData));

// Tính tổng tiền
const total = correctCartData.reduce((sum, item) => sum + (item.price * item.quantity), 0);
localStorage.setItem('checkout_total', total.toString());

console.log('✅ Đã sửa localStorage thành công!');
console.log('Dữ liệu mới:', localStorage.getItem('checkout_cart'));
console.log('Tổng tiền:', localStorage.getItem('checkout_total'));

// Tải lại trang
console.log('🔄 Đang tải lại trang...');
setTimeout(() => {
  window.location.reload();
}, 1000);
`;

    console.log("📋 Script JavaScript để chạy trong browser console:");
    console.log("=".repeat(80));
    console.log(jsScript);
    console.log("=".repeat(80));

    // 4. Tạo file script riêng
    const fs = require("fs");
    fs.writeFileSync("fix_cart_browser.js", jsScript);
    console.log("\n💾 Đã lưu script vào file: fix_cart_browser.js");

    // 5. Hướng dẫn sử dụng
    console.log("\n📖 HƯỚNG DẪN SỬ DỤNG:");
    console.log("1. Mở trang web frontend");
    console.log("2. Nhấn F12 để mở Developer Tools");
    console.log("3. Chuyển đến tab Console");
    console.log("4. Copy và paste script JavaScript ở trên");
    console.log("5. Nhấn Enter để chạy");
    console.log("6. Trang sẽ tự động reload với dữ liệu đúng");

    console.log("\n🎯 KẾT QUẢ MONG ĐỢI:");
    console.log("✅ localStorage sẽ chứa dữ liệu với ID đúng (1, 2, 3...)");
    console.log("✅ Checkout sẽ hoạt động bình thường");
    console.log("✅ Sản phẩm sẽ được trừ số lượng tồn kho");
  } catch (error) {
    console.error("❌ Lỗi khi sửa dữ liệu cart!");
    console.error("Lỗi:", error.response?.data || error.message);
  }
}

// Chạy script
fixCartWithCorrectData();
