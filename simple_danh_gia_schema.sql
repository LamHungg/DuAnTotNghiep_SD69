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
