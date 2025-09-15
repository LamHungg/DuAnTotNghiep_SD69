console.log(`
🔧 TEST ORDERS FIX - Copy và paste vào Console:

// Bước 1: Kiểm tra localStorage và user ID
console.log('=== BƯỚC 1: KIỂM TRA USER ID ===');

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

// Bước 2: Test backend connection
console.log('\\n=== BƯỚC 2: TEST BACKEND CONNECTION ===');

fetch('http://localhost:8080/api/customer-orders/test', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include'
})
.then(response => {
  console.log('Backend test response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Backend test response data:', data);
  if (response.status === 200) {
    console.log('✅ Backend đang hoạt động');
  } else {
    console.log('❌ Backend có vấn đề');
  }
})
.catch(error => {
  console.log('❌ Backend không thể kết nối:', error.message);
});

// Bước 3: Test no-auth endpoint để xem tất cả đơn hàng
console.log('\\n=== BƯỚC 3: TEST ALL ORDERS IN DATABASE ===');

setTimeout(() => {
  fetch('http://localhost:8080/api/customer-orders/test-no-auth', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then(response => {
    console.log('All orders response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('All orders response data:', data);
    if (response.status === 200) {
      console.log('✅ Lấy tất cả đơn hàng thành công');
      if (data.orders && data.orders.length > 0) {
        console.log('📦 Tổng số đơn hàng trong DB:', data.orders.length);
        
        // Tìm đơn hàng của user hiện tại
        const userOrders = data.orders.filter(order => 
          order.khachHang && order.khachHang.id === currentUserId
        );
        
        console.log('📦 Đơn hàng của user hiện tại:', userOrders.length);
        
        if (userOrders.length > 0) {
          console.log('✅ Tìm thấy đơn hàng của user:', userOrders[0]);
        } else {
          console.log('❌ Không tìm thấy đơn hàng của user hiện tại');
          console.log('🔍 Đơn hàng có khách hàng ID:', data.orders.map(o => o.khachHang?.id));
        }
      } else {
        console.log('📦 Không có đơn hàng nào trong database');
      }
    } else {
      console.log('❌ Lỗi lấy tất cả đơn hàng');
    }
  })
  .catch(error => {
    console.log('❌ All orders error:', error.message);
  });
}, 2000);

// Bước 4: Test customer orders API với user hiện tại
console.log('\\n=== BƯỚC 4: TEST CUSTOMER ORDERS API ===');

setTimeout(() => {
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
          console.log('Đơn hàng đầu tiên:', data[0]);
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
}, 4000);

console.log('\\n🎯 PHÂN TÍCH KẾT QUẢ:');
console.log('1. Nếu backend không kết nối -> Đợi backend khởi động xong');
console.log('2. Nếu có đơn hàng trong DB nhưng không phải của user hiện tại -> Vấn đề user ID');
console.log('3. Nếu customer-orders trả về 200 nhưng không có đơn hàng -> Vấn đề authentication');
console.log('4. Nếu tất cả OK -> Refresh trang Profile để test');
`);
