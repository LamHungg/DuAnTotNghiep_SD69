-- Script sửa foreign key constraint trong bảng chi_tiet_don_hang
-- Chạy script này trong SQL Server Management Studio

-- 1. Xóa foreign key constraint cũ
IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK__chi_tiet___id_di__0A9D95DB')
BEGIN
    ALTER TABLE chi_tiet_don_hang DROP CONSTRAINT FK__chi_tiet___id_di__0A9D95DB;
    PRINT '✅ Dropped old foreign key constraint FK__chi_tiet___id_di__0A9D95DB';
END
ELSE
BEGIN
    PRINT '❌ Foreign key constraint FK__chi_tiet___id_di__0A9D95DB not found';
END

-- 2. Tạo foreign key constraint mới
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_chi_tiet_don_hang_dia_chi_khach_hang')
BEGIN
    ALTER TABLE chi_tiet_don_hang 
    ADD CONSTRAINT FK_chi_tiet_don_hang_dia_chi_khach_hang 
    FOREIGN KEY (id_dia_chi) REFERENCES dia_chi_khach_hang_new(id);
    PRINT '✅ Added new foreign key constraint FK_chi_tiet_don_hang_dia_chi_khach_hang';
END
ELSE
BEGIN
    PRINT '❌ Foreign key constraint FK_chi_tiet_don_hang_dia_chi_khach_hang already exists';
END

-- 3. Kiểm tra kết quả
SELECT 
    fk.name AS FK_Name,
    OBJECT_NAME(fk.parent_object_id) AS Table_Name,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS Column_Name,
    OBJECT_NAME(fk.referenced_object_id) AS Referenced_Table_Name,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS Referenced_Column_Name
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'chi_tiet_don_hang';

PRINT '=== FOREIGN KEY CONSTRAINT FIX COMPLETED ===';
