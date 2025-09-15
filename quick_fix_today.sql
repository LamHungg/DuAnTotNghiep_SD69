-- Script nhanh tạo đơn hàng cho hôm nay
-- Chạy ngay trong SQL Server Management Studio

USE abcd7;
GO

PRINT '=== TẠO ĐƠN HÀNG NHANH CHO HÔM NAY ===';

-- Tạo đơn hàng test cho hôm nay
INSERT INTO don_hang (ma_don_hang, loai_don_hang, ngay_dat, tong_tien_hang, tong_thanh_toan)
VALUES 
('DH' + CAST(YEAR(GETDATE()) AS VARCHAR) + CAST(MONTH(GETDATE()) AS VARCHAR) + CAST(DAY(GETDATE()) AS VARCHAR) + '002', 
 0, -- offline
 GETDATE(), -- Hôm nay
 500000, 
 500000);

-- Lấy ID đơn hàng vừa tạo
DECLARE @DonHangID INT = SCOPE_IDENTITY();

-- Tạo chi tiết đơn hàng với sản phẩm có sẵn
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
    (SELECT TOP 1 id FROM chi_tiet_san_pham WHERE so_luong > 0 ORDER BY id), -- Lấy sản phẩm đầu tiên có tồn kho
    5, -- Trạng thái hoàn thành
    (SELECT TOP 1 id FROM khach_hang ORDER BY id), -- Lấy khách hàng đầu tiên
    (SELECT TOP 1 id FROM dia_chi ORDER BY id), -- Lấy địa chỉ đầu tiên
    2, -- Số lượng
    N'Đơn hàng test cho hôm nay'
);

PRINT '✅ Đã tạo đơn hàng test thành công!';

-- Kiểm tra kết quả
SELECT 
    'Tổng đơn hàng hôm nay' AS ThongKe,
    COUNT(*) AS SoLuong
FROM don_hang 
WHERE CAST(ngay_dat AS DATE) = CAST(GETDATE() AS DATE)

UNION ALL

SELECT 
    'Doanh thu hôm nay' AS ThongKe,
    ISNULL(SUM(tong_thanh_toan), 0) AS SoLuong
FROM don_hang 
WHERE CAST(ngay_dat AS DATE) = CAST(GETDATE() AS DATE);

PRINT '=== HOÀN THÀNH ===';
