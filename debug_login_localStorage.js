console.log(`
🔧 DEBUG LOGIN LOCALSTORAGE - Copy và paste vào Console sau khi đăng nhập:

// Kiểm tra localStorage ngay sau khi đăng nhập
console.log('=== DEBUG LOCALSTORAGE AFTER LOGIN ===');
console.log('user:', localStorage.getItem('user'));
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));

// Parse user data nếu có
const userStr = localStorage.getItem('user');
if (userStr) {
  try {
    const userData = JSON.parse(userStr);
    console.log('parsed userData:', userData);
    console.log('has token:', !!userData.token);
    console.log('token value:', userData.token);
  } catch (e) {
    console.error('Error parsing user data:', e);
  }
} else {
  console.log('❌ No user data in localStorage');
}

// Test cartService logic
console.log('\\n=== TEST CART SERVICE LOGIC ===');
const user = localStorage.getItem('user');
if (user) {
  const userData = JSON.parse(user);
  if (userData.token) {
    console.log('🔑 Token found:', userData.token);
    console.log('📤 Auth header:', 'Bearer ' + userData.token);
  } else {
    console.log('❌ No token in userData');
  }
} else {
  console.log('❌ No user in localStorage');
}

// Force update nếu cần
console.log('\\n=== FORCE UPDATE IF NEEDED ===');
if (!localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user') || '{}').token) {
  console.log('🔄 Forcing localStorage update...');
  localStorage.setItem('user', '{"soDienThoai":"0987654321","role":"CUSTOMER","phone":"0987654321","id":11,"hoTen":"Test Customer 2","email":"test2@example.com","token":"customer-token-11"}');
  localStorage.setItem('isLoggedIn', 'true');
  console.log('✅ localStorage updated');
} else {
  console.log('✅ localStorage already has correct data');
}
`);
