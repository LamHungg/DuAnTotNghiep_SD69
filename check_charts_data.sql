-- Script kiểm tra dữ liệu cho biểu đồ tròn và biểu đồ cột
-- Mục tiêu: Tìm hiểu tại sao các biểu đồ không hiển thị dữ liệu

-- 1. Kiểm tra dữ liệu cơ bản
SELECT '=== KIỂM TRA DỮ LIỆU CƠ BẢN ===' as info;

SELECT 'Số lượng đơn hàng:' as info;
SELECT COUNT(*) as tong_don_hang FROM don_hang;

SELECT 'Số lượng chi tiết đơn hàng:' as info;
SELECT COUNT(*) as tong_chi_tiet FROM chi_tiet_don_hang;

SELECT 'Số lượng sản phẩm:' as info;
SELECT COUNT(*) as tong_san_pham FROM san_pham;

SELECT 'Số lượng danh mục:' as info;
SELECT COUNT(*) as tong_danh_muc FROM danh_muc;

SELECT 'Số lượng phương thức thanh toán:' as info;
SELECT COUNT(*) as tong_phuong_thuc FROM phuong_thuc_thanh_toan;

-- 2. Kiểm tra trạng thái đơn hàng
SELECT '=== KIỂM TRA TRẠNG THÁI ĐƠN HÀNG ===' as info;
SELECT id_trang_thai, COUNT(*) as so_luong
FROM chi_tiet_don_hang 
GROUP BY id_trang_thai
ORDER BY id_trang_thai;

-- 3. Kiểm tra dữ liệu cho biểu đồ tròn (Doanh thu theo danh mục)
SELECT '=== KIỂM TRA DỮ LIỆU BIỂU ĐỒ TRÒN ===' as info;

-- Kiểm tra join giữa các bảng
SELECT 'Test join cơ bản:' as info;
SELECT 
    dm.ten_danh_muc AS tenDanhMuc,
    COUNT(*) as so_san_pham
FROM danh_muc dm
LEFT JOIN san_pham sp ON dm.id = sp.id_danh_muc
GROUP BY dm.ten_danh_muc;

-- Kiểm tra dữ liệu thực tế cho tháng 8/2025
SELECT 'Test query danh mục doanh thu tháng 8/2025:' as info;
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

-- 4. Kiểm tra dữ liệu cho biểu đồ cột (Thống kê thanh toán)
SELECT '=== KIỂM TRA DỮ LIỆU BIỂU ĐỒ CỘT ===' as info;

-- Kiểm tra phương thức thanh toán
SELECT 'Danh sách phương thức thanh toán:' as info;
SELECT * FROM phuong_thuc_thanh_toan;

-- Kiểm tra dữ liệu thực tế cho tháng 8/2025
SELECT 'Test query thanh toán thống kê tháng 8/2025:' as info;
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

-- 5. Kiểm tra dữ liệu mẫu
SELECT '=== KIỂM TRA DỮ LIỆU MẪU ===' as info;

-- Kiểm tra một vài đơn hàng cụ thể
SELECT 'Mẫu đơn hàng:' as info;
SELECT TOP 5 
    dh.id,
    dh.ngay_dat,
    dh.tong_thanh_toan,
    ctdh.id_trang_thai,
    ctdh.id_phuong_thuc_thanh_toan
FROM don_hang dh
JOIN chi_tiet_don_hang ctdh ON dh.id = ctdh.id_don_hang
ORDER BY dh.ngay_dat DESC;

-- Kiểm tra chi tiết sản phẩm
SELECT 'Mẫu chi tiết sản phẩm:' as info;
SELECT TOP 5 
    ctdh.id,
    ctdh.so_luong,
    ctsp.gia,
    sp.ten_san_pham,
    dm.ten_danh_muc
FROM chi_tiet_don_hang ctdh
JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
JOIN san_pham sp ON ctsp.id_san_pham = sp.id
JOIN danh_muc dm ON sp.id_danh_muc = dm.id
WHERE ctdh.id_trang_thai = 5
ORDER BY ctdh.id DESC;

-- 6. Test với điều kiện lỏng hơn
SELECT '=== TEST VỚI ĐIỀU KIỆN LỎNG HƠN ===' as info;

-- Test không có điều kiện tháng/năm
SELECT 'Test danh mục không có điều kiện thời gian:' as info;
SELECT 
    dm.ten_danh_muc AS tenDanhMuc,
    SUM(ctdh.so_luong * ctsp.gia) AS doanhThu
FROM chi_tiet_don_hang ctdh
JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
JOIN san_pham sp ON ctsp.id_san_pham = sp.id
JOIN danh_muc dm ON sp.id_danh_muc = dm.id
JOIN don_hang dh ON ctdh.id_don_hang = dh.id
WHERE ctdh.id_trang_thai = 5
GROUP BY dm.ten_danh_muc
ORDER BY doanhThu DESC;

-- Test thanh toán không có điều kiện thời gian
SELECT 'Test thanh toán không có điều kiện thời gian:' as info;
SELECT 
    pttt.ten_phuong_thuc AS tenPhuongThuc,
    COUNT(DISTINCT ctdh.id_don_hang) as soLuong,
    SUM(dh.tong_thanh_toan) as tongTien
FROM chi_tiet_don_hang ctdh
JOIN don_hang dh ON ctdh.id_don_hang = dh.id
JOIN phuong_thuc_thanh_toan pttt ON ctdh.id_phuong_thuc_thanh_toan = pttt.id
WHERE ctdh.id_trang_thai = 5
GROUP BY pttt.ten_phuong_thuc
ORDER BY tongTien DESC;
