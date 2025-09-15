console.log(`
🔍 DEBUG 400 ERROR - Copy và paste vào Console:

// Bước 1: Kiểm tra backend có chạy không
console.log('=== BƯỚC 1: KIỂM TRA BACKEND ===');

fetch('http://localhost:8080/api/addresses/test', {
  method: 'GET'
})
.then(response => {
  console.log('✅ Backend test status:', response.status);
  return response.text();
})
.then(data => {
  console.log('✅ Backend test response:', data);
  
  if (response.status === 200) {
    console.log('🎉 Backend đang chạy!');
    
    // Bước 2: Test API với user ID 11
    console.log('\\n=== BƯỚC 2: TEST API VỚI USER ID 11 ===');
    
    return fetch('http://localhost:8080/api/addresses', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'X-User-ID': '11'
      },
      credentials: 'include'
    });
  } else {
    console.log('❌ Backend không chạy!');
    throw new Error('Backend not running');
  }
})
.then(response => {
  if (response) {
    console.log('✅ Get addresses status:', response.status);
    return response.json();
  }
})
.then(data => {
  if (data) {
    console.log('✅ Get addresses response:', data);
    
    if (response.status === 200) {
      console.log('🎉 Lấy danh sách địa chỉ THÀNH CÔNG!');
      
      if (Array.isArray(data) && data.length > 0) {
        console.log('📦 Số địa chỉ:', data.length);
        const firstAddress = data[0];
        console.log('📍 Địa chỉ đầu tiên:', firstAddress);
        
        // Bước 3: Test đặt địa chỉ mặc định với chi tiết
        console.log('\\n=== BƯỚC 3: TEST ĐẶT ĐỊA CHỈ MẶC ĐỊNH (CHI TIẾT) ===');
        
        const testUrl = \`http://localhost:8080/api/addresses/\${firstAddress.id}/set-default\`;
        console.log('🔗 Test URL:', testUrl);
        console.log('📤 Headers:', {
          'Content-Type': 'application/json',
          'X-User-ID': '11'
        });
        
        return fetch(testUrl, {
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
      console.log('❌ Lỗi lấy danh sách địa chỉ:', data.error || 'Unknown error');
    }
  }
})
.then(response => {
  if (response) {
    console.log('✅ Set default status:', response.status);
    console.log('✅ Set default headers:', response.headers);
    return response.json();
  }
})
.then(data => {
  if (data) {
    console.log('✅ Set default response:', data);
    
    if (response.status === 200) {
      console.log('🎉 Đặt địa chỉ mặc định THÀNH CÔNG!');
    } else {
      console.log('❌ Lỗi đặt địa chỉ mặc định:', data.error || 'Unknown error');
      console.log('🔍 Chi tiết lỗi:', data);
    }
  }
})
.catch(error => {
  console.log('❌ Network error:', error.message);
  console.log('🔍 Error details:', error);
});

console.log('\\n📋 HƯỚNG DẪN:');
console.log('1. Nếu backend không chạy -> Restart backend');
console.log('2. Nếu API lỗi -> Kiểm tra backend logs');
console.log('3. Nếu test thành công -> Refresh trang Profile');
`);
