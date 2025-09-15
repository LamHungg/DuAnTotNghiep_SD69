// Script để sửa localStorage frontend
// Copy và paste đoạn code này vào Console của Developer Tools (F12)

console.log("🔧 Đang sửa localStorage...");

// Xóa dữ liệu cũ
localStorage.removeItem("checkout_cart");
localStorage.removeItem("checkout_total");

// Tạo dữ liệu mới đúng (chỉ sản phẩm có tồn tại)
const correctCartData = [
  {
    id: 1,
    name: "Áo thun nam",
    price: 199000,
    oldPrice: 199000,
    quantity: 1,
    image: "default-image.jpg",
    variant: "Đen - S, Cotton",
    mauSac: "Đen",
    kichCo: "S",
  },
];

// Lưu dữ liệu mới
localStorage.setItem("checkout_cart", JSON.stringify(correctCartData));
localStorage.setItem("checkout_total", "199000");

console.log("✅ Đã sửa localStorage thành công!");
console.log("Dữ liệu mới:", localStorage.getItem("checkout_cart"));
console.log("Tổng tiền:", localStorage.getItem("checkout_total"));

// Tải lại trang
console.log("🔄 Đang tải lại trang...");
setTimeout(() => {
  window.location.reload();
}, 1000);
