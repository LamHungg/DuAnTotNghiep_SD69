-- Script backup dữ liệu trước khi thực hiện migration
-- Chạy script này để backup dữ liệu hiện có

-- Backup bảng hinh_anh_san_pham
SELECT * INTO hinh_anh_san_pham_backup_$(CONVERT(VARCHAR(8), GETDATE(), 112))
FROM hinh_anh_san_pham;

PRINT 'Đã backup bảng hinh_anh_san_pham thành công!';

-- Backup bảng chi_tiet_san_pham
SELECT * INTO chi_tiet_san_pham_backup_$(CONVERT(VARCHAR(8), GETDATE(), 112))
FROM chi_tiet_san_pham;

PRINT 'Đã backup bảng chi_tiet_san_pham thành công!';

-- Backup bảng san_pham
SELECT * INTO san_pham_backup_$(CONVERT(VARCHAR(8), GETDATE(), 112))
FROM san_pham;

PRINT 'Đã backup bảng san_pham thành công!';

PRINT 'Hoàn thành backup dữ liệu!'; 