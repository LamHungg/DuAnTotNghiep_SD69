-- Script kiểm tra tài khoản Admin trong database
-- Chạy script này trong SQL Server Management Studio

-- 1. Kiểm tra tất cả tài khoản trong bảng nguoi_dung
SELECT 
    id,
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
FROM nguoi_dung
ORDER BY id;

-- 2. Kiểm tra tài khoản Admin cụ thể
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
   OR email IN ('admin@zmen.com', 'admin2@zmen.com')
   OR chuc_vu = 'ADMIN'
ORDER BY id;

-- 3. Kiểm tra tài khoản có email trống hoặc NULL
SELECT 
    id,
    ma,
    chuc_vu,
    ten_dang_nhap,
    ho_ten,
    email,
    trang_thai
FROM nguoi_dung 
WHERE email IS NULL OR email = '' OR email = 'NULL'
ORDER BY id;

-- 4. Đếm tổng số tài khoản
SELECT 
    COUNT(*) as total_accounts,
    COUNT(CASE WHEN chuc_vu = 'ADMIN' THEN 1 END) as admin_accounts,
    COUNT(CASE WHEN chuc_vu = 'Nhân viên' THEN 1 END) as staff_accounts
FROM nguoi_dung;
