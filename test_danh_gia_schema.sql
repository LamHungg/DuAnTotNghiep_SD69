-- Script test để kiểm tra schema đánh giá sản phẩm
-- Chạy sau khi đã tạo bảng và view

-- 1. Kiểm tra bảng danh_gia
SELECT 
    'Bảng danh_gia' AS object_type,
    COUNT(*) AS column_count
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'danh_gia';
GO

-- 2. Kiểm tra các cột trong bảng
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'danh_gia'
ORDER BY ORDINAL_POSITION;
GO

-- 3. Kiểm tra constraints
SELECT 
    CONSTRAINT_NAME,
    CONSTRAINT_TYPE
FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
WHERE TABLE_NAME = 'danh_gia';
GO

-- 4. Kiểm tra indexes
SELECT 
    i.name AS index_name,
    i.type_desc AS index_type,
    STRING_AGG(c.name, ', ') AS columns
FROM sys.indexes i
INNER JOIN sys.index_columns ic ON i.object_id = ic.object_id AND i.index_id = ic.index_id
INNER JOIN sys.columns c ON ic.object_id = c.object_id AND ic.column_id = c.column_id
WHERE i.object_id = OBJECT_ID('danh_gia')
GROUP BY i.name, i.type_desc;
GO

-- 5. Kiểm tra view
SELECT 
    'View vw_thong_ke_danh_gia' AS object_type,
    COUNT(*) AS column_count
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'vw_thong_ke_danh_gia';
GO

-- 6. Kiểm tra stored procedure
SELECT 
    'Stored Procedure sp_get_danh_gia_gan_day' AS object_type,
    COUNT(*) AS parameter_count
FROM INFORMATION_SCHEMA.PARAMETERS 
WHERE SPECIFIC_NAME = 'sp_get_danh_gia_gan_day';
GO

-- 7. Kiểm tra function
SELECT 
    'Function fn_has_khach_hang_reviewed' AS object_type,
    COUNT(*) AS parameter_count
FROM INFORMATION_SCHEMA.PARAMETERS 
WHERE SPECIFIC_NAME = 'fn_has_khach_hang_reviewed';
GO

-- 8. Test thêm dữ liệu mẫu (nếu có khách hàng và sản phẩm)
IF EXISTS (SELECT 1 FROM khach_hang WHERE id = 1) AND EXISTS (SELECT 1 FROM san_pham WHERE id = 1)
BEGIN
    -- Thêm đánh giá test
    INSERT INTO danh_gia (id_khach_hang, id_san_pham, so_sao, binh_luan) 
    VALUES (1, 1, 5, 'Đánh giá test - Sản phẩm rất tốt!');
    
    PRINT 'Đã thêm đánh giá test thành công!';
    
    -- Kiểm tra dữ liệu
    SELECT 
        dg.id,
        dg.so_sao,
        dg.binh_luan,
        dg.ngay_danh_gia,
        kh.ho_ten AS ten_khach_hang,
        sp.ten_san_pham
    FROM danh_gia dg
    INNER JOIN khach_hang kh ON dg.id_khach_hang = kh.id
    INNER JOIN san_pham sp ON dg.id_san_pham = sp.id
    WHERE dg.id_khach_hang = 1 AND dg.id_san_pham = 1;
    
    -- Test view
    SELECT * FROM vw_thong_ke_danh_gia WHERE id_san_pham = 1;
    
    -- Test stored procedure
    EXEC sp_get_danh_gia_gan_day @id_san_pham = 1, @so_luong = 5;
    
    -- Test function
    SELECT dbo.fn_has_khach_hang_reviewed(1, 1) AS has_reviewed;
    
    -- Xóa dữ liệu test
    DELETE FROM danh_gia WHERE id_khach_hang = 1 AND id_san_pham = 1;
    PRINT 'Đã xóa dữ liệu test.';
END
ELSE
BEGIN
    PRINT 'Không tìm thấy khách hàng ID=1 hoặc sản phẩm ID=1 để test.';
    PRINT 'Vui lòng thêm dữ liệu mẫu vào bảng khach_hang và san_pham trước.';
END
GO

PRINT 'Kiểm tra schema đánh giá hoàn tất!';
