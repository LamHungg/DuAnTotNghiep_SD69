-- Script đơn giản tạo tài khoản Admin
-- Chạy từng câu lệnh một trong SQL Server Management Studio

-- 1. Kiểm tra bảng nguoi_dung
SELECT TOP 5 * FROM nguoi_dung;

-- 2. Thêm tài khoản Admin 1
INSERT INTO nguoi_dung (ma, chuc_vu, ten_dang_nhap, mat_khau, ho_ten, email, so_dien_thoai, trang_thai, ngay_tao, ngay_cap_nhat)
VALUES ('AD001', 'ADMIN', 'admin', '123456', 'Admin ZMEN', 'admin@zmen.com', '0909090909', 1, GETDATE(), GETDATE());

-- 3. Thêm tài khoản Admin 2
INSERT INTO nguoi_dung (ma, chuc_vu, ten_dang_nhap, mat_khau, ho_ten, email, so_dien_thoai, trang_thai, ngay_tao, ngay_cap_nhat)
VALUES ('AD002', 'ADMIN', 'admin2', '123456', 'Admin Backup', 'admin2@zmen.com', '0808080808', 1, GETDATE(), GETDATE());

-- 4. Kiểm tra kết quả
SELECT ma, chuc_vu, ten_dang_nhap, ho_ten, email, trang_thai 
FROM nguoi_dung 
WHERE ten_dang_nhap IN ('admin', 'admin2')
ORDER BY ma;
