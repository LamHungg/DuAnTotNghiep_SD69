-- Script để debug chi tiết sản phẩm
-- Chạy script này trong SQL Server Management Studio

-- Kiểm tra tất cả chi tiết sản phẩm
SELECT 
    ctsp.id,
    ctsp.id_san_pham,
    sp.ten_san_pham,
    sp.ma_san_pham,
    ctsp.id_mau_sac,
    ms.ten_mau_sac,
    ctsp.id_kich_co,
    kc.ten_kich_co,
    ctsp.id_chat_lieu,
    cl.ten_chat_lieu,
    ctsp.so_luong,
    ctsp.gia,
    ctsp.gia_nhap,
    ctsp.trang_thai,
    ctsp.id_hinh_anh_san_pham
FROM chi_tiet_san_pham ctsp
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
LEFT JOIN mau_sac ms ON ctsp.id_mau_sac = ms.id
LEFT JOIN kich_co kc ON ctsp.id_kich_co = kc.id
LEFT JOIN chat_lieu cl ON ctsp.id_chat_lieu = cl.id
ORDER BY ctsp.id;

-- Kiểm tra chi tiết sản phẩm có ID 27
SELECT 
    'Checking ID 27' as check_type,
    ctsp.id,
    ctsp.id_san_pham,
    sp.ten_san_pham,
    ctsp.trang_thai
FROM chi_tiet_san_pham ctsp
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
WHERE ctsp.id = 27;

-- Kiểm tra ID lớn nhất trong bảng
SELECT 
    'Max ID' as check_type,
    MAX(id) as max_id,
    COUNT(*) as total_records
FROM chi_tiet_san_pham;

-- Kiểm tra các ID gần 27
SELECT 
    'IDs around 27' as check_type,
    ctsp.id,
    ctsp.id_san_pham,
    sp.ten_san_pham
FROM chi_tiet_san_pham ctsp
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
WHERE ctsp.id BETWEEN 20 AND 35
ORDER BY ctsp.id;
