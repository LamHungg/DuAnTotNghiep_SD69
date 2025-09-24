-- Script sửa constraints chính xác cho POS system
-- Dựa trên cấu trúc database thực tế từ databasenew.sql

USE abcd7;

-- 1. Sửa constraints cho bảng chi_tiet_don_hang
PRINT 'Đang sửa constraints cho bảng chi_tiet_don_hang...';

-- Fix 1: Allow NULL for id_trang_thai (hiện tại là NOT NULL)
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_trang_thai INT NULL;
PRINT 'Đã sửa id_trang_thai cho phép NULL';

-- Fix 2: Allow NULL for id_dia_chi (hiện tại là NOT NULL)
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_dia_chi INT NULL;
PRINT 'Đã sửa id_dia_chi cho phép NULL';

-- 3. Cập nhật dữ liệu NULL thành 0 cho các trường số
UPDATE chi_tiet_don_hang SET phi_van_chuyen = 0 WHERE phi_van_chuyen IS NULL;
UPDATE chi_tiet_don_hang SET tien_giam_gia = 0 WHERE tien_giam_gia IS NULL;
PRINT 'Đã cập nhật dữ liệu NULL thành 0';

-- 4. Thêm default constraints nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.default_constraints WHERE name = 'DF_chi_tiet_don_hang_phi_van_chuyen')
BEGIN
    ALTER TABLE chi_tiet_don_hang ADD CONSTRAINT DF_chi_tiet_don_hang_phi_van_chuyen DEFAULT 0 FOR phi_van_chuyen;
    PRINT 'Đã thêm default constraint cho phi_van_chuyen';
END

IF NOT EXISTS (SELECT * FROM sys.default_constraints WHERE name = 'DF_chi_tiet_don_hang_tien_giam_gia')
BEGIN
    ALTER TABLE chi_tiet_don_hang ADD CONSTRAINT DF_chi_tiet_don_hang_tien_giam_gia DEFAULT 0 FOR tien_giam_gia;
    PRINT 'Đã thêm default constraint cho tien_giam_gia';
END

-- 5. Kiểm tra kết quả
PRINT 'Kiểm tra cấu trúc bảng sau khi sửa:';
SELECT 
    COLUMN_NAME,
    IS_NULLABLE,
    DATA_TYPE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'chi_tiet_don_hang' 
AND TABLE_SCHEMA = 'dbo'
AND COLUMN_NAME IN ('id_trang_thai', 'id_dia_chi', 'id_khach_hang', 'id_voucher', 'id_nhan_vien_xu_ly', 'id_phuong_thuc_thanh_toan')
ORDER BY COLUMN_NAME;

-- 6. Thêm dữ liệu mẫu cho phương thức thanh toán nếu chưa có
IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE id = 1)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc) 
    VALUES (1, 'Tiền mặt');
    PRINT 'Đã thêm phương thức thanh toán: Tiền mặt';
END

IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE id = 2)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc) 
    VALUES (2, 'Chuyển khoản');
    PRINT 'Đã thêm phương thức thanh toán: Chuyển khoản';
END

-- 7. Thêm dữ liệu mẫu cho trạng thái đơn hàng nếu chưa có
IF NOT EXISTS (SELECT 1 FROM trang_thai_don_hang WHERE id = 1)
BEGIN
    INSERT INTO trang_thai_don_hang (id, ten_trang_thai) 
    VALUES (1, 'Hoàn thành');
    PRINT 'Đã thêm trạng thái: Hoàn thành';
END

-- 8. Thêm địa chỉ mặc định nếu chưa có
IF NOT EXISTS (SELECT 1 FROM dia_chi WHERE id = 1)
BEGIN
    INSERT INTO dia_chi (id, tinh_thanh, quan_huyen, phuong_xa, duong, dia_chi_mac_dinh) 
    VALUES (1, 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', 'Tại cửa hàng', 1);
    PRINT 'Đã thêm địa chỉ mặc định: Tại cửa hàng';
END

-- 9. Kiểm tra dữ liệu hiện tại
PRINT 'Kiểm tra dữ liệu hiện tại:';
SELECT 'phuong_thuc_thanh_toan' as table_name, COUNT(*) as count FROM phuong_thuc_thanh_toan
UNION ALL
SELECT 'trang_thai_don_hang', COUNT(*) FROM trang_thai_don_hang
UNION ALL
SELECT 'dia_chi', COUNT(*) FROM dia_chi;

PRINT '🎉 POS database constraints đã được sửa thành công!';
PRINT '✅ POS system sẵn sàng hoạt động!';
