# 🚀 Hướng Dẫn Test Nhanh

## ✅ Đã Sửa Lỗi

### Lỗi đã khắc phục:

- ✅ Sửa tên cột từ `id_nguoi_tao` thành `id_nhan_vien_xu_ly` trong SQL queries
- ✅ Sửa field `tongDoanhThu` từ `Long` thành `BigDecimal` trong `HieuSuatNVDto`
- ✅ Thêm endpoint test `/zmen/test`
- ✅ Sửa mapping trong `mapToNhanVienDto`
- ✅ Sửa SQL query `getThongKeThanhToan` để JOIN từ `chi_tiet_don_hang`

## 🚀 Khởi Động Backend

```bash
cd Website-b-n-qu-n-o-nam-ZMEN/ZMEN
mvn spring-boot:run
```

## 🧪 Test API

### 1. Test đơn giản:

Mở file `test-simple.html` trong browser để test từng endpoint một cách đơn giản.

### 2. Test từng endpoint:

```bash
# Test server status
curl http://localhost:8080/zmen/test

# Test tổng quan
curl http://localhost:8080/zmen/tong-quan

# Test hiệu suất nhân viên
curl "http://localhost:8080/zmen/nhan-vien/ngay?ngay=2025-08-26"

# Test thống kê thanh toán
curl "http://localhost:8080/zmen/thanh-toan/thong-ke?nam=2025&thang=8"
```

### 3. Test Frontend:

```bash
cd DATN-FRONTEND
npm start
```

## 📊 Kiểm Tra Kết Quả

1. **Backend Console:** Xem logs Spring Boot
2. **Frontend Console:** Xem network requests
3. **TestDataDisplay:** Kiểm tra nguồn dữ liệu (API/Demo)

## 🔧 Nếu Vẫn Có Lỗi

### Kiểm tra Database:

```sql
-- Kiểm tra dữ liệu
SELECT COUNT(*) FROM don_hang;
SELECT COUNT(*) FROM chi_tiet_don_hang;
SELECT COUNT(*) FROM nguoi_dung;
SELECT COUNT(*) FROM khach_hang;
SELECT COUNT(*) FROM phuong_thuc_thanh_toan;

-- Kiểm tra cột id_nhan_vien_xu_ly
SELECT TOP 5 id_don_hang, id_nhan_vien_xu_ly FROM chi_tiet_don_hang;

-- Kiểm tra cột id_phuong_thuc_thanh_toan
SELECT TOP 5 id_don_hang, id_phuong_thuc_thanh_toan FROM chi_tiet_don_hang;
```

### Kiểm tra Logs:

- Tìm lỗi "Bad Request" hoặc "400"
- Tìm lỗi SQL syntax
- Tìm lỗi database connection

## 🎯 Kết Quả Mong Đợi

- ✅ Backend chạy không lỗi
- ✅ API trả về dữ liệu thực tế
- ✅ Frontend hiển thị "🟢 Real Data from API"
- ✅ Không còn lỗi 400

## 📝 Ghi Chú

Nếu vẫn có lỗi 400, có thể do:

1. Database không có dữ liệu
2. Cột `id_nhan_vien_xu_ly` hoặc `id_phuong_thuc_thanh_toan` có giá trị NULL
3. Bảng `phuong_thuc_thanh_toan` không có dữ liệu

**Hãy test và cho tôi biết kết quả! 🚀**
