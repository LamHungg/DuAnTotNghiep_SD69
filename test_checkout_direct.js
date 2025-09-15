console.log(`
🔧 TEST CHECKOUT DIRECT - Copy và paste vào Console:

// Bước 1: Clear và setup dữ liệu test
console.log('=== BƯỚC 1: SETUP DỮ LIỆU TEST ===');

// Clear localStorage
localStorage.clear();
sessionStorage.clear();

// Setup user data
const testUser = {
  id: 7,
  email: 'test@example.com',
  hoTen: 'Nguyễn Văn Test',
  soDienThoai: '0123456789',
  phone: '0123456789',
  role: 'CUSTOMER',
  token: 'customer-token-7'
};

localStorage.setItem('user', JSON.stringify(testUser));
localStorage.setItem('isLoggedIn', 'true');

console.log('✅ Setup user data:', testUser);

// Bước 2: Test checkout trực tiếp
console.log('\\n=== BƯỚC 2: TEST CHECKOUT TRỰC TIẾP ===');

const testCheckoutData = {
  cartItems: [
    {
      chiTietSanPhamId: 5,
      soLuong: 1,
      gia: 100000,
      thanhTien: 100000
    }
  ],
  diaChiId: 17,
  voucherId: null,
  phuongThucThanhToanId: 1,
  ghiChuKhachHang: 'Test checkout direct',
  phiVanChuyen: 30000,
  tongTienHang: 100000,
  tongThanhToan: 130000,
  khachHangId: 7
};

console.log('Test checkout data:', testCheckoutData);

// Gửi request trực tiếp
fetch('http://localhost:8080/api/checkout/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify(testCheckoutData)
})
.then(response => {
  console.log('Checkout response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Checkout response data:', data);
  if (response.status === 200) {
    console.log('✅ Checkout successful!');
  } else {
    console.log('❌ Checkout failed');
  }
})
.catch(error => {
  console.log('Checkout error:', error);
});

// Bước 3: Test với Authorization header
console.log('\\n=== BƯỚC 3: TEST VỚI AUTHORIZATION HEADER ===');

setTimeout(() => {
  fetch('http://localhost:8080/api/checkout/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer customer-token-7'
    },
    credentials: 'include',
    body: JSON.stringify(testCheckoutData)
  })
  .then(response => {
    console.log('Checkout with Auth response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Checkout with Auth response data:', data);
    if (response.status === 200) {
      console.log('✅ Checkout with Auth successful!');
    } else {
      console.log('❌ Checkout with Auth failed');
    }
  })
  .catch(error => {
    console.log('Checkout with Auth error:', error);
  });
}, 2000);

// Bước 4: Test session endpoint
console.log('\\n=== BƯỚC 4: TEST SESSION ENDPOINT ===');

setTimeout(() => {
  fetch('http://localhost:8080/api/auth/test-check-session', {
    method: 'GET',
    credentials: 'include'
  })
  .then(response => {
    console.log('Session test status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Session test data:', data);
  })
  .catch(error => {
    console.log('Session test error:', error);
  });
}, 4000);

console.log('\\n🎯 Kết quả mong đợi:');
console.log('- Checkout direct: 200 OK với order data');
console.log('- Checkout with Auth: 200 OK với order data');
console.log('- Session test: 200 OK với user data');
`);
