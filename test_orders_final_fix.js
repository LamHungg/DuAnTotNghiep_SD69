console.log(`
🔧 TEST ORDERS FINAL FIX - Copy và paste vào Console:

// Bước 1: Kiểm tra localStorage
console.log('=== BƯỚC 1: KIỂM TRA LOCALSTORAGE ===');

const userStr = localStorage.getItem("user");
const isLoggedIn = localStorage.getItem("isLoggedIn");

console.log('User data:', userStr);
console.log('Is logged in:', isLoggedIn);

let currentUserId = null;
if (userStr) {
  try {
    const userData = JSON.parse(userStr);
    currentUserId = userData.id;
    console.log('✅ Current user ID:', currentUserId);
  } catch (e) {
    console.log('❌ Error parsing user data:', e);
  }
}

// Bước 2: Test customer orders API
console.log('\\n=== BƯỚC 2: TEST CUSTOMER ORDERS API ===');

fetch('http://localhost:8080/api/customer-orders', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': currentUserId || 7
  },
  credentials: 'include'
})
.then(response => {
  console.log('Customer orders response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Customer orders response data:', data);
  if (response.status === 200) {
    console.log('✅ Lấy đơn hàng thành công');
    if (Array.isArray(data)) {
      console.log('📦 Số đơn hàng:', data.length);
      if (data.length > 0) {
        const order = data[0];
        console.log('📦 Đơn hàng đầu tiên:');
        console.log('- ID:', order.id);
        console.log('- Mã đơn hàng:', order.maDonHang);
        console.log('- Ngày đặt:', order.ngayDat);
        console.log('- Tổng tiền:', order.tongThanhToan);
        console.log('- Trạng thái:', order.trangThaiDonHang?.tenTrangThai);
        console.log('- Số sản phẩm:', order.chiTietDonHang?.length || 0);
        
        if (order.chiTietDonHang && order.chiTietDonHang.length > 0) {
          const item = order.chiTietDonHang[0];
          console.log('📦 Chi tiết sản phẩm đầu tiên:');
          console.log('- Tên sản phẩm:', item.chiTietSanPham?.tenSanPham);
          console.log('- Số lượng:', item.soLuong);
          console.log('- Đơn giá:', item.donGia);
        }
        
        console.log('\\n🎯 PHÂN TÍCH:');
        console.log('1. Nếu có đơn hàng và trạng thái -> Refresh trang Profile');
        console.log('2. Nếu có đơn hàng nhưng không có trạng thái -> Vấn đề backend');
        console.log('3. Nếu không có đơn hàng -> Vấn đề user ID hoặc database');
      } else {
        console.log('📦 Không có đơn hàng nào');
      }
    } else {
      console.log('❌ Data không phải array:', typeof data);
    }
  } else {
    console.log('❌ Lỗi lấy đơn hàng:', data.error || 'Unknown error');
  }
})
.catch(error => {
  console.log('❌ Customer orders error:', error.message);
});

console.log('\\n🎯 HƯỚNG DẪN:');
console.log('1. Nếu API trả về 200 và có đơn hàng -> Refresh trang Profile');
console.log('2. Nếu vẫn không hiển thị -> Kiểm tra Console errors');
console.log('3. Nếu có lỗi -> Chạy lại script này');
`);
