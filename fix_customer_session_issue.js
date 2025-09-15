console.log(`
🔧 FIX CUSTOMER SESSION ISSUE - Copy và paste vào Console:

// Bước 1: Kiểm tra session hiện tại
console.log('=== BƯỚC 1: KIỂM TRA SESSION HIỆN TẠI ===');

const userStr = localStorage.getItem("user");
const isLoggedIn = localStorage.getItem("isLoggedIn");

console.log('User data:', userStr);
console.log('Is logged in:', isLoggedIn);

if (userStr) {
  try {
    const userData = JSON.parse(userStr);
    console.log('Parsed user data:', userData);
    console.log('User ID:', userData.id);
    console.log('User email:', userData.email);
    console.log('User token:', userData.token);
  } catch (e) {
    console.log('❌ Error parsing user data:', e);
  }
}

// Bước 2: Kiểm tra session với backend
console.log('\\n=== BƯỚC 2: KIỂM TRA SESSION VỚI BACKEND ===');

fetch('http://localhost:8080/api/auth/test-check-session', {
  method: 'GET',
  credentials: 'include'
})
.then(response => {
  console.log('Session check status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Session check response:', data);
})
.catch(error => {
  console.log('Session check error:', error);
});

// Bước 3: Kiểm tra checkout endpoint
console.log('\\n=== BƯỚC 3: KIỂM TRA CHECKOUT ENDPOINT ===');

fetch('http://localhost:8080/api/checkout/test', {
  method: 'GET',
  credentials: 'include'
})
.then(response => {
  console.log('Checkout test status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Checkout test response:', data);
})
.catch(error => {
  console.log('Checkout test error:', error);
});

// Bước 4: Sửa session nếu cần
console.log('\\n=== BƯỚC 4: SỬA SESSION NẾU CẦN ===');

if (userStr) {
  try {
    const userData = JSON.parse(userStr);
    let needsUpdate = false;
    
    // Đảm bảo có token
    if (!userData.token && userData.id) {
      userData.token = \`customer-token-\${userData.id}\`;
      needsUpdate = true;
      console.log('✅ Added missing token');
    }
    
    // Đảm bảo có role
    if (!userData.role) {
      userData.role = 'CUSTOMER';
      needsUpdate = true;
      console.log('✅ Added missing role');
    }
    
    // Đảm bảo có phone field
    if (!userData.phone && userData.soDienThoai) {
      userData.phone = userData.soDienThoai;
      needsUpdate = true;
      console.log('✅ Added missing phone field');
    }
    
    if (needsUpdate) {
      localStorage.setItem("user", JSON.stringify(userData));
      console.log('✅ Updated user data');
    }
    
    // Đảm bảo isLoggedIn
    if (!localStorage.getItem("isLoggedIn")) {
      localStorage.setItem("isLoggedIn", "true");
      console.log('✅ Added missing isLoggedIn');
    }
    
  } catch (e) {
    console.log('❌ Error fixing user data:', e);
  }
}

// Bước 5: Test checkout với session đã sửa
console.log('\\n=== BƯỚC 5: TEST CHECKOUT VỚI SESSION ĐÃ SỬA ===');

setTimeout(() => {
  fetch('http://localhost:8080/api/checkout/test', {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => {
    console.log('Fixed checkout test status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Fixed checkout test response:', data);
    if (response.status === 200) {
      console.log('✅ Session fixed successfully!');
    } else {
      console.log('❌ Session still has issues');
    }
  })
  .catch(error => {
    console.log('Fixed checkout test error:', error);
  });
}, 1000);

// Bước 6: Hướng dẫn khắc phục
console.log('\\n=== BƯỚC 6: HƯỚNG DẪN KHẮC PHỤC ===');

console.log(`
🔧 Nếu vẫn lỗi, thử các bước sau:

1. Đăng xuất và đăng nhập lại:
   - localStorage.clear();
   - window.location.href = '/login';

2. Kiểm tra backend session:
   - Đảm bảo backend đang chạy
   - Kiểm tra session timeout

3. Kiểm tra CORS:
   - Đảm bảo credentials: 'include' được gửi
   - Kiểm tra CORS configuration

4. Kiểm tra database:
   - Đảm bảo khách hàng tồn tại trong database
   - Kiểm tra session table

5. Test với Postman:
   - Gửi request với session cookie
   - Kiểm tra response
`);

console.log('\\n🎯 Kết quả mong đợi:');
console.log('- Session check: 200 OK');
console.log('- Checkout test: 200 OK với khachHangId');
console.log('- User data có đầy đủ thông tin');
`);
