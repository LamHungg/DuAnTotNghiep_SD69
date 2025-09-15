-- Script sửa/tạo tài khoản Admin
-- Chạy script này trong SQL Server Management Studio

-- 1. Xóa tài khoản Admin cũ nếu có
DELETE FROM nguoi_dung WHERE ten_dang_nhap IN ('admin', 'admin2');

-- 2. Tạo tài khoản Admin mới với email đúng
INSERT INTO nguoi_dung (
    ma,
    chuc_vu,
    ten_dang_nhap,
    mat_khau,
    ho_ten,
    email,
    so_dien_thoai,
    trang_thai,
    ngay_tao,
    ngay_cap_nhat
) VALUES 
('AD001', 'ADMIN', 'admin', '123456', 'Admin ZMEN', 'admin@zmen.com', '0909090909', 1, GETDATE(), GETDATE()),
('AD002', 'ADMIN', 'admin2', '123456', 'Admin Backup', 'admin2@zmen.com', '0808080808', 1, GETDATE(), GETDATE());

-- 3. Kiểm tra kết quả
SELECT 
    id,
    ma,
    chuc_vu,
    ten_dang_nhap,
    ho_ten,
    email,
    trang_thai
FROM nguoi_dung 
WHERE ten_dang_nhap IN ('admin', 'admin2')
ORDER BY ma;
