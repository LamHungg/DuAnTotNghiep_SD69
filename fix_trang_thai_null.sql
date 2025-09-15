-- Script để sửa trường trang_thai NULL thành 1
-- Chạy script này trong SQL Server Management Studio

-- Cập nhật tất cả chi tiết sản phẩm có trang_thai NULL thành 1
UPDATE chi_tiet_san_pham 
SET trang_thai = 1 
WHERE trang_thai IS NULL;

-- Kiểm tra kết quả
SELECT 
    'After update' as check_type,
    COUNT(*) as total_records,
    COUNT(CASE WHEN trang_thai = 1 THEN 1 END) as trang_thai_1,
    COUNT(CASE WHEN trang_thai IS NULL THEN 1 END) as trang_thai_null
FROM chi_tiet_san_pham;

-- Kiểm tra chi tiết sản phẩm ID 27
SELECT 
    'ID 27 after update' as check_type,
    ctsp.id,
    ctsp.id_san_pham,
    sp.ten_san_pham,
    ctsp.trang_thai,
    ctsp.id_hinh_anh_san_pham
FROM chi_tiet_san_pham ctsp
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
WHERE ctsp.id = 27;
