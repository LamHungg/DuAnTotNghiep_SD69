-- Script để xóa tất cả phương thức thanh toán khác và chỉ giữ lại 2 phương thức chính
-- Tiền mặt (ID: 1) và Chuyển khoản (ID: 2)

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

-- Xóa tất cả phương thức thanh toán khác (không phải ID 1 và 2)
DELETE FROM phuong_thuc_thanh_toan WHERE id NOT IN (1, 2);
PRINT '🗑️ Đã xóa các phương thức thanh toán khác';

-- Kiểm tra xem có ID 1 và 2 không, nếu không có thì tạo mới
IF NOT EXISTS (SELECT * FROM phuong_thuc_thanh_toan WHERE id = 1)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc) VALUES (1, 'Tiền mặt');
    PRINT '✅ Đã tạo phương thức thanh toán ID 1: Tiền mặt';
END

IF NOT EXISTS (SELECT * FROM phuong_thuc_thanh_toan WHERE id = 2)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc) VALUES (2, 'Chuyển khoản');
    PRINT '✅ Đã tạo phương thức thanh toán ID 2: Chuyển khoản';
END

-- Cập nhật tên nếu cần
UPDATE phuong_thuc_thanh_toan SET ten_phuong_thuc = 'Tiền mặt' WHERE id = 1;
UPDATE phuong_thuc_thanh_toan SET ten_phuong_thuc = 'Chuyển khoản' WHERE id = 2;

PRINT '✅ Đã cập nhật tên phương thức thanh toán';

-- Hiển thị dữ liệu sau khi dọn dẹp
PRINT '📊 Dữ liệu sau khi dọn dẹp:';
SELECT 'Cleaned' as status, COUNT(*) as count FROM phuong_thuc_thanh_toan;
SELECT id, ten_phuong_thuc FROM phuong_thuc_thanh_toan ORDER BY id;

-- Kiểm tra kết quả cuối cùng
DECLARE @FinalCount INT;
SELECT @FinalCount = COUNT(*) FROM phuong_thuc_thanh_toan;

IF @FinalCount = 2
BEGIN
    PRINT '🎉 Hoàn thành! Chỉ còn 2 phương thức thanh toán chính.';
    PRINT '💰 ID 1: Tiền mặt';
    PRINT '🏦 ID 2: Chuyển khoản';
END
ELSE
BEGIN
    PRINT '⚠️ Cảnh báo: Số lượng phương thức thanh toán không đúng!';
    PRINT 'Expected: 2, Actual: ' + CAST(@FinalCount AS VARCHAR);
END
