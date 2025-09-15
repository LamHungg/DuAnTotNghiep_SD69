console.log(`
🔍 TEST FRONTEND HEADERS - Copy và paste vào Console:

// Kiểm tra localStorage
console.log('=== KIỂM TRA LOCALSTORAGE ===');
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

// Test API với header X-User-ID
console.log('\\n=== TEST API VỚI X-User-ID HEADER ===');

fetch('http://localhost:8080/api/addresses/17/set-default', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-User-ID': currentUserId ? currentUserId.toString() : '7'
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
    console.log('\\n🔄 Bây giờ hãy refresh trang Profile và test lại chức năng đặt địa chỉ mặc định');
  } else {
    console.log('❌ Lỗi:', data.error || 'Unknown error');
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
