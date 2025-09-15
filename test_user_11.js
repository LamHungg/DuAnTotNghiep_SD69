console.log(`
🔍 TEST USER ID 11 - Copy và paste vào Console:

// Test lấy danh sách địa chỉ cho user ID 11
console.log('=== TEST LẤY DANH SÁCH ĐỊA CHỈ ===');

fetch('http://localhost:8080/api/addresses', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': '11'
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
    console.log('🎉 Lấy danh sách địa chỉ THÀNH CÔNG!');
    
    if (Array.isArray(data) && data.length > 0) {
      console.log('📦 Số địa chỉ:', data.length);
      const firstAddress = data[0];
      console.log('📍 Địa chỉ đầu tiên:', firstAddress);
      
      // Test đặt địa chỉ mặc định
      console.log('\\n=== TEST ĐẶT ĐỊA CHỈ MẶC ĐỊNH ===');
      
      return fetch(\`http://localhost:8080/api/addresses/\${firstAddress.id}/set-default\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': '11'
        },
        credentials: 'include'
      });
    } else {
      console.log('📝 Không có địa chỉ nào');
    }
  } else {
    console.log('❌ Lỗi:', data.error || 'Unknown error');
  }
})
.then(response => {
  if (response) {
    console.log('✅ Set default response status:', response.status);
    return response.json();
  }
})
.then(data => {
  if (data) {
    console.log('✅ Set default response data:', data);
    if (response.status === 200) {
      console.log('🎉 Đặt địa chỉ mặc định THÀNH CÔNG!');
      console.log('\\n🔄 Bây giờ hãy refresh trang Profile và test lại chức năng đặt địa chỉ mặc định');
    } else {
      console.log('❌ Lỗi đặt địa chỉ mặc định:', data.error || 'Unknown error');
    }
  }
})
.catch(error => {
  console.log('❌ Network error:', error.message);
});

console.log('\\n📋 HƯỚNG DẪN:');
console.log('1. Nếu test này thành công -> Refresh trang Profile');
console.log('2. Vào tab "Địa chỉ" và click icon check để đặt mặc định');
console.log('3. Nếu vẫn lỗi -> Kiểm tra backend logs');
`);
