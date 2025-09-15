-- Script tạo bảng nếu chưa có
-- Chạy script này để tạo các bảng cần thiết

-- ========================================
-- 1. TẠO BẢNG KHÁCH HÀNG (NẾU CHƯA CÓ)
-- ========================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'khach_hang')
BEGIN
    CREATE TABLE khach_hang (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ma_khach_hang NVARCHAR(50) UNIQUE NOT NULL,
        ho_ten NVARCHAR(100) NOT NULL,
        so_dien_thoai NVARCHAR(20) UNIQUE NOT NULL,
        email NVARCHAR(100) UNIQUE NOT NULL,
        ngay_sinh DATE,
        gioi_tinh NVARCHAR(10),
        ngay_dang_ky DATETIME2 DEFAULT GETDATE(),
        ten_dang_nhap NVARCHAR(50) UNIQUE NOT NULL,
        mat_khau NVARCHAR(255) NOT NULL,
        trang_thai_tai_khoan INT DEFAULT 1
    );
    PRINT 'Đã tạo bảng khach_hang';
END
ELSE
BEGIN
    PRINT 'Bảng khach_hang đã tồn tại';
END

-- ========================================
-- 2. TẠO BẢNG ĐỊA CHỈ KHÁCH HÀNG (NẾU CHƯA CÓ)
-- ========================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang')
BEGIN
    CREATE TABLE dia_chi_khach_hang (
        id INT IDENTITY(1,1) PRIMARY KEY,
        khach_hang_id INT NOT NULL,
        ho_ten NVARCHAR(100) NOT NULL,
        so_dien_thoai NVARCHAR(20),
        tinh_thanh NVARCHAR(100),
        quan_huyen NVARCHAR(100),
        phuong_xa NVARCHAR(100),
        dia_chi_chi_tiet NVARCHAR(255),
        loai_dia_chi NVARCHAR(50),
        mac_dinh BIT DEFAULT 0,
        ngay_tao DATETIME2 DEFAULT GETDATE(),
        ngay_cap_nhat DATETIME2 DEFAULT GETDATE(),
        FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id)
    );
    PRINT 'Đã tạo bảng dia_chi_khach_hang';
END
ELSE
BEGIN
    PRINT 'Bảng dia_chi_khach_hang đã tồn tại';
END

-- ========================================
-- 3. THÊM DỮ LIỆU MẪU (NẾU CHƯA CÓ)
-- ========================================
-- Thêm khách hàng mẫu nếu chưa có
IF NOT EXISTS (SELECT * FROM khach_hang WHERE id = 7)
BEGIN
    INSERT INTO khach_hang (ma_khach_hang, ho_ten, so_dien_thoai, email, ten_dang_nhap, mat_khau, trang_thai_tai_khoan)
    VALUES ('KH007', 'Lam Hung', '0876743212', 'lamhung@example.com', 'lamhung@example.com', 'password123', 1);
    PRINT 'Đã thêm khách hàng mẫu ID 7';
END
ELSE
BEGIN
    PRINT 'Khách hàng ID 7 đã tồn tại';
END

-- Thêm địa chỉ mẫu nếu chưa có
IF NOT EXISTS (SELECT * FROM dia_chi_khach_hang WHERE khach_hang_id = 7)
BEGIN
    INSERT INTO dia_chi_khach_hang (khach_hang_id, ho_ten, so_dien_thoai, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet, loai_dia_chi, mac_dinh)
    VALUES (7, 'Lam Hung', '0876743212', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', '123 Đường ABC', 'Nhà riêng', 1);
    PRINT 'Đã thêm địa chỉ mẫu cho khách hàng ID 7';
END
ELSE
BEGIN
    PRINT 'Địa chỉ cho khách hàng ID 7 đã tồn tại';
END

-- ========================================
-- 4. KIỂM TRA KẾT QUẢ
-- ========================================
-- Kiểm tra khách hàng
SELECT 
    id,
    ma_khach_hang,
    ho_ten,
    so_dien_thoai,
    email,
    trang_thai_tai_khoan,
    ngay_dang_ky
FROM khach_hang
ORDER BY id;

-- Kiểm tra địa chỉ
SELECT 
    dc.id,
    dc.khach_hang_id,
    kh.ho_ten as ten_khach_hang,
    dc.ho_ten,
    dc.so_dien_thoai,
    dc.tinh_thanh,
    dc.quan_huyen,
    dc.phuong_xa,
    dc.dia_chi_chi_tiet,
    dc.loai_dia_chi,
    dc.mac_dinh,
    dc.ngay_tao,
    dc.ngay_cap_nhat
FROM dia_chi_khach_hang dc
LEFT JOIN khach_hang kh ON dc.khach_hang_id = kh.id
ORDER BY dc.khach_hang_id, dc.mac_dinh DESC, dc.ngay_tao DESC;

-- ========================================
-- 5. THỐNG KÊ
-- ========================================
SELECT 
    'Tổng số khách hàng' as metric,
    COUNT(*) as value
FROM khach_hang
UNION ALL
SELECT 
    'Tổng số địa chỉ',
    COUNT(*)
FROM dia_chi_khach_hang
UNION ALL
SELECT 
    'Địa chỉ của user ID 7',
    COUNT(*)
FROM dia_chi_khach_hang
WHERE khach_hang_id = 7;
