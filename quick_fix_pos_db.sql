-- Quick fix for POS database constraints
-- Allow NULL for optional fields in chi_tiet_don_hang

-- Fix 1: Allow NULL for id_dia_chi
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_dia_chi INT NULL;

-- Fix 2: Allow NULL for id_khach_hang  
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_khach_hang INT NULL;

-- Fix 3: Allow NULL for id_voucher
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_voucher INT NULL;

-- Fix 4: Allow NULL for id_nhan_vien_xu_ly
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_nhan_vien_xu_ly INT NULL;

-- Fix 5: Allow NULL for id_phuong_thuc_thanh_toan
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_phuong_thuc_thanh_toan INT NULL;

-- Fix 6: Allow NULL for id_trang_thai
ALTER TABLE chi_tiet_don_hang ALTER COLUMN id_trang_thai INT NULL;

-- Fix 7: Set default values for numeric fields
UPDATE chi_tiet_don_hang SET phi_van_chuyen = 0 WHERE phi_van_chuyen IS NULL;
UPDATE chi_tiet_don_hang SET tien_giam_gia = 0 WHERE tien_giam_gia IS NULL;

-- Fix 8: Add default constraints
IF NOT EXISTS (SELECT * FROM sys.default_constraints WHERE name = 'DF_chi_tiet_don_hang_phi_van_chuyen')
    ALTER TABLE chi_tiet_don_hang ADD CONSTRAINT DF_chi_tiet_don_hang_phi_van_chuyen DEFAULT 0 FOR phi_van_chuyen;

IF NOT EXISTS (SELECT * FROM sys.default_constraints WHERE name = 'DF_chi_tiet_don_hang_tien_giam_gia')
    ALTER TABLE chi_tiet_don_hang ADD CONSTRAINT DF_chi_tiet_don_hang_tien_giam_gia DEFAULT 0 FOR tien_giam_gia;

PRINT 'POS database constraints fixed!';
