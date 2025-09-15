-- Script tạo tài khoản Admin cho hệ thống ZMEN
-- Chạy script này trong SQL Server Management Studio

-- 1. Kiểm tra bảng nguoi_dung có tồn tại không
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'nguoi_dung')
BEGIN
    PRINT 'Bảng nguoi_dung không tồn tại!';
    RETURN;
END

-- 2. Kiểm tra xem đã có admin chưa
IF EXISTS (SELECT * FROM nguoi_dung WHERE ten_dang_nhap = 'admin' OR email = 'admin@zmen.com')
BEGIN
    PRINT 'Tài khoản admin đã tồn tại!';
    SELECT * FROM nguoi_dung WHERE ten_dang_nhap = 'admin' OR email = 'admin@zmen.com';
    RETURN;
END

-- 3. Thêm tài khoản Admin mới
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
) VALUES (
    'AD001',
    'ADMIN',
    'admin',
    '123456',
    'Admin ZMEN',
    'admin@zmen.com',
    '0909090909',
    1,
    GETDATE(),
    GETDATE()
);

-- 4. Thêm tài khoản Admin thứ 2 (backup)
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
) VALUES (
    'AD002',
    'ADMIN',
    'admin2',
    '123456',
    'Admin Backup',
    'admin2@zmen.com',
    '0808080808',
    1,
    GETDATE(),
    GETDATE()
);

-- 5. Thêm tài khoản nhân viên demo
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
) VALUES (
    'NV001',
    'Nhân viên',
    'nv001',
    '123456',
    'Nguyễn Văn A',
    'nva@example.com',
    '0123456789',
    1,
    GETDATE(),
    GETDATE()
);

-- 6. Hiển thị kết quả
PRINT 'Đã tạo thành công các tài khoản:';
SELECT 
    ma,
    chuc_vu,
    ten_dang_nhap,
    ho_ten,
    email,
    so_dien_thoai,
    trang_thai
FROM nguoi_dung 
WHERE ten_dang_nhap IN ('admin', 'admin2', 'nv001')
ORDER BY ma;

PRINT 'Thông tin đăng nhập:';
PRINT 'Admin 1: admin / 123456';
PRINT 'Admin 2: admin2 / 123456';
PRINT 'Nhân viên: nv001 / 123456';
