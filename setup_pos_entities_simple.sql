-- Simple SQL script for SQL Server to create POS entities
-- Execute this in your SQL Server Management Studio or database tool

-- 1. Insert TrangThaiDonHang for POS (ID = 5 = Hoàn thành)
IF NOT EXISTS (SELECT 1 FROM trang_thai_don_hang WHERE id = 5)
BEGIN
    INSERT INTO trang_thai_don_hang (id, ten_trang_thai, mo_ta) 
    VALUES (5, N'Hoàn thành', N'Đơn hàng đã hoàn thành tại quầy POS')
END

-- 2. Insert DiaChi for POS (ID = 1 = Tại cửa hàng)
IF NOT EXISTS (SELECT 1 FROM dia_chi WHERE id = 1)
BEGIN
    INSERT INTO dia_chi (id, dia_chi_chi_tiet, phuong_xa, quan_huyen, tinh_thanh, loai_dia_chi, id_khach_hang) 
    VALUES (1, N'Tại cửa hàng', N'Phường 1', N'Quận 1', N'TP. Hồ Chí Minh', N'Cửa hàng', NULL)
END

-- 3. Insert PhuongThucThanhToan for POS
IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE id = 1)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc, mo_ta, trang_thai) 
    VALUES (1, N'Tiền mặt', N'Thanh toán bằng tiền mặt', 1)
END

IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE id = 2)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc, mo_ta, trang_thai) 
    VALUES (2, N'Chuyển khoản', N'Thanh toán qua chuyển khoản ngân hàng', 1)
END

IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE id = 3)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc, mo_ta, trang_thai) 
    VALUES (3, N'Thẻ tín dụng/ghi nợ', N'Thanh toán bằng thẻ', 1)
END

IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE id = 4)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc, mo_ta, trang_thai) 
    VALUES (4, N'Ví điện tử', N'Thanh toán qua ví điện tử', 1)
END

-- 4. Verify the data was inserted
SELECT 'TrangThaiDonHang' as table_name, id, ten_trang_thai as name FROM trang_thai_don_hang WHERE id = 5
UNION ALL
SELECT 'DiaChi' as table_name, id, dia_chi_chi_tiet as name FROM dia_chi WHERE id = 1
UNION ALL
SELECT 'PhuongThucThanhToan' as table_name, id, ten_phuong_thuc as name FROM phuong_thuc_thanh_toan WHERE id IN (1,2,3,4);

-- 5. Check available products for testing
SELECT TOP 5 'ChiTietSanPham' as table_name, id, so_luong FROM chi_tiet_san_pham WHERE so_luong > 0;
