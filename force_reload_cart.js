console.log(`
🔧 FORCE RELOAD CART - Copy và paste vào Console:

// Bước 1: Kiểm tra localStorage
console.log('=== BƯỚC 1: KIỂM TRA LOCALSTORAGE ===');
console.log('user:', localStorage.getItem('user'));
console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));

// Bước 2: Force reload cart
console.log('\\n=== BƯỚC 2: FORCE RELOAD CART ===');
const userStr = localStorage.getItem('user');
if (userStr) {
  const userData = JSON.parse(userStr);
  console.log('User data:', userData);
  
  if (userData.token) {
    console.log('🔑 Using token:', userData.token);
    
    // Force reload cart bằng cách gọi API trực tiếp
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
      console.log('📥 Items count:', data?.length || 0);
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('✅ Cart has items!');
        
        // Force update localStorage với cart data
        localStorage.setItem('cart_data', JSON.stringify(data));
        console.log('💾 Cart data saved to localStorage');
        
        // Trigger multiple events để đảm bảo
        console.log('🔄 Triggering events...');
        window.dispatchEvent(new Event('cartUpdated'));
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('authChange'));
        
        console.log('✅ Events triggered');
        
        // Force page reload nếu cần
        console.log('🔄 Reloading page...');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        
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

// Bước 3: Check current page
console.log('\\n=== BƯỚC 3: CHECK CURRENT PAGE ===');
console.log('Current URL:', window.location.href);
console.log('Current pathname:', window.location.pathname);

if (window.location.pathname.includes('/cart')) {
  console.log('✅ Currently on cart page');
} else {
  console.log('❌ Not on cart page, navigating...');
  window.location.href = '/cart';
}

console.log('\\n🎯 Nếu vẫn không hiện, có thể là vấn đề CSS hoặc component rendering!');
`);
