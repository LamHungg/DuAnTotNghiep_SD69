console.log(`
🔧 HƯỚNG DẪN CLEAR LOCALSTORAGE:

1. Mở Developer Tools (F12)
2. Vào tab Console
3. Chạy các lệnh sau:

   localStorage.clear();
   sessionStorage.clear();
   console.log("✅ Đã xóa localStorage và sessionStorage");

4. Refresh trang (F5)
5. Đăng nhập lại
6. Thử thêm sản phẩm vào giỏ hàng

🎯 Hoặc có thể user đang đăng nhập trên port khác?
   - Kiểm tra URL: http://localhost:3000 hoặc http://localhost:3001
   - Đảm bảo đăng nhập trên cùng port với port hiện tại

💡 Nếu vẫn lỗi, có thể cần:
   - Hard refresh (Ctrl+F5)
   - Xóa cookies cho localhost
   - Đăng nhập lại từ đầu
`);
