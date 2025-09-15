-- Script để kiểm tra dữ liệu API
-- Chạy script này để xem dữ liệu mà API sẽ trả về

-- 1. Kiểm tra chi tiết sản phẩm ID 27
SELECT 
    'Chi tiet san pham ID 27' as check_type,
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
WHERE ctsp.id = 27;

-- 2. Kiểm tra ảnh của chi tiết sản phẩm ID 27
SELECT 
    'Images for chi tiet san pham ID 27' as check_type,
    h.id,
    h.url,
    h.is_thumbnail,
    h.id_chi_tiet_san_pham,
    h.id_san_pham
FROM hinh_anh_san_pham h
WHERE h.id_chi_tiet_san_pham = 27;

-- 3. Kiểm tra tất cả chi tiết sản phẩm của sản phẩm ID 25 (sản phẩm của chi tiết ID 27)
SELECT 
    'All chi tiet san pham for san pham ID 25' as check_type,
    ctsp.id,
    ctsp.id_san_pham,
    sp.ten_san_pham,
    ctsp.trang_thai,
    ctsp.id_hinh_anh_san_pham
FROM chi_tiet_san_pham ctsp
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
WHERE ctsp.id_san_pham = 25
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
