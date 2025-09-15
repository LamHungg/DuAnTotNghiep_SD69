# Hướng dẫn sửa lỗi Auto-Generate Voucher

## 🔧 **Vấn đề đã gặp:**

- Lỗi: `"Mã voucher không được để trống"`
- Nguyên nhân: Validation `@NotBlank` trong `VoucherDTO` vẫn yêu cầu mã voucher

## ✅ **Các thay đổi đã thực hiện:**

### 1. **Cập nhật VoucherDTO.java:**

- Loại bỏ `@NotBlank` validation cho `maVoucher`
- Loại bỏ `@NotNull` cho `giaTriToiThieu` và `soLuong`
- Giữ lại `@Size` validation để đảm bảo độ dài hợp lệ

### 2. **Cập nhật VoucherServiceImpl.java:**

- Thêm xử lý các trường null
- Tự động set giá trị mặc định cho các trường không bắt buộc

## 🚀 **Cách test sau khi cập nhật:**

### **Bước 1: Restart Backend**

```bash
# Dừng backend hiện tại (Ctrl+C)
# Sau đó chạy lại:
cd "DATN-FRONTEND/Website-b-n-qu-n-o-nam-ZMEN/ZMEN"
mvn spring-boot:run
```

### **Bước 2: Test bằng script**

```javascript
// Copy và chạy trong browser console:
// Nội dung từ file test_voucher_simple.js
```

### **Bước 3: Test trong ứng dụng**

1. Mở trang quản lý voucher
2. Click "Thêm Voucher"
3. Điền thông tin (không cần nhập mã voucher)
4. Click "Thêm mới"

## 📋 **Kết quả mong đợi:**

- ✅ Voucher được tạo thành công
- ✅ Mã voucher được tự động generate (format: GT202412011234)
- ✅ Không có lỗi validation

## 🔍 **Troubleshooting:**

### **Nếu vẫn gặp lỗi:**

1. **Kiểm tra backend logs** - xem có lỗi gì khác không
2. **Kiểm tra database** - đảm bảo bảng voucher có cấu trúc đúng
3. **Kiểm tra CORS** - đảm bảo CORS đã được fix

### **Format mã voucher:**

- **Giảm tiền:** `GT + YYYYMMDD + 4 ký tự ngẫu nhiên`
- **Giảm phần trăm:** `PT + YYYYMMDD + 4 ký tự ngẫu nhiên`
- **Mặc định:** `VC + YYYYMMDD + 4 ký tự ngẫu nhiên`

## 📝 **Lưu ý:**

- Mã voucher sẽ được tự động generate theo loại giảm giá
- Các trường không bắt buộc sẽ được set giá trị mặc định
- Validation vẫn được giữ lại để đảm bảo tính toàn vẹn dữ liệu
