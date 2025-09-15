-- Script test VoucherController sau khi sửa lỗi LocalDate
-- Chạy script này để kiểm tra dữ liệu voucher và API

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
ORDER BY v.ngay_ket_thuc DESC;

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

-- Kiểm tra voucher theo loại giảm giá
SELECT 
    v.loai_giam_gia,
    COUNT(v.id) as so_luong,
    AVG(CAST(v.gia_tri_giam AS FLOAT)) as gia_tri_giam_trung_binh
FROM voucher v
GROUP BY v.loai_giam_gia
ORDER BY so_luong DESC;

-- Kiểm tra voucher theo trạng thái
SELECT 
    v.trang_thai,
    COUNT(v.id) as so_luong,
    MIN(v.ngay_bat_dau) as ngay_bat_dau_som_nhat,
    MAX(v.ngay_ket_thuc) as ngay_ket_thuc_muon_nhat
FROM voucher v
GROUP BY v.trang_thai
ORDER BY v.trang_thai;

-- Test tạo voucher mới (nếu cần)
-- INSERT INTO voucher (ma_voucher, ten_voucher, loai_giam_gia, gia_tri_giam, gia_tri_toi_thieu, giam_toi_da, so_luong, ngay_bat_dau, ngay_ket_thuc, trang_thai, mo_ta)
-- VALUES ('TEST003', 'Voucher Test 30%', 'PHAN_TRAM', 30.00, 300000.00, 150000.00, 100, '2024-01-01', '2024-12-31', 1, 'Voucher test cho VoucherController');

-- Test cập nhật voucher (nếu cần)
-- UPDATE voucher SET trang_thai = 0 WHERE ma_voucher = 'TEST003';

-- Test xóa voucher (nếu cần)
-- DELETE FROM voucher WHERE ma_voucher = 'TEST003';

-- Kiểm tra cấu trúc bảng voucher
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'voucher'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra voucher có ngày bắt đầu trong tương lai
SELECT 
    v.id,
    v.ma_voucher,
    v.ten_voucher,
    v.ngay_bat_dau,
    v.ngay_ket_thuc,
    DATEDIFF(day, GETDATE(), v.ngay_bat_dau) as ngay_con_lai_den_khi_bat_dau
FROM voucher v
WHERE v.ngay_bat_dau > GETDATE()
ORDER BY v.ngay_bat_dau;

-- Kiểm tra voucher sắp hết hạn (trong 7 ngày tới)
SELECT 
    v.id,
    v.ma_voucher,
    v.ten_voucher,
    v.ngay_ket_thuc,
    DATEDIFF(day, GETDATE(), v.ngay_ket_thuc) as ngay_con_lai
FROM voucher v
WHERE v.ngay_ket_thuc BETWEEN GETDATE() AND DATEADD(day, 7, GETDATE())
    AND v.trang_thai = 1
ORDER BY v.ngay_ket_thuc;

-- Kiểm tra voucher đã hết hạn
SELECT 
    v.id,
    v.ma_voucher,
    v.ten_voucher,
    v.ngay_ket_thuc,
    DATEDIFF(day, v.ngay_ket_thuc, GETDATE()) as ngay_da_het_han
FROM voucher v
WHERE v.ngay_ket_thuc < GETDATE()
ORDER BY v.ngay_ket_thuc DESC;

-- Kiểm tra voucher có số lượng = 0
SELECT 
    v.id,
    v.ma_voucher,
    v.ten_voucher,
    v.so_luong,
    v.trang_thai
FROM voucher v
WHERE v.so_luong = 0
ORDER BY v.id;

-- Kiểm tra voucher có giá trị giảm cao nhất
SELECT TOP 10
    v.id,
    v.ma_voucher,
    v.ten_voucher,
    v.loai_giam_gia,
    v.gia_tri_giam,
    v.giam_toi_da
FROM voucher v
WHERE v.trang_thai = 1
ORDER BY v.gia_tri_giam DESC;

-- Test API endpoints (sử dụng curl hoặc Postman)
-- GET http://localhost:8080/api/voucher
-- GET http://localhost:8080/api/voucher/1
-- GET http://localhost:8080/api/voucher/search?tenVoucher=Test&trangThai=1
-- GET http://localhost:8080/api/voucher/search?ngayBatDau=2024-01-01&ngayKetThuc=2024-12-31
-- POST http://localhost:8080/api/voucher
-- PUT http://localhost:8080/api/voucher/1
-- DELETE http://localhost:8080/api/voucher/1
