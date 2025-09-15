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
