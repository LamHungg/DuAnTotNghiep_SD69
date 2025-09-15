-- Script tạo bảng địa chỉ khách hàng
-- Chạy script này trong SQL Server Management Studio

-- Tạo bảng dia_chi_khach_hang
CREATE TABLE dia_chi_khach_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    khach_hang_id INT NOT NULL,
    ho_ten NVARCHAR(100) NOT NULL,
    so_dien_thoai VARCHAR(15),
    tinh_thanh NVARCHAR(100),
    quan_huyen NVARCHAR(100),
    phuong_xa NVARCHAR(100),
    dia_chi_chi_tiet NVARCHAR(500),
    loai_dia_chi VARCHAR(20) DEFAULT 'home', -- 'home', 'office'
    mac_dinh BIT DEFAULT 0,
    ngay_tao DATETIME DEFAULT GETDATE(),
    ngay_cap_nhat DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (khach_hang_id) REFERENCES khach_hang(id) ON DELETE CASCADE
);

-- Tạo index cho khóa ngoại
CREATE INDEX IX_dia_chi_khach_hang_khach_hang_id ON dia_chi_khach_hang(khach_hang_id);

-- Tạo index cho địa chỉ mặc định
CREATE INDEX IX_dia_chi_khach_hang_mac_dinh ON dia_chi_khach_hang(mac_dinh);

-- Thêm dữ liệu mẫu
INSERT INTO dia_chi_khach_hang (khach_hang_id, ho_ten, so_dien_thoai, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet, loai_dia_chi, mac_dinh)
VALUES 
(7, 'Lam Hung', '0876743212', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', 'Số 1, Trần Đăng Ninh', 'home', 1),
(7, 'Lam Hung', '0876743212', 'Hà Nội', 'Đống Đa', 'Láng Hạ', 'Số 15, Láng Hạ', 'office', 0);

-- Kiểm tra dữ liệu
SELECT * FROM dia_chi_khach_hang WHERE khach_hang_id = 7;
