-- Script thêm column id_khach_hang vào bảng don_hang
-- Chạy script này trong SQL Server Management Studio

-- 1. Thêm column id_khach_hang
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'don_hang' AND COLUMN_NAME = 'id_khach_hang')
BEGIN
    ALTER TABLE don_hang ADD id_khach_hang INT;
    PRINT 'Added id_khach_hang column';
END
ELSE
BEGIN
    PRINT 'Column id_khach_hang already exists';
END

-- 2. Tạo foreign key constraint
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_don_hang_khach_hang')
BEGIN
    ALTER TABLE don_hang 
    ADD CONSTRAINT FK_don_hang_khach_hang 
    FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id);
    PRINT 'Added foreign key constraint FK_don_hang_khach_hang';
END
ELSE
BEGIN
    PRINT 'Foreign key constraint FK_don_hang_khach_hang already exists';
END

-- 3. Kiểm tra kết quả
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'don_hang'
ORDER BY ORDINAL_POSITION;

-- 4. Kiểm tra foreign key constraints
SELECT 
    fk.name AS FK_Name,
    OBJECT_NAME(fk.parent_object_id) AS Table_Name,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS Column_Name,
    OBJECT_NAME(fk.referenced_object_id) AS Referenced_Table_Name,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS Referenced_Column_Name
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'don_hang';
