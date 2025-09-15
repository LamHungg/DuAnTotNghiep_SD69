-- Script test debug API để kiểm tra lỗi 400 Bad Request
-- Chạy script này để debug API địa chỉ

-- ========================================
-- 1. KIỂM TRA DỮ LIỆU CƠ BẢN
-- ========================================
-- Kiểm tra khách hàng
SELECT 
    id,
    ma_khach_hang,
    ho_ten,
    so_dien_thoai,
    email
FROM khach_hang
WHERE id = 7;

-- Kiểm tra địa chỉ của khách hàng
SELECT 
    dc.id,
    dc.khach_hang_id,
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
WHERE dc.khach_hang_id = 7;

-- ========================================
-- 2. TEST API ENDPOINTS (DEBUG)
-- ========================================
-- Test endpoint cơ bản
-- GET http://localhost:8080/api/addresses/test
-- Response: "API địa chỉ hoạt động bình thường!"

-- Test endpoint database
-- GET http://localhost:8080/api/addresses/test-db
-- Response: "Database hoạt động bình thường! Số địa chỉ: X"

-- Test endpoint debug (QUAN TRỌNG!)
-- GET http://localhost:8080/api/addresses/debug
-- Headers: Authorization: Bearer customer-token-7
-- Response: JSON với thông tin debug

-- Test endpoint authentication với JWT token
-- GET http://localhost:8080/api/addresses
-- Headers: Authorization: Bearer customer-token-7
-- Response: JSON array của địa chỉ của user ID 7

-- ========================================
-- 3. HƯỚNG DẪN DEBUG
-- ========================================
-- 1. Chạy Backend: mvn spring-boot:run
-- 2. Chạy Frontend: npm start
-- 3. Đăng nhập vào hệ thống
-- 4. Vào trang Profile
-- 5. Mở Developer Tools (F12)
-- 6. Xem Console để kiểm tra debug info
-- 7. Kiểm tra Network tab để xem API calls

-- ========================================
-- 4. KIỂM TRA LỖI CÓ THỂ XẢY RA
-- ========================================
-- ❌ Lỗi 400 Bad Request có thể do:
-- 1. JPA Query method không hoạt động
-- 2. Lombok conflict với ErrorResponse
-- 3. Database connection issues
-- 4. JWT token parsing errors
-- 5. Entity mapping issues

-- ✅ Các bước đã sửa:
-- 1. Sử dụng @Query annotation thay vì JPA naming convention
-- 2. Loại bỏ Lombok từ ErrorResponse
-- 3. Thêm debug endpoints
-- 4. Cải thiện error handling

-- ========================================
-- 5. THỐNG KÊ DỮ LIỆU
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
-- 6. KIỂM TRA CẤU TRÚC BẢNG
-- ========================================
-- Kiểm tra cấu trúc bảng dia_chi_khach_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'dia_chi_khach_hang'
ORDER BY ORDINAL_POSITION;

-- Kiểm tra cấu trúc bảng khach_hang
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'khach_hang'
ORDER BY ORDINAL_POSITION;
