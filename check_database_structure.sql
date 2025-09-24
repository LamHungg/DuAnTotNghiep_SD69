-- Script để kiểm tra cấu trúc database thực tế
-- Tìm tên bảng chính xác

-- 1. Liệt kê tất cả các bảng trong database
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE' 
AND TABLE_SCHEMA = 'dbo'
ORDER BY TABLE_NAME;

-- 2. Tìm bảng có tên tương tự chi_tiet_don_hang
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE' 
AND TABLE_SCHEMA = 'dbo'
AND TABLE_NAME LIKE '%chi_tiet%'
ORDER BY TABLE_NAME;

-- 3. Tìm bảng có tên tương tự don_hang
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE' 
AND TABLE_SCHEMA = 'dbo'
AND TABLE_NAME LIKE '%don_hang%'
ORDER BY TABLE_NAME;

-- 4. Kiểm tra cấu trúc bảng don_hang nếu tồn tại
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'don_hang' AND TABLE_SCHEMA = 'dbo')
BEGIN
    SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'don_hang' 
    AND TABLE_SCHEMA = 'dbo'
    ORDER BY ORDINAL_POSITION;
END
ELSE
BEGIN
    PRINT 'Bảng don_hang không tồn tại';
END

-- 5. Tìm tất cả các bảng có thể liên quan đến đơn hàng
SELECT TABLE_NAME 
FROM INFORMATION_SCHEMA.TABLES 
WHERE TABLE_TYPE = 'BASE TABLE' 
AND TABLE_SCHEMA = 'dbo'
AND (TABLE_NAME LIKE '%don%' OR TABLE_NAME LIKE '%order%' OR TABLE_NAME LIKE '%chi_tiet%')
ORDER BY TABLE_NAME;

PRINT 'Database structure check completed!';
