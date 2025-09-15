console.log(`
🔧 FORCE LOGIN AND CHECKOUT - Copy và paste vào Console:

// Bước 1: Clear session cũ và force login
console.log('=== BƯỚC 1: CLEAR SESSION CŨ ===');

localStorage.clear();
sessionStorage.clear();
console.log('✅ Cleared all storage');

// Bước 2: Force login với dữ liệu mẫu
console.log('\\n=== BƯỚC 2: FORCE LOGIN ===');

const testUserData = {
  id: 7, // Thay bằng ID khách hàng thực tế từ database
  email: 'test@example.com',
  hoTen: 'Nguyễn Văn Test',
  soDienThoai: '0123456789',
  phone: '0123456789',
  role: 'CUSTOMER',
  token: 'customer-token-7' // Thay bằng ID thực tế
};

localStorage.setItem('user', JSON.stringify(testUserData));
localStorage.setItem('isLoggedIn', 'true');

console.log('✅ Force login with test data:', testUserData);

// Bước 3: Test session với backend
console.log('\\n=== BƯỚC 3: TEST SESSION VỚI BACKEND ===');

fetch('http://localhost:8080/api/auth/test-check-session', {
  method: 'GET',
  credentials: 'include'
})
.then(response => {
  console.log('Session test status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Session test response:', data);
})
.catch(error => {
  console.log('Session test error:', error);
});

// Bước 4: Test checkout endpoint
console.log('\\n=== BƯỚC 4: TEST CHECKOUT ENDPOINT ===');

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

// Bước 5: Test checkout process với dữ liệu mẫu
console.log('\\n=== BƯỚC 5: TEST CHECKOUT PROCESS ===');

setTimeout(() => {
  const checkoutData = {
    cartItems: [
      {
        chiTietSanPhamId: 5, // Thay bằng ID sản phẩm thực tế
        soLuong: 1,
        gia: 100000,
        thanhTien: 100000
      }
    ],
    diaChiId: 17, // Thay bằng ID địa chỉ thực tế
    voucherId: null,
    phuongThucThanhToanId: 1,
    ghiChuKhachHang: 'Test checkout',
    phiVanChuyen: 30000,
    tongTienHang: 100000,
    tongThanhToan: 130000
  };

  console.log('Test checkout data:', checkoutData);

  fetch('http://localhost:8080/api/checkout/test-process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(checkoutData)
  })
  .then(response => {
    console.log('Checkout process test status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Checkout process test response:', data);
    if (response.status === 200) {
      console.log('✅ Checkout process test successful!');
    } else {
      console.log('❌ Checkout process test failed');
    }
  })
  .catch(error => {
    console.log('Checkout process test error:', error);
  });
}, 2000);

// Bước 6: Hướng dẫn sử dụng dữ liệu thực
console.log('\\n=== BƯỚC 6: HƯỚNG DẪN SỬ DỤNG DỮ LIỆU THỰC ===');

console.log(\`
🔧 Để sử dụng dữ liệu thực, thay đổi các giá trị sau:

1. User ID: Thay 'id: 7' bằng ID khách hàng thực từ database
2. Product ID: Thay 'chiTietSanPhamId: 5' bằng ID sản phẩm thực
3. Address ID: Thay 'diaChiId: 17' bằng ID địa chỉ thực

Cách lấy dữ liệu thực:

1. Chạy script SQL để xem dữ liệu:
   - SELECT id, ho_ten, email FROM khach_hang;
   - SELECT id, id_san_pham FROM chi_tiet_san_pham;
   - SELECT id, id_khach_hang FROM dia_chi_khach_hang;

2. Hoặc sử dụng API:
   - GET /api/customer/products
   - GET /api/address (sau khi login)
\`);

console.log('\\n🎯 Kết quả mong đợi:');
console.log('- Session test: 200 OK');
console.log('- Checkout test: 200 OK với khachHangId');
console.log('- Checkout process: 200 OK với order data');
`);
