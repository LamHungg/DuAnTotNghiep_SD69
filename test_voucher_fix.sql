-- Script test Voucher sau khi sửa lỗi LocalDate
-- Chạy script này để kiểm tra dữ liệu voucher

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
    v.mo_ta
FROM voucher v
ORDER BY v.ngay_bat_dau DESC;

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

-- Kiểm tra voucher hết hạn
SELECT 
    v.id,
    v.ma_voucher,
    v.ten_voucher,
    v.ngay_ket_thuc,
    DATEDIFF(day, v.ngay_ket_thuc, GETDATE()) as so_ngay_het_han
FROM voucher v
WHERE v.ngay_ket_thuc < GETDATE()
ORDER BY v.ngay_ket_thuc DESC;

-- Test tạo voucher mới (nếu cần)
-- INSERT INTO voucher (ma_voucher, ten_voucher, loai_giam_gia, gia_tri_giam, gia_tri_toi_thieu, giam_toi_da, so_luong, ngay_bat_dau, ngay_ket_thuc, trang_thai, mo_ta)
-- VALUES ('TEST001', 'Voucher Test 10%', 'PHAN_TRAM', 10.00, 100000.00, 50000.00, 100, '2024-01-01', '2024-12-31', 1, 'Voucher test cho API');

-- Kiểm tra cấu trúc bảng voucher
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'voucher'
ORDER BY ORDINAL_POSITION;
