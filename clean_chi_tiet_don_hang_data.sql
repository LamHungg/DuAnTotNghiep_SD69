-- Script xóa dữ liệu cũ trong chi_tiet_don_hang và kiểm tra foreign key
-- Chạy script này trong SQL Server Management Studio

-- 1. Kiểm tra dữ liệu hiện tại trong chi_tiet_don_hang
SELECT COUNT(*) AS TotalRecords FROM chi_tiet_don_hang;
SELECT TOP 10 * FROM chi_tiet_don_hang;

-- 2. Kiểm tra các id_dia_chi không tồn tại trong dia_chi_khach_hang_new
SELECT DISTINCT ctdh.id_dia_chi
FROM chi_tiet_don_hang ctdh
LEFT JOIN dia_chi_khach_hang_new dckhn ON ctdh.id_dia_chi = dckhn.id
WHERE dckhn.id IS NULL AND ctdh.id_dia_chi IS NOT NULL;

-- 3. Xóa tất cả dữ liệu trong chi_tiet_don_hang (vì đây là dữ liệu test cũ)
DELETE FROM chi_tiet_don_hang;
PRINT '✅ Deleted all data from chi_tiet_don_hang table';

-- 4. Kiểm tra lại foreign key constraint
SELECT 
    fk.name AS FK_Name,
    OBJECT_NAME(fk.parent_object_id) AS Table_Name,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS Column_Name,
    OBJECT_NAME(fk.referenced_object_id) AS Referenced_Table_Name,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS Referenced_Column_Name
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'chi_tiet_don_hang';

-- 5. Kiểm tra bảng chi_tiet_don_hang đã trống
SELECT COUNT(*) AS RemainingRecords FROM chi_tiet_don_hang;

PRINT '=== CHI_TIET_DON_HANG DATA CLEANUP COMPLETED ===';
