# 🔧 Hướng Dẫn Khắc Phục Vấn Đề Thống Kê

## 🚨 Vấn Đề

- **Top 10 Sản Phẩm Bán Chạy**: Không có dữ liệu hiển thị
- **Top 10 Khách Hàng**: Không có dữ liệu hiển thị

## 🔍 Nguyên Nhân Có Thể

### 1. **Không có dữ liệu đơn hàng**

- Chưa tạo đơn hàng nào trong hệ thống
- Đơn hàng chưa có trạng thái "Hoàn thành" (id_trang_thai = 5)

### 2. **Đơn hàng không có khách hàng**

- Đơn hàng được tạo với id_khach_hang = null
- Không có thông tin khách hàng trong chi_tiet_don_hang

### 3. **Không có chi tiết đơn hàng**

- Đơn hàng tồn tại nhưng không có chi_tiet_don_hang
- Chi tiết đơn hàng không có sản phẩm

### 4. **Vấn đề về trạng thái đơn hàng**

- Đơn hàng có trạng thái khác "Hoàn thành"
- Query chỉ tính các đơn hàng có trạng thái IN (1, 2, 3, 4, 5)

## 🛠️ Cách Khắc Phục

### Bước 1: Kiểm tra Backend

```bash
# Kiểm tra backend có hoạt động không
curl http://localhost:8080/zmen/test
```

### Bước 2: Chạy Script Test JavaScript

1. Mở trang Statistics trong browser
2. Mở Developer Tools (F12)
3. Vào tab Console
4. Copy và paste script `test_statistics_fix.js`
5. Nhấn Enter để chạy

### Bước 3: Chạy Script SQL

1. Mở SQL Server Management Studio
2. Kết nối đến database `abcd7`
3. Chạy script `fix_statistics_data.sql`
4. Kiểm tra kết quả

### Bước 4: Tạo Dữ Liệu Test (Nếu Cần)

1. Copy và paste script `create_test_data.js` vào Console
2. Script sẽ tự động tạo dữ liệu test nếu cần

## 📊 Kiểm Tra Dữ Liệu

### 1. Kiểm tra đơn hàng

```sql
-- Kiểm tra tổng số đơn hàng
SELECT COUNT(*) FROM don_hang;

-- Kiểm tra đơn hàng hôm nay
SELECT COUNT(*) FROM don_hang
WHERE CAST(ngay_dat AS DATE) = CAST(GETDATE() AS DATE);
```

### 2. Kiểm tra trạng thái đơn hàng

```sql
-- Xem các trạng thái đơn hàng
SELECT * FROM trang_thai_don_hang;

-- Kiểm tra đơn hàng theo trạng thái
SELECT
    ttdh.ten_trang_thai,
    COUNT(ctdh.id_don_hang) AS SoDonHang
FROM chi_tiet_don_hang ctdh
JOIN trang_thai_don_hang ttdh ON ctdh.id_trang_thai = ttdh.id
GROUP BY ttdh.ten_trang_thai, ttdh.id
ORDER BY ttdh.id;
```

### 3. Kiểm tra khách hàng

```sql
-- Kiểm tra đơn hàng có khách hàng
SELECT
    COUNT(*) AS TongDonHang,
    COUNT(id_khach_hang) AS DonHangCoKhachHang,
    COUNT(*) - COUNT(id_khach_hang) AS DonHangKhongCoKhachHang
FROM chi_tiet_don_hang;
```

## 🎯 Giải Pháp Cụ Thể

### Nếu không có đơn hàng:

1. **Tạo đơn hàng qua POS**:

   - Vào trang POS
   - Chọn sản phẩm
   - Chọn khách hàng
   - Hoàn thành đơn hàng

2. **Tạo đơn hàng test qua SQL**:

```sql
-- Tạo đơn hàng test
INSERT INTO don_hang (ma_don_hang, loai_don_hang, ngay_dat, tong_tien_hang, tong_thanh_toan)
VALUES ('DH001', 0, GETDATE(), 500000, 500000);

-- Tạo chi tiết đơn hàng test
INSERT INTO chi_tiet_don_hang (
    id_don_hang,
    id_chi_tiet_san_pham,
    id_trang_thai,
    id_khach_hang,
    id_dia_chi,
    so_luong
)
VALUES (
    (SELECT id FROM don_hang WHERE ma_don_hang = 'DH001'),
    (SELECT TOP 1 id FROM chi_tiet_san_pham),
    5, -- Trạng thái hoàn thành
    (SELECT TOP 1 id FROM khach_hang),
    (SELECT TOP 1 id FROM dia_chi),
    2
);
```

### Nếu đơn hàng chưa có trạng thái "Hoàn thành":

```sql
-- Cập nhật trạng thái đơn hàng thành "Hoàn thành"
UPDATE chi_tiet_don_hang
SET id_trang_thai = 5
WHERE id_trang_thai IS NULL OR id_trang_thai != 5;
```

### Nếu đơn hàng không có khách hàng:

```sql
-- Cập nhật khách hàng cho đơn hàng
UPDATE chi_tiet_don_hang
SET id_khach_hang = (SELECT TOP 1 id FROM khach_hang)
WHERE id_khach_hang IS NULL;
```

## 🔄 Kiểm Tra Lại Sau Khi Sửa

### 1. Kiểm tra API endpoints:

```javascript
// Kiểm tra top sản phẩm
fetch("http://localhost:8080/zmen/san-pham/ngay?ngay=2025-01-27")
  .then((response) => response.json())
  .then((data) => console.log("Top sản phẩm:", data));

// Kiểm tra top khách hàng
fetch("http://localhost:8080/zmen/khach-hang/ngay?ngay=2025-01-27")
  .then((response) => response.json())
  .then((data) => console.log("Top khách hàng:", data));
```

### 2. Refresh trang Statistics:

- Nhấn F5 để refresh trang
- Kiểm tra lại phần "Top 10 Sản Phẩm Bán Chạy" và "Top 10 Khách Hàng"

## 📝 Lưu Ý Quan Trọng

1. **Trạng thái đơn hàng**: Chỉ tính các đơn hàng có trạng thái IN (1, 2, 3, 4, 5)
2. **Khách hàng**: Đơn hàng phải có id_khach_hang để hiển thị trong top khách hàng
3. **Sản phẩm**: Phải có chi_tiet_don_hang với sản phẩm để hiển thị trong top sản phẩm
4. **Thời gian**: Dữ liệu được tính theo ngày/tháng/năm được chọn

## 🆘 Nếu Vẫn Không Hoạt Động

1. **Kiểm tra logs backend**: Xem có lỗi gì trong console của backend không
2. **Kiểm tra network**: Xem các API calls có thành công không trong Developer Tools
3. **Kiểm tra database**: Đảm bảo dữ liệu đã được lưu đúng trong database
4. **Restart backend**: Khởi động lại backend nếu cần

## 📞 Hỗ Trợ

Nếu vẫn gặp vấn đề, hãy:

1. Chụp màn hình lỗi
2. Copy logs từ console
3. Chia sẻ kết quả từ script test
4. Liên hệ để được hỗ trợ thêm
