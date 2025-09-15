-- Script kiểm tra cấu trúc database thực tế
-- Chạy script này để xem tên bảng và cột thực tế

-- ========================================
-- 1. KIỂM TRA TÊN BẢNG
-- ========================================
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
AND TABLE_NAME LIKE '%dia%'
OR TABLE_NAME LIKE '%khach%'
OR TABLE_NAME LIKE '%address%'
ORDER BY TABLE_NAME;

-- ========================================
-- 2. KIỂM TRA TẤT CẢ BẢNG CÓ SẴN
-- ========================================
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- ========================================
-- 3. KIỂM TRA CẤU TRÚC BẢNG KHÁCH HÀNG
-- ========================================
-- Thử các tên bảng có thể có
SELECT 'khach_hang' as table_name, COUNT(*) as exists
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'khach_hang'
UNION ALL
SELECT 'KhachHang' as table_name, COUNT(*) as exists
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'KhachHang'
UNION ALL
SELECT 'customer' as table_name, COUNT(*) as exists
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'customer'
UNION ALL
SELECT 'Customer' as table_name, COUNT(*) as exists
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'Customer';

-- ========================================
-- 4. KIỂM TRA CẤU TRÚC BẢNG ĐỊA CHỈ
-- ========================================
-- Thử các tên bảng có thể có
SELECT 'dia_chi_khach_hang' as table_name, COUNT(*) as exists
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'dia_chi_khach_hang'
UNION ALL
SELECT 'DiaChiKhachHang' as table_name, COUNT(*) as exists
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'DiaChiKhachHang'
UNION ALL
SELECT 'dia_chi' as table_name, COUNT(*) as exists
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'dia_chi'
UNION ALL
SELECT 'DiaChi' as table_name, COUNT(*) as exists
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'DiaChi'
UNION ALL
SELECT 'address' as table_name, COUNT(*) as exists
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'address'
UNION ALL
SELECT 'Address' as table_name, COUNT(*) as exists
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'Address';

-- ========================================
-- 5. KIỂM TRA CẤU TRÚC CỘT (NẾU BẢNG TỒN TẠI)
-- ========================================
-- Kiểm tra cấu trúc bảng khach_hang (nếu tồn tại)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'khach_hang')
BEGIN
    SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'khach_hang'
    ORDER BY ORDINAL_POSITION;
END
ELSE
BEGIN
    PRINT 'Bảng khach_hang không tồn tại';
END

-- Kiểm tra cấu trúc bảng dia_chi_khach_hang (nếu tồn tại)
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang')
BEGIN
    SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'dia_chi_khach_hang'
    ORDER BY ORDINAL_POSITION;
END
ELSE
BEGIN
    PRINT 'Bảng dia_chi_khach_hang không tồn tại';
END

-- ========================================
-- 6. THỬ TÌM BẢNG VỚI TÊN KHÁC
-- ========================================
-- Tìm tất cả bảng có chứa từ khóa
SELECT TABLE_NAME
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
AND (
    TABLE_NAME LIKE '%khach%'
    OR TABLE_NAME LIKE '%customer%'
    OR TABLE_NAME LIKE '%dia%'
    OR TABLE_NAME LIKE '%address%'
    OR TABLE_NAME LIKE '%user%'
)
ORDER BY TABLE_NAME;
