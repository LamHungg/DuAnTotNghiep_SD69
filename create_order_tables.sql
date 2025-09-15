-- Script tạo bảng đơn hàng
-- Chạy script này trong SQL Server Management Studio

-- Tạo bảng don_hang
CREATE TABLE don_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_don_hang VARCHAR(50) UNIQUE NOT NULL,
    khach_hang_id INT NOT NULL,
    ngay_dat DATETIME DEFAULT GETDATE(),
    ngay_giao DATETIME NULL,
    tong_tien DECIMAL(18,2) DEFAULT 0,
    trang_thai VARCHAR(50) DEFAULT 'pending', -- 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
    ghi_chu NVARCHAR(500),
    dia_chi_giao NVARCHAR(500),
    so_dien_thoai_giao VARCHAR(15),
    ho_ten_nguoi_nhan NVARCHAR(100),
    FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE
);

-- Tạo bảng chi_tiet_don_hang
CREATE TABLE chi_tiet_don_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    don_hang_id INT NOT NULL,
    san_pham_id INT NOT NULL,
    so_luong INT NOT NULL,
    don_gia DECIMAL(18,2) NOT NULL,
    thanh_tien DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (don_hang_id) REFERENCES don_hang(id) ON DELETE CASCADE,
    FOREIGN KEY (san_pham_id) REFERENCES san_pham(id) ON DELETE CASCADE
);

-- Tạo indexes
CREATE INDEX IX_don_hang_khach_hang_id ON don_hang(khach_hang_id);
CREATE INDEX IX_don_hang_trang_thai ON don_hang(trang_thai);
CREATE INDEX IX_don_hang_ngay_dat ON don_hang(ngay_dat);
CREATE INDEX IX_chi_tiet_don_hang_don_hang_id ON chi_tiet_don_hang(don_hang_id);
CREATE INDEX IX_chi_tiet_don_hang_san_pham_id ON chi_tiet_don_hang(san_pham_id);

-- Thêm dữ liệu mẫu
-- Đơn hàng 1
INSERT INTO don_hang (ma_don_hang, khach_hang_id, ngay_dat, tong_tien, trang_thai, dia_chi_giao, so_dien_thoai_giao, ho_ten_nguoi_nhan)
VALUES ('DH001', 7, '2024-01-15 10:00:00', 150000, 'delivered', 'Số 1, Trần Đăng Ninh, Dịch Vọng, Cầu Giấy, Hà Nội', '0876743212', 'Lam Hung');

-- Chi tiết đơn hàng 1
INSERT INTO chi_tiet_don_hang (don_hang_id, san_pham_id, so_luong, don_gia, thanh_tien)
VALUES (1, 1, 2, 75000, 150000);

-- Đơn hàng 2
INSERT INTO don_hang (ma_don_hang, khach_hang_id, ngay_dat, tong_tien, trang_thai, dia_chi_giao, so_dien_thoai_giao, ho_ten_nguoi_nhan)
VALUES ('DH002', 7, '2024-01-20 14:30:00', 250000, 'processing', 'Số 15, Láng Hạ, Đống Đa, Hà Nội', '0876743212', 'Lam Hung');

-- Chi tiết đơn hàng 2
INSERT INTO chi_tiet_don_hang (don_hang_id, san_pham_id, so_luong, don_gia, thanh_tien)
VALUES (2, 2, 1, 150000, 150000);

INSERT INTO chi_tiet_don_hang (don_hang_id, san_pham_id, so_luong, don_gia, thanh_tien)
VALUES (2, 3, 1, 100000, 100000);

-- Kiểm tra dữ liệu
SELECT 
    dh.id,
    dh.ma_don_hang,
    dh.ngay_dat,
    dh.tong_tien,
    dh.trang_thai,
    dh.ho_ten_nguoi_nhan,
    ctdh.so_luong,
    ctdh.don_gia,
    sp.ten_san_pham
FROM don_hang dh
JOIN chi_tiet_don_hang ctdh ON dh.id = ctdh.don_hang_id
JOIN san_pham sp ON ctdh.san_pham_id = sp.id
WHERE dh.khach_hang_id = 7
ORDER BY dh.ngay_dat DESC;
