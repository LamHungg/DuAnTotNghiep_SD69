console.log(`
🔍 DEBUG TOÀN BỘ LUỒNG THÊM GIỎ HÀNG:

// Bước 1: Kiểm tra localStorage
console.log('=== BƯỚC 1: KIỂM TRA LOCALSTORAGE ===');
console.log('user:', localStorage.getItem('user'));
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));

const userStr = localStorage.getItem('user');
if (userStr) {
  const userData = JSON.parse(userStr);
  console.log('parsed userData:', userData);
  console.log('has token:', !!userData.token);
  console.log('token value:', userData.token);
} else {
  console.log('❌ No user data in localStorage');
}

// Bước 2: Test cartService logic
console.log('\\n=== BƯỚC 2: TEST CART SERVICE LOGIC ===');
const getAuthHeaders = () => {
  const user = localStorage.getItem("user");
  console.log('🔍 cartService - localStorage user:', user);
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      console.log('🔍 cartService - parsed userData:', userData);
      
      if (userData.token) {
        console.log('🔑 cartService - Using token authentication:', userData.token);
        return { Authorization: \`Bearer \${userData.token}\` };
      } else {
        console.log('❌ cartService - No token in userData');
      }
    } catch (e) {
      console.error('❌ cartService - Error parsing user data:', e);
    }
  } else {
    console.log('❌ cartService - No user in localStorage');
  }
  
  console.log('🔄 cartService - Using session-based authentication');
  return {};
};

const headers = getAuthHeaders();
console.log('Generated headers:', headers);

// Bước 3: Test API call
console.log('\\n=== BƯỚC 3: TEST API CALL ===');
if (headers.Authorization) {
  console.log('📤 Will send Authorization header:', headers.Authorization);
  
  // Test API call
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
    } else {
      console.log('❌ Add to cart failed');
    }
  })
  .catch(error => {
    console.log('❌ API call error:', error);
  });
} else {
  console.log('❌ No Authorization header, cannot test API');
}

// Bước 4: Force fix nếu cần
console.log('\\n=== BƯỚC 4: FORCE FIX NẾU CẦN ===');
if (!localStorage.getItem('user') || !JSON.parse(localStorage.getItem('user') || '{}').token) {
  console.log('🔄 Forcing localStorage update...');
  localStorage.setItem('user', '{"soDienThoai":"0987654321","role":"CUSTOMER","phone":"0987654321","id":11,"hoTen":"Test Customer 2","email":"test2@example.com","token":"customer-token-11"}');
  localStorage.setItem('isLoggedIn', 'true');
  console.log('✅ localStorage updated');
  console.log('🔄 Please refresh page and try again');
} else {
  console.log('✅ localStorage already has correct data');
}
`);
