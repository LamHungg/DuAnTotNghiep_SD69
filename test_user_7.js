
🚀 TEST VỚI USER ID 7 - Copy và paste vào Console:

// Test endpoint set-default-simple cho user 7
console.log('=== TEST SET DEFAULT SIMPLE CHO USER 7 ===');

// Tìm địa chỉ của user 7
fetch('http://localhost:8080/api/addresses/test-list', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('✅ Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ All addresses:', data);
  
  // Tìm địa chỉ của user 7
  const user7Addresses = data.filter(addr => addr.khachHangId === 7);
  console.log('📍 User 7 addresses:', user7Addresses);
  
  if (user7Addresses.length > 0) {
    const firstAddress = user7Addresses[0];
    console.log('🎯 Testing with address ID:', firstAddress.id);
    
    // Test set default cho địa chỉ đầu tiên của user 7
    return fetch(`http://localhost:8080/api/addresses/${firstAddress.id}/set-default-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } else {
    console.log('❌ Không tìm thấy địa chỉ của user 7');
    return Promise.reject('No addresses found for user 7');
  }
})
.then(response => {
  console.log('✅ Set default status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Set default response:', data);
  
  if (data.message && data.message.includes('thành công')) {
    console.log('🎉 SET DEFAULT THÀNH CÔNG CHO USER 7!');
    console.log('🔄 Bây giờ hãy refresh trang Profile để xem kết quả');
  } else {
    console.log('❌ Lỗi:', data.message || 'Unknown error');
  }
})
.catch(error => {
  console.log('❌ Error:', error);
  console.log('🔍 Backend có thể chưa khởi động xong');
});

console.log('\\n📋 HƯỚNG DẪN:');
console.log('1. Nếu thành công -> Refresh trang Profile');
console.log('2. Nếu lỗi -> Đợi backend khởi động (30-60 giây)');
console.log('3. Backend đang chạy ở port 8080');
console.log('4. Test với user ID 7 (Lam Hung)');

