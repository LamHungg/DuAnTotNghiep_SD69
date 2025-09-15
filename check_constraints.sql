-- Script kiểm tra và sửa foreign key constraints
-- Chạy script này trong SQL Server Management Studio

-- 1. Kiểm tra foreign key constraints hiện tại
SELECT 
    fk.name AS constraint_name,
    OBJECT_NAME(fk.parent_object_id) AS table_name,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS column_name,
    OBJECT_NAME(fk.referenced_object_id) AS referenced_table_name,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS referenced_column_name,
    fk.delete_referential_action_desc AS delete_action,
    fk.update_referential_action_desc AS update_action
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'chi_tiet_san_pham'
   OR OBJECT_NAME(fk.parent_object_id) = 'hinh_anh_san_pham'
   OR OBJECT_NAME(fk.referenced_object_id) = 'chi_tiet_san_pham'
   OR OBJECT_NAME(fk.referenced_object_id) = 'hinh_anh_san_pham';

-- 2. Kiểm tra dữ liệu ảnh hiện tại
SELECT 'Current images for chi tiet san pham ID 29' as check_type,
       h.id, h.url, h.is_thumbnail,
       h.id_chi_tiet_san_pham, h.id_san_pham
FROM hinh_anh_san_pham h
WHERE h.id_chi_tiet_san_pham = 29;

-- 3. Kiểm tra chi tiết sản phẩm ID 29
SELECT 'Chi tiet san pham ID 29' as check_type,
       ctsp.id, ctsp.id_san_pham, ctsp.id_hinh_anh_san_pham,
       ctsp.trang_thai
FROM chi_tiet_san_pham ctsp
WHERE ctsp.id = 29;

-- 4. Nếu cần, xóa constraint có vấn đề (chỉ chạy nếu cần thiết)
-- Thay thế [CONSTRAINT_NAME] bằng tên constraint thực tế từ kết quả câu 1
-- ALTER TABLE chi_tiet_san_pham DROP CONSTRAINT [CONSTRAINT_NAME];

-- 5. Tạo constraint mới với CASCADE DELETE (nếu cần)
-- ALTER TABLE chi_tiet_san_pham 
-- ADD CONSTRAINT FK_chi_tiet_san_pham_hinh_anh_san_pham 
-- FOREIGN KEY (id_hinh_anh_san_pham) 
-- REFERENCES hinh_anh_san_pham(id) 
-- ON DELETE SET NULL;

PRINT 'Constraint check completed!';
