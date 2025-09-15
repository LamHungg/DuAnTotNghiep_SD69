# 🔧 Fix Lỗi API 400 - Test

## ✅ **Đã Sửa Thành Công**

- ✅ **Sửa `khachHangId`** - Chuyển từ `'guest'` thành `null` cho khách lẻ
- ✅ **Thêm debug logs chi tiết** - Xem response data từ API
- ✅ **Xử lý lỗi tốt hơn** - Hiển thị chi tiết lỗi 400

## 🔍 **Test Ngay Bây Giờ**

### **Bước 1: Mở POS System**

1. Truy cập: `http://localhost:3000/dashboard/pos`
2. Đăng nhập nếu cần

### **Bước 2: Tạo Đơn Hàng Test**

1. **Thêm sản phẩm** vào giỏ hàng
2. **Chọn "Khách lẻ"** (hoặc để trống)
3. **Click "Hoàn Tất Đơn Hàng"**

### **Bước 3: Theo Dõi Console Logs**

1. Mở **F12 → Console**
2. Theo dõi logs chi tiết, đặc biệt:
   - `🔍 5. Dữ liệu gửi API:` - Xem `khachHangId` có phải `null` không
   - `🔍 6. ❌ Lỗi API chi tiết:` - Xem response data từ backend

## 🎯 **Kết Quả Mong Đợi**

### **Nếu Fix Thành Công:**

```
🔍 5. Dữ liệu gửi API: {
  maDonHang: 'POS-...',
  khachHangId: null,  // ✅ Đã sửa
  voucherId: 5,
  ...
}
🔍 6. Kết quả API: {success: true, donHangId: 123}
```

### **Nếu Vẫn Có Lỗi:**

```
🔍 6. ❌ Lỗi API chi tiết:
   - Status: 400
   - Response Data: {message: "..."}  // ✅ Sẽ thấy chi tiết lỗi
```

## 📞 **Báo Cáo Kết Quả**

Hãy copy toàn bộ console logs và gửi cho tôi, đặc biệt:

- `🔍 5. Dữ liệu gửi API:`
- `🔍 6. ❌ Lỗi API chi tiết:` (nếu có)

**Điều này sẽ giúp tôi biết chính xác backend đang yêu cầu format dữ liệu như thế nào!**
