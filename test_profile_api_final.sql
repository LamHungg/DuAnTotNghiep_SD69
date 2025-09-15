-- Script test cuối cùng cho tất cả API trong trang Profile sau khi sửa lỗi authentication
-- Chạy script này để kiểm tra toàn bộ hệ thống

-- ========================================
-- 1. KIỂM TRA DỮ LIỆU KHÁCH HÀNG
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
-- 2. KIỂM TRA DỮ LIỆU ĐỊA CHỈ
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
-- 3. KIỂM TRA DỮ LIỆU ĐƠN HÀNG
-- ========================================
SELECT 
    dh.id,
    dh.ma_don_hang,
    dh.loai_don_hang,
    dh.ngay_dat,
    dh.tong_tien_hang,
    dh.tong_thanh_toan
FROM don_hang dh
ORDER BY dh.ngay_dat DESC;

-- ========================================
-- 4. KIỂM TRA DỮ LIỆU CHI TIẾT ĐƠN HÀNG
-- ========================================
SELECT 
    ctdh.id,
    ctdh.id_don_hang,
    dh.ma_don_hang,
    ctdh.id_chi_tiet_san_pham,
    sp.ten_san_pham,
    ctdh.id_trang_thai,
    ttdh.ten_trang_thai,
    ctdh.id_khach_hang,
    kh.ho_ten as ten_khach_hang,
    ctdh.so_luong,
    ctdh.phi_van_chuyen,
    ctdh.tien_giam_gia
FROM chi_tiet_don_hang ctdh
LEFT JOIN don_hang dh ON ctdh.id_don_hang = dh.id
LEFT JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
LEFT JOIN san_pham sp ON ctsp.id_san_pham = sp.id
LEFT JOIN trang_thai_don_hang ttdh ON ctdh.id_trang_thai = ttdh.id
LEFT JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
ORDER BY ctdh.id_don_hang DESC, ctdh.id;

-- ========================================
-- 5. TEST API ENDPOINTS (SAU KHI SỬA LỖI AUTHENTICATION)
-- ========================================
-- Test endpoint cơ bản
-- GET http://localhost:8080/api/orders/test
-- GET http://localhost:8080/api/addresses/test
-- GET http://localhost:8080/api/auth/test

-- Test endpoint authentication với JWT token
-- GET http://localhost:8080/api/auth/check-session
-- Headers: Authorization: Bearer customer-token-7

-- Test endpoint đơn hàng với JWT token
-- GET http://localhost:8080/api/orders
-- Headers: Authorization: Bearer customer-token-7

-- GET http://localhost:8080/api/orders/1
-- Headers: Authorization: Bearer customer-token-7

-- GET http://localhost:8080/api/orders/status/processing
-- Headers: Authorization: Bearer customer-token-7

-- Test endpoint địa chỉ với JWT token
-- GET http://localhost:8080/api/addresses
-- Headers: Authorization: Bearer customer-token-7

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

-- PUT http://localhost:8080/api/addresses/1
-- Headers: Authorization: Bearer customer-token-7
-- Content-Type: application/json
-- {
--   "hoTen": "Nguyễn Văn Test Updated",
--   "soDienThoai": "0987654321",
--   "tinhThanh": "TP.HCM",
--   "quanHuyen": "Quận 1",
--   "phuongXa": "Bến Nghé",
--   "diaChiChiTiet": "456 Đường XYZ",
--   "loaiDiaChi": "Văn phòng",
--   "macDinh": false
-- }

-- DELETE http://localhost:8080/api/addresses/1
-- Headers: Authorization: Bearer customer-token-7

-- POST http://localhost:8080/api/addresses/1/set-default
-- Headers: Authorization: Bearer customer-token-7

-- ========================================
-- 6. KIỂM TRA LỖI ĐÃ SỬA
-- ========================================
-- ✅ Lỗi 401 Unauthorized đã được sửa bằng cách:
-- 1. Thay đổi từ session authentication sang JWT authentication
-- 2. Frontend gửi JWT token trong Authorization header
-- 3. Backend xử lý JWT token để xác thực user
-- 4. Token format: "customer-token-{userId}"

-- ✅ Các controller đã được cập nhật:
-- - DonHangController: Sử dụng JWT authentication
-- - DiaChiController: Sử dụng JWT authentication  
-- - AuthController: Hỗ trợ cả JWT và session authentication

-- ✅ Các service đã được cập nhật:
-- - orderService.js: Gửi JWT token trong header
-- - addressService.js: Gửi JWT token trong header
-- - authService.js: Gửi JWT token cho check-session

-- ========================================
-- 7. HƯỚNG DẪN TEST FRONTEND
-- ========================================
-- 1. Đăng nhập vào hệ thống để có JWT token
-- 2. Token sẽ được lưu trong localStorage
-- 3. Tất cả API calls sẽ tự động gửi token trong header
-- 4. Kiểm tra console để xem không còn lỗi 401
-- 5. Test các chức năng trong trang Profile:
--    - Xem thông tin cá nhân
--    - Xem danh sách đơn hàng
--    - Xem danh sách địa chỉ
--    - Thêm/sửa/xóa địa chỉ

-- ========================================
-- 8. KIỂM TRA TOKEN FORMAT
-- ========================================
-- Token được tạo khi đăng nhập: "customer-token-{userId}"
-- Ví dụ: "customer-token-7" cho user có ID = 7
-- Backend sẽ parse token để lấy userId và tìm user trong database

-- ========================================
-- 9. THỐNG KÊ TỔNG QUAN
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
    'Tổng số đơn hàng',
    COUNT(*)
FROM don_hang
UNION ALL
SELECT 
    'Tổng số chi tiết đơn hàng',
    COUNT(*)
FROM chi_tiet_don_hang
UNION ALL
SELECT 
    'Khách hàng có địa chỉ',
    COUNT(DISTINCT khach_hang_id)
FROM dia_chi_khach_hang
UNION ALL
SELECT 
    'Khách hàng có đơn hàng',
    COUNT(DISTINCT id_khach_hang)
FROM chi_tiet_don_hang;

-- ========================================
-- 10. KIỂM TRA ORPHAN RECORDS
-- ========================================
-- Địa chỉ không có khách hàng
SELECT COUNT(*) as orphan_dia_chi
FROM dia_chi_khach_hang dc
LEFT JOIN khach_hang kh ON dc.khach_hang_id = kh.id
WHERE kh.id IS NULL;

-- Chi tiết đơn hàng không có khách hàng
SELECT COUNT(*) as orphan_chi_tiet_khach_hang
FROM chi_tiet_don_hang ctdh
LEFT JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
WHERE kh.id IS NULL;

-- Chi tiết đơn hàng không có đơn hàng
SELECT COUNT(*) as orphan_chi_tiet_don_hang
FROM chi_tiet_don_hang ctdh
LEFT JOIN don_hang dh ON ctdh.id_don_hang = dh.id
WHERE dh.id IS NULL;
