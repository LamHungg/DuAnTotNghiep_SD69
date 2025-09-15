console.log(`
🔧 DEBUG CHECKOUT KHACHHANGID - Copy và paste vào Console:

// Bước 1: Kiểm tra localStorage
console.log('=== BƯỚC 1: KIỂM TRA LOCALSTORAGE ===');

const userStr = localStorage.getItem("user");
const isLoggedIn = localStorage.getItem("isLoggedIn");

console.log('User data:', userStr);
console.log('Is logged in:', isLoggedIn);

if (userStr) {
  try {
    const userData = JSON.parse(userStr);
    console.log('Parsed user data:', userData);
    console.log('User ID:', userData.id);
    console.log('User email:', userData.email);
  } catch (e) {
    console.log('❌ Error parsing user data:', e);
  }
}

// Bước 2: Test với khachHangId từ localStorage
console.log('\\n=== BƯỚC 2: TEST VỚI KHACHHANGID TỪ LOCALSTORAGE ===');

let khachHangId = 7; // Default
if (userStr) {
  try {
    const userData = JSON.parse(userStr);
    khachHangId = userData.id || 7;
  } catch (e) {
    console.log('❌ Error parsing user data:', e);
  }
}

const testData = {
  cartItems: [
    {
      chiTietSanPhamId: 13,
      soLuong: 1,
      gia: 819000,
      thanhTien: 819000
    }
  ],
  diaChiId: 17,
  voucherId: 6,
  phuongThucThanhToanId: 1,
  ghiChuKhachHang: 'Test debug',
  phiVanChuyen: 30000,
  tongTienHang: 819000,
  tongThanhToan: 849000,
  khachHangId: khachHangId
};

console.log('Test data with khachHangId:', testData);

// Test test-process endpoint
fetch('http://localhost:8080/api/checkout/test-process', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include',
  body: JSON.stringify(testData)
})
.then(response => {
  console.log('Test-process response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Test-process response data:', data);
  if (response.status === 200) {
    console.log('✅ Test-process thành công!');
  } else {
    console.log('❌ Test-process thất bại');
  }
})
.catch(error => {
  console.log('Test-process error:', error);
});

// Bước 3: Test process endpoint
console.log('\\n=== BƯỚC 3: TEST PROCESS ENDPOINT ===');

setTimeout(() => {
  fetch('http://localhost:8080/api/checkout/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    credentials: 'include',
    body: JSON.stringify(testData)
  })
  .then(response => {
    console.log('Process response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Process response data:', data);
    if (response.status === 200) {
      console.log('✅ Process thành công!');
    } else {
      console.log('❌ Process thất bại');
    }
  })
  .catch(error => {
    console.log('Process error:', error);
  });
}, 2000);

// Bước 4: Test với Authorization header
console.log('\\n=== BƯỚC 4: TEST VỚI AUTHORIZATION HEADER ===');

setTimeout(() => {
  fetch('http://localhost:8080/api/checkout/process', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer customer-token-\${khachHangId}\`
    },
    credentials: 'include',
    body: JSON.stringify(testData)
  })
  .then(response => {
    console.log('Process with Auth response status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Process with Auth response data:', data);
    if (response.status === 200) {
      console.log('✅ Process with Auth thành công!');
    } else {
      console.log('❌ Process with Auth thất bại');
    }
  })
  .catch(error => {
    console.log('Process with Auth error:', error);
  });
}, 4000);

console.log('\\n🎯 Kết quả mong đợi:');
console.log('- Test-process: 200 OK với khachHangId');
console.log('- Process: 200 OK với order data');
console.log('- Process with Auth: 200 OK với order data');
`);
