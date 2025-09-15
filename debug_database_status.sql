-- Script debug để kiểm tra tình trạng database hiện tại
-- Chạy script này để xem database có vấn đề gì

-- ========================================
-- 1. KIỂM TRA TẤT CẢ BẢNG CÓ SẴN
-- ========================================
SELECT 
    TABLE_NAME,
    TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- ========================================
-- 2. KIỂM TRA BẢNG KHÁCH HÀNG
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
    
    SELECT TOP 5
        id,
        ma_khach_hang,
        ho_ten,
        so_dien_thoai,
        email
    FROM khach_hang
    ORDER BY id;
END
ELSE
BEGIN
    PRINT 'Bảng khach_hang không tồn tại!';
END

-- ========================================
-- 3. KIỂM TRA BẢNG DIA_CHI_KHACH_HANG_NEW
-- ========================================
SELECT 
    'dia_chi_khach_hang_new' as table_name,
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as status;

-- Kiểm tra dữ liệu địa chỉ
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new')
BEGIN
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
ELSE
BEGIN
    PRINT 'Bảng dia_chi_khach_hang_new không tồn tại!';
END

-- ========================================
-- 4. KIỂM TRA CÁC BẢNG ĐỊA CHỈ KHÁC
-- ========================================
-- Kiểm tra bảng dia_chi
SELECT 
    'dia_chi' as table_name,
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as status;

-- Kiểm tra bảng dia_chi_khach_hang
SELECT 
    'dia_chi_khach_hang' as table_name,
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as status;

-- ========================================
-- 5. KIỂM TRA VIEW
-- ========================================
SELECT 
    'vw_dia_chi_khach_hang' as view_name,
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'vw_dia_chi_khach_hang') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as status;

-- ========================================
-- 6. KIỂM TRA CẤU TRÚC BẢNG (NẾU TỒN TẠI)
-- ========================================
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new')
BEGIN
    SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'dia_chi_khach_hang_new'
    ORDER BY ORDINAL_POSITION;
END

-- ========================================
-- 7. THỐNG KÊ TỔNG QUAN
-- ========================================
SELECT 
    'Tổng số bảng' as metric,
    COUNT(*) as value
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
UNION ALL
SELECT 
    'Tổng số view',
    COUNT(*)
FROM INFORMATION_SCHEMA.VIEWS
UNION ALL
SELECT 
    'Bảng khách hàng',
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'khach_hang') 
        THEN 1 
        ELSE 0 
    END
UNION ALL
SELECT 
    'Bảng địa chỉ mới',
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new') 
        THEN 1 
        ELSE 0 
    END;

PRINT '=== KẾT QUẢ DEBUG ===';
PRINT '1. Nếu bảng dia_chi_khach_hang_new không tồn tại, chạy create_dia_chi_khach_hang_table.sql';
PRINT '2. Nếu bảng tồn tại nhưng không có dữ liệu, chạy lại script tạo dữ liệu';
PRINT '3. Nếu có lỗi cấu trúc, kiểm tra lại entity mapping';
