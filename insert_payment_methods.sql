-- Script để thêm dữ liệu mẫu cho bảng phuong_thuc_thanh_toan
-- Chạy script này trong SQL Server Management Studio

-- Kiểm tra xem bảng có tồn tại không
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'phuong_thuc_thanh_toan')
BEGIN
    PRINT 'Bảng phuong_thuc_thanh_toan không tồn tại!';
    RETURN;
END

-- Kiểm tra dữ liệu hiện tại
SELECT 'Current data' as status, COUNT(*) as count FROM phuong_thuc_thanh_toan;

-- Xóa dữ liệu cũ (nếu có)
DELETE FROM phuong_thuc_thanh_toan;

-- Thêm dữ liệu mẫu
INSERT INTO phuong_thuc_thanh_toan (ten_phuong_thuc) VALUES 
('Thanh toán khi nhận hàng'),
('Chuyển khoản ngân hàng'),
('Ví điện tử'),
('Thẻ tín dụng/ghi nợ');

-- Kiểm tra dữ liệu sau khi thêm
SELECT 'After insert' as status, COUNT(*) as count FROM phuong_thuc_thanh_toan;

-- Hiển thị dữ liệu
SELECT id, ten_phuong_thuc FROM phuong_thuc_thanh_toan ORDER BY id;
