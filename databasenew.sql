

-- =====================================
-- TẠO DATABASE
-- =====================================
CREATE DATABASE abcd7;
GO
USE abcd7;
GO

-- =====================================
-- 1. KÍCH CỠ
-- =====================================
CREATE TABLE kich_co (
    id INT PRIMARY KEY IDENTITY(1,1),
    ten_kich_co NVARCHAR(50) NOT NULL,
    trang_thai TINYINT NOT NULL DEFAULT 1
);

-- =====================================
-- 2. MÀU SẮC
-- =====================================
CREATE TABLE mau_sac (
    id INT PRIMARY KEY IDENTITY(1,1),
    ten_mau_sac NVARCHAR(50) NOT NULL,
    trang_thai TINYINT NOT NULL DEFAULT 1
);

-- =====================================
-- 3. CHẤT LIỆU
-- =====================================
CREATE TABLE chat_lieu (
    id INT PRIMARY KEY IDENTITY(1,1),
    ten_chat_lieu NVARCHAR(100) NOT NULL,
    trang_thai TINYINT NOT NULL DEFAULT 1
);

-- =====================================
-- 4. TRẠNG THÁI ĐƠN HÀNG
-- =====================================
CREATE TABLE trang_thai_don_hang (
    id INT PRIMARY KEY IDENTITY(1,1),
    ten_trang_thai NVARCHAR(100) NOT NULL
);

-- =====================================
-- 5. PHƯƠNG THỨC THANH TOÁN
-- =====================================
CREATE TABLE phuong_thuc_thanh_toan (
    id INT PRIMARY KEY IDENTITY(1,1),
    ten_phuong_thuc NVARCHAR(100) NOT NULL
);

-- =====================================
-- 6. TRẠNG THÁI GIAO HÀNG
-- =====================================
CREATE TABLE trang_thai_giao_hang (
    id INT PRIMARY KEY IDENTITY(1,1),
    ten_trang_thai NVARCHAR(100) NOT NULL
);

-- =====================================
-- 7. NGƯỜI DÙNG
-- =====================================
CREATE TABLE nguoi_dung (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma VARCHAR(50) UNIQUE,
    chuc_vu VARCHAR(20) NOT NULL,
    ten_dang_nhap VARCHAR(100) NOT NULL UNIQUE,
    mat_khau VARCHAR(255) NOT NULL,
    ho_ten NVARCHAR(255),
    email VARCHAR(255) UNIQUE,
    so_dien_thoai VARCHAR(20),
    trang_thai TINYINT NOT NULL DEFAULT 1,
    ngay_tao DATETIME DEFAULT (GETDATE()),
    ngay_cap_nhat DATETIME
);

-- =====================================
-- 8. KHÁCH HÀNG
-- =====================================
CREATE TABLE khach_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_khach_hang VARCHAR(50) UNIQUE,
    ho_ten NVARCHAR(255) NOT NULL,
    so_dien_thoai VARCHAR(20) UNIQUE,
    email VARCHAR(255) UNIQUE,
    ngay_sinh DATE,
    gioi_tinh VARCHAR(10) CHECK (gioi_tinh IN ('NAM', 'NU', 'KHAC')),
    ngay_dang_ky DATETIME DEFAULT (GETDATE()),
    ten_dang_nhap VARCHAR(100) UNIQUE,
    mat_khau VARCHAR(255),
    trang_thai_tai_khoan TINYINT DEFAULT 0
);

-- =====================================
-- 9. ĐỊA CHỈ
-- =====================================
CREATE TABLE dia_chi (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_khach_hang INT NULL,
    tinh_thanh NVARCHAR(255),
    quan_huyen NVARCHAR(255),
    phuong_xa NVARCHAR(255),
    duong NVARCHAR(255),
    dia_chi_mac_dinh BIT DEFAULT 0,
);

-- ĐỊA CHỈ KHÁCH HÀNG 

CREATE TABLE dia_chi_khach_hang (
        id INT IDENTITY(1,1) PRIMARY KEY,
        id_khach_hang INT,
		id_dia_chi INT,
		FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id),
		FOREIGN KEY (id_dia_chi) REFERENCES dia_chi(id)
    );

-- =====================================
-- 10. DANH MỤC
-- =====================================
CREATE TABLE danh_muc (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ten_danh_muc NVARCHAR(255) NOT NULL,
    id_danh_muc_cha INT NULL,
    trang_thai TINYINT NOT NULL DEFAULT 1,
    id_nguoi_tao INT NULL,
    ngay_tao DATETIME DEFAULT (GETDATE()),
    id_nguoi_cap_nhat INT NULL,
    ngay_cap_nhat DATETIME,
    FOREIGN KEY (id_danh_muc_cha) REFERENCES danh_muc(id),
    FOREIGN KEY (id_nguoi_tao) REFERENCES nguoi_dung(id)
);

-- =====================================
-- 11. SẢN PHẨM
-- =====================================
CREATE TABLE san_pham (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_san_pham VARCHAR(50) UNIQUE,
    id_danh_muc INT NOT NULL,
    ten_san_pham NVARCHAR(255) NOT NULL,
    mo_ta TEXT,
    trang_thai TINYINT NOT NULL DEFAULT 1,
    id_nguoi_tao INT NULL,
    ngay_tao DATETIME DEFAULT (GETDATE()),
    id_nguoi_cap_nhat INT NULL,
    ngay_cap_nhat DATETIME,
    deleted_at DATETIME,
    id_nguoi_xoa INT NULL,
    FOREIGN KEY (id_danh_muc) REFERENCES danh_muc(id),
    FOREIGN KEY (id_nguoi_tao) REFERENCES nguoi_dung(id)
);

-- =====================================
-- 13. HÌNH ẢNH SẢN PHẨM (SỬA)
-- =====================================
CREATE TABLE hinh_anh_san_pham (
    id INT PRIMARY KEY IDENTITY(1,1),
    url VARCHAR(500) NOT NULL,
    is_thumbnail BIT NOT NULL DEFAULT 0
);

-- =====================================
-- 14. KHUYẾN MÃI (ĐÃ DI CHUYỂN LÊN TRƯỚC CHI_TIET_SAN_PHAM)
-- =====================================
CREATE TABLE khuyen_mai (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_khuyen_mai VARCHAR(50) UNIQUE,
    ten_khuyen_mai NVARCHAR(255),
    phan_tram_giam DECIMAL(5,2),
    ngay_bat_dau DATE,
    ngay_ket_thuc DATE,
    trang_thai TINYINT NOT NULL DEFAULT 1,
    mo_ta TEXT
);

-- =====================================
-- 12. CHI TIẾT SẢN PHẨM (SỬA)
-- =====================================
CREATE TABLE chi_tiet_san_pham (
    id INT PRIMARY KEY IDENTITY(1,1),
    id_san_pham INT NOT NULL,
    id_kich_co INT NOT NULL,
    id_mau_sac INT NOT NULL,
    id_chat_lieu INT NOT NULL,
	id_khuyen_mai INT , -- Cột mới được thêm
    so_luong INT NOT NULL DEFAULT 0,
    gia DECIMAL(18,2) NOT NULL,
    gia_nhap DECIMAL(18,2) NOT NULL,
    id_nguoi_tao INT,
    ngay_tao DATETIME DEFAULT (GETDATE()),
    id_nguoi_cap_nhat INT,
    ngay_cap_nhat DATETIME,
    id_hinh_anh_san_pham INT,
	FOREIGN KEY (id_khuyen_mai) REFERENCES khuyen_mai(id), -- Ràng buộc mới
    FOREIGN KEY (id_san_pham) REFERENCES san_pham(id),
    FOREIGN KEY (id_kich_co) REFERENCES kich_co(id),
    FOREIGN KEY (id_mau_sac) REFERENCES mau_sac(id),
    FOREIGN KEY (id_chat_lieu) REFERENCES chat_lieu(id),
    FOREIGN KEY (id_nguoi_tao) REFERENCES nguoi_dung(id),
    FOREIGN KEY (id_hinh_anh_san_pham) REFERENCES hinh_anh_san_pham(id)
);


-- =====================================
-- 16. VOUCHER
-- =====================================
CREATE TABLE voucher (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_voucher VARCHAR(50) NOT NULL UNIQUE,
    ten_voucher NVARCHAR(255),
    loai_giam_gia VARCHAR(20) NOT NULL DEFAULT 'PHAN_TRAM',
    gia_tri_giam DECIMAL(18,2) NOT NULL,
    gia_tri_toi_thieu DECIMAL(18,2) DEFAULT 0,
    giam_toi_da DECIMAL(18,2),
    so_luong INT DEFAULT 0,
    ngay_bat_dau DATE,
    ngay_ket_thuc DATE,
    trang_thai TINYINT NOT NULL DEFAULT 1,
    mo_ta TEXT
);

-- =====================================
-- 17. ĐƠN HÀNG
-- =====================================
CREATE TABLE don_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    ma_don_hang VARCHAR(50) UNIQUE,
	loai_don_hang BIT NOT NULL DEFAULT 0, -- 0: offline, 1: online
    ngay_dat DATETIME DEFAULT (GETDATE()),
	tong_tien_hang DECIMAL(18,2),
    tong_thanh_toan DECIMAL(18,2),
);

-- =====================================
-- 18. CHI TIẾT ĐƠN HÀNG
-- =====================================
CREATE TABLE chi_tiet_don_hang (
    id INT PRIMARY KEY IDENTITY(1,1),
    id_don_hang INT NOT NULL,
    id_chi_tiet_san_pham INT NOT NULL,
	id_trang_thai INT NOT NULL,
	id_khach_hang INT NULL,
    id_dia_chi INT NOT NULL,
	id_nhan_vien_xu_ly INT NULL,
    id_voucher INT NULL,
    id_phuong_thuc_thanh_toan INT NULL,
    ngay_thanh_toan DATETIME,
    phi_van_chuyen DECIMAL(18,2) DEFAULT 0,
    tien_giam_gia DECIMAL(18,2) DEFAULT 0,
    so_luong INT NOT NULL,
	ghi_chu_khach_hang TEXT,
    ly_do_huy TEXT,
	FOREIGN KEY (id_trang_thai) REFERENCES trang_thai_don_hang(id),
    FOREIGN KEY (id_don_hang) REFERENCES don_hang(id),
    FOREIGN KEY (id_chi_tiet_san_pham) REFERENCES chi_tiet_san_pham(id),
	FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id),
    FOREIGN KEY (id_dia_chi) REFERENCES dia_chi(id),
	FOREIGN KEY (id_nhan_vien_xu_ly) REFERENCES nguoi_dung(id),
    FOREIGN KEY (id_voucher) REFERENCES voucher(id),
    FOREIGN KEY (id_phuong_thuc_thanh_toan) REFERENCES phuong_thuc_thanh_toan(id)
);

-- =====================================
-- 19. ĐÁNH GIÁ
-- =====================================
CREATE TABLE danh_gia (
    id INT PRIMARY KEY IDENTITY(1,1),
    id_khach_hang INT NOT NULL,
    id_san_pham INT NOT NULL,
    so_sao TINYINT,
    binh_luan TEXT,
    ngay_danh_gia DATETIME,
    FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id),
    FOREIGN KEY (id_san_pham) REFERENCES san_pham(id)
);

-- =====================================
-- 20. GIỎ HÀNG
-- =====================================
CREATE TABLE gio_hang (
    id INT PRIMARY KEY IDENTITY(1,1),
    id_khach_hang INT NOT NULL,
    ngay_tao DATETIME,
    ngay_cap_nhat DATETIME,
    FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id)
);

-- =====================================
-- 21. CHI TIẾT GIỎ HÀNG
-- =====================================
CREATE TABLE chi_tiet_gio_hang (
    id INT PRIMARY KEY IDENTITY(1,1),
    id_gio_hang INT NOT NULL,
    id_chi_tiet_san_pham INT NOT NULL,
    so_luong INT NOT NULL,
    FOREIGN KEY (id_gio_hang) REFERENCES gio_hang(id),
    FOREIGN KEY (id_chi_tiet_san_pham) REFERENCES chi_tiet_san_pham(id)
);

-- =====================================
-- 22. GIAO HÀNG
-- =====================================
CREATE TABLE giao_hang (
    id INT PRIMARY KEY IDENTITY(1,1),
    id_don_hang INT NOT NULL,
    id_nhan_vien_giao INT NOT NULL,
    ma_giao_hang NVARCHAR(50) NOT NULL,
    ngay_bat_dau_giao DATETIME NOT NULL,
    ngay_giao_hang_du_kien DATE NOT NULL,
    ngay_giao_thuc_te DATETIME,
    id_trang_thai_giao_hang INT NOT NULL,
    ghi_chu_nguoi_giao TEXT,
    FOREIGN KEY (id_don_hang) REFERENCES don_hang(id),
    FOREIGN KEY (id_nhan_vien_giao) REFERENCES nguoi_dung(id),
    FOREIGN KEY (id_trang_thai_giao_hang) REFERENCES trang_thai_giao_hang(id)
);

-- =====================================
-- 23. LỊCH SỬ ĐƠN HÀNG
-- =====================================
CREATE TABLE lich_su_don_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_don_hang INT NOT NULL,
    id_trang_thai_moi INT NOT NULL,
    id_nguoi_cap_nhat INT NOT NULL,
    thoi_gian_cap_nhat DATETIME DEFAULT (GETDATE()),
    ghi_chu TEXT,
    id_trang_thai_cu INT,
    FOREIGN KEY (id_don_hang) REFERENCES don_hang(id),
    FOREIGN KEY (id_trang_thai_moi) REFERENCES trang_thai_don_hang(id),
    FOREIGN KEY (id_trang_thai_cu) REFERENCES trang_thai_don_hang(id),
    FOREIGN KEY (id_nguoi_cap_nhat) REFERENCES nguoi_dung(id)
);

-- =====================================
-- 24. LỊCH SỬ GIAO HÀNG
-- =====================================
CREATE TABLE lich_su_giao_hang (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_giao_hang INT NOT NULL,
    id_trang_thai_giao_hang INT NOT NULL,
    id_nguoi_cap_nhat INT,
    thoi_gian_cap_nhat DATETIME DEFAULT (GETDATE()),
    ghi_chu TEXT,
    FOREIGN KEY (id_giao_hang) REFERENCES giao_hang(id),
    FOREIGN KEY (id_trang_thai_giao_hang) REFERENCES trang_thai_giao_hang(id),
    FOREIGN KEY (id_nguoi_cap_nhat) REFERENCES nguoi_dung(id)
);

-- =====================================
-- INSERT DỮ LIỆU
-- =====================================

-- 1. KÍCH CỠ
INSERT INTO kich_co (ten_kich_co) VALUES (N'S'), (N'M'), (N'L'), (N'XL');
INSERT INTO kich_co (ten_kich_co) VALUES (N'XS'), (N'XXL'), (N'Freesize'), (N'28'), (N'30');

-- 2. MÀU SẮC
INSERT INTO mau_sac (ten_mau_sac) VALUES (N'Đen'), (N'Trắng'), (N'Xanh'), (N'Đỏ');
INSERT INTO mau_sac (ten_mau_sac) VALUES (N'Vàng'), (N'Xám'), (N'Hồng'), (N'Tím'), (N'Nâu');

-- 3. CHẤT LIỆU
INSERT INTO chat_lieu (ten_chat_lieu) VALUES (N'Cotton'), (N'Polyester'), (N'Jean');
INSERT INTO chat_lieu (ten_chat_lieu) VALUES (N'Len'), (N'Lụa'), (N'Kaki'), (N'Da'), (N'Nỉ');

-- 4. TRẠNG THÁI ĐƠN HÀNG
INSERT INTO trang_thai_don_hang (ten_trang_thai) VALUES (N'Chờ xác nhận'), (N'Đã xác nhận'), (N'Đang giao'), (N'Đã giao'), (N'Hoàn thành'), (N'Đã hủy');
INSERT INTO trang_thai_don_hang (ten_trang_thai) VALUES (N'Chờ thanh toán'), (N'Đã thanh toán'), (N'Đang xử lý'), (N'Đã hoàn tiền'), (N'Đổi trả');

-- 5. PHƯƠNG THỨC THANH TOÁN
INSERT INTO phuong_thuc_thanh_toan (ten_phuong_thuc) VALUES (N'Tiền mặt'), (N'Chuyển khoản'), (N'Momo');
INSERT INTO phuong_thuc_thanh_toan (ten_phuong_thuc) VALUES (N'Thẻ tín dụng'), (N'VNPay'), (N'ZaloPay'), (N'ShopeePay'), (N'COD');

-- 6. TRẠNG THÁI GIAO HÀNG
INSERT INTO trang_thai_giao_hang (ten_trang_thai) VALUES (N'Đang chuẩn bị'), (N'Đang giao'), (N'Hoàn thành'), (N'Trả hàng');
INSERT INTO trang_thai_giao_hang (ten_trang_thai) VALUES (N'Chờ lấy hàng'), (N'Đã lấy hàng'), (N'Lưu kho'), (N'Thất bại'), (N'Giao lại');

-- 7. NGƯỜI DÙNG
INSERT INTO nguoi_dung (ma, chuc_vu, ten_dang_nhap, mat_khau, ho_ten, email, so_dien_thoai)
VALUES ('NV001', 'ADMIN', 'admin', '123456', N'Nguyễn Văn A', 'admin@example.com', '0911222333');
INSERT INTO nguoi_dung (ma, chuc_vu, ten_dang_nhap, mat_khau, ho_ten, email, so_dien_thoai)
VALUES ('NV002', 'NHANVIEN', 'nhanvien1', '123456', N'Trần Thị C', 'tran.c@example.com', '0911222444'),
       ('NV003', 'NHANVIEN', 'nhanvien2', '123456', N'Phạm Văn D', 'pham.d@example.com', '0911222555'),
       ('NV004', 'ADMIN', 'admin2', '123456', N'Hoàng Thị E', 'hoang.e@example.com', '0911222666'),
       ('NV005', 'NHANVIEN', 'nhanvien3', '123456', N'Đỗ Minh F', 'do.f@example.com', '0911222777'),
       ('NV006', 'NHANVIEN', 'nhanvien4', '123456', N'Lý Gia G', 'ly.g@example.com', '0911222888');

-- 8. KHÁCH HÀNG
INSERT INTO khach_hang (ma_khach_hang, ho_ten, so_dien_thoai, email, ngay_sinh, gioi_tinh, ten_dang_nhap, mat_khau)
VALUES ('KH001', N'Lê Thị B', '0909009001', 'le.b@example.com', '1995-06-15', 'NU', 'le.b', 'abc123');
INSERT INTO khach_hang (ma_khach_hang, ho_ten, so_dien_thoai, email, ngay_sinh, gioi_tinh, ten_dang_nhap, mat_khau)
VALUES ('KH002', N'Nguyễn Văn X', '0909009002', 'nguyen.x@example.com', '1990-01-01', 'NAM', 'nguyen.x', 'pass123'),
       ('KH003', N'Trần Thị Y', '0909009003', 'tran.y@example.com', '1992-02-02', 'NU', 'tran.y', 'pass123'),
       ('KH004', N'Phạm Văn Z', '0909009004', 'pham.z@example.com', '1988-03-03', 'NAM', 'pham.z', 'pass123'),
       ('KH005', N'Đinh Thị W', '0909009005', 'dinh.w@example.com', '1998-04-04', 'NU', 'dinh.w', 'pass123'),
       ('KH006', N'Hoàng Long', '0909009006', 'hoang.long@example.com', '1991-05-05', 'NAM', 'hoang.long', 'pass123');

-- 9. ĐỊA CHỈ
INSERT INTO dia_chi ( tinh_thanh, quan_huyen, phuong_xa, duong, dia_chi_mac_dinh)
VALUES ( N'Hà Nội', N'Cầu Giấy', N'Dịch Vọng', N'Số 1 Phạm Văn Đồng', 1);
INSERT INTO dia_chi (id_khach_hang, tinh_thanh, quan_huyen, phuong_xa, duong, dia_chi_mac_dinh)
VALUES (1, N'Hà Nội', N'Đống Đa', N'Láng Thượng', N'Ngõ 100 Chùa Láng', 0),
       (2, N'TP. Hồ Chí Minh', N'Quận 1', N'Bến Nghé', N'Đường Nguyễn Huệ', 1),
       (2, N'TP. Hồ Chí Minh', N'Quận 3', N'Võ Thị Sáu', N'Đường Nam Kỳ Khởi Nghĩa', 0),
       (3, N'Đà Nẵng', N'Hải Châu', N'Hòa Cường Bắc', N'Đường 2 tháng 9', 1),
       (4, N'Hải Phòng', N'Ngô Quyền', N'Lạch Tray', N'Đường Lạch Tray', 1);

-- 10. DANH MỤC
INSERT INTO danh_muc (ten_danh_muc, trang_thai, id_nguoi_tao)
VALUES (N'Áo', 1, 1), (N'Quần', 1, 1);
INSERT INTO danh_muc (ten_danh_muc, trang_thai, id_nguoi_tao)
VALUES (N'Váy', 1, 1), (N'Giày dép', 1, 1), (N'Phụ kiện', 1, 1),
       (N'Áo sơ mi', 1, 1), (N'Quần jean', 1, 1); -- Thêm danh mục con nếu muốn, ví dụ id_danh_muc_cha = 1 cho áo sơ mi

-- 11. SẢN PHẨM
INSERT INTO san_pham (ma_san_pham, id_danh_muc, ten_san_pham, mo_ta, trang_thai, id_nguoi_tao)
VALUES ('SP001', 1, N'Áo thun nam', N'Áo thun chất liệu cotton mềm mại', 1, 1);
INSERT INTO san_pham (ma_san_pham, id_danh_muc, ten_san_pham, mo_ta, trang_thai, id_nguoi_tao)
VALUES ('SP002', 1, N'Áo khoác dù', N'Áo khoác nhẹ, chống nước', 1, 1),
       ('SP003', 2, N'Quần tây nữ', N'Quần tây công sở thanh lịch', 1, 1),
       ('SP004', 1, N'Áo polo unisex', N'Áo polo cao cấp, đa dạng màu sắc', 1, 1),
       ('SP005', 2, N'Quần short kaki', N'Quần short thoáng mát cho mùa hè', 1, 1),
       ('SP006', 3, N'Váy maxi hoa', N'Váy maxi họa tiết hoa nhí nữ tính', 1, 1);


-- 12. HÌNH ẢNH SẢN PHẨM
INSERT INTO hinh_anh_san_pham (url, is_thumbnail)
VALUES ('/images/sp001-thumb.jpg', 1), ('/images/sp001-1.jpg', 0);
INSERT INTO hinh_anh_san_pham (url, is_thumbnail)
VALUES ('/images/sp002-thumb.jpg', 1), ('/images/sp002-1.jpg', 0),
       ('/images/sp003-thumb.jpg', 1), ('/images/sp003-1.jpg', 0),
       ('/images/sp004-thumb.jpg', 1), ('/images/sp004-1.jpg', 0),
       ('/images/sp005-thumb.jpg', 1), ('/images/sp005-1.jpg', 0);

-- 13. KHUYẾN MÃI (INSERT DỮ LIỆU TRƯỚC KHI CHI_TIET_SAN_PHAM CẦN ĐẾN)
INSERT INTO khuyen_mai (ma_khuyen_mai, ten_khuyen_mai, phan_tram_giam, ngay_bat_dau, ngay_ket_thuc, mo_ta)
VALUES ('KM10', N'Giảm 10%', 10, '2025-06-01', '2025-07-01', N'Giảm giá khai trương');
INSERT INTO khuyen_mai (ma_khuyen_mai, ten_khuyen_mai, phan_tram_giam, ngay_bat_dau, ngay_ket_thuc, mo_ta)
VALUES ('KM20', N'Giảm 20% cho áo khoác', 20, '2025-07-01', '2025-08-01', N'Chương trình hè'),
       ('KM_VIP', N'Khuyến mãi thành viên VIP', 15, '2025-06-15', '2025-09-15', N'Ưu đãi đặc biệt'),
       ('FLASH_SALE', N'Flash Sale cuối tuần', 30, '2025-07-05', '2025-07-07', N'Giảm giá chớp nhoáng'),
       ('NEW_ARRIVALS', N'Ưu đãi sản phẩm mới', 5, '2025-07-01', '2025-07-31', N'Chào đón bộ sưu tập mới'),
       ('END_SEASON', N'Sale cuối mùa', 50, '2025-08-15', '2025-08-31', N'Thanh lý hàng tồn');


-- 14. CHI TIẾT SẢN PHẨM
INSERT INTO chi_tiet_san_pham (id_san_pham, id_khuyen_mai, id_kich_co, id_mau_sac, id_chat_lieu, so_luong, gia, gia_nhap, id_nguoi_tao, id_hinh_anh_san_pham)
VALUES (1, 1, 1, 1, 1, 100, 199000, 120000, 1, 1);
INSERT INTO chi_tiet_san_pham (id_san_pham, id_khuyen_mai, id_kich_co, id_mau_sac, id_chat_lieu, so_luong, gia, gia_nhap, id_nguoi_tao, id_hinh_anh_san_pham)
VALUES (2, 2, 2, 3, 2, 50, 350000, 200000, 1, 3), -- Áo khoác, KM20, M, Xanh, Polyester, hinh_anh_san_pham ID 3
       (3, 1, 3, 2, 1, 75, 280000, 150000, 1, 5), -- Quần tây, KM10, L, Trắng, Cotton, hinh_anh_san_pham ID 5
       (4, 3, 1, 4, 1, 120, 220000, 130000, 1, 7), -- Áo polo, KM_VIP, S, Đỏ, Cotton, hinh_anh_san_pham ID 7
       (5, 1, 4, 1, 3, 80, 180000, 100000, 1, 9), -- Quần short, KM10, XL, Đen, Jean, hinh_anh_san_pham ID 9
       (6, 1, 5, 2, 2, 40, 450000, 250000, 1, 1); -- Váy maxi, KM10, Freesize, Trắng, Polyester, hinh_anh_san_pham ID 1


-- 16. VOUCHER
INSERT INTO voucher (ma_voucher, ten_voucher, loai_giam_gia, gia_tri_giam, gia_tri_toi_thieu, giam_toi_da, so_luong, ngay_bat_dau, ngay_ket_thuc, mo_ta)
VALUES ('VC100K', N'Giảm 100K', 'TIEN', 100000, 500000, NULL, 10, '2025-06-01', '2025-07-01', N'Áp dụng cho đơn từ 500K');
INSERT INTO voucher (ma_voucher, ten_voucher, loai_giam_gia, gia_tri_giam, gia_tri_toi_thieu, giam_toi_da, so_luong, ngay_bat_dau, ngay_ket_thuc, mo_ta)
VALUES ('FREE_SHIP', N'Miễn phí vận chuyển', 'TIEN', 30000, 0, 30000, 50, '2025-07-01', '2025-07-31', N'Miễn phí vận chuyển cho mọi đơn'),
       ('GIAM50K', N'Giảm 50K cho đơn 300K', 'TIEN', 50000, 300000, NULL, 20, '2025-07-01', '2025-08-01', N'Giảm giá cho đơn hàng lớn'),
       ('PERCENT15', N'Giảm 15%', 'PHAN_TRAM', 15, 200000, 100000, 30, '2025-07-01', '2025-07-15', N'Giảm 15% tối đa 100K'),
       ('HELLO_NEW', N'Chào mừng khách hàng mới', 'PHAN_TRAM', 10, 100000, 50000, 100, '2025-06-01', '2025-12-31', N'Dành cho khách hàng đăng ký mới'),
       ('BIRTHDAY_AUG', N'Voucher sinh nhật tháng 8', 'TIEN', 80000, 400000, NULL, 5, '2025-08-01', '2025-08-31', N'Dành cho khách hàng sinh nhật tháng 8');

-- 17. ĐƠN HÀNG
INSERT INTO don_hang (ma_don_hang, loai_don_hang, tong_tien_hang, tong_thanh_toan)
VALUES ('DH001', 1, 500000, 400000);
INSERT INTO don_hang (ma_don_hang, loai_don_hang, tong_tien_hang, tong_thanh_toan)
VALUES ('DH002', 0, 250000, 250000), -- Đơn offline
       ('DH003', 1, 700000, 650000), -- Đơn online, có giảm giá
       ('DH004', 1, 1200000, 1000000),
       ('DH005', 0, 300000, 300000),
       ('DH006', 1, 900000, 850000);

-- 18. CHI TIẾT ĐƠN HÀNG
INSERT INTO chi_tiet_don_hang (id_don_hang, id_trang_thai, id_khach_hang, id_dia_chi, id_chi_tiet_san_pham, so_luong, id_voucher, id_phuong_thuc_thanh_toan)
VALUES (1, 1, 1, 1, 1, 2, 1, 1);
INSERT INTO chi_tiet_don_hang (id_don_hang, id_trang_thai, id_khach_hang, id_dia_chi, id_chi_tiet_san_pham, so_luong, id_voucher, id_phuong_thuc_thanh_toan)
VALUES (2, 2, NULL, 1, 2, 1, NULL, 1), -- Đơn offline, không KH, không voucher
       (3, 3, 2, 2, 3, 2, 2, 2), -- KH2, địa chỉ 2, voucher FREE_SHIP, CK
       (3, 3, 2, 2, 4, 1, 2, 2), -- Thêm sản phẩm khác vào cùng đơn 3
       (4, 1, 3, 4, 5, 3, 3, 3), -- KH3, địa chỉ 4, voucher GIAM50K, Momo
       (5, 2, NULL, 1, 6, 1, NULL, 1); -- Đơn offline, không KH

-- 19. ĐÁNH GIÁ
INSERT INTO danh_gia (id_khach_hang, id_san_pham, so_sao, binh_luan, ngay_danh_gia)
VALUES (1, 1, 5, N'Chất lượng rất tốt!', GETDATE());
INSERT INTO danh_gia (id_khach_hang, id_san_pham, so_sao, binh_luan, ngay_danh_gia)
VALUES (2, 2, 4, N'Áo đẹp, giao hàng nhanh.', GETDATE()),
       (3, 3, 5, N'Quần rất ưng ý, vừa vặn.', GETDATE()),
       (1, 4, 3, N'Màu sắc hơi khác so với ảnh.', GETDATE()),
       (4, 5, 5, N'Chất liệu vải mát, thoải mái.', GETDATE()),
       (5, 6, 4, N'Váy xinh, giá cả hợp lý.', GETDATE());

-- 20. GIỎ HÀNG
INSERT INTO gio_hang (id_khach_hang, ngay_tao, ngay_cap_nhat)
VALUES (1, GETDATE(), GETDATE());
INSERT INTO gio_hang (id_khach_hang, ngay_tao, ngay_cap_nhat)
VALUES (2, GETDATE(), GETDATE()),
       (3, GETDATE(), GETDATE()),
       (4, GETDATE(), GETDATE()),
       (5, GETDATE(), GETDATE()),
       (6, GETDATE(), GETDATE());

-- 21. CHI TIẾT GIỎ HÀNG
INSERT INTO chi_tiet_gio_hang (id_gio_hang, id_chi_tiet_san_pham, so_luong)
VALUES (1, 1, 1);
INSERT INTO chi_tiet_gio_hang (id_gio_hang, id_chi_tiet_san_pham, so_luong)
VALUES (2, 2, 1),
       (2, 4, 1),
       (3, 3, 2),
       (4, 5, 1),
       (5, 6, 1);

-- 22. GIAO HÀNG
INSERT INTO giao_hang (id_don_hang, id_nhan_vien_giao, ma_giao_hang, ngay_bat_dau_giao, ngay_giao_hang_du_kien, id_trang_thai_giao_hang)
VALUES (1, 1, 'GH001', GETDATE(), '2025-06-30', 1);
INSERT INTO giao_hang (id_don_hang, id_nhan_vien_giao, ma_giao_hang, ngay_bat_dau_giao, ngay_giao_hang_du_kien, id_trang_thai_giao_hang)
VALUES (2, 2, 'GH002', GETDATE(), '2025-07-02', 2),
       (3, 3, 'GH003', GETDATE(), '2025-07-03', 1),
       (4, 2, 'GH004', GETDATE(), '2025-07-04', 2),
       (5, 3, 'GH005', GETDATE(), '2025-07-05', 1),
       (6, 1, 'GH006', GETDATE(), '2025-07-06', 2);

-- =====================================
-- 23. LỊCH SỬ ĐƠN HÀNG
-- =====================================
INSERT INTO lich_su_don_hang (id_don_hang, id_trang_thai_moi, id_nguoi_cap_nhat, ghi_chu)
VALUES (1, 1, 1, N'Tạo đơn hàng');
-- Dòng INSERT này đã được sửa để bao gồm 'id_trang_thai_cu'
INSERT INTO lich_su_don_hang (id_don_hang, id_trang_thai_moi, id_nguoi_cap_nhat, ghi_chu, id_trang_thai_cu)
VALUES (2, 2, 1, N'Đơn hàng đã được xác nhận', 1),
       (3, 3, 2, N'Đơn hàng đang trên đường giao', 2),
       (4, 1, 1, N'Tạo đơn hàng mới', NULL),
       (1, 2, 1, N'Đã xác nhận đơn hàng', 1),
       (3, 4, 3, N'Đã giao thành công', 3);

-- =====================================
-- 24. LỊCH SỬ GIAO HÀNG
-- =====================================
INSERT INTO lich_su_giao_hang (id_giao_hang, id_trang_thai_giao_hang, id_nguoi_cap_nhat, ghi_chu)
VALUES (1, 1, 1, N'Đang chuẩn bị hàng');
-- Dòng INSERT này đã được sửa bằng cách loại bỏ giá trị NULL thừa
INSERT INTO lich_su_giao_hang (id_giao_hang, id_trang_thai_giao_hang, id_nguoi_cap_nhat, ghi_chu)
VALUES (2, 2, 2, N'Đang trên đường giao'),
       (3, 1, 3, N'Đang đóng gói'),
       (4, 2, 2, N'Đã rời kho'),
       (1, 2, 1, N'Đã chuyển sang trạng thái đang giao'),
       (2, 3, 2, N'Giao hàng thành công');


-- Kiểm tra dữ liệu (Tùy chọn)
select * from kich_co;
select * from mau_sac;
select * from chat_lieu;
select * from trang_thai_don_hang;
select * from phuong_thuc_thanh_toan;
select * from trang_thai_giao_hang;
select * from nguoi_dung;
select * from khach_hang;
select * from dia_chi;
select * from dia_chi_khach_hang;
select * from danh_muc;
select * from san_pham;
select * from hinh_anh_san_pham;
select * from khuyen_mai;
select * from chi_tiet_san_pham;
select * from voucher;
select * from don_hang;
select * from chi_tiet_don_hang;
select * from danh_gia;
select * from gio_hang;
select * from chi_tiet_gio_hang;
select * from giao_hang;
select * from lich_su_don_hang;
select * from lich_su_giao_hang;




-- Script hoàn chỉnh để sửa database cho chức năng thêm và cập nhật hình ảnh sản phẩm
-- Chạy script này trong SQL Server Management Studio

-- 1. Thêm cột trang_thai vào bảng chi_tiet_san_pham nếu chưa có
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'chi_tiet_san_pham' AND COLUMN_NAME = 'trang_thai')
BEGIN
    ALTER TABLE chi_tiet_san_pham ADD trang_thai TINYINT DEFAULT 1;
    PRINT 'Added trang_thai column to chi_tiet_san_pham table';
END

-- 2. Thêm cột id_chi_tiet_san_pham vào bảng hinh_anh_san_pham nếu chưa có
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'hinh_anh_san_pham' AND COLUMN_NAME = 'id_chi_tiet_san_pham')
BEGIN
    ALTER TABLE hinh_anh_san_pham ADD id_chi_tiet_san_pham INT;
    PRINT 'Added id_chi_tiet_san_pham column to hinh_anh_san_pham table';
END

-- 3. Thêm cột id_san_pham vào bảng hinh_anh_san_pham nếu chưa có
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'hinh_anh_san_pham' AND COLUMN_NAME = 'id_san_pham')
BEGIN
    ALTER TABLE hinh_anh_san_pham ADD id_san_pham INT;
    PRINT 'Added id_san_pham column to hinh_anh_san_pham table';
END

-- 4. Sửa các giá trị NULL trong trang_thai thành 1
UPDATE chi_tiet_san_pham SET trang_thai = 1 WHERE trang_thai IS NULL;

-- 5. Kiểm tra và tạo foreign key constraints nếu cần
-- (Chỉ chạy nếu muốn thêm constraints)

-- 6. Kiểm tra dữ liệu sau khi sửa
SELECT 'chi_tiet_san_pham' as table_name, COUNT(*) as total_records, 
       COUNT(CASE WHEN trang_thai = 1 THEN 1 END) as trang_thai_1,
       COUNT(CASE WHEN trang_thai IS NULL THEN 1 END) as trang_thai_null
FROM chi_tiet_san_pham;

SELECT 'hinh_anh_san_pham' as table_name, COUNT(*) as total_records,
       COUNT(CASE WHEN id_chi_tiet_san_pham IS NOT NULL THEN 1 END) as has_chi_tiet_san_pham,
       COUNT(CASE WHEN id_san_pham IS NOT NULL THEN 1 END) as has_san_pham
FROM hinh_anh_san_pham;

-- 7. Kiểm tra chi tiết sản phẩm ID 27
SELECT 'Chi tiet san pham ID 27' as check_type, 
       ctsp.id, ctsp.id_san_pham, sp.ten_san_pham, 
       ctsp.trang_thai, ctsp.id_hinh_anh_san_pham
FROM chi_tiet_san_pham ctsp
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
WHERE ctsp.id = 27;

-- 8. Kiểm tra ảnh của chi tiết sản phẩm ID 27
SELECT 'Images for ID 27' as check_type, 
       h.id, h.url, h.is_thumbnail, 
       h.id_chi_tiet_san_pham, h.id_san_pham
FROM hinh_anh_san_pham h
WHERE h.id_chi_tiet_san_pham = 27;

PRINT 'Database fix completed successfully!';





-- Script kiểm tra và sửa dữ liệu chi tiết sản phẩm
-- Chạy script này trong SQL Server Management Studio

-- 1. Kiểm tra chi tiết sản phẩm ID 29
SELECT 'Chi tiet san pham ID 29' as check_type,
       ctsp.id, ctsp.id_san_pham, ctsp.id_kich_co, ctsp.id_mau_sac, 
       ctsp.id_chat_lieu, ctsp.id_khuyen_mai, ctsp.id_nguoi_tao,
       ctsp.trang_thai, ctsp.id_hinh_anh_san_pham
FROM chi_tiet_san_pham ctsp
WHERE ctsp.id = 29;

-- 2. Kiểm tra tất cả chi tiết sản phẩm có dữ liệu NULL
SELECT 'Chi tiet san pham with NULL data' as check_type,
       ctsp.id, ctsp.id_san_pham, ctsp.id_kich_co, ctsp.id_mau_sac, 
       ctsp.id_chat_lieu, ctsp.id_khuyen_mai, ctsp.id_nguoi_tao,
       ctsp.trang_thai
FROM chi_tiet_san_pham ctsp
WHERE ctsp.id_khuyen_mai IS NULL 
   OR ctsp.id_nguoi_tao IS NULL
   OR ctsp.id_san_pham IS NULL
   OR ctsp.id_kich_co IS NULL
   OR ctsp.id_mau_sac IS NULL
   OR ctsp.id_chat_lieu IS NULL;

-- 3. Lấy ID khuyến mãi đầu tiên để sử dụng làm giá trị mặc định
SELECT TOP 1 'Default khuyen mai ID' as check_type, id as default_khuyen_mai_id
FROM khuyen_mai 
WHERE trang_thai = 1;

-- 4. Lấy ID người dùng đầu tiên để sử dụng làm giá trị mặc định
SELECT TOP 1 'Default nguoi dung ID' as check_type, id as default_nguoi_dung_id
FROM nguoi_dung 
WHERE trang_thai = 1;

-- 5. Sửa dữ liệu NULL (chạy sau khi xem kết quả từ câu 3 và 4)
-- Thay thế [DEFAULT_KHUYEN_MAI_ID] và [DEFAULT_NGUOI_DUNG_ID] bằng giá trị thực tế

-- Sửa id_khuyen_mai NULL
UPDATE chi_tiet_san_pham 
SET id_khuyen_mai = (SELECT TOP 1 id FROM khuyen_mai WHERE trang_thai = 1)
WHERE id_khuyen_mai IS NULL;

-- Sửa id_nguoi_tao NULL
UPDATE chi_tiet_san_pham 
SET id_nguoi_tao = (SELECT TOP 1 id FROM nguoi_dung WHERE trang_thai = 1)
WHERE id_nguoi_tao IS NULL;

-- Sửa trang_thai NULL
UPDATE chi_tiet_san_pham 
SET trang_thai = 1
WHERE trang_thai IS NULL;

-- 6. Kiểm tra lại sau khi sửa
SELECT 'After fix - Chi tiet san pham ID 29' as check_type,
       ctsp.id, ctsp.id_san_pham, ctsp.id_kich_co, ctsp.id_mau_sac, 
       ctsp.id_chat_lieu, ctsp.id_khuyen_mai, ctsp.id_nguoi_tao,
       ctsp.trang_thai, ctsp.id_hinh_anh_san_pham
FROM chi_tiet_san_pham ctsp
WHERE ctsp.id = 29;

-- 7. Kiểm tra tổng quan
SELECT 'Summary after fix' as check_type,
       COUNT(*) as total_records,
       COUNT(CASE WHEN id_khuyen_mai IS NULL THEN 1 END) as null_khuyen_mai,
       COUNT(CASE WHEN id_nguoi_tao IS NULL THEN 1 END) as null_nguoi_tao,
       COUNT(CASE WHEN trang_thai IS NULL THEN 1 END) as null_trang_thai
FROM chi_tiet_san_pham;

PRINT 'Data fix completed!';






-- đợt 2
-- Script đơn giản để tạo bảng đánh giá sản phẩm
-- Chạy từng phần một để tránh lỗi

-- 1. Xóa bảng cũ nếu tồn tại
IF OBJECT_ID('danh_gia', 'U') IS NOT NULL
    DROP TABLE danh_gia;
GO

-- 2. Tạo bảng đánh giá mới
CREATE TABLE danh_gia (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_khach_hang INT NOT NULL,
    id_san_pham INT NOT NULL,
    so_sao TINYINT NOT NULL CHECK (so_sao >= 1 AND so_sao <= 5),
    binh_luan NVARCHAR(MAX),
    ngay_danh_gia DATETIME2 DEFAULT GETDATE(),
    trang_thai TINYINT DEFAULT 1 -- 1: Hiển thị, 0: Ẩn
);
GO

-- 3. Thêm foreign keys
ALTER TABLE danh_gia 
ADD CONSTRAINT FK_DanhGia_KhachHang 
FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id);
GO

ALTER TABLE danh_gia 
ADD CONSTRAINT FK_DanhGia_SanPham 
FOREIGN KEY (id_san_pham) REFERENCES san_pham(id);
GO

-- 4. Thêm unique constraint
ALTER TABLE danh_gia 
ADD CONSTRAINT UQ_DanhGia_KhachHang_SanPham 
UNIQUE (id_khach_hang, id_san_pham);
GO

-- 5. Tạo indexes
CREATE INDEX IX_DanhGia_SanPham ON danh_gia(id_san_pham, trang_thai);
GO

CREATE INDEX IX_DanhGia_KhachHang ON danh_gia(id_khach_hang);
GO

CREATE INDEX IX_DanhGia_NgayDanhGia ON danh_gia(ngay_danh_gia DESC);
GO

-- 6. Thêm dữ liệu mẫu (tùy chọn - bỏ comment để chạy)
/*
INSERT INTO danh_gia (id_khach_hang, id_san_pham, so_sao, binh_luan) VALUES
(1, 1, 5, 'Sản phẩm chất lượng tốt, vải mềm mại, form đẹp. Giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng!'),
(2, 1, 4, 'Áo đẹp, giá hợp lý. Size vừa vặn, màu sắc như hình. Sẽ mua thêm sản phẩm khác của shop.'),
(3, 1, 5, 'Chất lượng vải rất tốt, đường may cẩn thận. Đáng mua!'),
(1, 2, 4, 'Quần đẹp, form chuẩn. Chất liệu thoáng mát, dễ mặc.'),
(2, 2, 5, 'Quần rất đẹp, màu sắc tươi sáng. Giao hàng đúng hẹn.'),
(3, 2, 3, 'Quần đẹp nhưng hơi dài một chút. Chất liệu tốt.'),
(1, 3, 5, 'Áo sơ mi rất đẹp, form chuẩn, chất liệu cao cấp.'),
(2, 3, 4, 'Áo đẹp, phù hợp công sở. Màu sắc trang nhã.'),
(3, 3, 5, 'Chất lượng tuyệt vời, đáng đồng tiền bát gạo!');
GO
*/

PRINT 'Bảng danh_gia đã được tạo thành công!';
PRINT 'Các ràng buộc và index đã được thêm.';
PRINT 'Bạn có thể bỏ comment phần INSERT để thêm dữ liệu mẫu.';



-- ĐỢT 3


-- Script tạo view và stored procedures cho đánh giá sản phẩm
-- Chạy sau khi đã tạo bảng danh_gia

-- 1. Tạo view để tính toán thống kê đánh giá
IF OBJECT_ID('vw_thong_ke_danh_gia', 'V') IS NOT NULL
    DROP VIEW vw_thong_ke_danh_gia;
GO

CREATE VIEW vw_thong_ke_danh_gia AS
SELECT 
    sp.id AS id_san_pham,
    sp.ten_san_pham,
    COUNT(dg.id) AS tong_so_danh_gia,
    AVG(CAST(dg.so_sao AS FLOAT)) AS trung_binh_sao,
    SUM(CASE WHEN dg.so_sao = 5 THEN 1 ELSE 0 END) AS so_sao_5,
    SUM(CASE WHEN dg.so_sao = 4 THEN 1 ELSE 0 END) AS so_sao_4,
    SUM(CASE WHEN dg.so_sao = 3 THEN 1 ELSE 0 END) AS so_sao_3,
    SUM(CASE WHEN dg.so_sao = 2 THEN 1 ELSE 0 END) AS so_sao_2,
    SUM(CASE WHEN dg.so_sao = 1 THEN 1 ELSE 0 END) AS so_sao_1
FROM san_pham sp
LEFT JOIN danh_gia dg ON sp.id = dg.id_san_pham AND dg.trang_thai = 1
GROUP BY sp.id, sp.ten_san_pham;
GO

-- 2. Tạo stored procedure để lấy đánh giá gần đây
IF OBJECT_ID('sp_get_danh_gia_gan_day', 'P') IS NOT NULL
    DROP PROCEDURE sp_get_danh_gia_gan_day;
GO

CREATE PROCEDURE sp_get_danh_gia_gan_day
    @id_san_pham INT,
    @so_luong INT = 5
AS
BEGIN
    SELECT TOP (@so_luong)
        dg.id,
        dg.so_sao,
        dg.binh_luan,
        dg.ngay_danh_gia,
        kh.ho_ten AS ten_khach_hang,
        sp.ten_san_pham
    FROM danh_gia dg
    INNER JOIN khach_hang kh ON dg.id_khach_hang = kh.id
    INNER JOIN san_pham sp ON dg.id_san_pham = sp.id
    WHERE dg.id_san_pham = @id_san_pham 
    AND dg.trang_thai = 1
    ORDER BY dg.ngay_danh_gia DESC;
END;
GO

-- 3. Tạo function để kiểm tra khách hàng đã đánh giá chưa
IF OBJECT_ID('fn_has_khach_hang_reviewed', 'FN') IS NOT NULL
    DROP FUNCTION fn_has_khach_hang_reviewed;
GO

CREATE FUNCTION fn_has_khach_hang_reviewed
(
    @id_khach_hang INT,
    @id_san_pham INT
)
RETURNS BIT
AS
BEGIN
    DECLARE @has_reviewed BIT = 0;
    
    IF EXISTS (
        SELECT 1 
        FROM danh_gia 
        WHERE id_khach_hang = @id_khach_hang 
        AND id_san_pham = @id_san_pham
        AND trang_thai = 1
    )
    BEGIN
        SET @has_reviewed = 1;
    END
    
    RETURN @has_reviewed;
END;
GO

PRINT 'View và stored procedures đã được tạo thành công!';
PRINT 'View: vw_thong_ke_danh_gia';
PRINT 'Stored Procedure: sp_get_danh_gia_gan_day';
PRINT 'Function: fn_has_khach_hang_reviewed';





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



select * from don_hang
select * from chi_tiet_don_hang


select * from dia_chi



-- Script debug để kiểm tra tình trạng database hiện tại
-- Chạy script này để xem database có vấn đề gì

-- ========================================
-- 1. KIỂM TRA TẤT CẢ BẢNG CÓ SẴN
-- ========================================
SELECT 
    TABLE_NAME,
    TABLE_TYPE
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
ORDER BY TABLE_NAME;

-- ========================================
-- 2. KIỂM TRA BẢNG KHÁCH HÀNG
-- ========================================
SELECT 
    'khach_hang' as table_name,
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'khach_hang') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as status;

-- Kiểm tra dữ liệu khách hàng
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'khach_hang')
BEGIN
    SELECT 
        'khach_hang data' as check_type,
        COUNT(*) as record_count
    FROM khach_hang;
    
    SELECT TOP 5
        id,
        ma_khach_hang,
        ho_ten,
        so_dien_thoai,
        email
    FROM khach_hang
    ORDER BY id;
END
ELSE
BEGIN
    PRINT 'Bảng khach_hang không tồn tại!';
END

-- ========================================
-- 3. KIỂM TRA BẢNG DIA_CHI_KHACH_HANG_NEW
-- ========================================
SELECT 
    'dia_chi_khach_hang_new' as table_name,
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as status;

-- Kiểm tra dữ liệu địa chỉ
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new')
BEGIN
    SELECT 
        'dia_chi_khach_hang_new data' as check_type,
        COUNT(*) as record_count
    FROM dia_chi_khach_hang_new;
    
    SELECT 
        id,
        khach_hang_id,
        ho_ten,
        so_dien_thoai,
        tinh_thanh,
        quan_huyen,
        phuong_xa,
        dia_chi_chi_tiet,
        loai_dia_chi,
        mac_dinh
    FROM dia_chi_khach_hang_new
    ORDER BY khach_hang_id, mac_dinh DESC;
END
ELSE
BEGIN
    PRINT 'Bảng dia_chi_khach_hang_new không tồn tại!';
END

-- ========================================
-- 4. KIỂM TRA CÁC BẢNG ĐỊA CHỈ KHÁC
-- ========================================
-- Kiểm tra bảng dia_chi
SELECT 
    'dia_chi' as table_name,
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as status;

-- Kiểm tra bảng dia_chi_khach_hang
SELECT 
    'dia_chi_khach_hang' as table_name,
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as status;

-- ========================================
-- 5. KIỂM TRA VIEW
-- ========================================
SELECT 
    'vw_dia_chi_khach_hang' as view_name,
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.VIEWS WHERE TABLE_NAME = 'vw_dia_chi_khach_hang') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as status;

-- ========================================
-- 6. KIỂM TRA CẤU TRÚC BẢNG (NẾU TỒN TẠI)
-- ========================================
IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new')
BEGIN
    SELECT 
        COLUMN_NAME,
        DATA_TYPE,
        IS_NULLABLE,
        COLUMN_DEFAULT
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_NAME = 'dia_chi_khach_hang_new'
    ORDER BY ORDINAL_POSITION;
END

-- ========================================
-- 7. THỐNG KÊ TỔNG QUAN
-- ========================================
SELECT 
    'Tổng số bảng' as metric,
    COUNT(*) as value
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_TYPE = 'BASE TABLE'
UNION ALL
SELECT 
    'Tổng số view',
    COUNT(*)
FROM INFORMATION_SCHEMA.VIEWS
UNION ALL
SELECT 
    'Bảng khách hàng',
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'khach_hang') 
        THEN 1 
        ELSE 0 
    END
UNION ALL
SELECT 
    'Bảng địa chỉ mới',
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new') 
        THEN 1 
        ELSE 0 
    END;

PRINT '=== KẾT QUẢ DEBUG ===';
PRINT '1. Nếu bảng dia_chi_khach_hang_new không tồn tại, chạy create_dia_chi_khach_hang_table.sql';
PRINT '2. Nếu bảng tồn tại nhưng không có dữ liệu, chạy lại script tạo dữ liệu';
PRINT '3. Nếu có lỗi cấu trúc, kiểm tra lại entity mapping';



-- Script nhanh để sửa database
-- Chạy script này để tạo bảng và dữ liệu cần thiết

-- ========================================
-- 1. TẠO BẢNG DIA_CHI_KHACH_HANG_NEW
-- ========================================
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new')
BEGIN
    CREATE TABLE dia_chi_khach_hang_new (
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
        ngay_cap_nhat DATETIME2 DEFAULT GETDATE()
    );
    PRINT 'Đã tạo bảng dia_chi_khach_hang_new';
END
ELSE
BEGIN
    PRINT 'Bảng dia_chi_khach_hang_new đã tồn tại';
END

-- ========================================
-- 2. THÊM DỮ LIỆU MẪU
-- ========================================
-- Thêm khách hàng mẫu nếu chưa có
IF NOT EXISTS (SELECT * FROM khach_hang WHERE id = 7)
BEGIN
    INSERT INTO khach_hang (ma_khach_hang, ho_ten, so_dien_thoai, email, ten_dang_nhap, mat_khau, trang_thai_tai_khoan)
    VALUES ('KH007', 'Lam Hung', '0876743212', 'lamhung@example.com', 'lamhung@example.com', 'password123', 1);
    PRINT 'Đã thêm khách hàng ID 7';
END

-- Thêm địa chỉ mẫu
IF NOT EXISTS (SELECT * FROM dia_chi_khach_hang_new WHERE khach_hang_id = 7)
BEGIN
    INSERT INTO dia_chi_khach_hang_new (khach_hang_id, ho_ten, so_dien_thoai, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet, loai_dia_chi, mac_dinh)
    VALUES (7, 'Lam Hung', '0876743212', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', '123 Đường ABC', 'Nhà riêng', 1);
    PRINT 'Đã thêm địa chỉ mẫu cho khách hàng ID 7';
END

-- ========================================
-- 3. KIỂM TRA KẾT QUẢ
-- ========================================
SELECT 
    'Bảng dia_chi_khach_hang_new' as check_item,
    CASE 
        WHEN EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang_new') 
        THEN 'EXISTS' 
        ELSE 'NOT EXISTS' 
    END as status;

SELECT 
    'Dữ liệu trong bảng' as check_item,
    COUNT(*) as record_count
FROM dia_chi_khach_hang_new;

SELECT 
    'Địa chỉ của user ID 7' as check_item,
    COUNT(*) as record_count
FROM dia_chi_khach_hang_new
WHERE khach_hang_id = 7;

-- ========================================
-- 4. HIỂN THỊ DỮ LIỆU
-- ========================================
SELECT 
    id,
    khach_hang_id,
    ho_ten,
    so_dien_thoai,
    tinh_thanh,
    quan_huyen,
    phuong_xa,
    dia_chi_chi_tiet,
    loai_dia_chi,
    mac_dinh,
    ngay_tao,
    ngay_cap_nhat
FROM dia_chi_khach_hang_new
ORDER BY khach_hang_id, mac_dinh DESC;

PRINT '=== HOÀN THÀNH ===';
PRINT 'Bây giờ có thể test API!';


------DOT 4


-- Script thêm column id_khach_hang vào bảng don_hang
-- Chạy script này trong SQL Server Management Studio

-- 1. Thêm column id_khach_hang
IF NOT EXISTS (SELECT * FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'don_hang' AND COLUMN_NAME = 'id_khach_hang')
BEGIN
    ALTER TABLE don_hang ADD id_khach_hang INT;
    PRINT 'Added id_khach_hang column';
END
ELSE
BEGIN
    PRINT 'Column id_khach_hang already exists';
END

-- 2. Tạo foreign key constraint
IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_don_hang_khach_hang')
BEGIN
    ALTER TABLE don_hang 
    ADD CONSTRAINT FK_don_hang_khach_hang 
    FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id);
    PRINT 'Added foreign key constraint FK_don_hang_khach_hang';
END
ELSE
BEGIN
    PRINT 'Foreign key constraint FK_don_hang_khach_hang already exists';
END

-- 3. Kiểm tra kết quả
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'don_hang'
ORDER BY ORDINAL_POSITION;

-- 4. Kiểm tra foreign key constraints
SELECT 
    fk.name AS FK_Name,
    OBJECT_NAME(fk.parent_object_id) AS Table_Name,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS Column_Name,
    OBJECT_NAME(fk.referenced_object_id) AS Referenced_Table_Name,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS Referenced_Column_Name
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'don_hang';













------ DOT 5


-- Script kiểm tra và sửa foreign key constraint trong bảng chi_tiet_don_hang
-- Chạy script này trong SQL Server Management Studio

-- 1. Kiểm tra cấu trúc bảng chi_tiet_don_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    CHARACTER_MAXIMUM_LENGTH,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'chi_tiet_don_hang'
ORDER BY ORDINAL_POSITION;

-- 2. Kiểm tra foreign key constraints của bảng chi_tiet_don_hang
SELECT 
    fk.name AS FK_Name,
    OBJECT_NAME(fk.parent_object_id) AS Table_Name,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS Column_Name,
    OBJECT_NAME(fk.referenced_object_id) AS Referenced_Table_Name,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS Referenced_Column_Name
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'chi_tiet_don_hang';

-- 3. Kiểm tra dữ liệu trong bảng dia_chi
SELECT TOP 10 * FROM dia_chi;

-- 4. Kiểm tra dữ liệu trong bảng dia_chi_khach_hang_new
SELECT TOP 10 * FROM dia_chi_khach_hang_new;

-- 5. Xóa foreign key constraint cũ (nếu cần)
-- IF EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK__chi_tiet___id_di__0A9D95DB')
-- BEGIN
--     ALTER TABLE chi_tiet_don_hang DROP CONSTRAINT FK__chi_tiet___id_di__0A9D95DB;
--     PRINT 'Dropped old foreign key constraint';
-- END

-- 6. Tạo foreign key constraint mới (nếu cần)
-- IF NOT EXISTS (SELECT * FROM sys.foreign_keys WHERE name = 'FK_chi_tiet_don_hang_dia_chi_khach_hang')
-- BEGIN
--     ALTER TABLE chi_tiet_don_hang 
--     ADD CONSTRAINT FK_chi_tiet_don_hang_dia_chi_khach_hang 
--     FOREIGN KEY (id_dia_chi) REFERENCES dia_chi_khach_hang_new(id);
--     PRINT 'Added new foreign key constraint';
-- END






--- ĐỢT 6

-- Script xóa dữ liệu cũ trong chi_tiet_don_hang và kiểm tra foreign key
-- Chạy script này trong SQL Server Management Studio

-- 1. Kiểm tra dữ liệu hiện tại trong chi_tiet_don_hang
SELECT COUNT(*) AS TotalRecords FROM chi_tiet_don_hang;
SELECT TOP 10 * FROM chi_tiet_don_hang;

-- 2. Kiểm tra các id_dia_chi không tồn tại trong dia_chi_khach_hang_new
SELECT DISTINCT ctdh.id_dia_chi
FROM chi_tiet_don_hang ctdh
LEFT JOIN dia_chi_khach_hang_new dckhn ON ctdh.id_dia_chi = dckhn.id
WHERE dckhn.id IS NULL AND ctdh.id_dia_chi IS NOT NULL;

-- 3. Xóa tất cả dữ liệu trong chi_tiet_don_hang (vì đây là dữ liệu test cũ)
DELETE FROM chi_tiet_don_hang;
PRINT '✅ Deleted all data from chi_tiet_don_hang table';

-- 4. Kiểm tra lại foreign key constraint
SELECT 
    fk.name AS FK_Name,
    OBJECT_NAME(fk.parent_object_id) AS Table_Name,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS Column_Name,
    OBJECT_NAME(fk.referenced_object_id) AS Referenced_Table_Name,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS Referenced_Column_Name
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'chi_tiet_don_hang';

-- 5. Kiểm tra bảng chi_tiet_don_hang đã trống
SELECT COUNT(*) AS RemainingRecords FROM chi_tiet_don_hang;

PRINT '=== CHI_TIET_DON_HANG DATA CLEANUP COMPLETED ===';




--- ĐỢT 7 


-- Script sửa lỗi cuối cùng - xóa dữ liệu còn lại và tạo foreign key constraint
-- Chạy script này trong SQL Server Management Studio

-- 1. Xóa dữ liệu còn lại trong chi_tiet_don_hang
DELETE FROM chi_tiet_don_hang WHERE id_dia_chi IN (2, 4);
PRINT '✅ Deleted remaining orphaned records';

-- 2. Kiểm tra lại
SELECT COUNT(*) AS RemainingRecords FROM chi_tiet_don_hang;

-- 3. Tạo foreign key constraint cho id_dia_chi (nếu chưa có)
IF NOT EXISTS (
    SELECT * FROM sys.foreign_keys fk
    INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
    WHERE OBJECT_NAME(fk.parent_object_id) = 'chi_tiet_don_hang' 
    AND COL_NAME(fkc.parent_object_id, fkc.parent_column_id) = 'id_dia_chi'
)
BEGIN
    ALTER TABLE chi_tiet_don_hang 
    ADD CONSTRAINT FK_chi_tiet_don_hang_dia_chi_khach_hang 
    FOREIGN KEY (id_dia_chi) REFERENCES dia_chi_khach_hang_new(id);
    PRINT '✅ Created foreign key constraint for id_dia_chi';
END
ELSE
BEGIN
    PRINT '✅ Foreign key constraint for id_dia_chi already exists';
END

-- 4. Kiểm tra tất cả foreign key constraints
SELECT 
    fk.name AS FK_Name,
    OBJECT_NAME(fk.parent_object_id) AS Table_Name,
    COL_NAME(fkc.parent_object_id, fkc.parent_column_id) AS Column_Name,
    OBJECT_NAME(fk.referenced_object_id) AS Referenced_Table_Name,
    COL_NAME(fkc.referenced_object_id, fkc.referenced_column_id) AS Referenced_Column_Name
FROM sys.foreign_keys fk
INNER JOIN sys.foreign_key_columns fkc ON fk.object_id = fkc.constraint_object_id
WHERE OBJECT_NAME(fk.parent_object_id) = 'chi_tiet_don_hang'
ORDER BY COL_NAME(fkc.parent_object_id, fkc.parent_column_id);

-- 5. Kiểm tra địa chỉ ID 15 tồn tại
SELECT id, khach_hang_id, ho_ten, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet
FROM dia_chi_khach_hang_new 
WHERE id = 15;

PRINT '=== FINAL FOREIGN KEY FIX COMPLETED ===';





--- Đợt 8


USE abcd7;

-- 1. Sửa constraints cho bảng chi_tiet_don_hang
PRINT 'Đang sửa constraints cho bảng chi_tiet_don_hang...';

-- Fix 1: Allow NULL for id_trang_thai (hiện tại là NOT NULL)
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_trang_thai INT NULL;
PRINT 'Đã sửa id_trang_thai cho phép NULL';

-- Fix 2: Allow NULL for id_dia_chi (hiện tại là NOT NULL)
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_dia_chi INT NULL;
PRINT 'Đã sửa id_dia_chi cho phép NULL';

-- 3. Cập nhật dữ liệu NULL thành 0 cho các trường số
UPDATE chi_tiet_don_hang SET phi_van_chuyen = 0 WHERE phi_van_chuyen IS NULL;
UPDATE chi_tiet_don_hang SET tien_giam_gia = 0 WHERE tien_giam_gia IS NULL;
PRINT 'Đã cập nhật dữ liệu NULL thành 0';

-- 4. Thêm default constraints nếu chưa có
IF NOT EXISTS (SELECT * FROM sys.default_constraints WHERE name = 'DF_chi_tiet_don_hang_phi_van_chuyen')
BEGIN
    ALTER TABLE chi_tiet_don_hang ADD CONSTRAINT DF_chi_tiet_don_hang_phi_van_chuyen DEFAULT 0 FOR phi_van_chuyen;
    PRINT 'Đã thêm default constraint cho phi_van_chuyen';
END

IF NOT EXISTS (SELECT * FROM sys.default_constraints WHERE name = 'DF_chi_tiet_don_hang_tien_giam_gia')
BEGIN
    ALTER TABLE chi_tiet_don_hang ADD CONSTRAINT DF_chi_tiet_don_hang_tien_giam_gia DEFAULT 0 FOR tien_giam_gia;
    PRINT 'Đã thêm default constraint cho tien_giam_gia';
END

-- 5. Kiểm tra kết quả
PRINT 'Kiểm tra cấu trúc bảng sau khi sửa:';
SELECT 
    COLUMN_NAME,
    IS_NULLABLE,
    DATA_TYPE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_NAME = 'chi_tiet_don_hang' 
AND TABLE_SCHEMA = 'dbo'
AND COLUMN_NAME IN ('id_trang_thai', 'id_dia_chi', 'id_khach_hang', 'id_voucher', 'id_nhan_vien_xu_ly', 'id_phuong_thuc_thanh_toan')
ORDER BY COLUMN_NAME;

-- 6. Thêm dữ liệu mẫu cho phương thức thanh toán nếu chưa có
IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE id = 1)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc) 
    VALUES (1, 'Tiền mặt');
    PRINT 'Đã thêm phương thức thanh toán: Tiền mặt';
END

IF NOT EXISTS (SELECT 1 FROM phuong_thuc_thanh_toan WHERE id = 2)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc) 
    VALUES (2, 'Chuyển khoản');
    PRINT 'Đã thêm phương thức thanh toán: Chuyển khoản';
END

-- 7. Thêm dữ liệu mẫu cho trạng thái đơn hàng nếu chưa có
IF NOT EXISTS (SELECT 1 FROM trang_thai_don_hang WHERE id = 1)
BEGIN
    INSERT INTO trang_thai_don_hang (id, ten_trang_thai) 
    VALUES (1, 'Hoàn thành');
    PRINT 'Đã thêm trạng thái: Hoàn thành';
END

-- 8. Thêm địa chỉ mặc định nếu chưa có
IF NOT EXISTS (SELECT 1 FROM dia_chi WHERE id = 1)
BEGIN
    INSERT INTO dia_chi (id, tinh_thanh, quan_huyen, phuong_xa, duong, dia_chi_mac_dinh) 
    VALUES (1, 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', 'Tại cửa hàng', 1);
    PRINT 'Đã thêm địa chỉ mặc định: Tại cửa hàng';
END

-- 9. Kiểm tra dữ liệu hiện tại
PRINT 'Kiểm tra dữ liệu hiện tại:';
SELECT 'phuong_thuc_thanh_toan' as table_name, COUNT(*) as count FROM phuong_thuc_thanh_toan
UNION ALL
SELECT 'trang_thai_don_hang', COUNT(*) FROM trang_thai_don_hang
UNION ALL
SELECT 'dia_chi', COUNT(*) FROM dia_chi;

PRINT '🎉 POS database constraints đã được sửa thành công!';
PRINT '✅ POS system sẵn sàng hoạt động!';

