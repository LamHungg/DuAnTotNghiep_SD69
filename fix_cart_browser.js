
// Script sửa localStorage với dữ liệu đúng từ API
console.log('🔧 Đang sửa localStorage với dữ liệu đúng...');

// Xóa dữ liệu cũ
localStorage.removeItem('checkout_cart');
localStorage.removeItem('checkout_total');

// Dữ liệu cart đúng từ API
const correctCartData = [{"id":1,"name":"Áo thun nam","price":199000,"oldPrice":120000,"quantity":1,"image":"https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=500&q=100","variant":"Đen - S","mauSac":"Đen","kichCo":"S","stock":82}];

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
