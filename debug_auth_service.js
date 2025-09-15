console.log(`
🔍 DEBUG AUTH SERVICE - Copy và paste vào Console sau khi đăng nhập:

// Kiểm tra localStorage sau khi đăng nhập
console.log('=== DEBUG AUTH SERVICE ===');
console.log('user:', localStorage.getItem('user'));
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));

// Parse user data
const userStr = localStorage.getItem('user');
if (userStr) {
  const userData = JSON.parse(userStr);
  console.log('parsed userData:', userData);
  console.log('has token:', !!userData.token);
  console.log('token value:', userData.token);
  
  // Nếu không có token, thêm vào
  if (!userData.token) {
    console.log('🔄 Adding missing token...');
    userData.token = 'customer-token-11';
    localStorage.setItem('user', JSON.stringify(userData));
    console.log('✅ Token added to localStorage');
  }
} else {
  console.log('❌ No user data found');
}

// Test authService logic
console.log('\\n=== TEST AUTH SERVICE LOGIC ===');
const authService = {
  getCurrentUser: () => {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);
    return null;
  },
  
  isAuthenticated: () => {
    const user = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    return !!(user && isLoggedIn === "true");
  }
};

console.log('getCurrentUser():', authService.getCurrentUser());
console.log('isAuthenticated():', authService.isAuthenticated());

// Test cartService logic
console.log('\\n=== TEST CART SERVICE LOGIC ===');
const getAuthHeaders = () => {
  const user = localStorage.getItem("user");
  
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.token) {
        console.log('🔑 Token found:', userData.token);
        return { Authorization: \`Bearer \${userData.token}\` };
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

// Test API call
console.log('\\n=== TEST API CALL ===');
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
`);
