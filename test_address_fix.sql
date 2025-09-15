-- Script test API địa chỉ sau khi sửa lỗi 400 Bad Request
-- Chạy script này để kiểm tra toàn bộ hệ thống địa chỉ

-- ========================================
-- 1. KIỂM TRA DỮ LIỆU ĐỊA CHỈ KHÁCH HÀNG
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
-- 2. KIỂM TRA KHÁCH HÀNG
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
-- 3. TEST API ENDPOINTS (SAU KHI SỬA LỖI 400)
-- ========================================
-- Test endpoint cơ bản
-- GET http://localhost:8080/api/addresses/test
-- Response: "API địa chỉ hoạt động bình thường!"

-- Test endpoint database
-- GET http://localhost:8080/api/addresses/test-db
-- Response: "Database hoạt động bình thường! Số địa chỉ: X"

-- Test endpoint authentication với JWT token
-- GET http://localhost:8080/api/addresses
-- Headers: Authorization: Bearer customer-token-7
-- Response: JSON array của địa chỉ của user ID 7

-- Test endpoint thêm địa chỉ với JWT token
-- POST http://localhost:8080/api/addresses
-- Headers: Authorization: Bearer customer-token-7
-- Content-Type: application/json
-- {
--   "hoTen": "Nguyễn Văn Test",
--   "soDienThoai": "0123456789",
--   "tinhThanh": "Hà Nội",
--   "quanHuyen": "Cầu Giấy",
--   "phuongXa": "Dịch Vọng",
--   "diaChiChiTiet": "123 Đường ABC",
--   "loaiDiaChi": "Nhà riêng",
--   "macDinh": true
-- }

-- ========================================
-- 4. KIỂM TRA LỖI ĐÃ SỬA
-- ========================================
-- ✅ Lỗi 400 Bad Request đã được sửa bằng cách:
-- 1. Sử dụng @Query annotation thay vì JPA naming convention
-- 2. Sửa ErrorResponse class để loại bỏ Lombok conflict
-- 3. Thêm test endpoints để debug

-- ✅ Các repository methods đã được sửa:
-- - findByKhachHangIdOrderByMacDinhDescNgayTaoDesc: Sử dụng @Query
-- - findByKhachHangIdAndMacDinhTrue: Sử dụng @Query
-- - countByKhachHangId: Sử dụng @Query

-- ✅ ErrorResponse class đã được sửa:
-- - Loại bỏ Lombok annotations
-- - Sử dụng manual constructors và getters/setters

-- ========================================
-- 5. HƯỚNG DẪN TEST FRONTEND
-- ========================================
-- 1. Chạy Backend: mvn spring-boot:run
-- 2. Chạy Frontend: npm start
-- 3. Đăng nhập vào hệ thống
-- 4. Vào trang Profile
-- 5. Kiểm tra console để xem không còn lỗi 400
-- 6. Test chức năng thêm/sửa/xóa địa chỉ

-- ========================================
-- 6. THỐNG KÊ TỔNG QUAN
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
    'Số địa chỉ mặc định',
    COUNT(*)
FROM dia_chi_khach_hang
WHERE mac_dinh = 1
UNION ALL
SELECT 
    'Khách hàng có địa chỉ',
    COUNT(DISTINCT khach_hang_id)
FROM dia_chi_khach_hang;

-- ========================================
-- 7. KIỂM TRA ORPHAN RECORDS
-- ========================================
-- Địa chỉ không có khách hàng
SELECT COUNT(*) as orphan_dia_chi
FROM dia_chi_khach_hang dc
LEFT JOIN khach_hang kh ON dc.khach_hang_id = kh.id
WHERE kh.id IS NULL;

-- Khách hàng không có địa chỉ
SELECT COUNT(*) as khach_hang_khong_co_dia_chi
FROM khach_hang kh
LEFT JOIN dia_chi_khach_hang dc ON kh.id = dc.khach_hang_id
WHERE dc.id IS NULL;
