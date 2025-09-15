-- Kiểm tra dữ liệu sản phẩm trong database
USE DATN23_7;

-- Kiểm tra bảng chi_tiet_san_pham
SELECT 
    cts.id,
    cts.ma_chi_tiet_san_pham,
    sp.ten_san_pham,
    cts.gia,
    cts.so_luong_ton,
    cts.trang_thai
FROM chi_tiet_san_pham cts
JOIN san_pham sp ON cts.san_pham_id = sp.id
ORDER BY cts.id;

-- Kiểm tra sản phẩm có ID 18
SELECT 
    cts.id,
    cts.ma_chi_tiet_san_pham,
    sp.ten_san_pham,
    cts.gia,
    cts.so_luong_ton,
    cts.trang_thai
FROM chi_tiet_san_pham cts
JOIN san_pham sp ON cts.san_pham_id = sp.id
WHERE cts.id = 18;

-- Kiểm tra tất cả sản phẩm có sẵn
SELECT 
    cts.id,
    cts.ma_chi_tiet_san_pham,
    sp.ten_san_pham,
    cts.gia,
    cts.so_luong_ton,
    cts.trang_thai
FROM chi_tiet_san_pham cts
JOIN san_pham sp ON cts.san_pham_id = sp.id
WHERE cts.trang_thai = 1 AND cts.so_luong_ton > 0
ORDER BY cts.id;

-- Đếm tổng số sản phẩm
SELECT COUNT(*) as total_products FROM chi_tiet_san_pham;
SELECT COUNT(*) as active_products FROM chi_tiet_san_pham WHERE trang_thai = 1;
