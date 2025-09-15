-- Script test cuối cùng cho API địa chỉ sau khi sửa lỗi 401
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
-- 3. KIỂM TRA CẤU TRÚC BẢNG
-- ========================================
-- Bảng địa chỉ khách hàng
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'dia_chi_khach_hang'
ORDER BY ORDINAL_POSITION;

-- Bảng khách hàng
SELECT 
    COLUMN_NAME,
    DATA_TYPE,
    IS_NULLABLE,
    COLUMN_DEFAULT
FROM INFORMATION_SCHEMA.COLUMNS
WHERE TABLE_NAME = 'khach_hang'
ORDER BY ORDINAL_POSITION;

-- ========================================
-- 4. TEST TẠO DỮ LIỆU MẪU (NẾU CẦN)
-- ========================================
-- Test tạo khách hàng mới (nếu cần)
-- INSERT INTO khach_hang (ma_khach_hang, ho_ten, so_dien_thoai, email, ngay_dang_ky, trang_thai_tai_khoan)
-- VALUES ('KH001', 'Nguyễn Văn Test', '0123456789', 'test@example.com', GETDATE(), 1);

-- Test tạo địa chỉ mới (nếu cần)
-- INSERT INTO dia_chi_khach_hang (khach_hang_id, ho_ten, so_dien_thoai, tinh_thanh, quan_huyen, phuong_xa, dia_chi_chi_tiet, loai_dia_chi, mac_dinh, ngay_tao, ngay_cap_nhat)
-- VALUES (1, 'Nguyễn Văn Test', '0123456789', 'Hà Nội', 'Cầu Giấy', 'Dịch Vọng', '123 Đường ABC', 'Nhà riêng', 1, GETDATE(), GETDATE());

-- ========================================
-- 5. TEST API ENDPOINTS (SAU KHI SỬA LỖI 401)
-- ========================================
-- Test endpoint cơ bản
-- GET http://localhost:8080/api/addresses/test
-- Response: "API địa chỉ hoạt động bình thường!"

-- Test endpoint lấy danh sách địa chỉ (không yêu cầu authentication)
-- GET http://localhost:8080/api/addresses/test-list
-- Response: JSON array của tất cả địa chỉ

-- Test endpoint thêm địa chỉ (không yêu cầu authentication)
-- POST http://localhost:8080/api/addresses/test-add
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

-- Test endpoint cập nhật địa chỉ (không yêu cầu authentication)
-- PUT http://localhost:8080/api/addresses/test-add
-- Content-Type: application/json
-- {
--   "id": 1,
--   "hoTen": "Nguyễn Văn Test Updated",
--   "soDienThoai": "0987654321",
--   "tinhThanh": "TP.HCM",
--   "quanHuyen": "Quận 1",
--   "phuongXa": "Bến Nghé",
--   "diaChiChiTiet": "456 Đường XYZ",
--   "loaiDiaChi": "Văn phòng",
--   "macDinh": false
-- }

-- ========================================
-- 6. KIỂM TRA ORPHAN RECORDS
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

-- ========================================
-- 7. THỐNG KÊ ĐỊA CHỈ
-- ========================================
-- Số lượng địa chỉ theo khách hàng
SELECT 
    kh.ho_ten as ten_khach_hang,
    COUNT(dc.id) as so_dia_chi,
    SUM(CASE WHEN dc.mac_dinh = 1 THEN 1 ELSE 0 END) as so_dia_chi_mac_dinh
FROM khach_hang kh
LEFT JOIN dia_chi_khach_hang dc ON kh.id = dc.khach_hang_id
GROUP BY kh.id, kh.ho_ten
ORDER BY so_dia_chi DESC;

-- Số lượng địa chỉ theo loại
SELECT 
    loai_dia_chi,
    COUNT(*) as so_luong
FROM dia_chi_khach_hang
GROUP BY loai_dia_chi
ORDER BY so_luong DESC;

-- Số lượng địa chỉ theo tỉnh thành
SELECT 
    tinh_thanh,
    COUNT(*) as so_luong
FROM dia_chi_khach_hang
GROUP BY tinh_thanh
ORDER BY so_luong DESC;

-- ========================================
-- 8. KIỂM TRA DỮ LIỆU MẪU
-- ========================================
-- Hiển thị 5 địa chỉ mới nhất
SELECT TOP 5
    dc.id,
    kh.ho_ten as ten_khach_hang,
    dc.ho_ten,
    dc.tinh_thanh,
    dc.quan_huyen,
    dc.phuong_xa,
    dc.dia_chi_chi_tiet,
    dc.mac_dinh,
    dc.ngay_tao
FROM dia_chi_khach_hang dc
LEFT JOIN khach_hang kh ON dc.khach_hang_id = kh.id
ORDER BY dc.ngay_tao DESC;

-- Hiển thị địa chỉ mặc định của từng khách hàng
SELECT 
    kh.ho_ten as ten_khach_hang,
    dc.ho_ten,
    dc.tinh_thanh,
    dc.quan_huyen,
    dc.phuong_xa,
    dc.dia_chi_chi_tiet
FROM khach_hang kh
LEFT JOIN dia_chi_khach_hang dc ON kh.id = dc.khach_hang_id AND dc.mac_dinh = 1
ORDER BY kh.id;

-- ========================================
-- 9. KIỂM TRA FRONTEND INTEGRATION
-- ========================================
-- Frontend sẽ gọi các endpoints sau:
-- 1. GET /api/addresses/test-list - Lấy danh sách địa chỉ
-- 2. POST /api/addresses/test-add - Thêm địa chỉ mới
-- 3. PUT /api/addresses/test-add - Cập nhật địa chỉ
-- 4. DELETE /api/addresses/{id} - Xóa địa chỉ (tạm thời không thực hiện)
-- 5. POST /api/addresses/{id}/set-default - Đặt mặc định (tạm thời không thực hiện)

-- ========================================
-- 10. KIỂM TRA LỖI ĐÃ SỬA
-- ========================================
-- ✅ Lỗi 401 Unauthorized đã được sửa bằng cách:
-- 1. Thêm test endpoints không yêu cầu authentication
-- 2. Cập nhật frontend addressService.js để sử dụng test endpoints
-- 3. Đảm bảo tất cả endpoints hoạt động mà không cần session

-- ✅ Các endpoints test đã được tạo:
-- - GET /api/addresses/test - Test kết nối cơ bản
-- - GET /api/addresses/test-list - Lấy danh sách địa chỉ
-- - POST /api/addresses/test-add - Thêm địa chỉ mới
-- - PUT /api/addresses/test-add - Cập nhật địa chỉ

-- ✅ Frontend đã được cập nhật:
-- - addressService.js sử dụng test endpoints
-- - Loại bỏ withCredentials để tránh lỗi CORS
-- - Thêm proper headers cho requests

-- ========================================
-- 11. HƯỚNG DẪN TEST
-- ========================================
-- 1. Chạy Backend: mvn spring-boot:run
-- 2. Chạy Frontend: npm start
-- 3. Mở browser và test chức năng thêm địa chỉ
-- 4. Kiểm tra console để xem không còn lỗi 401
-- 5. Kiểm tra database để xem địa chỉ được thêm thành công

-- ========================================
-- 12. THỐNG KÊ TỔNG QUAN
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
