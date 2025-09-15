console.log(`
🚀 TEST NGAY LẬP TỨC - Copy và paste vào Console:

// Test endpoint cực đơn giản
console.log('=== TEST ENDPOINT CỰC ĐƠN GIẢN ===');

fetch('http://localhost:8080/api/addresses/17/test-set', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('✅ Test status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Test response:', data);
  
  if (response.status === 200) {
    console.log('🎉 Test thành công!');
    console.log('\\n🔄 Bây giờ hãy refresh trang Profile và test lại chức năng đặt địa chỉ mặc định');
  } else {
    console.log('❌ Test lỗi:', data.error || 'Unknown error');
  }
})
.catch(error => {
  console.log('❌ Network error:', error.message);
  console.log('🔍 Backend có thể chưa khởi động xong, hãy đợi thêm 30 giây');
});

console.log('\\n📋 HƯỚNG DẪN:');
console.log('1. Nếu test thành công -> Refresh trang Profile');
console.log('2. Nếu test lỗi -> Đợi backend khởi động xong');
console.log('3. Backend cần khoảng 30-60 giây để khởi động');
`);
