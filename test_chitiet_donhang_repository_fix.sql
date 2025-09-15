-- Script test ChiTietDonHangRepository sau khi sửa lỗi findByIdDonHang
-- Chạy script này để kiểm tra dữ liệu chi tiết đơn hàng

-- Kiểm tra dữ liệu chi tiết đơn hàng
SELECT 
    ctdh.id,
    ctdh.id_don_hang,
    dh.ma_don_hang,
    ctdh.id_chi_tiet_san_pham,
    sp.ten_san_pham,
    ctdh.id_trang_thai,
    ttdh.ten_trang_thai,
    ctdh.id_khach_hang,
    kh.ho_ten as ten_khach_hang,
    ctdh.so_luong,
    ctdh.phi_van_chuyen,
    ctdh.tien_giam_gia,
    ctdh.ghi_chu_khach_hang,
    ctdh.ly_do_huy
FROM chi_tiet_don_hang ctdh
LEFT JOIN don_hang dh ON ctdh.id_don_hang = dh.id
LEFT JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
LEFT JOIN trang_thai_don_hang ttdh ON ctdh.id_trang_thai = ttdh.id
LEFT JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
ORDER BY ctdh.id_don_hang DESC, ctdh.id;

-- Kiểm tra chi tiết đơn hàng theo từng đơn hàng
SELECT 
    dh.id as id_don_hang,
    dh.ma_don_hang,
    COUNT(ctdh.id) as so_chi_tiet,
    SUM(ctdh.so_luong) as tong_so_luong,
    SUM(ctdh.so_luong * ctsp.gia) as tong_tien_hang
FROM don_hang dh
LEFT JOIN chi_tiet_don_hang ctdh ON dh.id = ctdh.id_don_hang
LEFT JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
GROUP BY dh.id, dh.ma_don_hang
ORDER BY dh.id DESC;

-- Kiểm tra chi tiết đơn hàng theo khách hàng
SELECT 
    kh.id as id_khach_hang,
    kh.ho_ten as ten_khach_hang,
    kh.so_dien_thoai,
    COUNT(DISTINCT ctdh.id_don_hang) as so_don_hang,
    SUM(ctdh.so_luong) as tong_so_luong
FROM khach_hang kh
LEFT JOIN chi_tiet_don_hang ctdh ON kh.id = ctdh.id_khach_hang
GROUP BY kh.id, kh.ho_ten, kh.so_dien_thoai
ORDER BY so_don_hang DESC;

-- Kiểm tra chi tiết đơn hàng theo sản phẩm
SELECT 
    sp.id as id_san_pham,
    sp.ten_san_pham,
    sp.ma_san_pham,
    COUNT(ctdh.id) as so_lan_mua,
    SUM(ctdh.so_luong) as tong_so_luong_ban
FROM san_pham sp
LEFT JOIN chi_tiet_san_pham ctsp ON sp.id = ctsp.id_san_pham
LEFT JOIN chi_tiet_don_hang ctdh ON ctsp.id = ctdh.id_chi_tiet_san_pham
GROUP BY sp.id, sp.ten_san_pham, sp.ma_san_pham
ORDER BY tong_so_luong_ban DESC;

-- Kiểm tra chi tiết đơn hàng theo trạng thái
SELECT 
    ttdh.id,
    ttdh.ten_trang_thai,
    COUNT(ctdh.id) as so_chi_tiet,
    COUNT(DISTINCT ctdh.id_don_hang) as so_don_hang
FROM trang_thai_don_hang ttdh
LEFT JOIN chi_tiet_don_hang ctdh ON ttdh.id = ctdh.id_trang_thai
GROUP BY ttdh.id, ttdh.ten_trang_thai
ORDER BY ttdh.id;

-- Test tạo chi tiết đơn hàng mới (nếu cần)
-- INSERT INTO chi_tiet_don_hang (id_don_hang, id_chi_tiet_san_pham, id_trang_thai, id_khach_hang, so_luong, phi_van_chuyen, tien_giam_gia)
-- VALUES (1, 1, 1, 1, 2, 30000.00, 50000.00);

-- Kiểm tra cấu trúc bảng chi_tiet_don_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'chi_tiet_don_hang'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra cấu trúc bảng don_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'don_hang'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra chi tiết đơn hàng không có đơn hàng (orphan records)
SELECT 
    ctdh.id,
    ctdh.id_don_hang,
    ctdh.id_chi_tiet_san_pham,
    ctdh.so_luong
FROM chi_tiet_don_hang ctdh
LEFT JOIN don_hang dh ON ctdh.id_don_hang = dh.id
WHERE dh.id IS NULL
ORDER BY ctdh.id;

-- Kiểm tra chi tiết đơn hàng không có chi tiết sản phẩm (orphan records)
SELECT 
    ctdh.id,
    ctdh.id_chi_tiet_san_pham,
    ctdh.id_don_hang,
    ctdh.so_luong
FROM chi_tiet_don_hang ctdh
LEFT JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
WHERE ctsp.id IS NULL
ORDER BY ctdh.id;

-- Kiểm tra chi tiết đơn hàng không có khách hàng (orphan records)
SELECT 
    ctdh.id,
    ctdh.id_khach_hang,
    ctdh.id_don_hang,
    ctdh.so_luong
FROM chi_tiet_don_hang ctdh
LEFT JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
WHERE kh.id IS NULL
ORDER BY ctdh.id;

-- Kiểm tra chi tiết đơn hàng không có trạng thái (orphan records)
SELECT 
    ctdh.id,
    ctdh.id_trang_thai,
    ctdh.id_don_hang,
    ctdh.so_luong
FROM chi_tiet_don_hang ctdh
LEFT JOIN trang_thai_don_hang ttdh ON ctdh.id_trang_thai = ttdh.id
WHERE ttdh.id IS NULL
ORDER BY ctdh.id;

-- Test API endpoints (sử dụng curl hoặc Postman)
-- GET http://localhost:8080/api/donhang/1/chitiet
-- GET http://localhost:8080/api/donhang/khachhang/1
-- GET http://localhost:8080/api/donhang
-- POST http://localhost:8080/api/donhang/add
-- PUT http://localhost:8080/api/donhang/1
-- DELETE http://localhost:8080/api/donhang/1
