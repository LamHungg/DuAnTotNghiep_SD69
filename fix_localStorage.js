console.log(`
🔧 HƯỚNG DẪN FIX LOCALSTORAGE:

1. Mở Developer Tools (F12) → Console
2. Chạy lệnh sau để force update localStorage:

   // Lấy user data từ API
   fetch('http://localhost:8080/api/auth/login', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     credentials: 'include',
     body: JSON.stringify({
       email: 'test2@example.com',
       matKhau: '123456'
     })
   })
   .then(response => response.json())
   .then(data => {
     console.log('✅ Login response:', data);
     localStorage.setItem('user', JSON.stringify(data));
     localStorage.setItem('isLoggedIn', 'true');
     console.log('✅ localStorage updated');
     console.log('🔍 Check localStorage:', localStorage.getItem('user'));
   })
   .catch(error => console.error('❌ Error:', error));

3. Sau đó thử thêm sản phẩm vào giỏ hàng

💡 Hoặc chạy lệnh đơn giản hơn:
   localStorage.setItem('user', '{"soDienThoai":"0987654321","role":"CUSTOMER","phone":"0987654321","id":11,"hoTen":"Test Customer 2","email":"test2@example.com","token":"customer-token-11"}');
   localStorage.setItem('isLoggedIn', 'true');
   console.log('✅ localStorage manually updated');
`);
