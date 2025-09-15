console.log(`
🔧 TEST ADDRESS API - Copy và paste vào Console:

// Bước 1: Kiểm tra localStorage
console.log('=== BƯỚC 1: KIỂM TRA LOCALSTORAGE ===');

const userStr = localStorage.getItem("user");
const isLoggedIn = localStorage.getItem("isLoggedIn");

console.log('User data:', userStr);
console.log('Is logged in:', isLoggedIn);

let currentUserId = null;
if (userStr) {
  try {
    const userData = JSON.parse(userStr);
    currentUserId = userData.id;
    console.log('✅ Current user ID:', currentUserId);
  } catch (e) {
    console.log('❌ Error parsing user data:', e);
  }
}

// Bước 2: Test lấy danh sách địa chỉ
console.log('\\n=== BƯỚC 2: TEST LẤY DANH SÁCH ĐỊA CHỈ ===');

fetch('http://localhost:8080/api/addresses', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': currentUserId || 7
  },
  credentials: 'include'
})
.then(response => {
  console.log('Addresses response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Addresses response data:', data);
  if (response.status === 200) {
    console.log('✅ Lấy danh sách địa chỉ thành công');
    
    if (Array.isArray(data) && data.length > 0) {
      const firstAddress = data[0];
      console.log('\\n📦 KIỂM TRA ĐỊA CHỈ ĐẦU TIÊN:');
      console.log('- ID:', firstAddress.id);
      console.log('- Họ tên:', firstAddress.hoTen);
      console.log('- Số điện thoại:', firstAddress.soDienThoai);
      console.log('- Tỉnh thành:', firstAddress.tinhThanh);
      console.log('- Mặc định:', firstAddress.macDinh);
      
      // Bước 3: Test đặt địa chỉ mặc định
      console.log('\\n=== BƯỚC 3: TEST ĐẶT ĐỊA CHỈ MẶC ĐỊNH ===');
      
      return fetch(\`http://localhost:8080/api/addresses/\${firstAddress.id}/set-default\`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-ID': currentUserId || 7
        },
        credentials: 'include'
      });
    } else {
      console.log('❌ Không có địa chỉ để test');
      throw new Error('No addresses available');
    }
  } else {
    console.log('❌ Lỗi lấy danh sách địa chỉ:', data.error || 'Unknown error');
    throw new Error('Failed to get addresses');
  }
})
.then(response => {
  console.log('Set default response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Set default response data:', data);
  if (response.status === 200) {
    console.log('✅ Đặt địa chỉ mặc định thành công');
  } else {
    console.log('❌ Lỗi đặt địa chỉ mặc định:', data.error || 'Unknown error');
  }
})
.catch(error => {
  console.log('❌ Test error:', error.message);
});

// Bước 4: Test thêm địa chỉ mới
console.log('\\n=== BƯỚC 4: TEST THÊM ĐỊA CHỈ MỚI ===');

const newAddress = {
  hoTen: "Test User",
  soDienThoai: "0987654321",
  tinhThanh: "Hà Nội",
  quanHuyen: "Cầu Giấy",
  phuongXa: "Dịch Vọng",
  diaChiChiTiet: "Số 1, Trần Đăng Ninh",
  loaiDiaChi: "home",
  macDinh: false
};

fetch('http://localhost:8080/api/addresses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': currentUserId || 7
  },
  credentials: 'include',
  body: JSON.stringify(newAddress)
})
.then(response => {
  console.log('Add address response status:', response.status);
  return response.json();
})
.then(data => {
  console.log('Add address response data:', data);
  if (response.status === 200) {
    console.log('✅ Thêm địa chỉ thành công');
  } else {
    console.log('❌ Lỗi thêm địa chỉ:', data.error || 'Unknown error');
  }
})
.catch(error => {
  console.log('❌ Test error:', error.message);
});

console.log('\\n🎯 HƯỚNG DẪN:');
console.log('1. Nếu tất cả API đều trả về 200 -> Các chức năng địa chỉ sẽ hoạt động');
console.log('2. Nếu có lỗi -> Kiểm tra backend logs');
console.log('3. Refresh trang Profile để test các chức năng thực tế');
`);
