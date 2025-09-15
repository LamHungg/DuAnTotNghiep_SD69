-- Script để kiểm tra dữ liệu thực tế trong database
-- Chạy script này trong SQL Server Management Studio

-- 1. Kiểm tra tất cả chi tiết sản phẩm
SELECT 
    'All chi tiet san pham' as check_type,
    COUNT(*) as total_count,
    MIN(id) as min_id,
    MAX(id) as max_id
FROM chi_tiet_san_pham;

-- 2. Kiểm tra chi tiết sản phẩm ID 27
SELECT 
    'Chi tiet san pham ID 27' as check_type,
    ctsp.id,
    ctsp.id_san_pham,
    sp.ten_san_pham,
    ctsp.trang_thai,
    ctsp.id_hinh_anh_san_pham
FROM chi_tiet_san_pham ctsp
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
WHERE ctsp.id = 27;

-- 3. Kiểm tra các ID gần 27
SELECT 
    'IDs around 27' as check_type,
    ctsp.id,
    ctsp.id_san_pham,
    sp.ten_san_pham,
    ctsp.trang_thai
FROM chi_tiet_san_pham ctsp
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
WHERE ctsp.id BETWEEN 25 AND 30
ORDER BY ctsp.id;

-- 4. Kiểm tra sản phẩm ID 25
SELECT 
    'San pham ID 25' as check_type,
    sp.id,
    sp.ten_san_pham,
    sp.ma_san_pham,
    sp.trang_thai
FROM san_pham sp
WHERE sp.id = 25;

-- 5. Kiểm tra tất cả sản phẩm
SELECT 
    'All san pham' as check_type,
    COUNT(*) as total_count,
    MIN(id) as min_id,
    MAX(id) as max_id
FROM san_pham;
