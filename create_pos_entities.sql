-- Script tạo các entity cần thiết cho POS
-- Chạy script này để tạo các bản ghi cần thiết cho POS orders

-- 1. Tạo TrangThaiDonHang cho POS (ID = 5 = Hoàn thành)
INSERT INTO trang_thai_don_hang (id, ten_trang_thai, mo_ta) 
VALUES (5, 'Hoàn thành', 'Đơn hàng đã hoàn thành')
ON DUPLICATE KEY UPDATE ten_trang_thai = 'Hoàn thành', mo_ta = 'Đơn hàng đã hoàn thành';

-- 2. Tạo DiaChi cho POS (ID = 1 = Tại cửa hàng)
INSERT INTO dia_chi (id, dia_chi_chi_tiet, phuong_xa, quan_huyen, tinh_thanh, loai_dia_chi) 
VALUES (1, 'Tại cửa hàng', 'Phường 1', 'Quận 1', 'TP.HCM', 'Cửa hàng')
ON DUPLICATE KEY UPDATE dia_chi_chi_tiet = 'Tại cửa hàng', phuong_xa = 'Phường 1', quan_huyen = 'Quận 1', tinh_thanh = 'TP.HCM', loai_dia_chi = 'Cửa hàng';

-- 3. Tạo PhuongThucThanhToan cho POS
INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc, mo_ta, trang_thai) 
VALUES (1, 'Tiền mặt', 'Thanh toán bằng tiền mặt', 1)
ON DUPLICATE KEY UPDATE ten_phuong_thuc = 'Tiền mặt', mo_ta = 'Thanh toán bằng tiền mặt', trang_thai = 1;

INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc, mo_ta, trang_thai) 
VALUES (2, 'Chuyển khoản', 'Thanh toán chuyển khoản ngân hàng', 1)
ON DUPLICATE KEY UPDATE ten_phuong_thuc = 'Chuyển khoản', mo_ta = 'Thanh toán chuyển khoản ngân hàng', trang_thai = 1;

INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc, mo_ta, trang_thai) 
VALUES (3, 'Thẻ tín dụng', 'Thanh toán bằng thẻ tín dụng', 1)
ON DUPLICATE KEY UPDATE ten_phuong_thuc = 'Thẻ tín dụng', mo_ta = 'Thanh toán bằng thẻ tín dụng', trang_thai = 1;

INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc, mo_ta, trang_thai) 
VALUES (4, 'Ví điện tử', 'Thanh toán bằng ví điện tử', 1)
ON DUPLICATE KEY UPDATE ten_phuong_thuc = 'Ví điện tử', mo_ta = 'Thanh toán bằng ví điện tử', trang_thai = 1;

-- 4. Kiểm tra dữ liệu đã tạo
SELECT 'TrangThaiDonHang' as table_name, id, ten_trang_thai as name FROM trang_thai_don_hang WHERE id = 5
UNION ALL
SELECT 'DiaChi' as table_name, id, dia_chi_chi_tiet as name FROM dia_chi WHERE id = 1
UNION ALL
SELECT 'PhuongThucThanhToan' as table_name, id, ten_phuong_thuc as name FROM phuong_thuc_thanh_toan WHERE id IN (1,2,3,4);

-- 5. Kiểm tra ChiTietSanPham có sẵn
SELECT 'ChiTietSanPham' as table_name, id, ten_san_pham as name, so_luong FROM chi_tiet_san_pham WHERE so_luong > 0 LIMIT 5;
