-- Script test DonHangMapper sau khi sửa lỗi getIdDonHang
-- Chạy script này để kiểm tra dữ liệu đơn hàng và chi tiết đơn hàng

-- Kiểm tra dữ liệu đơn hàng
SELECT 
    dh.id,
    dh.ma_don_hang,
    dh.loai_don_hang,
    dh.ngay_dat,
    dh.tong_tien_hang,
    dh.tong_thanh_toan
FROM don_hang dh
ORDER BY dh.ngay_dat DESC;

-- Kiểm tra chi tiết đơn hàng
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

-- Kiểm tra lịch sử đơn hàng
SELECT 
    lsdh.id,
    lsdh.id_don_hang,
    dh.ma_don_hang,
    lsdh.id_trang_thai_cu,
    ttdh_cu.ten_trang_thai as trang_thai_cu,
    lsdh.id_trang_thai_moi,
    ttdh_moi.ten_trang_thai as trang_thai_moi,
    lsdh.id_nguoi_cap_nhat,
    nd.ho_ten as ten_nguoi_cap_nhat,
    lsdh.thoi_gian_cap_nhat,
    lsdh.ghi_chu
FROM lich_su_don_hang lsdh
LEFT JOIN don_hang dh ON lsdh.id_don_hang = dh.id
LEFT JOIN trang_thai_don_hang ttdh_cu ON lsdh.id_trang_thai_cu = ttdh_cu.id
LEFT JOIN trang_thai_don_hang ttdh_moi ON lsdh.id_trang_thai_moi = ttdh_moi.id
LEFT JOIN nguoi_dung nd ON lsdh.id_nguoi_cap_nhat = nd.id
ORDER BY lsdh.id_don_hang DESC, lsdh.thoi_gian_cap_nhat DESC;

-- Kiểm tra đơn hàng theo trạng thái
SELECT 
    ttdh.id,
    ttdh.ten_trang_thai,
    COUNT(ctdh.id) as so_don_hang
FROM trang_thai_don_hang ttdh
LEFT JOIN chi_tiet_don_hang ctdh ON ttdh.id = ctdh.id_trang_thai
GROUP BY ttdh.id, ttdh.ten_trang_thai
ORDER BY ttdh.id;

-- Kiểm tra đơn hàng theo khách hàng
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

-- Test tạo đơn hàng mới (nếu cần)
-- INSERT INTO don_hang (ma_don_hang, loai_don_hang, ngay_dat, tong_tien_hang, tong_thanh_toan)
-- VALUES ('DH999999', 0, GETDATE(), 500000.00, 500000.00);

-- Test tạo chi tiết đơn hàng mới (nếu cần)
-- INSERT INTO chi_tiet_don_hang (id_don_hang, id_chi_tiet_san_pham, id_trang_thai, id_khach_hang, so_luong, phi_van_chuyen, tien_giam_gia)
-- VALUES (1, 1, 1, 1, 2, 30000.00, 50000.00);

-- Kiểm tra cấu trúc bảng don_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'don_hang'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra cấu trúc bảng chi_tiet_don_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'chi_tiet_don_hang'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra cấu trúc bảng lich_su_don_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'lich_su_don_hang'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra đơn hàng không có chi tiết
SELECT 
    dh.id,
    dh.ma_don_hang,
    dh.ngay_dat,
    dh.tong_tien_hang
FROM don_hang dh
LEFT JOIN chi_tiet_don_hang ctdh ON dh.id = ctdh.id_don_hang
WHERE ctdh.id IS NULL
ORDER BY dh.id;

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
