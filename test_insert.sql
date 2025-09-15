-- Script test insert đơn giản
-- Chạy script này để test insert trực tiếp vào database

-- ========================================
-- TEST INSERT TRỰC TIẾP
-- ========================================

-- Lấy khách hàng đầu tiên
DECLARE @test_khach_hang_id INT;
SELECT TOP 1 @test_khach_hang_id = id FROM khach_hang ORDER BY id;

PRINT 'Testing insert with khach_hang_id: ' + CAST(@test_khach_hang_id AS VARCHAR);

-- Test insert 1
BEGIN TRY
    INSERT INTO dia_chi_khach_hang_new (
        khach_hang_id, 
        ho_ten, 
        so_dien_thoai, 
        tinh_thanh, 
        quan_huyen, 
        phuong_xa, 
        dia_chi_chi_tiet, 
        loai_dia_chi, 
        mac_dinh,
        ngay_tao,
        ngay_cap_nhat
    ) VALUES (
        @test_khach_hang_id,
        'Test User 1',
        '0123456789',
        'Hà Nội',
        'Cầu Giấy',
        'Dịch Vọng',
        '123 Đường Test',
        'Nhà riêng',
        0,
        GETDATE(),
        GETDATE()
    );
    PRINT 'Test insert 1 SUCCESS!';
    
    -- Xóa record test
    DELETE FROM dia_chi_khach_hang_new 
    WHERE khach_hang_id = @test_khach_hang_id 
    AND ho_ten = 'Test User 1';
    PRINT 'Test record 1 deleted.';
END TRY
BEGIN CATCH
    PRINT 'Test insert 1 FAILED!';
    PRINT 'Error: ' + ERROR_MESSAGE();
END CATCH

-- Test insert 2 (với mac_dinh = 1)
BEGIN TRY
    INSERT INTO dia_chi_khach_hang_new (
        khach_hang_id, 
        ho_ten, 
        so_dien_thoai, 
        tinh_thanh, 
        quan_huyen, 
        phuong_xa, 
        dia_chi_chi_tiet, 
        loai_dia_chi, 
        mac_dinh,
        ngay_tao,
        ngay_cap_nhat
    ) VALUES (
        @test_khach_hang_id,
        'Test User 2',
        '0987654321',
        'TP.HCM',
        'Quận 1',
        'Bến Nghé',
        '456 Đường Test',
        'Văn phòng',
        1,
        GETDATE(),
        GETDATE()
    );
    PRINT 'Test insert 2 SUCCESS!';
    
    -- Xóa record test
    DELETE FROM dia_chi_khach_hang_new 
    WHERE khach_hang_id = @test_khach_hang_id 
    AND ho_ten = 'Test User 2';
    PRINT 'Test record 2 deleted.';
END TRY
BEGIN CATCH
    PRINT 'Test insert 2 FAILED!';
    PRINT 'Error: ' + ERROR_MESSAGE();
END CATCH

-- ========================================
-- KIỂM TRA DỮ LIỆU SAU TEST
-- ========================================
SELECT 
    'Current data after test' as check_type,
    COUNT(*) as record_count
FROM dia_chi_khach_hang_new;

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
    mac_dinh,
    ngay_tao,
    ngay_cap_nhat
FROM dia_chi_khach_hang_new
ORDER BY id;

PRINT '=== HOÀN THÀNH TEST INSERT ===';
