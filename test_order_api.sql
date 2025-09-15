-- Script test API đơn hàng
-- Chạy script này để kiểm tra dữ liệu đơn hàng hiện có

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
    ctdh.id_chi_tiet_san_pham,
    ctdh.id_trang_thai,
    ctdh.id_khach_hang,
    ctdh.id_dia_chi,
    ctdh.so_luong,
    ctdh.phi_van_chuyen,
    ctdh.tien_giam_gia,
    ctdh.ghi_chu_khach_hang
FROM chi_tiet_don_hang ctdh
ORDER BY ctdh.id_don_hang;

-- Kiểm tra trạng thái đơn hàng
SELECT * FROM trang_thai_don_hang;

-- Kiểm tra khách hàng
SELECT 
    kh.id,
    kh.ma_khach_hang,
    kh.ho_ten,
    kh.email,
    kh.so_dien_thoai
FROM khach_hang kh
WHERE kh.id IN (SELECT DISTINCT id_khach_hang FROM chi_tiet_don_hang WHERE id_khach_hang IS NOT NULL);

-- Kiểm tra địa chỉ
SELECT 
    dc.id,
    dc.id_khach_hang,
    dc.tinh_thanh,
    dc.quan_huyen,
    dc.phuong_xa,
    dc.duong
FROM dia_chi dc
WHERE dc.id IN (SELECT DISTINCT id_dia_chi FROM chi_tiet_don_hang WHERE id_dia_chi IS NOT NULL);
