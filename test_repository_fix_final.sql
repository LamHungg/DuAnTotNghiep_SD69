-- Script test cuối cùng sau khi sửa tất cả lỗi repository
-- Chạy script này để kiểm tra toàn bộ hệ thống

-- ========================================
-- 1. KIỂM TRA CHI TIẾT ĐƠN HÀNG
-- ========================================
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
    ctdh.tien_giam_gia
FROM chi_tiet_don_hang ctdh
LEFT JOIN don_hang dh ON ctdh.id_don_hang = dh.id
LEFT JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
LEFT JOIN trang_thai_don_hang ttdh ON ctdh.id_trang_thai = ttdh.id
LEFT JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
ORDER BY ctdh.id_don_hang DESC, ctdh.id;

-- ========================================
-- 2. KIỂM TRA VOUCHER
-- ========================================
SELECT 
    v.id,
    v.ma_voucher,
    v.ten_voucher,
    v.loai_giam_gia,
    v.gia_tri_giam,
    v.ngay_bat_dau,
    v.ngay_ket_thuc,
    v.trang_thai,
    CASE 
        WHEN v.ngay_ket_thuc IS NOT NULL THEN 
            DATEDIFF(day, GETDATE(), v.ngay_ket_thuc)
        ELSE NULL
    END as ngay_con_lai
FROM voucher v
ORDER BY v.ngay_ket_thuc DESC;

-- ========================================
-- 3. KIỂM TRA ĐƠN HÀNG
-- ========================================
SELECT 
    dh.id,
    dh.ma_don_hang,
    dh.loai_don_hang,
    dh.ngay_dat,
    dh.tong_tien_hang,
    dh.tong_thanh_toan
FROM don_hang dh
ORDER BY dh.ngay_dat DESC;

-- ========================================
-- 4. KIỂM TRA KHÁCH HÀNG
-- ========================================
SELECT 
    kh.id,
    kh.ma_khach_hang,
    kh.ho_ten,
    kh.so_dien_thoai,
    kh.email,
    kh.trang_thai_tai_khoan
FROM khach_hang kh
ORDER BY kh.id;

-- ========================================
-- 5. KIỂM TRA ĐỊA CHỈ
-- ========================================
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

-- ========================================
-- 6. KIỂM TRA LỊCH SỬ ĐƠN HÀNG
-- ========================================
SELECT 
    lsdh.id,
    lsdh.id_don_hang,
    dh.ma_don_hang,
    lsdh.id_trang_thai_moi,
    ttdh.ten_trang_thai,
    lsdh.id_nguoi_cap_nhat,
    nd.ho_ten as ten_nguoi_cap_nhat,
    lsdh.thoi_gian_cap_nhat,
    lsdh.ghi_chu
FROM lich_su_don_hang lsdh
LEFT JOIN don_hang dh ON lsdh.id_don_hang = dh.id
LEFT JOIN trang_thai_don_hang ttdh ON lsdh.id_trang_thai_moi = ttdh.id
LEFT JOIN nguoi_dung nd ON lsdh.id_nguoi_cap_nhat = nd.id
ORDER BY lsdh.id_don_hang DESC, lsdh.thoi_gian_cap_nhat DESC;

-- ========================================
-- 7. KIỂM TRA TRẠNG THÁI ĐƠN HÀNG
-- ========================================
SELECT 
    id,
    ten_trang_thai
FROM trang_thai_don_hang
ORDER BY id;

-- ========================================
-- 8. KIỂM TRA CẤU TRÚC BẢNG
-- ========================================
-- Chi tiết đơn hàng
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'chi_tiet_don_hang'
ORDER BY ORDINAL_POSITION;

-- Đơn hàng
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'don_hang'
ORDER BY ORDINAL_POSITION;

-- Voucher
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'voucher'
ORDER BY ORDINAL_POSITION;

-- ========================================
-- 9. TEST TẠO DỮ LIỆU MỚI (NẾU CẦN)
-- ========================================
-- Test tạo đơn hàng mới
-- INSERT INTO don_hang (ma_don_hang, loai_don_hang, ngay_dat, tong_tien_hang, tong_thanh_toan)
-- VALUES ('DH999999', 0, GETDATE(), 500000.00, 500000.00);

-- Test tạo chi tiết đơn hàng mới
-- INSERT INTO chi_tiet_don_hang (id_don_hang, id_chi_tiet_san_pham, id_trang_thai, id_khach_hang, so_luong, phi_van_chuyen, tien_giam_gia)
-- VALUES (1, 1, 1, 1, 2, 30000.00, 50000.00);

-- Test tạo voucher mới
-- INSERT INTO voucher (ma_voucher, ten_voucher, loai_giam_gia, gia_tri_giam, gia_tri_toi_thieu, giam_toi_da, so_luong, ngay_bat_dau, ngay_ket_thuc, trang_thai, mo_ta)
-- VALUES ('TEST999', 'Voucher Test Final', 'PHAN_TRAM', 25.00, 250000.00, 125000.00, 50, '2024-01-01', '2024-12-31', 1, 'Voucher test cuối cùng');

-- ========================================
-- 10. TEST API ENDPOINTS
-- ========================================
-- GET http://localhost:8080/api/donhang
-- GET http://localhost:8080/api/donhang/1
-- GET http://localhost:8080/api/donhang/1/chitiet
-- GET http://localhost:8080/api/donhang/khachhang/1
-- POST http://localhost:8080/api/donhang/add
-- PUT http://localhost:8080/api/donhang/1
-- DELETE http://localhost:8080/api/donhang/1

-- GET http://localhost:8080/api/voucher
-- GET http://localhost:8080/api/voucher/1
-- GET http://localhost:8080/api/voucher/search?tenVoucher=Test&trangThai=1
-- POST http://localhost:8080/api/voucher
-- PUT http://localhost:8080/api/voucher/1
-- DELETE http://localhost:8080/api/voucher/1

-- GET http://localhost:8080/api/customer
-- GET http://localhost:8080/api/customer/1
-- GET http://localhost:8080/api/customer/1/donhang

-- GET http://localhost:8080/api/diachi
-- GET http://localhost:8080/api/diachi/khachhang/1
-- POST http://localhost:8080/api/diachi
-- PUT http://localhost:8080/api/diachi/1
-- DELETE http://localhost:8080/api/diachi/1

-- ========================================
-- 11. KIỂM TRA ORPHAN RECORDS
-- ========================================
-- Chi tiết đơn hàng không có đơn hàng
SELECT COUNT(*) as orphan_chi_tiet_don_hang
FROM chi_tiet_don_hang ctdh
LEFT JOIN don_hang dh ON ctdh.id_don_hang = dh.id
WHERE dh.id IS NULL;

-- Chi tiết đơn hàng không có khách hàng
SELECT COUNT(*) as orphan_chi_tiet_khach_hang
FROM chi_tiet_don_hang ctdh
LEFT JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
WHERE kh.id IS NULL;

-- Địa chỉ không có khách hàng
SELECT COUNT(*) as orphan_dia_chi
FROM dia_chi dc
LEFT JOIN khach_hang kh ON dc.id_khach_hang = kh.id
WHERE kh.id IS NULL;

-- Lịch sử đơn hàng không có đơn hàng
SELECT COUNT(*) as orphan_lich_su_don_hang
FROM lich_su_don_hang lsdh
LEFT JOIN don_hang dh ON lsdh.id_don_hang = dh.id
WHERE dh.id IS NULL;

-- ========================================
-- 12. THỐNG KÊ TỔNG QUAN
-- ========================================
SELECT 
    'Tổng số đơn hàng' as metric,
    COUNT(*) as value
FROM don_hang
UNION ALL
SELECT 
    'Tổng số chi tiết đơn hàng',
    COUNT(*)
FROM chi_tiet_don_hang
UNION ALL
SELECT 
    'Tổng số khách hàng',
    COUNT(*)
FROM khach_hang
UNION ALL
SELECT 
    'Tổng số voucher',
    COUNT(*)
FROM voucher
UNION ALL
SELECT 
    'Tổng số địa chỉ',
    COUNT(*)
FROM dia_chi
UNION ALL
SELECT 
    'Tổng số lịch sử đơn hàng',
    COUNT(*)
FROM lich_su_don_hang;
