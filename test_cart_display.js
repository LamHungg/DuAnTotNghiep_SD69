console.log(`
🔧 TEST CART DISPLAY - Copy và paste vào Console sau khi thêm sản phẩm:

// Bước 1: Kiểm tra localStorage
console.log('=== BƯỚC 1: KIỂM TRA LOCALSTORAGE ===');
console.log('user:', localStorage.getItem('user'));
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));

// Bước 2: Test API get cart
console.log('\\n=== BƯỚC 2: TEST API GET CART ===');
const userStr = localStorage.getItem('user');
if (userStr) {
  const userData = JSON.parse(userStr);
  console.log('User data:', userData);
  
  if (userData.token) {
    console.log('🔑 Using token:', userData.token);
    
    fetch('http://localhost:8080/api/cart', {
      method: 'GET',
      headers: {
        'Authorization': 'Bearer ' + userData.token
      },
      credentials: 'include'
    })
    .then(response => {
      console.log('📥 Response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('📥 Cart data:', data);
      console.log('📥 Is array:', Array.isArray(data));
      console.log('📥 Length:', data?.length || 0);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('✅ Cart has items!');
        data.forEach((item, index) => {
          console.log(\`Item \${index + 1}:\`, {
            id: item.id,
            name: item.tenSanPham,
            quantity: item.soLuong,
            price: item.gia,
            total: item.thanhTien
          });
        });
      } else {
        console.log('❌ Cart is empty');
      }
    })
    .catch(error => {
      console.log('❌ API call error:', error);
    });
  } else {
    console.log('❌ No token found');
  }
} else {
  console.log('❌ No user data found');
}

// Bước 3: Test cartService
console.log('\\n=== BƯỚC 3: TEST CART SERVICE ===');
if (typeof window !== 'undefined' && window.cartService) {
  console.log('cartService available');
  // Test cartService.getCart() if available
} else {
  console.log('cartService not available in console');
}

// Bước 4: Trigger cart reload
console.log('\\n=== BƯỚC 4: TRIGGER CART RELOAD ===');
console.log('🔄 Dispatching cartUpdated event...');
window.dispatchEvent(new Event('cartUpdated'));
console.log('✅ Event dispatched');

console.log('\\n🎯 Nếu cart có items nhưng không hiện trên UI, có thể là vấn đề CSS hoặc component rendering!');
`);
