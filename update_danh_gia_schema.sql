-- Script cập nhật schema cho bảng đánh giá sản phẩm
-- Chạy script này để cập nhật database

-- 1. Backup bảng cũ (nếu có)
-- SELECT * INTO danh_gia_backup FROM danh_gia;

-- 2. Xóa bảng cũ nếu tồn tại
IF OBJECT_ID('danh_gia', 'U') IS NOT NULL
    DROP TABLE danh_gia;

-- 3. Tạo bảng đánh giá mới
CREATE TABLE danh_gia (
    id INT IDENTITY(1,1) PRIMARY KEY,
    id_khach_hang INT NOT NULL,
    id_san_pham INT NOT NULL,
    so_sao TINYINT NOT NULL CHECK (so_sao >= 1 AND so_sao <= 5),
    binh_luan NVARCHAR(MAX),
    ngay_danh_gia DATETIME2 DEFAULT GETDATE(),
    trang_thai TINYINT DEFAULT 1, -- 1: Hiển thị, 0: Ẩn
    
    -- Foreign keys
    CONSTRAINT FK_DanhGia_KhachHang FOREIGN KEY (id_khach_hang) REFERENCES khach_hang(id),
    CONSTRAINT FK_DanhGia_SanPham FOREIGN KEY (id_san_pham) REFERENCES san_pham(id),
    
    -- Unique constraint để đảm bảo mỗi khách hàng chỉ đánh giá mỗi sản phẩm 1 lần
    CONSTRAINT UQ_DanhGia_KhachHang_SanPham UNIQUE (id_khach_hang, id_san_pham)
);

-- 4. Tạo index để tối ưu performance
CREATE INDEX IX_DanhGia_SanPham ON danh_gia(id_san_pham, trang_thai);
CREATE INDEX IX_DanhGia_KhachHang ON danh_gia(id_khach_hang);
CREATE INDEX IX_DanhGia_NgayDanhGia ON danh_gia(ngay_danh_gia DESC);

-- 5. Thêm dữ liệu mẫu (tùy chọn)
-- INSERT INTO danh_gia (id_khach_hang, id_san_pham, so_sao, binh_luan) VALUES
-- (1, 1, 5, 'Sản phẩm chất lượng tốt, vải mềm mại, form đẹp. Giao hàng nhanh, đóng gói cẩn thận. Rất hài lòng!'),
-- (2, 1, 4, 'Áo đẹp, giá hợp lý. Size vừa vặn, màu sắc như hình. Sẽ mua thêm sản phẩm khác của shop.'),
-- (3, 1, 5, 'Chất lượng vải rất tốt, đường may cẩn thận. Đáng mua!'),
-- (1, 2, 4, 'Quần đẹp, form chuẩn. Chất liệu thoáng mát, dễ mặc.'),
-- (2, 2, 5, 'Quần rất đẹp, màu sắc tươi sáng. Giao hàng đúng hẹn.'),
-- (3, 2, 3, 'Quần đẹp nhưng hơi dài một chút. Chất liệu tốt.'),
-- (1, 3, 5, 'Áo sơ mi rất đẹp, form chuẩn, chất liệu cao cấp.'),
-- (2, 3, 4, 'Áo đẹp, phù hợp công sở. Màu sắc trang nhã.'),
-- (3, 3, 5, 'Chất lượng tuyệt vời, đáng đồng tiền bát gạo!');

-- 6. Tạo view để tính toán thống kê đánh giá
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

-- 7. Tạo stored procedure để lấy đánh giá gần đây
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

-- 8. Tạo function để kiểm tra khách hàng đã đánh giá chưa
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

PRINT 'Schema đánh giá sản phẩm đã được cập nhật thành công!';
PRINT 'Bảng danh_gia đã được tạo với các ràng buộc và index cần thiết.';
PRINT 'View vw_thong_ke_danh_gia đã được tạo để tính toán thống kê.';
PRINT 'Stored procedure sp_get_danh_gia_gan_day đã được tạo.';
PRINT 'Function fn_has_khach_hang_reviewed đã được tạo.';
