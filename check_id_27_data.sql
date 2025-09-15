-- Script để kiểm tra dữ liệu chi tiết của ID 27
-- Chạy script này trong SQL Server Management Studio

-- 1. Kiểm tra chi tiết sản phẩm ID 27
SELECT 
    'Chi tiet san pham ID 27' as check_type,
    ctsp.id,
    ctsp.id_san_pham,
    ctsp.id_kich_co,
    ctsp.id_mau_sac,
    ctsp.id_chat_lieu,
    ctsp.id_khuyen_mai,
    ctsp.id_nguoi_tao,
    ctsp.id_nguoi_cap_nhat,
    ctsp.id_hinh_anh_san_pham,
    ctsp.so_luong,
    ctsp.gia,
    ctsp.gia_nhap,
    ctsp.trang_thai,
    ctsp.ngay_tao,
    ctsp.ngay_cap_nhat
FROM chi_tiet_san_pham ctsp
WHERE ctsp.id = 27;

-- 2. Kiểm tra các bảng liên quan có tồn tại không
SELECT 'San pham' as table_name, COUNT(*) as count FROM san_pham WHERE id = 25;
SELECT 'Kich co' as table_name, COUNT(*) as count FROM kich_co WHERE id = 3;
SELECT 'Mau sac' as table_name, COUNT(*) as count FROM mau_sac WHERE id = 4;
SELECT 'Chat lieu' as table_name, COUNT(*) as count FROM chat_lieu WHERE id = 4;
SELECT 'Khuyen mai' as table_name, COUNT(*) as count FROM khuyen_mai WHERE id = 1;
SELECT 'Nguoi dung' as table_name, COUNT(*) as count FROM nguoi_dung WHERE id = 1;

-- 3. Kiểm tra ảnh của chi tiết sản phẩm ID 27
SELECT 
    'Images for ID 27' as check_type,
    h.id,
    h.url,
    h.is_thumbnail,
    h.id_chi_tiet_san_pham,
    h.id_san_pham
FROM hinh_anh_san_pham h
WHERE h.id_chi_tiet_san_pham = 27;

-- 4. So sánh với ID 6 (hoạt động bình thường)
SELECT 
    'Chi tiet san pham ID 6' as check_type,
    ctsp.id,
    ctsp.id_san_pham,
    ctsp.id_kich_co,
    ctsp.id_mau_sac,
    ctsp.id_chat_lieu,
    ctsp.id_khuyen_mai,
    ctsp.id_nguoi_tao,
    ctsp.id_nguoi_cap_nhat,
    ctsp.id_hinh_anh_san_pham,
    ctsp.so_luong,
    ctsp.gia,
    ctsp.gia_nhap,
    ctsp.trang_thai
FROM chi_tiet_san_pham ctsp
WHERE ctsp.id = 6;
