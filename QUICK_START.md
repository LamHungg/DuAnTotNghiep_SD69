# 🚀 Hướng Dẫn Khởi Động Nhanh

## ✅ Đã Sửa Lỗi Backend

### Lỗi đã khắc phục:

- ✅ Thêm method `getThongKeTongQuan()` vào service
- ✅ Sửa lỗi type mismatch trong ThongKeImpl
- ✅ Thêm field `doanhThu` vào `SanPhamBanChayDto`
- ✅ Cập nhật SQL queries để bao gồm doanh thu
- ✅ Sửa lỗi `getDoanhThu()` method không tồn tại
- ✅ Thêm method `exportTongQuanToExcel()` vào ExcelExportUtil
- ✅ Cập nhật method `exportSanPhamBanChayToExcel()` để bao gồm doanh thu
- ✅ Sửa lỗi SQL queries trong repository

## 🚨 Vấn Đề Hiện Tại

Có lỗi 400 (Bad Request) từ các endpoint:

- `/zmen/bieu-do/doanh-thu`
- `/zmen/thanh-toan/thong-ke`
- `/zmen/nhan-vien/ngay`

## 🚀 Khởi Động Backend

```bash
# Di chuyển đến thư mục backend
cd Website-b-n-qu-n-o-nam-ZMEN/ZMEN

# Khởi động Spring Boot
mvn spring-boot:run
```

## 🚀 Khởi Động Frontend

```bash
# Trong terminal khác, di chuyển đến thư mục frontend
cd DATN-FRONTEND

# Khởi động React app
npm start
```

## 🧪 Test API

### 1. Test đơn giản:

Mở file `test-backend-simple.html` trong browser để test:

1. **Server Status** - Kiểm tra backend có chạy không
2. **Basic Endpoints** - Test các API cơ bản
3. **New Endpoints** - Test các API thống kê mới

### 2. Test chi tiết:

Mở file `test-backend-api.html` trong browser để test chi tiết hơn.

## 📊 Kiểm Tra Dữ Liệu Thực Tế

1. Mở trang Statistics trong browser
2. Xem TestDataDisplay component:
   - 🟢 **"Real Data from API"** = Dữ liệu thực tế
   - 🟡 **"Demo Data (API Unavailable)"** = Cần khắc phục

## 🔧 Debug Lỗi 400

### Kiểm tra database:

```sql
-- Kiểm tra dữ liệu trong database
SELECT COUNT(*) FROM don_hang;
SELECT COUNT(*) FROM khach_hang;
SELECT COUNT(*) FROM san_pham;
SELECT COUNT(*) FROM chi_tiet_don_hang;
SELECT COUNT(*) FROM danh_muc;
SELECT COUNT(*) FROM phuong_thuc_thanh_toan;

-- Kiểm tra dữ liệu mẫu
SELECT TOP 5 * FROM don_hang;
SELECT TOP 5 * FROM chi_tiet_don_hang;
```

### Kiểm tra logs Spring Boot:

- Xem console khi chạy `mvn spring-boot:run`
- Tìm lỗi database connection hoặc SQL
- Tìm lỗi "Bad Request" hoặc "400"

### Test từng endpoint:

```bash
# Test endpoint cơ bản
curl http://localhost:8080/zmen/tong-quan

# Test endpoint có lỗi
curl "http://localhost:8080/zmen/bieu-do/doanh-thu?loai=ngay&nam=2025&thang=8"
curl "http://localhost:8080/zmen/thanh-toan/thong-ke?nam=2025&thang=8"
```

## 🎯 Giải Pháp Tạm Thời

Nếu backend vẫn có lỗi 400, frontend đã được cấu hình để:

1. **Hiển thị demo data** khi API không khả dụng
2. **Log errors** để debug
3. **Fallback gracefully** không crash ứng dụng

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra SQL Server có chạy không
2. Kiểm tra database có dữ liệu không
3. Restart backend server
4. Xem logs Spring Boot
5. Sử dụng file test để debug từng endpoint

**Backend đã được sửa lỗi cơ bản, nhưng cần debug thêm các lỗi 400! 🔧**
