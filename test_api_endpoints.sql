-- Script để test các API endpoints
-- Chạy script này để kiểm tra dữ liệu trước khi test API

-- 1. Kiểm tra bảng chi_tiet_san_pham
SELECT 
    'chi_tiet_san_pham table' as table_name,
    COUNT(*) as total_records,
    MIN(id) as min_id,
    MAX(id) as max_id
FROM chi_tiet_san_pham;

-- 2. Kiểm tra bảng san_pham
SELECT 
    'san_pham table' as table_name,
    COUNT(*) as total_records,
    MIN(id) as min_id,
    MAX(id) as max_id
FROM san_pham;

-- 3. Kiểm tra quan hệ giữa chi_tiet_san_pham và san_pham
SELECT 
    sp.id as san_pham_id,
    sp.ten_san_pham,
    sp.ma_san_pham,
    COUNT(ctsp.id) as so_chi_tiet
FROM san_pham sp
LEFT JOIN chi_tiet_san_pham ctsp ON sp.id = ctsp.id_san_pham
GROUP BY sp.id, sp.ten_san_pham, sp.ma_san_pham
ORDER BY sp.id;

-- 4. Kiểm tra chi tiết sản phẩm theo sản phẩm cụ thể
-- Thay đổi ID sản phẩm ở đây để test
SELECT 
    ctsp.id,
    ctsp.id_san_pham,
    sp.ten_san_pham,
    ctsp.id_mau_sac,
    ms.ten_mau_sac,
    ctsp.id_kich_co,
    kc.ten_kich_co,
    ctsp.id_chat_lieu,
    cl.ten_chat_lieu,
    ctsp.so_luong,
    ctsp.gia,
    ctsp.gia_nhap,
    ctsp.trang_thai
FROM chi_tiet_san_pham ctsp
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
LEFT JOIN mau_sac ms ON ctsp.id_mau_sac = ms.id
LEFT JOIN kich_co kc ON ctsp.id_kich_co = kc.id
LEFT JOIN chat_lieu cl ON ctsp.id_chat_lieu = cl.id
WHERE ctsp.id_san_pham = 1  -- Thay đổi ID sản phẩm ở đây
ORDER BY ctsp.id;
