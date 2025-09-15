console.log(`
🔧 DEBUG ORDER LOADING - Copy và paste vào Console:

// Bước 1: Kiểm tra localStorage
console.log('=== BƯỚC 1: KIỂM TRA LOCALSTORAGE ===');

const userStr = localStorage.getItem("user");
const isLoggedIn = localStorage.getItem("isLoggedIn");

console.log('User data:', userStr);
console.log('Is logged in:', isLoggedIn);

if (userStr) {
  try {
    const userData = JSON.parse(userStr);
    console.log('Parsed user data:', userData);
    console.log('User ID:', userData.id);
  } catch (e) {
    console.log('❌ Error parsing user data:', e);
  }
}

// Bước 2: Test session check
console.log('\\n=== BƯỚC 2: TEST SESSION CHECK ===');

fetch('http://localhost:8080/api/auth/check-session', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include'
})
.then(response => {
  console.log('Session check response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Session check response data:', data);
  if (response.status === 200) {
    console.log('✅ Session hợp lệ');
  } else {
    console.log('❌ Session không hợp lệ');
  }
})
.catch(error => {
  console.log('Session check error:', error);
});

// Bước 3: Test customer orders API
console.log('\\n=== BƯỚC 3: TEST CUSTOMER ORDERS API ===');

setTimeout(() => {
  fetch('http://localhost:8080/api/customer-orders', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
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
        console.log('Số đơn hàng:', data.length);
        if (data.length > 0) {
          console.log('Đơn hàng đầu tiên:', data[0]);
        }
      }
    } else {
      console.log('❌ Lỗi lấy đơn hàng');
    }
  })
  .catch(error => {
    console.log('Customer orders error:', error);
  });
}, 2000);

// Bước 4: Test customer orders no-auth API
console.log('\\n=== BƯỚC 4: TEST CUSTOMER ORDERS NO-AUTH API ===');

setTimeout(() => {
  fetch('http://localhost:8080/api/customer-orders/test-no-auth', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then(response => {
    console.log('Admin orders response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Customer orders no-auth response data:', data);
    if (response.status === 200) {
      console.log('✅ Lấy đơn hàng no-auth thành công');
      if (data.orders && Array.isArray(data.orders)) {
        console.log('Số đơn hàng no-auth:', data.orders.length);
        if (data.orders.length > 0) {
          console.log('Đơn hàng no-auth đầu tiên:', data.orders[0]);
        }
      }
    } else {
      console.log('❌ Lỗi lấy đơn hàng no-auth');
    }
  })
  .catch(error => {
    console.log('Customer orders no-auth error:', error);
  });
}, 4000);

console.log('\\n🎯 Kết quả mong đợi:');
console.log('- Session check: 200 OK với user data');
console.log('- Customer orders: 200 OK với danh sách đơn hàng');
console.log('- Customer orders no-auth: 200 OK với tất cả đơn hàng (để so sánh)');
`);
