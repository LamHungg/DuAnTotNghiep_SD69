-- Script tạo bảng dia_chi_khach_hang thực thay vì view
-- Chạy script này để tạo bảng có thể INSERT/UPDATE/DELETE

-- ========================================
-- 1. TẠO BẢNG DIA_CHI_KHACH_HANG THỰC
-- ========================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new')
BEGIN
    CREATE TABLE dia_chi_khach_hang_new (
        id INT IDENTITY(1,1) PRIMARY KEY,
        khach_hang_id INT NOT NULL,
        ho_ten NVARCHAR(100) NOT NULL,
        so_dien_thoai NVARCHAR(20),
        tinh_thanh NVARCHAR(100),
        quan_huyen NVARCHAR(100),
        phuong_xa NVARCHAR(100),
        dia_chi_chi_tiet NVARCHAR(255),
        loai_dia_chi NVARCHAR(50),
        mac_dinh BIT DEFAULT 0,
        ngay_tao DATETIME2 DEFAULT GETDATE(),
        ngay_cap_nhat DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id)
    );
    PRINT 'Đã tạo bảng dia_chi_khach_hang_new';
END
ELSE
BEGIN
    PRINT 'Bảng dia_chi_khach_hang_new đã tồn tại';
END

-- ========================================
-- 2. THÊM DỮ LIỆU MẪU CHO USER ID 7
-- ========================================
-- Thêm khách hàng ID 7 nếu chưa có
IF NOT EXISTS (SELECT * FROM khach_hang WHERE id = 7)
BEGIN
    INSERT INTO khach_hang (ma_khach_hang, ho_ten, so_dien_thoai, email, ten_dang_nhap, mat_khau, trang_thai_tai_khoan)
    VALUES ('KH007', 'Lam Hung', '0876743212', 'lamhung@example.com', 'lamhung@example.com', 'password123', 1);
    PRINT 'Đã thêm khách hàng ID 7';
END
ELSE
BEGIN
    PRINT 'Khách hàng ID 7 đã tồn tại';
END

-- Thêm địa chỉ mẫu cho khách hàng ID 7
IF NOT EXISTS (SELECT * FROM dia_chi_khach_hang_new WHERE khach_hang_id = 7)
BEGIN
    INSERT INTO dia_chi_khach_hang_new (khach_hang_id, ho_ten, so_dien_thoai, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet, loai_dia_chi, mac_dinh)
    VALUES (7, 'Lam Hung', '0876743212', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', '123 Đường ABC', 'Nhà riêng', 1);
    PRINT 'Đã thêm địa chỉ mẫu cho khách hàng ID 7';
END
ELSE
BEGIN
    PRINT 'Địa chỉ cho khách hàng ID 7 đã tồn tại';
END

-- ========================================
-- 3. KIỂM TRA KẾT QUẢ
-- ========================================
-- Kiểm tra bảng mới
SELECT 
    id,
    khach_hang_id,
    ho_ten,
    so_dien_thoai,
    tinh_thanh,
    quan_huyen,
    phuong_xa,
    dia_chi_chi_tiet,
    loai_dia_chi,
    mac_dinh,
    ngay_tao,
    ngay_cap_nhat
FROM dia_chi_khach_hang_new
ORDER BY khach_hang_id, mac_dinh DESC;

-- ========================================
-- 4. THỐNG KÊ
-- ========================================
SELECT 
    'Tổng số khách hàng' as metric,
    COUNT(*) as value
FROM khach_hang
UNION ALL
SELECT 
    'Tổng số địa chỉ trong bảng mới',
    COUNT(*)
FROM dia_chi_khach_hang_new
UNION ALL
SELECT 
    'Địa chỉ của user ID 7',
    COUNT(*)
FROM dia_chi_khach_hang_new
WHERE khach_hang_id = 7;

PRINT 'Script hoàn thành! Bây giờ entity có thể sử dụng bảng dia_chi_khach_hang_new';
