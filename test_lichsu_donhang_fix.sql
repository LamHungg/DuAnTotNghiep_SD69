-- Script test LichSuDonHang sau khi sửa lỗi TrangThaiDonHang
-- Chạy script này để kiểm tra dữ liệu lịch sử đơn hàng

-- Kiểm tra dữ liệu lịch sử đơn hàng
SELECT 
    lsdh.id,
    lsdh.id_don_hang,
    dh.ma_don_hang,
    lsdh.id_trang_thai_cu,
    ttdh_cu.ten_trang_thai as trang_thai_cu,
    lsdh.id_trang_thai_moi,
    ttdh_moi.ten_trang_thai as trang_thai_moi,
    lsdh.id_nguoi_cap_nhat,
    nd.ho_ten as ten_nguoi_cap_nhat,
    lsdh.thoi_gian_cap_nhat,
    lsdh.ghi_chu
FROM lich_su_don_hang lsdh
LEFT JOIN don_hang dh ON lsdh.id_don_hang = dh.id
LEFT JOIN trang_thai_don_hang ttdh_cu ON lsdh.id_trang_thai_cu = ttdh_cu.id
LEFT JOIN trang_thai_don_hang ttdh_moi ON lsdh.id_trang_thai_moi = ttdh_moi.id
LEFT JOIN nguoi_dung nd ON lsdh.id_nguoi_cap_nhat = nd.id
ORDER BY lsdh.id_don_hang DESC, lsdh.thoi_gian_cap_nhat DESC;

-- Kiểm tra lịch sử đơn hàng theo trạng thái
SELECT 
    ttdh.ten_trang_thai,
    COUNT(lsdh.id) as so_lan_cap_nhat
FROM trang_thai_don_hang ttdh
LEFT JOIN lich_su_don_hang lsdh ON ttdh.id = lsdh.id_trang_thai_moi
GROUP BY ttdh.id, ttdh.ten_trang_thai
ORDER BY so_lan_cap_nhat DESC;

-- Kiểm tra lịch sử đơn hàng theo người cập nhật
SELECT 
    nd.ho_ten as ten_nguoi_cap_nhat,
    COUNT(lsdh.id) as so_lan_cap_nhat
FROM nguoi_dung nd
LEFT JOIN lich_su_don_hang lsdh ON nd.id = lsdh.id_nguoi_cap_nhat
GROUP BY nd.id, nd.ho_ten
ORDER BY so_lan_cap_nhat DESC;

-- Kiểm tra lịch sử đơn hàng theo thời gian
SELECT 
    CAST(lsdh.thoi_gian_cap_nhat AS DATE) as ngay,
    COUNT(lsdh.id) as so_lan_cap_nhat
FROM lich_su_don_hang lsdh
WHERE lsdh.thoi_gian_cap_nhat >= DATEADD(day, -30, GETDATE())
GROUP BY CAST(lsdh.thoi_gian_cap_nhat AS DATE)
ORDER BY ngay DESC;

-- Kiểm tra đơn hàng có nhiều lịch sử nhất
SELECT 
    dh.ma_don_hang,
    COUNT(lsdh.id) as so_lich_su,
    MIN(lsdh.thoi_gian_cap_nhat) as ngay_dau,
    MAX(lsdh.thoi_gian_cap_nhat) as ngay_cuoi
FROM don_hang dh
LEFT JOIN lich_su_don_hang lsdh ON dh.id = lsdh.id_don_hang
GROUP BY dh.id, dh.ma_don_hang
HAVING COUNT(lsdh.id) > 0
ORDER BY so_lich_su DESC;

-- Test tạo lịch sử đơn hàng mới (nếu cần)
-- INSERT INTO lich_su_don_hang (id_don_hang, id_trang_thai_moi, id_nguoi_cap_nhat, thoi_gian_cap_nhat, ghi_chu)
-- VALUES (1, 2, 1, GETDATE(), 'Cập nhật trạng thái đơn hàng');

-- Kiểm tra cấu trúc bảng lich_su_don_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'lich_su_don_hang'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra cấu trúc bảng trang_thai_don_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'trang_thai_don_hang'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra dữ liệu trang thái đơn hàng
SELECT 
    id,
    ten_trang_thai
FROM trang_thai_don_hang
ORDER BY id;

-- Kiểm tra lịch sử đơn hàng không có đơn hàng (orphan records)
SELECT 
    lsdh.id,
    lsdh.id_don_hang,
    lsdh.thoi_gian_cap_nhat
FROM lich_su_don_hang lsdh
LEFT JOIN don_hang dh ON lsdh.id_don_hang = dh.id
WHERE dh.id IS NULL
ORDER BY lsdh.id;

-- Kiểm tra lịch sử đơn hàng không có trạng thái (orphan records)
SELECT 
    lsdh.id,
    lsdh.id_trang_thai_moi,
    lsdh.thoi_gian_cap_nhat
FROM lich_su_don_hang lsdh
LEFT JOIN trang_thai_don_hang ttdh ON lsdh.id_trang_thai_moi = ttdh.id
WHERE ttdh.id IS NULL
ORDER BY lsdh.id;

-- Kiểm tra lịch sử đơn hàng không có người cập nhật (orphan records)
SELECT 
    lsdh.id,
    lsdh.id_nguoi_cap_nhat,
    lsdh.thoi_gian_cap_nhat
FROM lich_su_don_hang lsdh
LEFT JOIN nguoi_dung nd ON lsdh.id_nguoi_cap_nhat = nd.id
WHERE nd.id IS NULL
ORDER BY lsdh.id;
