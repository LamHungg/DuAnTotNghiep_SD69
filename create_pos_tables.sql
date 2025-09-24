-- Script để tạo các bảng cần thiết cho POS system
-- Kiểm tra và tạo bảng nếu chưa tồn tại

-- 1. Tạo bảng chi_tiet_don_hang nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'chi_tiet_don_hang' AND TABLE_SCHEMA = 'dbo')
BEGIN
    CREATE TABLE chi_tiet_don_hang (
        id INT IDENTITY(1,1) PRIMARY KEY,
        id_don_hang INT,
        id_chi_tiet_san_pham INT,
        id_trang_thai INT NULL,
        id_khach_hang INT NULL,
        id_dia_chi INT NULL,
        id_nhan_vien_xu_ly INT NULL,
        id_voucher INT NULL,
        id_phuong_thuc_thanh_toan INT NULL,
        ngay_thanh_toan DATETIME NULL,
        phi_van_chuyen DECIMAL(18,2) DEFAULT 0,
        tien_giam_gia DECIMAL(18,2) DEFAULT 0,
        so_luong INT NOT NULL,
        ghi_chu_khach_hang NVARCHAR(500) NULL,
        ly_do_huy NVARCHAR(500) NULL
    );
    PRINT 'Bảng chi_tiet_don_hang đã được tạo';
END
ELSE
BEGIN
    PRINT 'Bảng chi_tiet_don_hang đã tồn tại';
END

-- 2. Tạo bảng don_hang nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'don_hang' AND TABLE_SCHEMA = 'dbo')
BEGIN
    CREATE TABLE don_hang (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ma_don_hang NVARCHAR(50) UNIQUE NOT NULL,
        ngay_dat DATETIME NOT NULL,
        tong_thanh_toan DECIMAL(18,2) NOT NULL,
        tong_tien_hang DECIMAL(18,2) NOT NULL,
        loai_don_hang BIT DEFAULT 0, -- 0 = POS, 1 = Online
        id_khach_hang INT NULL,
        id_nguoi_tao INT NULL
    );
    PRINT 'Bảng don_hang đã được tạo';
END
ELSE
BEGIN
    PRINT 'Bảng don_hang đã tồn tại';
END

-- 3. Tạo bảng phuong_thuc_thanh_toan nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'phuong_thuc_thanh_toan' AND TABLE_SCHEMA = 'dbo')
BEGIN
    CREATE TABLE phuong_thuc_thanh_toan (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ten_phuong_thuc NVARCHAR(100) NOT NULL,
        mo_ta NVARCHAR(500) NULL,
        trang_thai BIT DEFAULT 1
    );
    
    -- Thêm dữ liệu mẫu
    INSERT INTO phuong_thuc_thanh_toan (ten_phuong_thuc, mo_ta, trang_thai) VALUES 
    ('Tiền mặt', 'Thanh toán bằng tiền mặt', 1),
    ('Chuyển khoản', 'Thanh toán bằng chuyển khoản ngân hàng', 1);
    
    PRINT 'Bảng phuong_thuc_thanh_toan đã được tạo với dữ liệu mẫu';
END
ELSE
BEGIN
    PRINT 'Bảng phuong_thuc_thanh_toan đã tồn tại';
END

-- 4. Tạo bảng trang_thai_don_hang nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'trang_thai_don_hang' AND TABLE_SCHEMA = 'dbo')
BEGIN
    CREATE TABLE trang_thai_don_hang (
        id INT IDENTITY(1,1) PRIMARY KEY,
        ten_trang_thai NVARCHAR(100) NOT NULL,
        mo_ta NVARCHAR(500) NULL,
        trang_thai BIT DEFAULT 1
    );
    
    -- Thêm dữ liệu mẫu
    INSERT INTO trang_thai_don_hang (ten_trang_thai, mo_ta, trang_thai) VALUES 
    ('Hoàn thành', 'Đơn hàng đã hoàn thành', 1),
    ('Đang xử lý', 'Đơn hàng đang được xử lý', 1),
    ('Đã hủy', 'Đơn hàng đã bị hủy', 1);
    
    PRINT 'Bảng trang_thai_don_hang đã được tạo với dữ liệu mẫu';
END
ELSE
BEGIN
    PRINT 'Bảng trang_thai_don_hang đã tồn tại';
END

-- 5. Tạo bảng dia_chi nếu chưa tồn tại
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi' AND TABLE_SCHEMA = 'dbo')
BEGIN
    CREATE TABLE dia_chi (
        id INT IDENTITY(1,1) PRIMARY KEY,
        dia_chi_chi_tiet NVARCHAR(500) NOT NULL,
        id_phuong_xa INT NULL,
        id_quan_huyen INT NULL,
        id_tinh_thanh INT NULL,
        trang_thai BIT DEFAULT 1
    );
    
    -- Thêm địa chỉ mặc định cho POS
    INSERT INTO dia_chi (dia_chi_chi_tiet, id_phuong_xa, id_quan_huyen, id_tinh_thanh, trang_thai) VALUES 
    ('Tại cửa hàng', 1, 1, 1, 1);
    
    PRINT 'Bảng dia_chi đã được tạo với dữ liệu mẫu';
END
ELSE
BEGIN
    PRINT 'Bảng dia_chi đã tồn tại';
END

-- 6. Kiểm tra và thêm Foreign Key constraints nếu cần
-- (Có thể thêm sau khi đã có đầy đủ các bảng liên quan)

PRINT 'Tất cả các bảng POS đã được kiểm tra và tạo!';
