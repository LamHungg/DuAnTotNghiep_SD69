-- Script kiểm tra foreign key constraint
-- Chạy script này để kiểm tra vấn đề với foreign key

-- ========================================
-- 1. KIỂM TRA BẢNG KHÁCH HÀNG
-- ========================================
SELECT 
    'khach_hang' as table_name,
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'khach_hang') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as status;

-- Kiểm tra dữ liệu khách hàng
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'khach_hang')
BEGIN
    SELECT 
        'khach_hang data' as check_type,
        COUNT(*) as record_count
    FROM khach_hang;
    
    SELECT TOP 10
        id,
        ma_khach_hang,
        ho_ten,
        so_dien_thoai,
        email
    FROM khach_hang
    ORDER BY id;
END

-- ========================================
-- 2. KIỂM TRA BẢNG DIA_CHI_KHACH_HANG_NEW
-- ========================================
SELECT 
    'dia_chi_khach_hang_new' as table_name,
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as status;

-- Kiểm tra foreign key constraint
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new')
BEGIN
    SELECT 
        fk.name AS CONSTRAINT_NAME,
        COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS COLUMN_NAME,
        OBJECT_NAME(fk.referenced_object_id) AS REFERENCED_TABLE_NAME,
        COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS REFERENCED_COLUMN_NAME
    FROM sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
    WHERE OBJECT_NAME(fk.parent_object_id) = 'dia_chi_khach_hang_new';
    
    -- Kiểm tra dữ liệu hiện tại
    SELECT 
        'dia_chi_khach_hang_new data' as check_type,
        COUNT(*) as record_count
    FROM dia_chi_khach_hang_new;
    
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
        mac_dinh
    FROM dia_chi_khach_hang_new
    ORDER BY khach_hang_id, mac_dinh DESC;
END

-- ========================================
-- 3. KIỂM TRA FOREIGN KEY VIOLATION
-- ========================================
-- Kiểm tra xem có khach_hang_id nào không tồn tại trong bảng khach_hang không
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new')
AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'khach_hang')
BEGIN
    SELECT 
        'Foreign key violation check' as check_type,
        COUNT(*) as violation_count
    FROM dia_chi_khach_hang_new dckh
    LEFT JOIN khach_hang kh ON dckh.khach_hang_id = kh.id
    WHERE kh.id IS NULL;
    
    -- Hiển thị chi tiết violation
    SELECT 
        dckh.id as dia_chi_id,
        dckh.khach_hang_id,
        dckh.ho_ten,
        'Missing khach_hang' as issue
    FROM dia_chi_khach_hang_new dckh
    LEFT JOIN khach_hang kh ON dckh.khach_hang_id = kh.id
    WHERE kh.id IS NULL;
END

-- ========================================
-- 4. TEST INSERT ĐƠN GIẢN
-- ========================================
-- Thử insert một record đơn giản để test
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new')
AND EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'khach_hang')
BEGIN
    -- Lấy khách hàng đầu tiên
    DECLARE @test_khach_hang_id INT;
    SELECT TOP 1 @test_khach_hang_id = id FROM khach_hang ORDER BY id;
    
    IF @test_khach_hang_id IS NOT NULL
    BEGIN
        PRINT 'Testing insert with khach_hang_id: ' + CAST(@test_khach_hang_id AS VARCHAR);
        
        BEGIN TRY
            INSERT INTO dia_chi_khach_hang_new (
                khach_hang_id, 
                ho_ten, 
                so_dien_thoai, 
                tinh_thanh, 
                quan_huyen, 
                phuong_xa, 
                dia_chi_chi_tiet, 
                loai_dia_chi, 
                mac_dinh
            ) VALUES (
                @test_khach_hang_id,
                'Test User',
                '0123456789',
                'Hà Nội',
                'Cầu Giấy',
                'Dịch Vọng',
                '123 Đường Test',
                'Nhà riêng',
                0
            );
            PRINT 'Test insert SUCCESS!';
            
            -- Xóa record test
            DELETE FROM dia_chi_khach_hang_new 
            WHERE khach_hang_id = @test_khach_hang_id 
            AND ho_ten = 'Test User' 
            AND so_dien_thoai = '0123456789';
            PRINT 'Test record deleted.';
        END TRY
        BEGIN CATCH
            PRINT 'Test insert FAILED!';
            PRINT 'Error: ' + ERROR_MESSAGE();
        END CATCH
    END
    ELSE
    BEGIN
        PRINT 'No khach_hang found for testing!';
    END
END

-- ========================================
-- 5. KIỂM TRA CẤU TRÚC BẢNG
-- ========================================
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new')
BEGIN
    SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT,
        CHARACTER_MAXIMUM_LENGTH
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'dia_chi_khach_hang_new'
    ORDER BY ORDINAL_POSITION;
END

PRINT '=== HOÀN THÀNH KIỂM TRA ===';
PRINT 'Nếu test insert thành công, vấn đề có thể là với Spring Boot entity mapping.';
PRINT 'Nếu test insert thất bại, vấn đề là với database constraint.';
