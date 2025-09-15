-- Script an toàn để thêm dữ liệu mẫu cho bảng phuong_thuc_thanh_toan
-- Chạy script này trong SQL Server Management Studio

-- Kiểm tra xem bảng có tồn tại không
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'phuong_thuc_thanh_toan')
BEGIN
    PRINT 'Bảng phuong_thuc_thanh_toan không tồn tại!';
    RETURN;
END

-- Kiểm tra dữ liệu hiện tại
SELECT 'Current data' as status, COUNT(*) as count FROM phuong_thuc_thanh_toan;

-- Kiểm tra xem có dữ liệu nào đã tồn tại không
IF EXISTS (SELECT * FROM phuong_thuc_thanh_toan WHERE ten_phuong_thuc = 'Thanh toán khi nhận hàng')
BEGIN
    PRINT 'Dữ liệu payment methods đã tồn tại!';
    SELECT * FROM phuong_thuc_thanh_toan;
    RETURN;
END

-- Thêm dữ liệu mẫu (chỉ thêm nếu chưa có)
INSERT INTO phuong_thuc_thanh_toan (ten_phuong_thuc) 
SELECT 'Thanh toán khi nhận hàng'
WHERE NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE ten_phuong_thuc = 'Thanh toán khi nhận hàng');

INSERT INTO phuong_thuc_thanh_toan (ten_phuong_thuc) 
SELECT 'Chuyển khoản ngân hàng'
WHERE NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE ten_phuong_thuc = 'Chuyển khoản ngân hàng');

INSERT INTO phuong_thuc_thanh_toan (ten_phuong_thuc) 
SELECT 'Ví điện tử'
WHERE NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE ten_phuong_thuc = 'Ví điện tử');

INSERT INTO phuong_thuc_thanh_toan (ten_phuong_thuc) 
SELECT 'Thẻ tín dụng/ghi nợ'
WHERE NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE ten_phuong_thuc = 'Thẻ tín dụng/ghi nợ');

-- Kiểm tra dữ liệu sau khi thêm
SELECT 'After insert' as status, COUNT(*) as count FROM phuong_thuc_thanh_toan;

-- Hiển thị dữ liệu cuối cùng
SELECT 'Final data' as status, * FROM phuong_thuc_thanh_toan ORDER BY id;

PRINT 'Script hoàn thành thành công!';
