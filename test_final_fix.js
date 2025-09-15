console.log(`
🚀 TEST FINAL FIX - Copy và paste vào Console:

// Test cuối cùng để fix vấn đề
console.log('=== TEST FINAL FIX ===');

// 1. Clear localStorage để fix user sync
localStorage.clear();
console.log('✅ Cleared localStorage');

// 2. Test backend status
fetch('http://localhost:8080/api/addresses/test-simple', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('✅ Backend status:', response.status);
  return response.text();
})
.then(data => {
  console.log('✅ Backend response:', data);
  
  if (data.includes('Backend đang chạy')) {
    console.log('🎉 Backend is running!');
    console.log('🔄 Now reload page and login again');
    console.log('📋 Next steps:');
    console.log('1. Reload page (F5)');
    console.log('2. Login with lamhungg05@gmail.com');
    console.log('3. Go to Profile page');
    console.log('4. Add new address if needed');
    console.log('5. Test set default address function');
  } else {
    console.log('❌ Backend not responding properly');
  }
})
.catch(error => {
  console.log('❌ Backend error:', error.message);
  console.log('🔍 Backend may not be running');
});

console.log('\\n📋 HƯỚNG DẪN:');
console.log('1. Script sẽ clear localStorage');
console.log('2. Test backend status');
console.log('3. Reload page và đăng nhập lại');
console.log('4. Test chức năng đặt địa chỉ mặc định');
`);
