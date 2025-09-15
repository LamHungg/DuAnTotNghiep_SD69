-- Script sửa lỗi cuối cùng - xóa dữ liệu còn lại và tạo foreign key constraint
-- Chạy script này trong SQL Server Management Studio

-- 1. Xóa dữ liệu còn lại trong chi_tiet_don_hang
DELETE FROM chi_tiet_don_hang WHERE id_dia_chi IN (2, 4);
PRINT '✅ Deleted remaining orphaned records';

-- 2. Kiểm tra lại
SELECT COUNT(*) AS RemainingRecords FROM chi_tiet_don_hang;

-- 3. Tạo foreign key constraint cho id_dia_chi (nếu chưa có)
IF NOT EXISTS (
    SELECT * FROM sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
    WHERE OBJECT_NAME(fk.parent_object_id) = 'chi_tiet_don_hang' 
    AND COL_NAME(fkc.parent_object_id, fkc.parent_column_id) = 'id_dia_chi'
)
BEGIN
    ALTER TABLE chi_tiet_don_hang 
    ADD CONSTRAINT FK_chi_tiet_don_hang_dia_chi_khach_hang 
    FOREIGN KEY (id_dia_chi) REFERENCES dia_chi_khach_hang_new(id);
    PRINT '✅ Created foreign key constraint for id_dia_chi';
END
ELSE
BEGIN
    PRINT '✅ Foreign key constraint for id_dia_chi already exists';
END

-- 4. Kiểm tra tất cả foreign key constraints
SELECT 
    fk.name AS FK_Name,
    OBJECT_NAME(fk.parent_object_id) AS Table_Name,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS Column_Name,
    OBJECT_NAME(fk.referenced_object_id) AS Referenced_Table_Name,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS Referenced_Column_Name
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'chi_tiet_don_hang'
ORDER BY COL_NAME(fkc.parent_object_id, fkc.parent_column_id);

-- 5. Kiểm tra địa chỉ ID 15 tồn tại
SELECT id, khach_hang_id, ho_ten, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet
FROM dia_chi_khach_hang_new 
WHERE id = 15;

PRINT '=== FINAL FOREIGN KEY FIX COMPLETED ===';
