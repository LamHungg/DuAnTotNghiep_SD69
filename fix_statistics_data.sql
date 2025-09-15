-- Script kiểm tra và sửa dữ liệu thống kê
-- Chạy trong SQL Server Management Studio hoặc Azure Data Studio

USE abcd7;
GO

-- =====================================
-- 1. KIỂM TRA DỮ LIỆU HIỆN TẠI
-- =====================================

PRINT '=== KIỂM TRA DỮ LIỆU HIỆN TẠI ===';

-- Kiểm tra số lượng đơn hàng
SELECT COUNT(*) AS TongDonHang FROM don_hang;
SELECT COUNT(*) AS TongKhachHang FROM khach_hang;
SELECT COUNT(*) AS TongSanPham FROM san_pham WHERE trang_thai = 1;
SELECT COUNT(*) AS TongChiTietSanPham FROM chi_tiet_san_pham;

-- Kiểm tra đơn hàng hôm nay
SELECT 
    COUNT(*) AS DonHangHomNay,
    SUM(tong_thanh_toan) AS DoanhThuHomNay
FROM don_hang 
WHERE CAST(ngay_dat AS DATE) = CAST(GETDATE() AS DATE);

-- Kiểm tra chi tiết đơn hàng
SELECT 
    COUNT(*) AS TongChiTietDonHang,
    COUNT(DISTINCT id_don_hang) AS SoDonHangCoChiTiet,
    COUNT(DISTINCT id_khach_hang) AS SoKhachHangCoDonHang
FROM chi_tiet_don_hang;

-- =====================================
-- 2. KIỂM TRA TRẠNG THÁI ĐƠN HÀNG
-- =====================================

PRINT '=== KIỂM TRA TRẠNG THÁI ĐƠN HÀNG ===';

-- Xem các trạng thái đơn hàng
SELECT * FROM trang_thai_don_hang;

-- Kiểm tra đơn hàng theo trạng thái
SELECT 
    ttdh.ten_trang_thai,
    COUNT(ctdh.id_don_hang) AS SoDonHang
FROM chi_tiet_don_hang ctdh
JOIN trang_thai_don_hang ttdh ON ctdh.id_trang_thai = ttdh.id
GROUP BY ttdh.ten_trang_thai, ttdh.id
ORDER BY ttdh.id;

-- =====================================
-- 3. KIỂM TRA DỮ LIỆU KHÁCH HÀNG
-- =====================================

PRINT '=== KIỂM TRA DỮ LIỆU KHÁCH HÀNG ===';

-- Kiểm tra đơn hàng có khách hàng
SELECT 
    COUNT(*) AS TongDonHang,
    COUNT(id_khach_hang) AS DonHangCoKhachHang,
    COUNT(*) - COUNT(id_khach_hang) AS DonHangKhongCoKhachHang
FROM chi_tiet_don_hang;

-- Xem các khách hàng có đơn hàng
SELECT 
    kh.ho_ten,
    kh.email,
    kh.so_dien_thoai,
    COUNT(ctdh.id_don_hang) AS SoDonHang
FROM khach_hang kh
LEFT JOIN chi_tiet_don_hang ctdh ON kh.id = ctdh.id_khach_hang
GROUP BY kh.id, kh.ho_ten, kh.email, kh.so_dien_thoai
ORDER BY SoDonHang DESC;

-- =====================================
-- 4. KIỂM TRA DỮ LIỆU SẢN PHẨM
-- =====================================

PRINT '=== KIỂM TRA DỮ LIỆU SẢN PHẨM ===';

-- Kiểm tra sản phẩm có trong đơn hàng
SELECT 
    sp.ten_san_pham,
    COUNT(ctdh.id_don_hang) AS SoDonHang,
    SUM(ctdh.so_luong) AS TongSoLuongBan,
    SUM(ctdh.so_luong * ctsp.gia) AS TongDoanhThu
FROM san_pham sp
LEFT JOIN chi_tiet_san_pham ctsp ON sp.id = ctsp.id_san_pham
LEFT JOIN chi_tiet_don_hang ctdh ON ctsp.id = ctdh.id_chi_tiet_san_pham
GROUP BY sp.id, sp.ten_san_pham
ORDER BY TongSoLuongBan DESC;

-- =====================================
-- 5. TẠO DỮ LIỆU TEST NẾU CẦN
-- =====================================

PRINT '=== TẠO DỮ LIỆU TEST NẾU CẦN ===';

-- Kiểm tra xem có cần tạo dữ liệu test không
DECLARE @TongDonHang INT = (SELECT COUNT(*) FROM don_hang);
DECLARE @TongKhachHang INT = (SELECT COUNT(*) FROM khach_hang);
DECLARE @TongSanPham INT = (SELECT COUNT(*) FROM san_pham WHERE trang_thai = 1);

IF @TongDonHang = 0
BEGIN
    PRINT '⚠️ Không có đơn hàng nào. Tạo dữ liệu test...';
    
    -- Tạo khách hàng test nếu chưa có
    IF @TongKhachHang = 0
    BEGIN
        INSERT INTO khach_hang (ma_khach_hang, ho_ten, so_dien_thoai, email, ngay_dang_ky, ten_dang_nhap, mat_khau, trang_thai_tai_khoan)
        VALUES ('KH001', N'Khách hàng Test', '0123456789', 'test@example.com', GETDATE(), 'test@example.com', 'password123', 1);
        PRINT '✅ Đã tạo khách hàng test';
    END
    
    -- Tạo sản phẩm test nếu chưa có
    IF @TongSanPham = 0
    BEGIN
        -- Tạo danh mục test
        IF NOT EXISTS (SELECT 1 FROM danh_muc WHERE ten_danh_muc = N'Test')
        BEGIN
            INSERT INTO danh_muc (ten_danh_muc, trang_thai, ngay_tao)
            VALUES (N'Test', 1, GETDATE());
        END
        
        -- Tạo sản phẩm test
        INSERT INTO san_pham (ma_san_pham, id_danh_muc, ten_san_pham, mo_ta, trang_thai, ngay_tao)
        VALUES ('SP001', (SELECT id FROM danh_muc WHERE ten_danh_muc = N'Test'), N'Sản phẩm Test', N'Mô tả sản phẩm test', 1, GETDATE());
        
        -- Tạo chi tiết sản phẩm test
        INSERT INTO chi_tiet_san_pham (id_san_pham, id_kich_co, id_mau_sac, id_chat_lieu, so_luong, gia, gia_nhap, ngay_tao)
        VALUES (
            (SELECT id FROM san_pham WHERE ma_san_pham = 'SP001'),
            (SELECT TOP 1 id FROM kich_co),
            (SELECT TOP 1 id FROM mau_sac),
            (SELECT TOP 1 id FROM chat_lieu),
            100, 250000, 200000, GETDATE()
        );
        
        PRINT '✅ Đã tạo sản phẩm test';
    END
    
    -- Tạo đơn hàng test
    INSERT INTO don_hang (ma_don_hang, loai_don_hang, ngay_dat, tong_tien_hang, tong_thanh_toan)
    VALUES ('DH001', 0, GETDATE(), 500000, 500000);
    
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
        (SELECT id FROM don_hang WHERE ma_don_hang = 'DH001'),
        (SELECT TOP 1 id FROM chi_tiet_san_pham),
        5, -- Trạng thái hoàn thành
        (SELECT TOP 1 id FROM khach_hang),
        (SELECT TOP 1 id FROM dia_chi),
        2,
        N'Đơn hàng test cho thống kê'
    );
    
    PRINT '✅ Đã tạo đơn hàng test';
END
ELSE
BEGIN
    PRINT '✅ Đã có dữ liệu đơn hàng trong hệ thống';
    
    -- Kiểm tra trạng thái đơn hàng
    SELECT 
        ttdh.ten_trang_thai,
        COUNT(*) AS SoDonHang
    FROM chi_tiet_don_hang ctdh
    JOIN trang_thai_don_hang ttdh ON ctdh.id_trang_thai = ttdh.id
    GROUP BY ttdh.ten_trang_thai, ttdh.id
    ORDER BY ttdh.id;
END

-- =====================================
-- 6. KIỂM TRA LẠI SAU KHI TẠO DỮ LIỆU
-- =====================================

PRINT '=== KIỂM TRA LẠI SAU KHI TẠO DỮ LIỆU ===';

-- Kiểm tra thống kê tổng quan
SELECT 
    (SELECT COUNT(*) FROM don_hang) AS TongDonHang,
    (SELECT COUNT(*) FROM khach_hang) AS TongKhachHang,
    (SELECT COUNT(*) FROM san_pham WHERE trang_thai = 1) AS TongSanPham,
    (SELECT ISNULL(SUM(tong_thanh_toan), 0) FROM don_hang WHERE CAST(ngay_dat AS DATE) = CAST(GETDATE() AS DATE)) AS DoanhThuHomNay;

-- Kiểm tra top sản phẩm bán chạy hôm nay
SELECT TOP 10
    sp.ten_san_pham AS TenSanPham,
    SUM(ctdh.so_luong) AS SoLuongBan,
    SUM(ctdh.so_luong * ctsp.gia) AS DoanhThu
FROM chi_tiet_don_hang ctdh
JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
JOIN san_pham sp ON ctsp.id_san_pham = sp.id
JOIN don_hang dh ON ctdh.id_don_hang = dh.id
WHERE CAST(dh.ngay_dat AS DATE) = CAST(GETDATE() AS DATE)
AND ctdh.id_trang_thai IN (1, 2, 3, 4, 5)
GROUP BY sp.ten_san_pham
ORDER BY SoLuongBan DESC;

-- Kiểm tra top khách hàng chi tiêu hôm nay
SELECT TOP 10
    kh.ho_ten AS HoTen,
    kh.email,
    kh.so_dien_thoai AS SoDienThoai,
    COUNT(DISTINCT ctdh.id_don_hang) AS SoLuongDon,
    SUM(ctdh.so_luong * ctsp.gia) AS TongChiTieu
FROM chi_tiet_don_hang ctdh
JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
JOIN don_hang dh ON ctdh.id_don_hang = dh.id
JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
WHERE CAST(dh.ngay_dat AS DATE) = CAST(GETDATE() AS DATE)
AND ctdh.id_trang_thai IN (1, 2, 3, 4, 5)
GROUP BY kh.id, kh.ho_ten, kh.email, kh.so_dien_thoai
ORDER BY TongChiTieu DESC;

PRINT '=== HOÀN THÀNH KIỂM TRA VÀ SỬA DỮ LIỆU ===';
