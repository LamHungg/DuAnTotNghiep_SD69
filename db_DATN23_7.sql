

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