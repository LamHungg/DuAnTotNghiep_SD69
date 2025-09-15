console.log(`
🧪 TEST SIMPLE SET DEFAULT - Copy và paste vào Console:

// Test endpoint đơn giản không cần authentication
console.log('=== TEST ENDPOINT ĐƠN GIẢN ===');

fetch('http://localhost:8080/api/addresses/test-set-default/17', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('✅ Test set default status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Test set default response:', data);
  
  if (response.status === 200) {
    console.log('🎉 Test đặt địa chỉ mặc định THÀNH CÔNG!');
    console.log('\\n🔄 Bây giờ hãy refresh trang Profile và test lại chức năng đặt địa chỉ mặc định');
  } else {
    console.log('❌ Test lỗi:', data.error || 'Unknown error');
  }
})
.catch(error => {
  console.log('❌ Network error:', error.message);
});

console.log('\\n📋 HƯỚNG DẪN:');
console.log('1. Nếu test này thành công -> Backend đã được sửa');
console.log('2. Nếu test này lỗi -> Backend chưa được restart');
console.log('3. Refresh trang Profile để test chức năng thực tế');
`);
