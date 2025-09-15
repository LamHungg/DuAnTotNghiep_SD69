-- Script test đơn giản để debug lỗi 400 Bad Request
-- Chạy script này để kiểm tra cơ bản

-- ========================================
-- 1. KIỂM TRA DỮ LIỆU CƠ BẢN
-- ========================================
-- Kiểm tra khách hàng ID 7
SELECT 
    id,
    ma_khach_hang,
    ho_ten,
    so_dien_thoai,
    email
FROM khach_hang
WHERE id = 7;

-- Kiểm tra địa chỉ của khách hàng ID 7
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
-- 2. TEST API ENDPOINTS ĐƠN GIẢN
-- ========================================
-- Test endpoint cơ bản (không cần auth)
-- GET http://localhost:8080/api/addresses/test
-- Response: "API địa chỉ hoạt động bình thường!"

-- Test endpoint database (không cần auth)
-- GET http://localhost:8080/api/addresses/test-db
-- Response: "Database hoạt động bình thường! Số địa chỉ: X"

-- Test endpoint lấy tất cả địa chỉ (không cần auth)
-- GET http://localhost:8080/api/addresses/test-list
-- Response: JSON array của tất cả địa chỉ

-- ========================================
-- 3. HƯỚNG DẪN TEST
-- ========================================
-- 1. Chạy Backend: mvn spring-boot:run
-- 2. Chạy Frontend: npm start
-- 3. Đăng nhập vào hệ thống
-- 4. Vào trang Profile
-- 5. Mở Developer Tools (F12)
-- 6. Xem Console để kiểm tra:
--    - "Using test endpoint for debugging..."
--    - "Test response: [...]"
-- 7. Nếu test endpoint hoạt động, vấn đề là với JWT authentication
-- 8. Nếu test endpoint không hoạt động, vấn đề là với database/repository

-- ========================================
-- 4. THỐNG KÊ DỮ LIỆU
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
-- 5. KIỂM TRA LỖI CÓ THỂ XẢY RA
-- ========================================
-- ❌ Nếu test endpoint cũng lỗi 400:
-- 1. Database connection issues
-- 2. Repository method problems
-- 3. Entity mapping issues
-- 4. Spring Boot startup problems

-- ❌ Nếu test endpoint hoạt động nhưng JWT endpoint lỗi:
-- 1. JWT token parsing issues
-- 2. getUserFromToken method problems
-- 3. Authorization header issues
-- 4. KhachHangRepository problems

-- ✅ Kết quả mong đợi:
-- - Test endpoint hoạt động bình thường
-- - Trả về danh sách địa chỉ
-- - Không có lỗi 400 Bad Request
