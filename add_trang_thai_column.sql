-- Script để thêm cột trang_thai vào bảng chi_tiet_san_pham
-- Chạy script này trong SQL Server Management Studio

-- Kiểm tra xem cột đã tồn tại chưa
IF NOT EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_NAME = 'chi_tiet_san_pham' 
    AND COLUMN_NAME = 'trang_thai'
)
BEGIN
    -- Thêm cột trang_thai với giá trị mặc định là 1
    ALTER TABLE chi_tiet_san_pham 
    ADD trang_thai TINYINT DEFAULT 1;
    
    PRINT 'Đã thêm cột trang_thai vào bảng chi_tiet_san_pham';
END
ELSE
BEGIN
    PRINT 'Cột trang_thai đã tồn tại trong bảng chi_tiet_san_pham';
END
