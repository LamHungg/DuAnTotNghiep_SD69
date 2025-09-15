console.log(`
🔧 FIX ORDER LOADING - Copy và paste vào Console:

// Bước 1: Kiểm tra và fix localStorage
console.log('=== BƯỚC 1: KIỂM TRA VÀ FIX LOCALSTORAGE ===');

const userStr = localStorage.getItem("user");
const isLoggedIn = localStorage.getItem("isLoggedIn");

console.log('User data:', userStr);
console.log('Is logged in:', isLoggedIn);

// Nếu không có user data, tạo test data
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
  console.log('💡 Hãy khởi động backend trước!');
});

// Bước 3: Test no-auth endpoint
console.log('\\n=== BƯỚC 3: TEST NO-AUTH ENDPOINT ===');

setTimeout(() => {
  fetch('http://localhost:8080/api/customer-orders/test-no-auth', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include'
  })
  .then(response => {
    console.log('No-auth test response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('No-auth test response data:', data);
    if (response.status === 200) {
      console.log('✅ No-auth endpoint hoạt động');
      if (data.orders && data.orders.length > 0) {
        console.log('📦 Có đơn hàng trong database:', data.orders.length);
        console.log('Đơn hàng đầu tiên:', data.orders[0]);
      } else {
        console.log('📦 Không có đơn hàng trong database');
      }
    } else {
      console.log('❌ No-auth endpoint có vấn đề');
    }
  })
  .catch(error => {
    console.log('❌ No-auth endpoint error:', error.message);
  });
}, 2000);

// Bước 4: Test session check
console.log('\\n=== BƯỚC 4: TEST SESSION CHECK ===');

setTimeout(() => {
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
      console.log('❌ Session không hợp lệ - cần đăng nhập lại');
    }
  })
  .catch(error => {
    console.log('❌ Session check error:', error.message);
  });
}, 4000);

// Bước 5: Test customer orders với authentication
console.log('\\n=== BƯỚC 5: TEST CUSTOMER ORDERS WITH AUTH ===');

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
        console.log('📦 Số đơn hàng:', data.length);
        if (data.length > 0) {
          console.log('Đơn hàng đầu tiên:', data[0]);
        }
      }
    } else {
      console.log('❌ Lỗi lấy đơn hàng:', data.error || 'Unknown error');
    }
  })
  .catch(error => {
    console.log('❌ Customer orders error:', error.message);
  });
}, 6000);

console.log('\\n🎯 HƯỚNG DẪN:');
console.log('1. Nếu backend không kết nối được -> Khởi động backend');
console.log('2. Nếu session không hợp lệ -> Đăng nhập lại');
console.log('3. Nếu không có đơn hàng -> Tạo đơn hàng test');
`);
