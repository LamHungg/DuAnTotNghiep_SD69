# 🔧 Khắc Phục Vấn Đề Update Voucher

## 🚨 Vấn Đề
- **Lỗi 400** khi update voucher
- **Constraint violation**: `Cannot insert the value NULL into column 'ma_voucher'`
- Voucher không thể cập nhật thông tin

## 🔍 Nguyên Nhân
1. **Frontend**: Loại bỏ `maVoucher` khỏi dữ liệu gửi đi khi update
2. **Backend**: Không xử lý trường hợp `maVoucher` null trong update
3. **Database**: Trường `ma_voucher` không cho phép NULL

## 🛠️ Giải Pháp Đã Áp Dụng

### 1. **Sửa Frontend (voucherService.js)**
```javascript
// TRƯỚC (Có lỗi):
const { maVoucher, ...dataWithoutMaVoucher } = voucherData;
const formattedData = {
  ...dataWithoutMaVoucher,
  // thiếu maVoucher
};

// SAU (Đã sửa):
const formattedData = {
  maVoucher: voucherData.maVoucher, // Giữ lại maVoucher khi update
  tenVoucher: voucherData.tenVoucher,
  // ... các trường khác
};
```

### 2. **Sửa Backend (VoucherServiceImpl.java)**
```java
// TRƯỚC (Có lỗi):
voucher.setMaVoucher(dto.getMaVoucher()); // Có thể null

// SAU (Đã sửa):
// Chỉ cập nhật maVoucher nếu được cung cấp và không rỗng
if (dto.getMaVoucher() != null && !dto.getMaVoucher().trim().isEmpty()) {
    voucher.setMaVoucher(dto.getMaVoucher());
}

// Xử lý các trường có thể null
voucher.setGiaTriToiThieu(dto.getGiaTriToiThieu() != null ? dto.getGiaTriToiThieu() : BigDecimal.ZERO);
voucher.setGiamToiDa(dto.getGiamToiDa() != null ? dto.getGiamToiDa() : BigDecimal.ZERO);
voucher.setSoLuong(dto.getSoLuong() != null ? dto.getSoLuong() : 0);
voucher.setMoTa(dto.getMoTa() != null ? dto.getMoTa() : "");
```

## 🚀 Cách Kiểm Tra

### 1. **Restart Backend**
```bash
# Dừng backend hiện tại (Ctrl+C)
# Khởi động lại backend
mvn spring-boot:run
```

### 2. **Test Update Voucher**
1. Mở trang Voucher Management
2. Mở Developer Tools (F12)
3. Vào tab Console
4. Copy và paste script `test_voucher_update.js`
5. Nhấn Enter để chạy

### 3. **Test Thủ Công**
1. Vào trang Voucher Management
2. Chọn một voucher để edit
3. Thay đổi thông tin (ví dụ: tên voucher, giá trị giảm)
4. Nhấn Save
5. Kiểm tra xem có lỗi không

## 📋 Các Trường Hợp Test

### **Test Case 1: Update thông tin cơ bản**
```javascript
const voucherData = {
  maVoucher: "VC100K",
  tenVoucher: "Giảm 100K - Updated",
  loaiGiamGia: "GIA_TIEN",
  giaTriGiam: 100000,
  giaTriToiThieu: 500000,
  giamToiDa: null,
  soLuong: 10,
  trangThai: 1,
  moTa: "Áp dụng cho đơn từ 500K - Updated",
  ngayBatDau: "2025-08-29",
  ngayKetThuc: "2025-08-31"
};
```

### **Test Case 2: Update với giá trị null**
```javascript
const voucherData = {
  maVoucher: "VC100K",
  tenVoucher: "Giảm 100K",
  loaiGiamGia: "GIA_TIEN",
  giaTriGiam: 100000,
  giaTriToiThieu: null, // Test null
  giamToiDa: null,      // Test null
  soLuong: null,        // Test null
  trangThai: 1,
  moTa: null,           // Test null
  ngayBatDau: "2025-08-29",
  ngayKetThuc: "2025-08-31"
};
```

## 🔄 Quy Trình Update Voucher

### **Frontend Process:**
1. User nhập thông tin voucher
2. Frontend validate dữ liệu
3. Gửi request PUT với đầy đủ thông tin
4. Hiển thị kết quả

### **Backend Process:**
1. Nhận request PUT
2. Validate dữ liệu
3. Tìm voucher theo ID
4. Cập nhật thông tin (xử lý null values)
5. Lưu vào database
6. Trả về kết quả

## 📝 Lưu Ý Quan Trọng

1. **maVoucher**: Không được null, phải có giá trị
2. **Các trường số**: Nếu null sẽ được set thành 0
3. **Các trường text**: Nếu null sẽ được set thành ""
4. **Ngày tháng**: Phải đúng format ISO
5. **Trạng thái**: Phải là số nguyên

## 🆘 Nếu Vẫn Gặp Lỗi

### **Kiểm tra logs:**
1. Backend console logs
2. Browser console logs
3. Network tab trong Developer Tools

### **Debug steps:**
1. Kiểm tra dữ liệu gửi đi có đúng format không
2. Kiểm tra backend có nhận được request không
3. Kiểm tra database có lỗi constraint không
4. Kiểm tra response từ backend

### **Common issues:**
- **CORS error**: Kiểm tra Cross-Origin configuration
- **Validation error**: Kiểm tra dữ liệu đầu vào
- **Database error**: Kiểm tra connection và constraints
- **Network error**: Kiểm tra kết nối backend

## 📞 Hỗ Trợ

Nếu vẫn gặp vấn đề:
1. Chụp màn hình lỗi
2. Copy logs từ console
3. Chia sẻ dữ liệu voucher đang test
4. Liên hệ để được hỗ trợ thêm
