console.log(`
🔧 SIMPLE CHECKOUT TEST - Copy và paste vào Console:

// Test checkout với dữ liệu đơn giản
console.log('=== TEST CHECKOUT ĐƠN GIẢN ===');

const testData = {
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
  ghiChuKhachHang: 'Test đơn giản',
  phiVanChuyen: 30000,
  tongTienHang: 100000,
  tongThanhToan: 130000,
  khachHangId: 7
};

console.log('Test data:', testData);

// Test 1: Không có Authorization header
fetch('http://localhost:8080/api/checkout/process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Test 1 - Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Test 1 - Response:', data);
  if (response.status === 200) {
    console.log('✅ Test 1 thành công!');
  } else {
    console.log('❌ Test 1 thất bại');
  }
})
.catch(error => {
  console.log('Test 1 - Error:', error);
});

// Test 2: Có Authorization header
setTimeout(() => {
  fetch('http://localhost:8080/api/checkout/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer customer-token-7'
    },
    credentials: 'include',
    body: JSON.stringify(testData)
  })
  .then(response => {
    console.log('Test 2 - Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Test 2 - Response:', data);
    if (response.status === 200) {
      console.log('✅ Test 2 thành công!');
    } else {
      console.log('❌ Test 2 thất bại');
    }
  })
  .catch(error => {
    console.log('Test 2 - Error:', error);
  });
}, 2000);

console.log('\\n🎯 Kết quả mong đợi:');
console.log('- Test 1: 200 OK (sử dụng khachHangId từ request body)');
console.log('- Test 2: 200 OK (sử dụng khachHangId từ JWT token)');
`);
