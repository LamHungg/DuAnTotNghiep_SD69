-- Script tạo đơn hàng test cho hôm nay
-- Chạy trong SQL Server Management Studio

USE abcd7;
GO

PRINT '=== TẠO ĐƠN HÀNG TEST CHO HÔM NAY ===';

-- Kiểm tra dữ liệu hiện tại
SELECT 
    COUNT(*) AS TongDonHang,
    COUNT(CASE WHEN CAST(ngay_dat AS DATE) = CAST(GETDATE() AS DATE) THEN 1 END) AS DonHangHomNay
FROM don_hang;

-- Tạo đơn hàng test cho hôm nay
INSERT INTO don_hang (ma_don_hang, loai_don_hang, ngay_dat, tong_tien_hang, tong_thanh_toan)
VALUES 
('DH' + CAST(YEAR(GETDATE()) AS VARCHAR) + CAST(MONTH(GETDATE()) AS VARCHAR) + CAST(DAY(GETDATE()) AS VARCHAR) + '001', 
 0, -- offline
 GETDATE(), -- Hôm nay
 750000, 
 750000);

PRINT '✅ Đã tạo đơn hàng test';

-- Lấy ID đơn hàng vừa tạo
DECLARE @DonHangID INT = SCOPE_IDENTITY();
PRINT '📋 ID đơn hàng: ' + CAST(@DonHangID AS VARCHAR);

-- Tạo chi tiết đơn hàng test
INSERT INTO chi_tiet_don_hang (
    id_don_hang, 
    id_chi_tiet_san_pham, 
    id_trang_thai, 
    id_khach_hang, 
    id_dia_chi,
    so_luong, 
    ghi_chu_khach_hang
)
VALUES (
    @DonHangID,
    (SELECT TOP 1 id FROM chi_tiet_san_pham WHERE so_luong > 0), -- Lấy sản phẩm có tồn kho
    5, -- Trạng thái hoàn thành
    (SELECT TOP 1 id FROM khach_hang), -- Lấy khách hàng đầu tiên
    (SELECT TOP 1 id FROM dia_chi), -- Lấy địa chỉ đầu tiên
    3, -- Số lượng
    N'Đơn hàng test cho hôm nay'
);

PRINT '✅ Đã tạo chi tiết đơn hàng test';

-- Kiểm tra lại sau khi tạo
SELECT 
    COUNT(*) AS TongDonHang,
    COUNT(CASE WHEN CAST(ngay_dat AS DATE) = CAST(GETDATE() AS DATE) THEN 1 END) AS DonHangHomNay
FROM don_hang;

-- Kiểm tra chi tiết đơn hàng hôm nay
SELECT 
    dh.ma_don_hang,
    dh.ngay_dat,
    dh.tong_thanh_toan,
    ctdh.so_luong,
    ctdh.id_trang_thai,
    kh.ho_ten AS KhachHang,
    sp.ten_san_pham AS SanPham
FROM don_hang dh
JOIN chi_tiet_don_hang ctdh ON dh.id = ctdh.id_don_hang
JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
JOIN san_pham sp ON ctsp.id_san_pham = sp.id
WHERE CAST(dh.ngay_dat AS DATE) = CAST(GETDATE() AS DATE)
ORDER BY dh.ngay_dat DESC;

PRINT '=== HOÀN THÀNH TẠO ĐƠN HÀNG TEST ===';
