console.log(`
🏠 ADD ADDRESS FOR USER 7 - Copy và paste vào Console:

// Thêm địa chỉ cho user 7
console.log('=== ADD ADDRESS FOR USER 7 ===');

const newAddress = {
  hoTen: 'Lam Hung',
  soDienThoai: '0876743212',
  tinhThanh: 'Hà Nội',
  quanHuyen: 'Cầu Giấy',
  phuongXa: 'Dịch Vọng',
  diaChiChiTiet: '123 Đường ABC, Phường Dịch Vọng',
  loaiDiaChi: 'Nhà riêng',
  macDinh: false
};

console.log('📝 Adding address:', newAddress);

fetch('http://localhost:8080/api/addresses/test-add', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(newAddress)
})
.then(response => {
  console.log('✅ Status:', response.status);
  return response.json();
})
.then(data => {
  console.log('✅ Response:', data);
  
  if (data.id) {
    console.log('🎉 ADDRESS ADDED SUCCESSFULLY!');
    console.log('📍 New address ID:', data.id);
    console.log('🔄 Bây giờ hãy test set default với address ID:', data.id);
    
    // Test set default ngay
    return fetch(`http://localhost:8080/api/addresses/${data.id}/set-default-simple`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } else {
    console.log('❌ Lỗi thêm địa chỉ:', data.message || 'Unknown error');
  }
})
.then(response => {
  if (response) {
    console.log('✅ Set default status:', response.status);
    return response.json();
  }
})
.then(data => {
  if (data) {
    console.log('✅ Set default response:', data);
    
    if (data.message && data.message.includes('thành công')) {
      console.log('🎉 SET DEFAULT THÀNH CÔNG!');
      console.log('🔄 Bây giờ hãy refresh trang Profile để xem kết quả');
    } else {
      console.log('❌ Lỗi set default:', data.message || 'Unknown error');
    }
  }
})
.catch(error => {
  console.log('❌ Error:', error);
  console.log('🔍 Backend có thể chưa khởi động xong');
});

console.log('\\n📋 HƯỚNG DẪN:');
console.log('1. Script sẽ thêm địa chỉ cho user 7');
console.log('2. Sau đó test set default ngay');
console.log('3. Nếu thành công -> Refresh trang Profile');
console.log('4. Backend đang chạy ở port 8080');
`);
