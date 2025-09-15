console.log(`
🔧 TEST PROFILE FIX - Copy và paste vào Console:

// Bước 1: Kiểm tra localStorage
console.log('=== BƯỚC 1: KIỂM TRA LOCALSTORAGE ===');

const userStr = localStorage.getItem("user");
const isLoggedIn = localStorage.getItem("isLoggedIn");

console.log('User data:', userStr);
console.log('Is logged in:', isLoggedIn);

if (!userStr || !isLoggedIn) {
  console.log('❌ Không có user data, tạo test data...');
  
  const testUser = {
    id: 7,
    email: "test@example.com",
    hoTen: "Test User",
    soDienThoai: "0123456789",
    role: "CUSTOMER"
  };
  
  localStorage.setItem("user", JSON.stringify(testUser));
  localStorage.setItem("isLoggedIn", "true");
  
  console.log('✅ Đã tạo test user data:', testUser);
} else {
  console.log('✅ User data đã có sẵn');
}

// Bước 2: Test customer orders API
console.log('\\n=== BƯỚC 2: TEST CUSTOMER ORDERS API ===');

const user = JSON.parse(localStorage.getItem("user") || "{}");

fetch('http://localhost:8080/api/customer-orders', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': user.id || 7
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
        console.log('Đơn hàng đầu tiên:', data[0]);
        console.log('Cấu trúc đơn hàng:', Object.keys(data[0]));
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

// Bước 3: Test Profile page
console.log('\\n=== BƯỚC 3: TEST PROFILE PAGE ===');

console.log('💡 Bây giờ hãy:');
console.log('1. Refresh trang Profile');
console.log('2. Chuyển đến tab "Đơn hàng"');
console.log('3. Kiểm tra xem có lỗi "orders.filter is not a function" không');

console.log('\\n🎯 Kết quả mong đợi:');
console.log('- API trả về 200 OK với array đơn hàng');
console.log('- Profile page không bị lỗi filter');
console.log('- Hiển thị danh sách đơn hàng hoặc "Chưa có đơn hàng nào"');
`);
