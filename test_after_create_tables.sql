-- Script test sau khi tạo bảng
-- Chạy script này để kiểm tra sau khi tạo bảng

-- ========================================
-- 1. KIỂM TRA BẢNG ĐÃ TỒN TẠI
-- ========================================
SELECT 
    TABLE_NAME,
    'EXISTS' as status
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_NAME IN ('khach_hang', 'dia_chi_khach_hang')
ORDER BY TABLE_NAME;

-- ========================================
-- 2. KIỂM TRA DỮ LIỆU KHÁCH HÀNG
-- ========================================
SELECT 
    id,
    ma_khach_hang,
    ho_ten,
    so_dien_thoai,
    email,
    trang_thai_tai_khoan,
    ngay_dang_ky
FROM khach_hang
ORDER BY id;

-- ========================================
-- 3. KIỂM TRA DỮ LIỆU ĐỊA CHỈ
-- ========================================
SELECT 
    dc.id,
    dc.khach_hang_id,
    kh.ho_ten as ten_khach_hang,
    dc.ho_ten,
    dc.so_dien_thoai,
    dc.tinh_thanh,
    dc.quan_huyen,
    dc.phuong_xa,
    dc.dia_chi_chi_tiet,
    dc.loai_dia_chi,
    dc.mac_dinh,
    dc.ngay_tao,
    dc.ngay_cap_nhat
FROM dia_chi_khach_hang dc
LEFT JOIN khach_hang kh ON dc.khach_hang_id = kh.id
ORDER BY dc.khach_hang_id, dc.mac_dinh DESC, dc.ngay_tao DESC;

-- ========================================
-- 4. TEST API ENDPOINTS
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

-- ========================================
-- 5. HƯỚNG DẪN TEST FRONTEND
-- ========================================
-- 1. Chạy Backend: mvn spring-boot:run
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
-- 6. THỐNG KÊ
-- ========================================
SELECT 
    'Tổng số khách hàng' as metric,
    COUNT(*) as value
FROM khach_hang
UNION ALL
SELECT 
    'Tổng số địa chỉ',
    COUNT(*)
FROM dia_chi_khach_hang
UNION ALL
SELECT 
    'Địa chỉ của user ID 7',
    COUNT(*)
FROM dia_chi_khach_hang
WHERE khach_hang_id = 7;

-- ========================================
-- 7. KIỂM TRA CẤU TRÚC CỘT
-- ========================================
-- Kiểm tra cấu trúc bảng khach_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'khach_hang'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra cấu trúc bảng dia_chi_khach_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'dia_chi_khach_hang'
ORDER BY ORDINAL_POSITION;
