-- Kiểm tra sản phẩm ID 21
SELECT * FROM chi_tiet_san_pham WHERE id = 21;

-- Kiểm tra tất cả sản phẩm có sẵn
SELECT id, ten_san_pham, so_luong, trang_thai 
FROM chi_tiet_san_pham 
WHERE trang_thai = 1 
ORDER BY id 
LIMIT 10;

-- Kiểm tra sản phẩm có số lượng > 0
SELECT id, ten_san_pham, so_luong, trang_thai 
FROM chi_tiet_san_pham 
WHERE so_luong > 0 AND trang_thai = 1 
ORDER BY id 
LIMIT 10;
