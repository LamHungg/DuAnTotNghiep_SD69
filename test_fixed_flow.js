console.log(`
🔧 TEST FIXED FLOW - Copy và paste vào Console sau khi đăng nhập:

// Bước 1: Kiểm tra localStorage
console.log('=== BƯỚC 1: KIỂM TRA LOCALSTORAGE ===');
console.log('user:', localStorage.getItem('user'));
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));

// Bước 2: Auto-fix token nếu cần
console.log('\\n=== BƯỚC 2: AUTO-FIX TOKEN ===');
const userStr = localStorage.getItem('user');
if (userStr) {
  const userData = JSON.parse(userStr);
  console.log('parsed userData:', userData);
  console.log('has token:', !!userData.token);
  
  if (!userData.token && userData.id) {
    console.log('🔄 Auto-fixing missing token...');
    userData.token = 'customer-token-' + userData.id;
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('✅ Token auto-fixed:', userData.token);
  } else if (userData.token) {
    console.log('✅ Token already exists:', userData.token);
  }
} else {
  console.log('❌ No user data found');
}

// Bước 3: Test cartService logic
console.log('\\n=== BƯỚC 3: TEST CART SERVICE ===');
const getAuthHeaders = () => {
  const user = localStorage.getItem("user");
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      
      // Auto-fix token nếu cần
      if (!userData.token && userData.id) {
        userData.token = 'customer-token-' + userData.id;
        localStorage.setItem("user", JSON.stringify(userData));
        console.log("🔧 Auto-fixed missing token:", userData.token);
      }
      
      if (userData.token) {
        console.log('🔑 Using token:', userData.token);
        return { Authorization: 'Bearer ' + userData.token };
      }
    } catch (e) {
      console.error('Error parsing user data:', e);
    }
  }
  
  console.log('🔄 No token, using session-based');
  return {};
};

const headers = getAuthHeaders();
console.log('Generated headers:', headers);

// Bước 4: Test API call
console.log('\\n=== BƯỚC 4: TEST API CALL ===');
if (headers.Authorization) {
  console.log('📤 Testing with Authorization header...');
  
  fetch('http://localhost:8080/api/cart/add', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': headers.Authorization
    },
    credentials: 'include',
    body: JSON.stringify({
      chiTietSanPhamId: 1,
      soLuong: 1
    })
  })
  .then(response => {
    console.log('📥 Response status:', response.status);
    return response.text();
  })
  .then(data => {
    console.log('📥 Response data:', data);
    if (data.includes('thành công')) {
      console.log('✅ Add to cart successful!');
      console.log('🎉 VẤN ĐỀ ĐÃ ĐƯỢC GIẢI QUYẾT!');
    } else {
      console.log('❌ Add to cart failed');
    }
  })
  .catch(error => {
    console.log('❌ API call error:', error);
  });
} else {
  console.log('❌ No Authorization header available');
}

console.log('\\n🎯 Sau khi chạy xong, thử thêm sản phẩm vào giỏ hàng trên trang web!');
`);
