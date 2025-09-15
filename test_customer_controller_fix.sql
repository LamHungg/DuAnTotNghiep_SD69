-- Script test CustomerController sau khi sửa lỗi LocalDate
-- Chạy script này để kiểm tra dữ liệu voucher và khuyến mãi

-- Kiểm tra dữ liệu voucher
SELECT 
    v.id,
    v.ma_voucher,
    v.ten_voucher,
    v.loai_giam_gia,
    v.gia_tri_giam,
    v.gia_tri_toi_thieu,
    v.giam_toi_da,
    v.so_luong,
    v.ngay_bat_dau,
    v.ngay_ket_thuc,
    v.trang_thai,
    v.mo_ta,
    -- Tính ngày còn lại
    CASE 
        WHEN v.ngay_ket_thuc IS NOT NULL THEN 
            DATEDIFF(day, GETDATE(), v.ngay_ket_thuc)
        ELSE NULL
    END as ngay_con_lai
FROM voucher v
WHERE v.trang_thai = 1
ORDER BY v.ngay_ket_thuc;

-- Kiểm tra voucher đang hoạt động
SELECT 
    v.id,
    v.ma_voucher,
    v.ten_voucher,
    v.trang_thai,
    v.ngay_bat_dau,
    v.ngay_ket_thuc,
    CASE 
        WHEN v.ngay_ket_thuc < GETDATE() THEN 'HẾT HẠN'
        WHEN v.ngay_bat_dau > GETDATE() THEN 'CHƯA BẮT ĐẦU'
        ELSE 'ĐANG HOẠT ĐỘNG'
    END as trang_thai_ngay
FROM voucher v
WHERE v.trang_thai = 1
ORDER BY v.ngay_ket_thuc;

-- Kiểm tra dữ liệu khuyến mãi
SELECT 
    km.id,
    km.ma_khuyen_mai,
    km.ten_khuyen_mai,
    km.phan_tram_giam,
    km.ngay_bat_dau,
    km.ngay_ket_thuc,
    km.trang_thai,
    km.mo_ta,
    -- Tính ngày còn lại
    CASE 
        WHEN km.ngay_ket_thuc IS NOT NULL THEN 
            DATEDIFF(day, GETDATE(), km.ngay_ket_thuc)
        ELSE NULL
    END as ngay_con_lai
FROM khuyen_mai km
WHERE km.trang_thai = 1
ORDER BY km.ngay_ket_thuc;

-- Kiểm tra khuyến mãi đang hoạt động
SELECT 
    km.id,
    km.ma_khuyen_mai,
    km.ten_khuyen_mai,
    km.trang_thai,
    km.ngay_bat_dau,
    km.ngay_ket_thuc,
    CASE 
        WHEN km.ngay_ket_thuc < GETDATE() THEN 'HẾT HẠN'
        WHEN km.ngay_bat_dau > GETDATE() THEN 'CHƯA BẮT ĐẦU'
        ELSE 'ĐANG HOẠT ĐỘNG'
    END as trang_thai_ngay
FROM khuyen_mai km
WHERE km.trang_thai = 1
ORDER BY km.ngay_ket_thuc;

-- Test tạo voucher mới (nếu cần)
-- INSERT INTO voucher (ma_voucher, ten_voucher, loai_giam_gia, gia_tri_giam, gia_tri_toi_thieu, giam_toi_da, so_luong, ngay_bat_dau, ngay_ket_thuc, trang_thai, mo_ta)
-- VALUES ('TEST002', 'Voucher Test 20%', 'PHAN_TRAM', 20.00, 200000.00, 100000.00, 50, '2024-01-01', '2024-12-31', 1, 'Voucher test cho CustomerController');

-- Test tạo khuyến mãi mới (nếu cần)
-- INSERT INTO khuyen_mai (ma_khuyen_mai, ten_khuyen_mai, phan_tram_giam, ngay_bat_dau, ngay_ket_thuc, trang_thai, mo_ta)
-- VALUES ('KM001', 'Khuyến mãi mùa hè', 15.00, '2024-06-01', '2024-08-31', 1, 'Khuyến mãi mùa hè cho khách hàng');

-- Kiểm tra cấu trúc bảng voucher
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'voucher'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra cấu trúc bảng khuyen_mai
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'khuyen_mai'
ORDER BY ORDINAL_POSITION;
