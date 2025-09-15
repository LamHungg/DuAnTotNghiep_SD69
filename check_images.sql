-- Script để kiểm tra dữ liệu ảnh trong database
-- Chạy script này trong SQL Server Management Studio

-- Kiểm tra bảng hinh_anh_san_pham
SELECT 
    'hinh_anh_san_pham' as table_name,
    COUNT(*) as total_records
FROM hinh_anh_san_pham;

-- Kiểm tra ảnh theo chi tiết sản phẩm
SELECT 
    h.id,
    h.url,
    h.is_thumbnail,
    h.id_chi_tiet_san_pham,
    h.id_san_pham,
    ctsp.id as chi_tiet_san_pham_id,
    sp.ten_san_pham
FROM hinh_anh_san_pham h
LEFT JOIN chi_tiet_san_pham ctsp ON h.id_chi_tiet_san_pham = ctsp.id
LEFT JOIN san_pham sp ON h.id_san_pham = sp.id
ORDER BY h.id_chi_tiet_san_pham, h.is_thumbnail DESC;

-- Kiểm tra chi tiết sản phẩm có ảnh chính
SELECT 
    ctsp.id,
    ctsp.id_hinh_anh_san_pham,
    sp.ten_san_pham,
    ms.ten_mau_sac,
    kc.ten_kich_co,
    cl.ten_chat_lieu
FROM chi_tiet_san_pham ctsp
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
LEFT JOIN mau_sac ms ON ctsp.id_mau_sac = ms.id
LEFT JOIN kich_co kc ON ctsp.id_kich_co = kc.id
LEFT JOIN chat_lieu cl ON ctsp.id_chat_lieu = cl.id
WHERE ctsp.id_hinh_anh_san_pham IS NOT NULL
ORDER BY ctsp.id;
