-- Script để sửa database constraints cho POS system
-- Cho phép NULL cho các trường không bắt buộc trong POS

-- 1. Sửa bảng chi_tiet_don_hang để cho phép NULL cho id_dia_chi
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_dia_chi INT NULL;

-- 2. Sửa bảng chi_tiet_don_hang để cho phép NULL cho id_khach_hang (cho khách lẻ)
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_khach_hang INT NULL;

-- 3. Sửa bảng chi_tiet_don_hang để cho phép NULL cho id_voucher (cho đơn không có voucher)
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_voucher INT NULL;

-- 4. Sửa bảng chi_tiet_don_hang để cho phép NULL cho id_nhan_vien_xu_ly (cho POS tự động)
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_nhan_vien_xu_ly INT NULL;

-- 5. Sửa bảng chi_tiet_don_hang để cho phép NULL cho id_phuong_thuc_thanh_toan (sẽ set sau)
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_phuong_thuc_thanh_toan INT NULL;

-- 6. Sửa bảng chi_tiet_don_hang để cho phép NULL cho id_trang_thai (sẽ set mặc định)
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_trang_thai INT NULL;

-- 7. Thêm giá trị mặc định cho các trường số
ALTER TABLE chi_tiet_don_hang ADD CONSTRAINT DF_chi_tiet_don_hang_phi_van_chuyen DEFAULT 0 FOR phi_van_chuyen;
ALTER TABLE chi_tiet_don_hang ADD CONSTRAINT DF_chi_tiet_don_hang_tien_giam_gia DEFAULT 0 FOR tien_giam_gia;

-- 8. Kiểm tra kết quả
SELECT 
    COLUMN_NAME,
    IS_NULLABLE,
    DATA_TYPE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'chi_tiet_don_hang' 
AND TABLE_SCHEMA = 'dbo'
ORDER BY ORDINAL_POSITION;

-- 9. Thêm dữ liệu mẫu cho phương thức thanh toán nếu chưa có
IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE id = 1)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc, mo_ta, trang_thai) 
    VALUES (1, 'Tiền mặt', 'Thanh toán bằng tiền mặt', 1);
END

IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE id = 2)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc, mo_ta, trang_thai) 
    VALUES (2, 'Chuyển khoản', 'Thanh toán bằng chuyển khoản ngân hàng', 1);
END

-- 10. Thêm dữ liệu mẫu cho trạng thái đơn hàng nếu chưa có
IF NOT EXISTS (SELECT 1 FROM trang_thai_don_hang WHERE id = 1)
BEGIN
    INSERT INTO trang_thai_don_hang (id, ten_trang_thai, mo_ta, trang_thai) 
    VALUES (1, 'Hoàn thành', 'Đơn hàng đã hoàn thành', 1);
END

-- 11. Thêm dữ liệu mẫu cho địa chỉ mặc định nếu chưa có
IF NOT EXISTS (SELECT 1 FROM dia_chi WHERE id = 1)
BEGIN
    INSERT INTO dia_chi (id, dia_chi_chi_tiet, id_phuong_xa, id_quan_huyen, id_tinh_thanh, trang_thai) 
    VALUES (1, 'Tại cửa hàng', 1, 1, 1, 1);
END

PRINT 'Database constraints fixed for POS system!';
