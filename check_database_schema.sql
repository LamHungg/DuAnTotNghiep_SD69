-- Script kiểm tra cấu trúc database
-- Chạy script này trong SQL Server Management Studio hoặc Azure Data Studio

-- Kiểm tra cấu trúc bảng don_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'don_hang'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra cấu trúc bảng dia_chi_khach_hang_new
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'dia_chi_khach_hang_new'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra foreign key constraints
SELECT 
    fk.name AS FK_Name,
    OBJECT_NAME(fk.parent_object_id) AS Table_Name,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS Column_Name,
    OBJECT_NAME(fk.referenced_object_id) AS Referenced_Table_Name,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS Referenced_Column_Name
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'don_hang';

-- Kiểm tra dữ liệu mẫu trong bảng don_hang
SELECT TOP 5 * FROM don_hang;

-- Kiểm tra dữ liệu mẫu trong bảng dia_chi_khach_hang_new
SELECT TOP 5 * FROM dia_chi_khach_hang_new;
