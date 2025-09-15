-- Script kiểm tra và sửa trạng thái đơn hàng
-- Mục tiêu: Đảm bảo tất cả đơn hàng có trạng thái phù hợp cho thống kê

-- 1. Kiểm tra trạng thái hiện tại
SELECT 'Trạng thái hiện tại trong chi_tiet_don_hang:' as info;
SELECT id_trang_thai, COUNT(*) as so_luong
FROM chi_tiet_don_hang 
GROUP BY id_trang_thai
ORDER BY id_trang_thai;

-- 2. Kiểm tra các đơn hàng có trạng thái NULL
SELECT 'Đơn hàng có trạng thái NULL:' as info;
SELECT COUNT(*) as so_luong_null
FROM chi_tiet_don_hang 
WHERE id_trang_thai IS NULL;

-- 3. Cập nhật tất cả trạng thái NULL thành 5 (Hoàn thành)
UPDATE chi_tiet_don_hang 
SET id_trang_thai = 5 
WHERE id_trang_thai IS NULL;

-- 4. Cập nhật tất cả trạng thái 3 thành 5 (để thống nhất)
UPDATE chi_tiet_don_hang 
SET id_trang_thai = 5 
WHERE id_trang_thai = 3;

-- 5. Kiểm tra kết quả sau khi cập nhật
SELECT 'Trạng thái sau khi cập nhật:' as info;
SELECT id_trang_thai, COUNT(*) as so_luong
FROM chi_tiet_don_hang 
GROUP BY id_trang_thai
ORDER BY id_trang_thai;

-- 6. Test các query thống kê với trạng thái mới
SELECT 'Test query sản phẩm bán chạy:' as info;
SELECT TOP 5
    sp.ten_san_pham AS tenSanPham,
    SUM(ctdh.so_luong) AS soLuongBan,
    SUM(ctdh.so_luong * ctsp.gia) AS doanhThu
FROM chi_tiet_don_hang ctdh
JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
JOIN san_pham sp ON ctsp.id_san_pham = sp.id
JOIN don_hang dh ON ctdh.id_don_hang = dh.id
WHERE CAST(dh.ngay_dat AS DATE) = '2025-08-27'
AND ctdh.id_trang_thai = 5
GROUP BY sp.ten_san_pham
ORDER BY soLuongBan DESC;

SELECT 'Test query doanh thu ngày:' as info;
SELECT 
    '2025-08-27' as moTa,
    SUM(dh.tong_thanh_toan) as tongDoanhThu
FROM don_hang dh
WHERE dh.id IN (
    SELECT DISTINCT ctdh.id_don_hang
    FROM chi_tiet_don_hang ctdh
    WHERE ctdh.id_trang_thai = 5
)
AND CAST(dh.ngay_dat AS DATE) = '2025-08-27';

SELECT 'Test query biểu đồ doanh thu:' as info;
SELECT 
    FORMAT(dh.ngay_dat, 'dd/MM') as thoiGian,
    SUM(dh.tong_thanh_toan) as doanhThu
FROM don_hang dh
WHERE dh.id IN (
    SELECT DISTINCT ctdh.id_don_hang
    FROM chi_tiet_don_hang ctdh
    WHERE ctdh.id_trang_thai = 5
)
AND MONTH(dh.ngay_dat) = 8
AND YEAR(dh.ngay_dat) = 2025
GROUP BY FORMAT(dh.ngay_dat, 'dd/MM')
ORDER BY thoiGian;

SELECT 'Test query danh mục doanh thu:' as info;
SELECT 
    dm.ten_danh_muc AS tenDanhMuc,
    SUM(ctdh.so_luong * ctsp.gia) AS doanhThu
FROM chi_tiet_don_hang ctdh
JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
JOIN san_pham sp ON ctsp.id_san_pham = sp.id
JOIN danh_muc dm ON sp.id_danh_muc = dm.id
JOIN don_hang dh ON ctdh.id_don_hang = dh.id
WHERE ctdh.id_trang_thai = 5
AND MONTH(dh.ngay_dat) = 8
AND YEAR(dh.ngay_dat) = 2025
GROUP BY dm.ten_danh_muc
ORDER BY doanhThu DESC;

SELECT 'Test query thanh toán thống kê:' as info;
SELECT 
    pttt.ten_phuong_thuc AS tenPhuongThuc,
    COUNT(DISTINCT ctdh.id_don_hang) as soLuong,
    SUM(dh.tong_thanh_toan) as tongTien
FROM chi_tiet_don_hang ctdh
JOIN don_hang dh ON ctdh.id_don_hang = dh.id
JOIN phuong_thuc_thanh_toan pttt ON ctdh.id_phuong_thuc_thanh_toan = pttt.id
WHERE ctdh.id_trang_thai = 5
AND MONTH(dh.ngay_dat) = 8
AND YEAR(dh.ngay_dat) = 2025
GROUP BY pttt.ten_phuong_thuc
ORDER BY tongTien DESC;
