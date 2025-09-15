-- =====================================
-- KIỂM TRA VÀ TẠO DỮ LIỆU MẪU
-- =====================================

-- 1. Kiểm tra dữ liệu hiện tại
SELECT '=== KIỂM TRA DỮ LIỆU HIỆN TẠI ===' as info;

-- Kiểm tra số lượng bản ghi
SELECT 'don_hang' as table_name, COUNT(*) as count FROM don_hang
UNION ALL
SELECT 'chi_tiet_don_hang' as table_name, COUNT(*) as count FROM chi_tiet_don_hang
UNION ALL
SELECT 'nguoi_dung' as table_name, COUNT(*) as count FROM nguoi_dung
UNION ALL
SELECT 'khach_hang' as table_name, COUNT(*) as count FROM khach_hang
UNION ALL
SELECT 'san_pham' as table_name, COUNT(*) as count FROM san_pham
UNION ALL
SELECT 'phuong_thuc_thanh_toan' as table_name, COUNT(*) as count FROM phuong_thuc_thanh_toan;

-- 2. Kiểm tra dữ liệu đơn hàng
SELECT '=== KIỂM TRA ĐƠN HÀNG ===' as info;
SELECT TOP 5 
    id, 
    ma_don_hang, 
    ngay_dat, 
    tong_tien_hang, 
    tong_thanh_toan 
FROM don_hang 
ORDER BY ngay_dat DESC;

-- 3. Kiểm tra chi tiết đơn hàng
SELECT '=== KIỂM TRA CHI TIẾT ĐƠN HÀNG ===' as info;
SELECT TOP 5 
    ctdh.id_don_hang,
    ctdh.id_nhan_vien_xu_ly,
    ctdh.id_phuong_thuc_thanh_toan,
    ctdh.id_trang_thai,
    ctdh.so_luong,
    dh.ngay_dat
FROM chi_tiet_don_hang ctdh
JOIN don_hang dh ON ctdh.id_don_hang = dh.id
ORDER BY dh.ngay_dat DESC;

-- 4. Kiểm tra trạng thái đơn hàng
SELECT '=== KIỂM TRA TRẠNG THÁI ĐƠN HÀNG ===' as info;
SELECT * FROM trang_thai_don_hang;

-- 5. Tạo dữ liệu mẫu nếu cần
SELECT '=== TẠO DỮ LIỆU MẪU ===' as info;

-- Thêm phương thức thanh toán nếu chưa có
IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE ten_phuong_thuc = N'Tiền mặt')
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (ten_phuong_thuc) VALUES (N'Tiền mặt');
END

IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE ten_phuong_thuc = N'Chuyển khoản')
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (ten_phuong_thuc) VALUES (N'Chuyển khoản');
END

IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE ten_phuong_thuc = N'Ví điện tử')
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (ten_phuong_thuc) VALUES (N'Ví điện tử');
END

-- Thêm trạng thái đơn hàng nếu chưa có
IF NOT EXISTS (SELECT 1 FROM trang_thai_don_hang WHERE ten_trang_thai = N'Chờ xác nhận')
BEGIN
    INSERT INTO trang_thai_don_hang (ten_trang_thai) VALUES (N'Chờ xác nhận');
END

IF NOT EXISTS (SELECT 1 FROM trang_thai_don_hang WHERE ten_trang_thai = N'Đã xác nhận')
BEGIN
    INSERT INTO trang_thai_don_hang (ten_trang_thai) VALUES (N'Đã xác nhận');
END

IF NOT EXISTS (SELECT 1 FROM trang_thai_don_hang WHERE ten_trang_thai = N'Hoàn thành')
BEGIN
    INSERT INTO trang_thai_don_hang (ten_trang_thai) VALUES (N'Hoàn thành');
END

-- 6. Kiểm tra lại sau khi tạo dữ liệu
SELECT '=== KIỂM TRA SAU KHI TẠO DỮ LIỆU ===' as info;
SELECT * FROM phuong_thuc_thanh_toan;
SELECT * FROM trang_thai_don_hang;
