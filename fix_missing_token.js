console.log(`
🔧 FIX MISSING TOKEN - Copy và paste vào Console:

// Kiểm tra localStorage hiện tại
console.log('=== CURRENT LOCALSTORAGE ===');
console.log('user:', localStorage.getItem('user'));
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));


const userStr = localStorage.getItem('user');
if (userStr) {
  const userData = JSON.parse(userStr);
  console.log('parsed userData:', userData);
  console.log('has token:', !!userData.token);
  
  // Nếu không có token, thêm vào
  if (!userData.token) {
    console.log('🔄 Adding missing token...');
    userData.token = 'customer-token-11';
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('✅ Token added to localStorage');
    console.log('Updated user data:', JSON.parse(localStorage.getItem('user')));
  } else {
    console.log('✅ Token already exists');
  }
} else {
  console.log('❌ No user data found');
}

// Test cartService logic sau khi fix
console.log('\\n=== TEST CART SERVICE AFTER FIX ===');
const updatedUser = localStorage.getItem('user');
if (updatedUser) {
  const userData = JSON.parse(updatedUser);
  if (userData.token) {
    console.log('🔑 Token found:', userData.token);
    console.log('📤 Auth header:', 'Bearer ' + userData.token);
    console.log('✅ Ready for cart operations!');
  } else {
    console.log('❌ Still no token');
  }
}
`);
