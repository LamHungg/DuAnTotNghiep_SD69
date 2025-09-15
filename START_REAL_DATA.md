# 🚀 Hướng Dẫn Sử Dụng Dữ Liệu Thực Tế

## 🎯 Mục Tiêu

Chuyển từ demo data sang dữ liệu thực tế từ database thông qua API.

## 📋 Các Bước Thực Hiện

### 1. Khởi Động Backend Server

```bash
# Di chuyển đến thư mục backend
cd Website-b-n-qu-n-o-nam-ZMEN/ZMEN

# Khởi động Spring Boot application
mvn spring-boot:run
```

**Lưu ý:** Đảm bảo SQL Server đang chạy và có dữ liệu trong database.

### 2. Kiểm Tra Backend Status

Mở file `test-backend-api.html` trong browser để test các endpoint:

- ✅ Server Status: `GET /zmen/test`
- ✅ Basic Endpoints: San pham, Doanh thu, Nhan vien, Khach hang
- ✅ New Statistics: Tong quan, Bieu do, Danh muc, Thanh toan

### 3. Khởi Động Frontend

```bash
# Trong terminal khác, di chuyển đến thư mục frontend
cd DATN-FRONTEND

# Khởi động React app
npm start
```

### 4. Kiểm Tra Dữ Liệu Thực Tế

1. **Mở trang Statistics** trong browser
2. **Kiểm tra TestDataDisplay component:**
   - 🟢 Nếu hiển thị "Real Data from API" → Dữ liệu thực tế
   - 🟡 Nếu hiển thị "Demo Data (API Unavailable)" → Cần khắc phục backend

### 5. Debug Backend Issues

Nếu vẫn hiển thị demo data, kiểm tra:

#### A. Database Connection

```sql
-- Kiểm tra dữ liệu trong database
SELECT COUNT(*) FROM don_hang;
SELECT COUNT(*) FROM khach_hang;
SELECT COUNT(*) FROM san_pham;
SELECT COUNT(*) FROM chi_tiet_don_hang;
```

#### B. API Endpoints

```bash
# Test từng endpoint
curl http://localhost:8080/zmen/tong-quan
curl http://localhost:8080/zmen/san-pham/ngay?ngay=2025-08-26
curl http://localhost:8080/zmen/doanh-thu/ngay?ngay=2025-08-26
```

#### C. Spring Boot Logs

Kiểm tra console logs khi chạy `mvn spring-boot:run` để tìm lỗi.

## 🔧 Các Endpoint Đã Sửa

### Thống Kê Tổng Quan

- `GET /zmen/tong-quan` - Thống kê tổng quan
- `GET /zmen/bieu-do/doanh-thu` - Biểu đồ doanh thu
- `GET /zmen/danh-muc/doanh-thu` - Doanh thu theo danh mục
- `GET /zmen/thanh-toan/thong-ke` - Thống kê thanh toán

### Export Excel

- `GET /zmen/tong-quan/export-excel` - Xuất thống kê tổng quan
- `GET /zmen/doanh-thu/export-excel` - Xuất doanh thu
- `GET /zmen/san-pham/ngay/export-excel` - Xuất sản phẩm bán chạy

## 📊 Dữ Liệu Thực Tế Sẽ Hiển Thị

### KPI Cards

- **Doanh thu hôm nay:** Từ database thực tế
- **Doanh thu tháng:** Từ database thực tế
- **Tổng đơn hàng:** Số lượng đơn hàng thực tế
- **Tổng khách hàng:** Số lượng khách hàng thực tế

### Biểu Đồ

- **Biểu đồ doanh thu:** Dữ liệu theo thời gian thực
- **Biểu đồ danh mục:** Doanh thu theo danh mục thực tế
- **Biểu đồ thanh toán:** Thống kê phương thức thanh toán

### Bảng Dữ Liệu

- **Sản phẩm bán chạy:** Top sản phẩm thực tế
- **Hiệu suất nhân viên:** Dữ liệu nhân viên thực tế
- **Khách hàng chi tiêu:** Dữ liệu khách hàng thực tế

## 🎯 Kết Quả Mong Đợi

Sau khi hoàn thành:

1. ✅ **Backend server chạy ổn định**
2. ✅ **API endpoints trả về dữ liệu thực**
3. ✅ **Frontend hiển thị "Real Data from API"**
4. ✅ **KPI cards hiển thị số liệu thực tế**
5. ✅ **Biểu đồ và bảng hiển thị dữ liệu thực**

## 🚨 Troubleshooting

### Lỗi 400/500

- Kiểm tra database connection
- Kiểm tra SQL queries
- Restart backend server

### Không có dữ liệu

- Kiểm tra database có dữ liệu không
- Kiểm tra điều kiện WHERE trong queries
- Kiểm tra trạng thái đơn hàng (id_trang_thai = 3)

### Frontend vẫn hiển thị demo

- Kiểm tra backend có chạy không
- Kiểm tra CORS configuration
- Kiểm tra network requests trong browser dev tools

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra logs Spring Boot
2. Test API endpoints bằng `test-backend-api.html`
3. Kiểm tra database connection và dữ liệu
4. Xem console logs của frontend
