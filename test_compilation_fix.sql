-- Script test sau khi sửa lỗi compilation
-- Chạy script này để kiểm tra database và API

-- ========================================
-- 1. KIỂM TRA VIEW VÀ DỮ LIỆU
-- ========================================
-- Kiểm tra view có tồn tại không
SELECT 
    TABLE_NAME,
    TABLE_TYPE,
    'EXISTS' as status
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME = 'vw_dia_chi_khach_hang';

-- Kiểm tra dữ liệu trong view
SELECT 
    id,
    khach_hang_id,
    ho_ten,
    so_dien_thoai,
    tinh_thanh,
    quan_huyen,
    phuong_xa,
    dia_chi_chi_tiet,
    loai_dia_chi,
    mac_dinh
FROM vw_dia_chi_khach_hang
ORDER BY khach_hang_id, mac_dinh DESC;

-- ========================================
-- 2. KIỂM TRA DỮ LIỆU CHO USER ID 7
-- ========================================
SELECT 
    'User ID 7 addresses' as check_type,
    id,
    khach_hang_id,
    ho_ten,
    so_dien_thoai,
    tinh_thanh,
    quan_huyen,
    phuong_xa,
    dia_chi_chi_tiet,
    loai_dia_chi,
    mac_dinh
FROM vw_dia_chi_khach_hang
WHERE khach_hang_id = 7;

-- ========================================
-- 3. TEST API ENDPOINTS
-- ========================================
-- Test endpoint cơ bản
-- GET http://localhost:8080/api/addresses/test
-- Response: "API địa chỉ hoạt động bình thường!"

-- Test endpoint database
-- GET http://localhost:8080/api/addresses/test-db
-- Response: "Database hoạt động bình thường! Số địa chỉ: X"

-- Test endpoint lấy tất cả địa chỉ
-- GET http://localhost:8080/api/addresses/test-list
-- Response: JSON array của tất cả địa chỉ

-- Test endpoint debug
-- GET http://localhost:8080/api/addresses/debug
-- Headers: Authorization: Bearer customer-token-7
-- Response: JSON với thông tin debug

-- Test endpoint chính (với JWT)
-- GET http://localhost:8080/api/addresses
-- Headers: Authorization: Bearer customer-token-7
-- Response: JSON array của địa chỉ của user ID 7

-- ========================================
-- 4. HƯỚNG DẪN TEST FRONTEND
-- ========================================
-- 1. Chạy Backend: mvn spring-boot:run (hoặc IDE)
-- 2. Chạy Frontend: npm start
-- 3. Đăng nhập vào hệ thống
-- 4. Vào trang Profile
-- 5. Mở Developer Tools (F12)
-- 6. Xem Console để kiểm tra:
--    - "Using test endpoint for debugging..."
--    - "Test response: [...]"
-- 7. Nếu test endpoint hoạt động, API sẽ trả về dữ liệu
-- 8. Nếu vẫn lỗi, vấn đề có thể là với Spring Boot configuration

-- ========================================
-- 5. THỐNG KÊ CUỐI CÙNG
-- ========================================
SELECT 
    'Tổng số khách hàng' as metric,
    COUNT(*) as value
FROM khach_hang
UNION ALL
SELECT 
    'Tổng số địa chỉ',
    COUNT(*)
FROM dia_chi
UNION ALL
SELECT 
    'Tổng số quan hệ địa chỉ',
    COUNT(*)
FROM dia_chi_khach_hang
UNION ALL
SELECT 
    'Tổng số địa chỉ trong view',
    COUNT(*)
FROM vw_dia_chi_khach_hang
UNION ALL
SELECT 
    'Địa chỉ của user ID 7',
    COUNT(*)
FROM vw_dia_chi_khach_hang
WHERE khach_hang_id = 7;

-- ========================================
-- 6. KIỂM TRA CẤU TRÚC VIEW
-- ========================================
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'vw_dia_chi_khach_hang'
ORDER BY ORDINAL_POSITION;

PRINT 'Test hoàn thành! Bây giờ có thể test API.';
PRINT 'Nếu view có dữ liệu, API sẽ hoạt động bình thường.';
PRINT 'Nếu view không có dữ liệu, cần chạy lại fix_entity_mapping.sql.';
PRINT 'Nếu có lỗi compilation, cần kiểm tra lại entity và controller.';
