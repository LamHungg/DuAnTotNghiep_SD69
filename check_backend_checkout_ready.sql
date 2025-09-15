-- Kiểm tra backend có sẵn sàng cho checkout không
USE abcd7;
GO

-- 1. Kiểm tra các bảng cần thiết
PRINT '=== KIỂM TRA CÁC BẢNG CẦN THIẾT ===';

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'don_hang')
    PRINT '✅ Bảng don_hang tồn tại'
ELSE
    PRINT '❌ Bảng don_hang KHÔNG tồn tại';

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'chi_tiet_don_hang')
    PRINT '✅ Bảng chi_tiet_don_hang tồn tại'
ELSE
    PRINT '❌ Bảng chi_tiet_don_hang KHÔNG tồn tại';

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'khach_hang')
    PRINT '✅ Bảng khach_hang tồn tại'
ELSE
    PRINT '❌ Bảng khach_hang KHÔNG tồn tại';

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'dia_chi_khach_hang')
    PRINT '✅ Bảng dia_chi_khach_hang tồn tại'
ELSE
    PRINT '❌ Bảng dia_chi_khach_hang KHÔNG tồn tại';

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'phuong_thuc_thanh_toan')
    PRINT '✅ Bảng phuong_thuc_thanh_toan tồn tại'
ELSE
    PRINT '❌ Bảng phuong_thuc_thanh_toan KHÔNG tồn tại';

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'trang_thai_don_hang')
    PRINT '✅ Bảng trang_thai_don_hang tồn tại'
ELSE
    PRINT '❌ Bảng trang_thai_don_hang KHÔNG tồn tại';

IF EXISTS (SELECT * FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_NAME = 'chi_tiet_san_pham')
    PRINT '✅ Bảng chi_tiet_san_pham tồn tại'
ELSE
    PRINT '❌ Bảng chi_tiet_san_pham KHÔNG tồn tại';

-- 2. Kiểm tra dữ liệu cần thiết
PRINT '';
PRINT '=== KIỂM TRA DỮ LIỆU CẦN THIẾT ===';

-- Kiểm tra khách hàng
DECLARE @KhachHangCount INT;
SELECT @KhachHangCount = COUNT(*) FROM khach_hang;
SELECT @KhachHangCount as KhachHangCount;
PRINT 'Số lượng khách hàng: ' + CAST(@KhachHangCount AS VARCHAR(10));

-- Kiểm tra địa chỉ
DECLARE @DiaChiCount INT;
SELECT @DiaChiCount = COUNT(*) FROM dia_chi_khach_hang;
SELECT @DiaChiCount as DiaChiCount;
PRINT 'Số lượng địa chỉ: ' + CAST(@DiaChiCount AS VARCHAR(10));

-- Kiểm tra phương thức thanh toán
DECLARE @PaymentMethodCount INT;
SELECT @PaymentMethodCount = COUNT(*) FROM phuong_thuc_thanh_toan;
SELECT @PaymentMethodCount as PaymentMethodCount;
PRINT 'Số lượng phương thức thanh toán: ' + CAST(@PaymentMethodCount AS VARCHAR(10));

-- Kiểm tra trạng thái đơn hàng
DECLARE @OrderStatusCount INT;
SELECT @OrderStatusCount = COUNT(*) FROM trang_thai_don_hang;
SELECT @OrderStatusCount as OrderStatusCount;
PRINT 'Số lượng trạng thái đơn hàng: ' + CAST(@OrderStatusCount AS VARCHAR(10));

-- Kiểm tra sản phẩm
DECLARE @ProductCount INT;
SELECT @ProductCount = COUNT(*) FROM chi_tiet_san_pham;
SELECT @ProductCount as ProductCount;
PRINT 'Số lượng chi tiết sản phẩm: ' + CAST(@ProductCount AS VARCHAR(10));

-- 3. Kiểm tra dữ liệu mẫu
PRINT '';
PRINT '=== KIỂM TRA DỮ LIỆU MẪU ===';

-- Hiển thị khách hàng
SELECT TOP 5 id, ho_ten, email, so_dien_thoai FROM khach_hang;

-- Hiển thị địa chỉ
SELECT TOP 5 id, id_khach_hang, tinh_thanh, quan_huyen, phuong_xa FROM dia_chi_khach_hang;

-- Hiển thị phương thức thanh toán
SELECT id, ten_phuong_thuc FROM phuong_thuc_thanh_toan;

-- Hiển thị trạng thái đơn hàng
SELECT id, ten_trang_thai FROM trang_thai_don_hang;

-- Hiển thị sản phẩm
SELECT TOP 5 id, id_san_pham, gia, so_luong FROM chi_tiet_san_pham;

-- 4. Kiểm tra ràng buộc khóa ngoại
PRINT '';
PRINT '=== KIỂM TRA RÀNG BUỘC KHÓA NGOẠI ===';

-- Kiểm tra ràng buộc giữa chi_tiet_don_hang và don_hang
IF EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
    WHERE CONSTRAINT_NAME LIKE '%chi_tiet_don_hang%don_hang%'
)
    PRINT '✅ Ràng buộc chi_tiet_don_hang -> don_hang tồn tại'
ELSE
    PRINT '❌ Ràng buộc chi_tiet_don_hang -> don_hang KHÔNG tồn tại';

-- Kiểm tra ràng buộc giữa chi_tiet_don_hang và chi_tiet_san_pham
IF EXISTS (
    SELECT * FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS 
    WHERE CONSTRAINT_NAME LIKE '%chi_tiet_don_hang%chi_tiet_san_pham%'
)
    PRINT '✅ Ràng buộc chi_tiet_don_hang -> chi_tiet_san_pham tồn tại'
ELSE
    PRINT '❌ Ràng buộc chi_tiet_don_hang -> chi_tiet_san_pham KHÔNG tồn tại';

-- 5. Tạo dữ liệu mẫu nếu thiếu
PRINT '';
PRINT '=== TẠO DỮ LIỆU MẪU NẾU THIẾU ===';

-- Tạo phương thức thanh toán nếu chưa có
IF NOT EXISTS (SELECT * FROM phuong_thuc_thanh_toan WHERE id = 1)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc) VALUES (1, 'Tiền mặt');
    PRINT '✅ Đã tạo phương thức thanh toán: Tiền mặt';
END

IF NOT EXISTS (SELECT * FROM phuong_thuc_thanh_toan WHERE id = 2)
BEGIN
    INSERT INTO phuong_thuc_thanh_toan (id, ten_phuong_thuc) VALUES (2, 'Chuyển khoản');
    PRINT '✅ Đã tạo phương thức thanh toán: Chuyển khoản';
END

-- Tạo trạng thái đơn hàng nếu chưa có
IF NOT EXISTS (SELECT * FROM trang_thai_don_hang WHERE id = 1)
BEGIN
    INSERT INTO trang_thai_don_hang (id, ten_trang_thai) VALUES (1, 'Chờ xác nhận');
    PRINT '✅ Đã tạo trạng thái đơn hàng: Chờ xác nhận';
END

IF NOT EXISTS (SELECT * FROM trang_thai_don_hang WHERE id = 2)
BEGIN
    INSERT INTO trang_thai_don_hang (id, ten_trang_thai) VALUES (2, 'Đã xác nhận');
    PRINT '✅ Đã tạo trạng thái đơn hàng: Đã xác nhận';
END

PRINT '';
PRINT '=== KẾT QUẢ KIỂM TRA ===';
PRINT 'Nếu tất cả đều ✅ thì backend đã sẵn sàng cho checkout!';
PRINT 'Nếu có ❌ thì cần khắc phục trước khi test checkout.';
