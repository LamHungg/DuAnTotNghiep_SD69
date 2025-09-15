-- Kiểm tra sản phẩm ID 5
SELECT 
    ctsp.id as chi_tiet_san_pham_id,
    sp.ten_san_pham,
    ctsp.gia,
    ctsp.so_luong,
    ctsp.trang_thai,
    k.ten_kich_co,
    ms.ten_mau_sac,
    cl.ten_chat_lieu
FROM chi_tiet_san_pham ctsp
JOIN san_pham sp ON ctsp.san_pham_id = sp.id
JOIN kich_co k ON ctsp.kich_co_id = k.id
JOIN mau_sac ms ON ctsp.mau_sac_id = ms.id
JOIN chat_lieu cl ON ctsp.chat_lieu_id = cl.id
WHERE ctsp.id = 5;

-- Kiểm tra tất cả sản phẩm có sẵn (ID 5-14)
SELECT 
    ctsp.id as chi_tiet_san_pham_id,
    sp.ten_san_pham,
    ctsp.gia,
    ctsp.so_luong,
    ctsp.trang_thai,
    k.ten_kich_co,
    ms.ten_mau_sac,
    cl.ten_chat_lieu
FROM chi_tiet_san_pham ctsp
JOIN san_pham sp ON ctsp.san_pham_id = sp.id
JOIN kich_co k ON ctsp.kich_co_id = k.id
JOIN mau_sac ms ON ctsp.mau_sac_id = ms.id
JOIN chat_lieu cl ON ctsp.chat_lieu_id = cl.id
WHERE ctsp.id BETWEEN 5 AND 14
AND ctsp.trang_thai = 1
AND ctsp.so_luong > 0
ORDER BY ctsp.id;
