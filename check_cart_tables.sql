-- Kiểm tra bảng gio_hang
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'gio_hang')
BEGIN
    CREATE TABLE gio_hang (
        id INT IDENTITY(1,1) PRIMARY KEY,
        id_khach_hang INT NOT NULL,
        ngay_tao DATETIME DEFAULT GETDATE(),
        ngay_cap_nhat DATETIME,
        FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id)
    );
    PRINT 'Đã tạo bảng gio_hang';
END
ELSE
BEGIN
    PRINT 'Bảng gio_hang đã tồn tại';
END

-- Kiểm tra bảng chi_tiet_gio_hang
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'chi_tiet_gio_hang')
BEGIN
    CREATE TABLE chi_tiet_gio_hang (
        id INT IDENTITY(1,1) PRIMARY KEY,
        id_gio_hang INT NOT NULL,
        id_chi_tiet_san_pham INT NOT NULL,
        so_luong INT NOT NULL,
        FOREIGN KEY (id_gio_hang) REFERENCES gio_hang(id),
        FOREIGN KEY (id_chi_tiet_san_pham) REFERENCES chi_tiet_san_pham(id)
    );
    PRINT 'Đã tạo bảng chi_tiet_gio_hang';
END
ELSE
BEGIN
    PRINT 'Bảng chi_tiet_gio_hang đã tồn tại';
END

-- Kiểm tra dữ liệu
SELECT 'gio_hang' as table_name, COUNT(*) as count FROM gio_hang
UNION ALL
SELECT 'chi_tiet_gio_hang' as table_name, COUNT(*) as count FROM chi_tiet_gio_hang;

-- Kiểm tra khách hàng có sẵn
SELECT TOP 5 id, ho_ten, so_dien_thoai FROM khach_hang;
