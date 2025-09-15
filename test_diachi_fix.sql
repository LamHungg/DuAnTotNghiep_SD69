-- Script test DiaChi sau khi sửa lỗi getIdKhachHang
-- Chạy script này để kiểm tra dữ liệu địa chỉ

-- Kiểm tra dữ liệu địa chỉ
SELECT 
    dc.id,
    dc.id_khach_hang,
    kh.ho_ten as ten_khach_hang,
    dc.tinh_thanh,
    dc.quan_huyen,
    dc.phuong_xa,
    dc.duong,
    dc.dia_chi_mac_dinh
FROM dia_chi dc
LEFT JOIN khach_hang kh ON dc.id_khach_hang = kh.id
ORDER BY dc.id_khach_hang, dc.dia_chi_mac_dinh DESC;

-- Kiểm tra địa chỉ mặc định của từng khách hàng
SELECT 
    kh.id as id_khach_hang,
    kh.ho_ten as ten_khach_hang,
    dc.id as id_dia_chi,
    dc.tinh_thanh,
    dc.quan_huyen,
    dc.phuong_xa,
    dc.duong,
    dc.dia_chi_mac_dinh
FROM khach_hang kh
LEFT JOIN dia_chi dc ON kh.id = dc.id_khach_hang AND dc.dia_chi_mac_dinh = 1
ORDER BY kh.id;

-- Kiểm tra số lượng địa chỉ của từng khách hàng
SELECT 
    kh.id as id_khach_hang,
    kh.ho_ten as ten_khach_hang,
    COUNT(dc.id) as so_dia_chi,
    SUM(CASE WHEN dc.dia_chi_mac_dinh = 1 THEN 1 ELSE 0 END) as so_dia_chi_mac_dinh
FROM khach_hang kh
LEFT JOIN dia_chi dc ON kh.id = dc.id_khach_hang
GROUP BY kh.id, kh.ho_ten
ORDER BY kh.id;

-- Test tạo địa chỉ mới (nếu cần)
-- INSERT INTO dia_chi (id_khach_hang, tinh_thanh, quan_huyen, phuong_xa, duong, dia_chi_mac_dinh)
-- VALUES (1, 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', '123 Đường ABC', 0);

-- Test cập nhật địa chỉ mặc định (nếu cần)
-- UPDATE dia_chi SET dia_chi_mac_dinh = 0 WHERE id_khach_hang = 1;
-- UPDATE dia_chi SET dia_chi_mac_dinh = 1 WHERE id = 1;

-- Kiểm tra cấu trúc bảng dia_chi
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'dia_chi'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra cấu trúc bảng khach_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'khach_hang'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra khách hàng không có địa chỉ
SELECT 
    kh.id,
    kh.ho_ten,
    kh.so_dien_thoai,
    kh.email
FROM khach_hang kh
LEFT JOIN dia_chi dc ON kh.id = dc.id_khach_hang
WHERE dc.id IS NULL
ORDER BY kh.id;

-- Kiểm tra địa chỉ không có khách hàng (orphan records)
SELECT 
    dc.id,
    dc.id_khach_hang,
    dc.tinh_thanh,
    dc.quan_huyen,
    dc.phuong_xa,
    dc.duong
FROM dia_chi dc
LEFT JOIN khach_hang kh ON dc.id_khach_hang = kh.id
WHERE kh.id IS NULL
ORDER BY dc.id;
