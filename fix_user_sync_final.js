
🔧 FIX USER SYNC FINAL - Copy và paste vào Console:

// Fix vấn đề user sync cuối cùng
console.log('=== FIX USER SYNC FINAL ===');

// 1. Kiểm tra localStorage hiện tại
console.log('📋 Current localStorage:');
console.log('User:', localStorage.getItem('user'));
console.log('Token:', localStorage.getItem('token'));

// 2. Clear localStorage
localStorage.clear();
console.log('✅ Cleared localStorage');

// 3. Reload page để đăng nhập lại
console.log('🔄 Reloading page in 3 seconds...');
setTimeout(() => {
  window.location.reload();
}, 3000);

console.log('\\n📋 HƯỚNG DẪN:');
console.log('1. Page sẽ reload sau 3 giây');
console.log('2. Đăng nhập lại với lamhungg05@gmail.com');
console.log('3. Vào trang Profile');
console.log('4. Kiểm tra xem user data có đúng không');
console.log('5. Test chức năng đặt địa chỉ mặc định');
console.log('\\n🔍 Nếu vẫn lỗi, có thể cần:');
console.log('- Clear browser cache');
console.log('- Restart browser');
console.log('- Check backend status');

