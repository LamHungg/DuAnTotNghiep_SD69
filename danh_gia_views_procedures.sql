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
