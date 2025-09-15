console.log(`
🔧 TEST PROFILE BUTTONS - Copy và paste vào Console:

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

// Bước 2: Test lấy danh sách đơn hàng
console.log('\\n=== BƯỚC 2: TEST LẤY DANH SÁCH ĐƠN HÀNG ===');

fetch('http://localhost:8080/api/customer-orders', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': currentUserId || 7
  },
  credentials: 'include'
})
.then(response => {
  console.log('Orders list response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Orders list response data:', data);
  if (response.status === 200 && Array.isArray(data) && data.length > 0) {
    const firstOrder = data[0];
    console.log('✅ Có đơn hàng để test, ID:', firstOrder.id);
    
    // Bước 3: Test lấy chi tiết đơn hàng
    console.log('\\n=== BƯỚC 3: TEST LẤY CHI TIẾT ĐƠN HÀNG ===');
    
    return fetch(\`http://localhost:8080/api/customer-orders/\${firstOrder.id}\`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': currentUserId || 7
      },
      credentials: 'include'
    });
  } else {
    console.log('❌ Không có đơn hàng để test');
    throw new Error('No orders available');
  }
})
.then(response => {
  console.log('Order detail response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Order detail response data:', data);
  if (response.status === 200) {
    console.log('✅ Lấy chi tiết đơn hàng thành công');
    
    // Bước 4: Test hủy đơn hàng (chỉ test API, không thực sự hủy)
    console.log('\\n=== BƯỚC 4: TEST API HỦY ĐƠN HÀNG ===');
    console.log('⚠️  Chỉ test API, không thực sự hủy đơn hàng');
    
    return fetch(\`http://localhost:8080/api/customer-orders/\${data.id}/cancel\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': currentUserId || 7
      },
      credentials: 'include'
    });
  } else {
    console.log('❌ Lỗi lấy chi tiết đơn hàng:', data.error || 'Unknown error');
    throw new Error('Failed to get order detail');
  }
})
.then(response => {
  console.log('Cancel order response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Cancel order response data:', data);
  if (response.status === 200) {
    console.log('✅ API hủy đơn hàng hoạt động');
  } else {
    console.log('❌ Lỗi API hủy đơn hàng:', data.error || 'Unknown error');
  }
})
.catch(error => {
  console.log('❌ Test error:', error.message);
});

console.log('\\n🎯 HƯỚNG DẪN:');
console.log('1. Nếu tất cả API đều trả về 200 -> Các button sẽ hoạt động');
console.log('2. Nếu có lỗi -> Kiểm tra backend logs');
console.log('3. Refresh trang Profile để test các button thực tế');
`);
