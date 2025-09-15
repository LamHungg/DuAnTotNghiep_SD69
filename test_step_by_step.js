console.log(`
🔍 TEST STEP BY STEP - Copy và paste vào Console:

// Bước 1: Kiểm tra backend có chạy không
console.log('=== BƯỚC 1: KIỂM TRA BACKEND ===');

fetch('http://localhost:8080/api/addresses/test-simple', {
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
    
    // Bước 2: Kiểm tra địa chỉ ID 17 có tồn tại không
    console.log('\\n=== BƯỚC 2: KIỂM TRA ĐỊA CHỈ ID 17 ===');
    
    return fetch('http://localhost:8080/api/addresses/test-address-17', {
      method: 'GET'
    });
  } else {
    console.log('❌ Backend không chạy!');
    throw new Error('Backend not running');
  }
})
.then(response => {
  if (response) {
    console.log('✅ Test address 17 status:', response.status);
    return response.text();
  }
})
.then(data => {
  if (data) {
    console.log('✅ Test address 17 response:', data);
    
    if (response.status === 200) {
      console.log('🎉 Kiểm tra địa chỉ ID 17 thành công!');
      
      // Bước 3: Test đặt địa chỉ mặc định đơn giản
      console.log('\\n=== BƯỚC 3: TEST ĐẶT ĐỊA CHỈ MẶC ĐỊNH ĐƠN GIẢN ===');
      
      return fetch('http://localhost:8080/api/addresses/test-set-default/17', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });
    } else {
      console.log('❌ Lỗi kiểm tra địa chỉ ID 17:', data);
    }
  }
})
.then(response => {
  if (response) {
    console.log('✅ Test set default status:', response.status);
    return response.json();
  }
})
.then(data => {
  if (data) {
    console.log('✅ Test set default response:', data);
    
    if (response.status === 200) {
      console.log('🎉 Test đặt địa chỉ mặc định THÀNH CÔNG!');
      console.log('\\n🔄 Bây giờ hãy refresh trang Profile và test lại chức năng đặt địa chỉ mặc định');
    } else {
      console.log('❌ Test lỗi:', data.error || 'Unknown error');
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
console.log('2. Nếu địa chỉ ID 17 không tồn tại -> Kiểm tra database');
console.log('3. Nếu test đặt địa chỉ mặc định lỗi -> Kiểm tra backend logs');
console.log('4. Nếu tất cả thành công -> Refresh trang Profile');
`);
