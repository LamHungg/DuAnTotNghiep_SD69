console.log(`
🔧 TEST BROWSER CONSOLE - Copy và paste vào Console (F12):

// Test 1: Kiểm tra localStorage hiện tại
console.log('=== TEST 1: Current localStorage ===');
console.log('user:', localStorage.getItem('user'));
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));

// Test 2: Force update localStorage với token
console.log('\\n=== TEST 2: Force update localStorage ===');
const userData = {
  "soDienThoai": "0987654321",
  "role": "CUSTOMER", 
  "phone": "0987654321",
  "id": 11,
  "hoTen": "Test Customer 2",
  "email": "test2@example.com",
  "token": "customer-token-11"
};

localStorage.setItem('user', JSON.stringify(userData));
localStorage.setItem('isLoggedIn', 'true');
console.log('✅ localStorage updated');

// Test 3: Kiểm tra lại localStorage
console.log('\\n=== TEST 3: Check updated localStorage ===');
console.log('user:', localStorage.getItem('user'));
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));

// Test 4: Test cartService logic
console.log('\\n=== TEST 4: Test cartService logic ===');
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

// Test 5: Test add to cart API call
console.log('\\n=== TEST 5: Test add to cart API ===');
fetch('http://localhost:8080/api/cart/add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer customer-token-11'
  },
  credentials: 'include',
  body: JSON.stringify({
    chiTietSanPhamId: 1,
    soLuong: 1
  })
})
.then(response => response.text())
.then(data => {
  console.log('✅ Add to cart response:', data);
})
.catch(error => {
  console.log('❌ Add to cart error:', error);
});

console.log('\\n🎯 Sau khi chạy xong, thử thêm sản phẩm vào giỏ hàng trên trang web!');
`);
