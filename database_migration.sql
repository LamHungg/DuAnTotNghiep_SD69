-- Script để thêm cột mới vào bảng hinh_anh_san_pham
-- Dựa trên cấu trúc database thực tế từ db_DATN23_7.sql
-- Chạy script này trong SQL Server Management Studio hoặc công cụ quản lý database

-- Kiểm tra xem cột id_chi_tiet_san_pham đã tồn tại chưa
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'hinh_anh_san_pham' 
    AND COLUMN_NAME = 'id_chi_tiet_san_pham'
)
BEGIN
    -- Thêm cột id_chi_tiet_san_pham
    ALTER TABLE hinh_anh_san_pham
    ADD id_chi_tiet_san_pham INT NULL;
    
    PRINT 'Đã thêm cột id_chi_tiet_san_pham vào bảng hinh_anh_san_pham';
END
ELSE
BEGIN
    PRINT 'Cột id_chi_tiet_san_pham đã tồn tại trong bảng hinh_anh_san_pham';
END

-- Kiểm tra xem cột id_san_pham đã tồn tại chưa
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'hinh_anh_san_pham' 
    AND COLUMN_NAME = 'id_san_pham'
)
BEGIN
    -- Thêm cột id_san_pham
    ALTER TABLE hinh_anh_san_pham
    ADD id_san_pham INT NULL;
    
    PRINT 'Đã thêm cột id_san_pham vào bảng hinh_anh_san_pham';
END
ELSE
BEGIN
    PRINT 'Cột id_san_pham đã tồn tại trong bảng hinh_anh_san_pham';
END

-- Tùy chọn: Thêm khóa ngoại (chỉ chạy nếu bạn muốn có ràng buộc khóa ngoại)
-- IF NOT EXISTS (
--     SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
--     WHERE CONSTRAINT_NAME = 'FK_HinhAnh_ChiTietSanPham'
-- )
-- BEGIN
--     ALTER TABLE hinh_anh_san_pham
--     ADD CONSTRAINT FK_HinhAnh_ChiTietSanPham
--     FOREIGN KEY (id_chi_tiet_san_pham) REFERENCES chi_tiet_san_pham(id);
--     
--     PRINT 'Đã thêm khóa ngoại FK_HinhAnh_ChiTietSanPham';
-- END

-- IF NOT EXISTS (
--     SELECT * FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS 
--     WHERE CONSTRAINT_NAME = 'FK_HinhAnh_SanPham'
-- )
-- BEGIN
--     ALTER TABLE hinh_anh_san_pham
--     ADD CONSTRAINT FK_HinhAnh_SanPham
--     FOREIGN KEY (id_san_pham) REFERENCES san_pham(id);
--     
--     PRINT 'Đã thêm khóa ngoại FK_HinhAnh_SanPham';
-- END

PRINT 'Hoàn thành cập nhật schema!';
PRINT 'Bây giờ bạn có thể khởi động lại backend.'; 