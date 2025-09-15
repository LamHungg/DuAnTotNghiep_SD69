console.log(`
🚀 QUICK TEST - Đặt địa chỉ mặc định
Copy và paste vào Console:

// Test đặt địa chỉ ID 17 làm mặc định
fetch('http://localhost:8080/api/addresses/17/set-default', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': '7'  // Thay bằng user ID thực tế
  },
  credentials: 'include'
})
.then(response => {
  console.log('✅ Response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Response data:', data);
  if (response.status === 200) {
    console.log('🎉 Đặt địa chỉ mặc định THÀNH CÔNG!');
  } else {
    console.log('❌ Lỗi:', data.error || 'Unknown error');
  }
})
.catch(error => {
  console.log('❌ Network error:', error.message);
});

console.log('🔍 Kiểm tra kết quả ở trên...');
`);
