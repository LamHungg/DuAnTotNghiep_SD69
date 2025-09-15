-- Script kiểm tra và sửa foreign key constraint trong bảng chi_tiet_don_hang
-- Chạy script này trong SQL Server Management Studio

-- 1. Kiểm tra cấu trúc bảng chi_tiet_don_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'chi_tiet_don_hang'
ORDER BY ORDINAL_POSITION;

-- 2. Kiểm tra foreign key constraints của bảng chi_tiet_don_hang
SELECT 
    fk.name AS FK_Name,
    OBJECT_NAME(fk.parent_object_id) AS Table_Name,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS Column_Name,
    OBJECT_NAME(fk.referenced_object_id) AS Referenced_Table_Name,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS Referenced_Column_Name
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'chi_tiet_don_hang';

-- 3. Kiểm tra dữ liệu trong bảng dia_chi
SELECT TOP 10 * FROM dia_chi;

-- 4. Kiểm tra dữ liệu trong bảng dia_chi_khach_hang_new
SELECT TOP 10 * FROM dia_chi_khach_hang_new;

-- 5. Xóa foreign key constraint cũ (nếu cần)
-- IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK__chi_tiet___id_di__0A9D95DB')
-- BEGIN
--     ALTER TABLE chi_tiet_don_hang DROP CONSTRAINT FK__chi_tiet___id_di__0A9D95DB;
--     PRINT 'Dropped old foreign key constraint';
-- END

-- 6. Tạo foreign key constraint mới (nếu cần)
-- IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_chi_tiet_don_hang_dia_chi_khach_hang')
-- BEGIN
--     ALTER TABLE chi_tiet_don_hang 
--     ADD CONSTRAINT FK_chi_tiet_don_hang_dia_chi_khach_hang 
--     FOREIGN KEY (id_dia_chi) REFERENCES dia_chi_khach_hang_new(id);
--     PRINT 'Added new foreign key constraint';
-- END
