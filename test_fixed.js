console.log(`
🚀 TEST VỚI FIX @TRANSACTIONAL - Copy và paste vào Console:

// Test endpoint set-default-simple
console.log('=== TEST SET DEFAULT SIMPLE VỚI @TRANSACTIONAL ===');

fetch('http://localhost:8080/api/addresses/17/set-default-simple', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('✅ Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Response:', data);
  
  if (data.message && data.message.includes('thành công')) {
    console.log('🎉 SET DEFAULT THÀNH CÔNG!');
    console.log('🔄 Bây giờ hãy refresh trang Profile để xem kết quả');
  } else {
    console.log('❌ Lỗi:', data.message || 'Unknown error');
  }
})
.catch(error => {
  console.log('❌ Network error:', error.message);
  console.log('🔍 Backend có thể chưa khởi động xong');
});

console.log('\\n📋 HƯỚNG DẪN:');
console.log('1. Nếu thành công -> Refresh trang Profile');
console.log('2. Nếu lỗi -> Đợi backend khởi động (30-60 giây)');
console.log('3. Backend đang chạy ở port 8080');
console.log('4. Đã thêm @Transactional để fix lỗi database');
`);
