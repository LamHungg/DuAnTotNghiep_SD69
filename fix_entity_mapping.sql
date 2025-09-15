-- Script sửa entity mapping cho phù hợp với cấu trúc database thực tế
-- Chạy script này để kiểm tra và sửa dữ liệu

-- ========================================
-- 1. KIỂM TRA CẤU TRÚC BẢNG HIỆN TẠI
-- ========================================
SELECT 'dia_chi' as table_name, COUNT(*) as record_count
FROM dia_chi
UNION ALL
SELECT 'dia_chi_khach_hang' as table_name, COUNT(*) as record_count
FROM dia_chi_khach_hang
UNION ALL
SELECT 'khach_hang' as table_name, COUNT(*) as record_count
FROM khach_hang;

-- ========================================
-- 2. KIỂM TRA DỮ LIỆU HIỆN TẠI
-- ========================================
-- Kiểm tra khách hàng
SELECT 
    id,
    ma_khach_hang,
    ho_ten,
    so_dien_thoai,
    email,
    trang_thai_tai_khoan
FROM khach_hang
ORDER BY id;

-- Kiểm tra địa chỉ
SELECT 
    dc.id,
    dc.id_khach_hang,
    dc.tinh_thanh,
    dc.quan_huyen,
    dc.phuong_xa,
    dc.duong,
    dc.dia_chi_mac_dinh
FROM dia_chi dc
ORDER BY dc.id_khach_hang, dc.dia_chi_mac_dinh DESC;

-- Kiểm tra quan hệ địa chỉ khách hàng
SELECT 
    dckh.id,
    dckh.id_khach_hang,
    dckh.id_dia_chi,
    kh.ho_ten as ten_khach_hang,
    dc.tinh_thanh,
    dc.quan_huyen,
    dc.phuong_xa,
    dc.duong,
    dc.dia_chi_mac_dinh
FROM dia_chi_khach_hang dckh
LEFT JOIN khach_hang kh ON dckh.id_khach_hang = kh.id
LEFT JOIN dia_chi dc ON dckh.id_dia_chi = dc.id
ORDER BY dckh.id_khach_hang;

-- ========================================
-- 3. THÊM DỮ LIỆU MẪU CHO USER ID 7
-- ========================================
-- Thêm khách hàng ID 7 nếu chưa có
IF NOT EXISTS (SELECT * FROM khach_hang WHERE id = 7)
BEGIN
    INSERT INTO khach_hang (ma_khach_hang, ho_ten, so_dien_thoai, email, ten_dang_nhap, mat_khau, trang_thai_tai_khoan)
    VALUES ('KH007', 'Lam Hung', '0876743212', 'lamhung@example.com', 'lamhung@example.com', 'password123', 1);
    PRINT 'Đã thêm khách hàng ID 7';
END
ELSE
BEGIN
    PRINT 'Khách hàng ID 7 đã tồn tại';
END

-- Thêm địa chỉ cho khách hàng ID 7
IF NOT EXISTS (SELECT * FROM dia_chi WHERE id_khach_hang = 7)
BEGIN
    INSERT INTO dia_chi (id_khach_hang, tinh_thanh, quan_huyen, phuong_xa, duong, dia_chi_mac_dinh)
    VALUES (7, 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', '123 Đường ABC', 1);
    
    -- Lấy ID địa chỉ vừa thêm
    DECLARE @dia_chi_id INT = SCOPE_IDENTITY();
    
    -- Thêm quan hệ trong bảng dia_chi_khach_hang
    INSERT INTO dia_chi_khach_hang (id_khach_hang, id_dia_chi)
    VALUES (7, @dia_chi_id);
    
    PRINT 'Đã thêm địa chỉ cho khách hàng ID 7';
END
ELSE
BEGIN
    PRINT 'Địa chỉ cho khách hàng ID 7 đã tồn tại';
END

-- ========================================
-- 4. TẠO VIEW ĐỂ TƯƠNG THÍCH VỚI ENTITY
-- ========================================
-- Tạo view để entity có thể sử dụng
IF OBJECT_ID('vw_dia_chi_khach_hang', 'V') IS NOT NULL
    DROP VIEW vw_dia_chi_khach_hang;
GO

CREATE VIEW vw_dia_chi_khach_hang AS
SELECT 
    dckh.id,
    dckh.id_khach_hang as khach_hang_id,
    kh.ho_ten as ho_ten,
    kh.so_dien_thoai as so_dien_thoai,
    dc.tinh_thanh,
    dc.quan_huyen,
    dc.phuong_xa,
    dc.duong as dia_chi_chi_tiet,
    'Nhà riêng' as loai_dia_chi,
    dc.dia_chi_mac_dinh as mac_dinh,
    GETDATE() as ngay_tao,
    GETDATE() as ngay_cap_nhat
FROM dia_chi_khach_hang dckh
INNER JOIN khach_hang kh ON dckh.id_khach_hang = kh.id
INNER JOIN dia_chi dc ON dckh.id_dia_chi = dc.id;
GO

PRINT 'Đã tạo view vw_dia_chi_khach_hang';

-- ========================================
-- 5. KIỂM TRA KẾT QUẢ
-- ========================================
-- Kiểm tra view
SELECT 
    id,
    khach_hang_id,
    ho_ten,
    so_dien_thoai,
    tinh_thanh,
    quan_huyen,
    phuong_xa,
    dia_chi_chi_tiet,
    loai_dia_chi,
    mac_dinh,
    ngay_tao,
    ngay_cap_nhat
FROM vw_dia_chi_khach_hang
WHERE khach_hang_id = 7;

-- ========================================
-- 6. THỐNG KÊ
-- ========================================
SELECT 
    'Tổng số khách hàng' as metric,
    COUNT(*) as value
FROM khach_hang
UNION ALL
SELECT 
    'Tổng số địa chỉ',
    COUNT(*)
FROM dia_chi
UNION ALL
SELECT 
    'Tổng số quan hệ địa chỉ',
    COUNT(*)
FROM dia_chi_khach_hang
UNION ALL
SELECT 
    'Địa chỉ của user ID 7',
    COUNT(*)
FROM vw_dia_chi_khach_hang
WHERE khach_hang_id = 7;

PRINT 'Script hoàn thành! Bây giờ entity có thể sử dụng view vw_dia_chi_khach_hang';
