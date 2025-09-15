# Hướng dẫn chức năng tìm kiếm Voucher

## 🔍 **Các tính năng tìm kiếm đã được cập nhật:**

### **1. Tìm kiếm theo tên voucher:**

- Nhập tên voucher vào ô "Tìm theo tên voucher..."
- Hỗ trợ tìm kiếm một phần tên
- Nhấn Enter hoặc click "Tìm kiếm"

### **2. Tìm kiếm theo mã voucher:**

- Nhập mã voucher vào ô "Tìm theo mã voucher..."
- Hỗ trợ tìm kiếm một phần mã
- Nhấn Enter hoặc click "Tìm kiếm"

### **3. Tìm kiếm theo trạng thái:**

- Chọn trạng thái từ dropdown:
  - "Tất cả trạng thái" - Hiển thị tất cả
  - "Hoạt động" - Chỉ voucher đang hoạt động
  - "Vô hiệu hóa" - Chỉ voucher đã vô hiệu

### **4. Tìm kiếm kết hợp:**

- Có thể kết hợp nhiều điều kiện tìm kiếm
- Ví dụ: Tên + Trạng thái, Mã + Trạng thái

### **5. Xóa bộ lọc:**

- Click "Xóa bộ lọc" để reset tất cả điều kiện
- Tự động load lại tất cả voucher

## 🚀 **Cách test chức năng tìm kiếm:**

### **Bước 1: Test bằng script**

```javascript
// Copy và chạy trong browser console:
// Nội dung từ file test_search_voucher.js
```

### **Bước 2: Test trong ứng dụng**

1. Mở trang quản lý voucher
2. Thử các tìm kiếm sau:
   - **Tìm theo tên:** Nhập "Test" hoặc tên voucher có sẵn
   - **Tìm theo mã:** Nhập "GT" hoặc "PT" để tìm voucher có mã bắt đầu bằng đó
   - **Tìm theo trạng thái:** Chọn "Hoạt động" hoặc "Vô hiệu hóa"
   - **Tìm kết hợp:** Nhập tên + chọn trạng thái

### **Bước 3: Kiểm tra kết quả**

- Xem số lượng voucher được tìm thấy
- Kiểm tra thông báo "Tìm thấy X voucher"
- Thử tìm kiếm không có kết quả

## 📋 **Kết quả mong đợi:**

### **✅ Khi tìm kiếm thành công:**

- Hiển thị danh sách voucher phù hợp
- Thông báo "Tìm thấy X voucher"
- Console log hiển thị params và response

### **✅ Khi không có kết quả:**

- Hiển thị danh sách rỗng
- Thông báo "Tìm thấy 0 voucher"
- Không có lỗi

### **✅ Khi xóa bộ lọc:**

- Hiển thị lại tất cả voucher
- Thông báo "Đã xóa bộ lọc tìm kiếm"
- Reset tất cả ô tìm kiếm

## 🔧 **Troubleshooting:**

### **Nếu tìm kiếm không hoạt động:**

1. **Kiểm tra console** - xem có lỗi gì không
2. **Kiểm tra network** - xem API call có thành công không
3. **Kiểm tra backend** - đảm bảo endpoint `/api/voucher/search` hoạt động
4. **Kiểm tra CORS** - đảm bảo CORS đã được fix

### **Nếu không có kết quả:**

1. **Kiểm tra dữ liệu** - đảm bảo có voucher trong database
2. **Kiểm tra từ khóa** - thử từ khóa khác
3. **Kiểm tra backend logs** - xem có lỗi gì không

## 📝 **Lưu ý:**

- Tìm kiếm không phân biệt hoa thường
- Hỗ trợ tìm kiếm một phần (LIKE query)
- Có thể kết hợp nhiều điều kiện
- Tự động trim khoảng trắng
- Hỗ trợ nhấn Enter để tìm kiếm
- **Hiệu ứng loading:** Hiển thị spinner và disable form khi đang tìm kiếm
- **Animation:** Fade-in effect cho kết quả tìm kiếm
- **Responsive:** Form tìm kiếm responsive trên mobile
- **Validation:** Kiểm tra input tối thiểu 2 ký tự
- **Error handling:** Xử lý các tình huống lỗi cụ thể
- **No results:** Hiển thị component gợi ý khi không tìm thấy kết quả
- **Form validation:** Kiểm tra dữ liệu trước khi gửi
- **Input constraints:** Giới hạn độ dài và giá trị hợp lệ
- **Error messages:** Thông báo lỗi chi tiết và thân thiện
