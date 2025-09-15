-- Script test DonHang sau khi sửa lỗi LocalDateTime
-- Chạy script này để kiểm tra dữ liệu đơn hàng

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

-- Kiểm tra đơn hàng mới nhất
SELECT TOP 5
    dh.id,
    dh.ma_don_hang,
    dh.loai_don_hang,
    dh.ngay_dat,
    dh.tong_tien_hang,
    dh.tong_thanh_toan,
    DATEDIFF(minute, dh.ngay_dat, GETDATE()) as phut_truoc
FROM don_hang dh
ORDER BY dh.ngay_dat DESC;

-- Kiểm tra đơn hàng theo loại
SELECT 
    CASE 
        WHEN dh.loai_don_hang = 0 THEN 'OFFLINE'
        WHEN dh.loai_don_hang = 1 THEN 'ONLINE'
        ELSE 'KHÔNG XÁC ĐỊNH'
    END as loai_don_hang_text,
    COUNT(*) as so_luong
FROM don_hang dh
GROUP BY dh.loai_don_hang;

-- Kiểm tra đơn hàng theo ngày
SELECT 
    CAST(dh.ngay_dat AS DATE) as ngay,
    COUNT(*) as so_don_hang,
    SUM(dh.tong_thanh_toan) as tong_doanh_thu
FROM don_hang dh
WHERE dh.ngay_dat >= DATEADD(day, -30, GETDATE())
GROUP BY CAST(dh.ngay_dat AS DATE)
ORDER BY ngay DESC;

-- Test tạo đơn hàng mới (nếu cần)
-- INSERT INTO don_hang (ma_don_hang, loai_don_hang, ngay_dat, tong_tien_hang, tong_thanh_toan)
-- VALUES ('DH999999', 0, GETDATE(), 0.00, 0.00);

-- Kiểm tra cấu trúc bảng don_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'don_hang'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra chi tiết đơn hàng
SELECT 
    dh.ma_don_hang,
    dh.ngay_dat,
    dh.tong_thanh_toan,
    COUNT(ctdh.id) as so_san_pham,
    SUM(ctdh.so_luong) as tong_so_luong
FROM don_hang dh
LEFT JOIN chi_tiet_don_hang ctdh ON dh.id = ctdh.id_don_hang
GROUP BY dh.id, dh.ma_don_hang, dh.ngay_dat, dh.tong_thanh_toan
ORDER BY dh.ngay_dat DESC;
