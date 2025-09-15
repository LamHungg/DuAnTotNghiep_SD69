console.log(`
🔧 TEST MODAL FIX - Copy và paste vào Console:

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

// Bước 2: Test lấy chi tiết đơn hàng
console.log('\\n=== BƯỚC 2: TEST LẤY CHI TIẾT ĐƠN HÀNG ===');

fetch('http://localhost:8080/api/customer-orders/44', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': currentUserId || 7
  },
  credentials: 'include'
})
.then(response => {
  console.log('Order detail response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Order detail response data:', data);
  if (response.status === 200) {
    console.log('✅ Lấy chi tiết đơn hàng thành công');
    
    // Kiểm tra các field quan trọng
    console.log('\\n📦 KIỂM TRA DỮ LIỆU:');
    console.log('- ID:', data.id);
    console.log('- Mã đơn hàng:', data.maDonHang);
    console.log('- Ngày đặt:', data.ngayDat);
    console.log('- Tổng tiền hàng:', data.tongTienHang);
    console.log('- Tổng thanh toán:', data.tongThanhToan);
    
    // Kiểm tra trạng thái
    if (data.trangThaiDonHang) {
      console.log('- Trạng thái ID:', data.trangThaiDonHang.id);
      console.log('- Trạng thái tên:', data.trangThaiDonHang.tenTrangThai);
      console.log('- Trạng thái mô tả:', data.trangThaiDonHang.moTa);
    } else {
      console.log('❌ Không có trạng thái đơn hàng');
    }
    
    // Kiểm tra chi tiết sản phẩm
    if (data.chiTietDonHang && data.chiTietDonHang.length > 0) {
      console.log('\\n📦 CHI TIẾT SẢN PHẨM:');
      data.chiTietDonHang.forEach((item, index) => {
        console.log(\`Sản phẩm \${index + 1}:\`);
        console.log('- ID:', item.id);
        console.log('- Số lượng:', item.soLuong);
        console.log('- Đơn giá:', item.donGia);
        console.log('- Thành tiền:', item.thanhTien);
        
        if (item.chiTietSanPham) {
          console.log('- Tên sản phẩm:', item.chiTietSanPham.tenSanPham);
          console.log('- Mô tả:', item.chiTietSanPham.moTa);
          console.log('- Giá:', item.chiTietSanPham.gia);
        } else {
          console.log('❌ Không có thông tin sản phẩm');
        }
      });
    } else {
      console.log('❌ Không có chi tiết sản phẩm');
    }
    
    console.log('\\n🎯 PHÂN TÍCH:');
    console.log('1. Nếu có trạng thái và tên sản phẩm -> Modal sẽ hiển thị đúng');
    console.log('2. Nếu thiếu dữ liệu -> Cần kiểm tra database');
    console.log('3. Refresh trang Profile và click "Xem chi tiết" để test modal');
    
  } else {
    console.log('❌ Lỗi lấy chi tiết đơn hàng:', data.error || 'Unknown error');
  }
})
.catch(error => {
  console.log('❌ Test error:', error.message);
});

console.log('\\n🎯 HƯỚNG DẪN:');
console.log('1. Nếu API trả về 200 và có đầy đủ dữ liệu -> Modal sẽ hoạt động tốt');
console.log('2. Refresh trang Profile và click "Xem chi tiết" để test modal');
console.log('3. Kiểm tra xem modal có hiển thị đúng trạng thái và tên sản phẩm không');
`);
