console.log(`
🔧 TEST ORDER STATUS UPDATE - Copy và paste vào Console:

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
  } catch (e) {
    console.log('❌ Error parsing user data:', e);
  }
}

// Bước 2: Test lấy danh sách đơn hàng
console.log('\\n=== BƯỚC 2: TEST LẤY DANH SÁCH ĐƠN HÀNG ===');

fetch('http://localhost:8080/api/customer-orders', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  },
  credentials: 'include'
})
.then(response => {
  console.log('Orders response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Orders response data:', data);
  if (response.status === 200 && data.length > 0) {
    console.log('✅ Có đơn hàng để test');
    window.testOrderId = data[0].id; // Lưu ID đơn hàng đầu tiên để test
    console.log('Test order ID:', window.testOrderId);
  } else {
    console.log('❌ Không có đơn hàng để test');
  }
})
.catch(error => {
  console.log('Orders error:', error);
});

// Bước 3: Test lấy lịch sử đơn hàng
console.log('\\n=== BƯỚC 3: TEST LẤY LỊCH SỬ ĐƠN HÀNG ===');

setTimeout(() => {
  if (window.testOrderId) {
    fetch(\`http://localhost:8080/api/customer-orders/\${window.testOrderId}/history\`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then(response => {
      console.log('Order history response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Order history response data:', data);
      if (response.status === 200) {
        console.log('✅ Lấy lịch sử đơn hàng thành công');
      } else {
        console.log('❌ Lấy lịch sử đơn hàng thất bại');
      }
    })
    .catch(error => {
      console.log('Order history error:', error);
    });
  }
}, 2000);

// Bước 4: Test hủy đơn hàng
console.log('\\n=== BƯỚC 4: TEST HỦY ĐƠN HÀNG ===');

setTimeout(() => {
  if (window.testOrderId) {
    fetch(\`http://localhost:8080/api/customer-orders/\${window.testOrderId}/cancel\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({
        lyDoHuy: 'Test hủy đơn hàng từ console'
      })
    })
    .then(response => {
      console.log('Cancel order response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Cancel order response data:', data);
      if (response.status === 200) {
        console.log('✅ Hủy đơn hàng thành công');
      } else {
        console.log('❌ Hủy đơn hàng thất bại');
      }
    })
    .catch(error => {
      console.log('Cancel order error:', error);
    });
  }
}, 4000);

// Bước 5: Test xác nhận đã nhận hàng
console.log('\\n=== BƯỚC 5: TEST XÁC NHẬN ĐÃ NHẬN HÀNG ===');

setTimeout(() => {
  if (window.testOrderId) {
    fetch(\`http://localhost:8080/api/customer-orders/\${window.testOrderId}/confirm-received\`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    })
    .then(response => {
      console.log('Confirm received response status:', response.status);
      return response.json();
    })
    .then(data => {
      console.log('Confirm received response data:', data);
      if (response.status === 200) {
        console.log('✅ Xác nhận đã nhận hàng thành công');
      } else {
        console.log('❌ Xác nhận đã nhận hàng thất bại');
      }
    })
    .catch(error => {
      console.log('Confirm received error:', error);
    });
  }
}, 6000);

console.log('\\n🎯 Kết quả mong đợi:');
console.log('- Lấy danh sách đơn hàng: 200 OK');
console.log('- Lấy lịch sử đơn hàng: 200 OK');
console.log('- Hủy đơn hàng: 200 OK (nếu đơn hàng có thể hủy)');
console.log('- Xác nhận đã nhận hàng: 200 OK (nếu đơn hàng đã giao)');
`);
