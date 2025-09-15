-- Script hoàn chỉnh để sửa database cho chức năng thêm và cập nhật hình ảnh sản phẩm
-- Chạy script này trong SQL Server Management Studio

-- 1. Thêm cột trang_thai vào bảng chi_tiet_san_pham nếu chưa có
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'chi_tiet_san_pham' AND COLUMN_NAME = 'trang_thai')
BEGIN
    ALTER TABLE chi_tiet_san_pham ADD trang_thai TINYINT DEFAULT 1;
    PRINT 'Added trang_thai column to chi_tiet_san_pham table';
END

-- 2. Thêm cột id_chi_tiet_san_pham vào bảng hinh_anh_san_pham nếu chưa có
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'hinh_anh_san_pham' AND COLUMN_NAME = 'id_chi_tiet_san_pham')
BEGIN
    ALTER TABLE hinh_anh_san_pham ADD id_chi_tiet_san_pham INT;
    PRINT 'Added id_chi_tiet_san_pham column to hinh_anh_san_pham table';
END

-- 3. Thêm cột id_san_pham vào bảng hinh_anh_san_pham nếu chưa có
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'hinh_anh_san_pham' AND COLUMN_NAME = 'id_san_pham')
BEGIN
    ALTER TABLE hinh_anh_san_pham ADD id_san_pham INT;
    PRINT 'Added id_san_pham column to hinh_anh_san_pham table';
END

-- 4. Sửa các giá trị NULL trong trang_thai thành 1
UPDATE chi_tiet_san_pham SET trang_thai = 1 WHERE trang_thai IS NULL;

-- 5. Kiểm tra và tạo foreign key constraints nếu cần
-- (Chỉ chạy nếu muốn thêm constraints)

-- 6. Kiểm tra dữ liệu sau khi sửa
SELECT 'chi_tiet_san_pham' as table_name, COUNT(*) as total_records, 
       COUNT(CASE WHEN trang_thai = 1 THEN 1 END) as trang_thai_1,
       COUNT(CASE WHEN trang_thai IS NULL THEN 1 END) as trang_thai_null
FROM chi_tiet_san_pham;

SELECT 'hinh_anh_san_pham' as table_name, COUNT(*) as total_records,
       COUNT(CASE WHEN id_chi_tiet_san_pham IS NOT NULL THEN 1 END) as has_chi_tiet_san_pham,
       COUNT(CASE WHEN id_san_pham IS NOT NULL THEN 1 END) as has_san_pham
FROM hinh_anh_san_pham;

-- 7. Kiểm tra chi tiết sản phẩm ID 27
SELECT 'Chi tiet san pham ID 27' as check_type, 
       ctsp.id, ctsp.id_san_pham, sp.ten_san_pham, 
       ctsp.trang_thai, ctsp.id_hinh_anh_san_pham
FROM chi_tiet_san_pham ctsp
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
WHERE ctsp.id = 27;

-- 8. Kiểm tra ảnh của chi tiết sản phẩm ID 27
SELECT 'Images for ID 27' as check_type, 
       h.id, h.url, h.is_thumbnail, 
       h.id_chi_tiet_san_pham, h.id_san_pham
FROM hinh_anh_san_pham h
WHERE h.id_chi_tiet_san_pham = 27;

PRINT 'Database fix completed successfully!';
