-- Script để cập nhật phương thức thanh toán chỉ có 2 phương thức
-- Tiền mặt và Chuyển khoản

-- Kiểm tra bảng có tồn tại không
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'phuong_thuc_thanh_toan')
BEGIN
    PRINT '❌ Bảng phuong_thuc_thanh_toan không tồn tại!';
    RETURN;
END

PRINT '✅ Bảng phuong_thuc_thanh_toan tồn tại';

-- Hiển thị dữ liệu hiện tại
PRINT '📊 Dữ liệu hiện tại:';
SELECT 'Current' as status, COUNT(*) as count FROM phuong_thuc_thanh_toan;
SELECT id, ten_phuong_thuc FROM phuong_thuc_thanh_toan ORDER BY id;

-- Xóa tất cả dữ liệu cũ
DELETE FROM phuong_thuc_thanh_toan;
PRINT '🗑️ Đã xóa dữ liệu cũ';

-- Thêm 2 phương thức thanh toán mới
INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc) VALUES 
(1, 'Tiền mặt'),
(2, 'Chuyển khoản');

PRINT '✅ Đã thêm 2 phương thức thanh toán mới';

-- Hiển thị dữ liệu sau khi cập nhật
PRINT '📊 Dữ liệu sau khi cập nhật:';
SELECT 'Updated' as status, COUNT(*) as count FROM phuong_thuc_thanh_toan;
SELECT id, ten_phuong_thuc FROM phuong_thuc_thanh_toan ORDER BY id;

PRINT '🎉 Hoàn thành cập nhật phương thức thanh toán!';
