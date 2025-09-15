package com.example.ZMEN.repository;

import com.example.ZMEN.entity.DonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface ThongKeRepository extends JpaRepository<DonHang, Integer> {

    // ==================== SẢN PHẨM BÁN CHẠY ====================
    @Query(value = """
        SELECT
        sp.ten_san_pham AS tenSanPham,
        SUM(ctdh.so_luong) AS soLuongBan,
        SUM(ctdh.so_luong * ctsp.gia) AS doanhThu
        FROM chi_tiet_don_hang ctdh
        JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
        JOIN san_pham sp ON ctsp.id_san_pham = sp.id
        JOIN don_hang dh ON ctdh.id_don_hang = dh.id
        WHERE CAST(dh.ngay_dat AS DATE) = ?
        AND ctdh.id_trang_thai IN (1, 2, 3, 4, 5)
        GROUP BY sp.ten_san_pham
        ORDER BY soLuongBan DESC
                                
    """, nativeQuery = true)
    List<Object[]> thongKeTheoNgay(@Param("ngay") LocalDate ngay);

    @Query(value = """
        SELECT
        sp.ten_san_pham AS tenSanPham,
        SUM(ctdh.so_luong) AS soLuongBan,
        SUM(ctdh.so_luong * ctsp.gia) AS doanhThu
        FROM chi_tiet_don_hang ctdh
        JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
        JOIN san_pham sp ON ctsp.id_san_pham = sp.id
        JOIN don_hang dh ON ctdh.id_don_hang = dh.id
        WHERE MONTH(dh.ngay_dat) = ?1 AND YEAR(dh.ngay_dat) = ?2
        AND ctdh.id_trang_thai IN (1, 2, 3, 4, 5)
        GROUP BY sp.ten_san_pham
        ORDER BY soLuongBan DESC
    """, nativeQuery = true)
    List<Object[]> thongKeTheoThang(int thang, int nam);

    @Query(value = """
        SELECT
        sp.ten_san_pham AS tenSanPham,
        SUM(ctdh.so_luong) AS soLuongBan,
        SUM(ctdh.so_luong * ctsp.gia) AS doanhThu
        FROM chi_tiet_don_hang ctdh
        JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
        JOIN san_pham sp ON ctsp.id_san_pham = sp.id
        JOIN don_hang dh ON ctdh.id_don_hang = dh.id
        WHERE YEAR(dh.ngay_dat) = ?1
        AND ctdh.id_trang_thai IN (1, 2, 3, 4, 5)
        GROUP BY sp.ten_san_pham
        ORDER BY soLuongBan DESC
    """, nativeQuery = true)
    List<Object[]> thongKeTheoNam(int nam);

    @Query(value = """
        SELECT
        sp.ten_san_pham AS tenSanPham,
        SUM(ctdh.so_luong) AS soLuongBan,
        SUM(ctdh.so_luong * ctsp.gia) AS doanhThu
        FROM chi_tiet_don_hang ctdh
        JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
        JOIN san_pham sp ON ctsp.id_san_pham = sp.id
        JOIN don_hang dh ON ctdh.id_don_hang = dh.id
        WHERE dh.ngay_dat BETWEEN :tuNgay AND :denNgay
        AND ctdh.id_trang_thai IN (1, 2, 3, 4, 5)
        GROUP BY sp.ten_san_pham
        ORDER BY soLuongBan DESC
    """, nativeQuery = true)
    List<Object[]> thongKeTheoKhoangNgay(@Param("tuNgay") LocalDate tuNgay, @Param("denNgay") LocalDate denNgay);

    // ==================== DOANH THU ====================
    @Query(value = """
    SELECT SUM(dh.tong_thanh_toan)
    FROM don_hang dh
    WHERE dh.id IN (
        SELECT DISTINCT ctdh.id_don_hang
        FROM chi_tiet_don_hang ctdh
        WHERE ctdh.id_trang_thai = 5
    )
    AND CAST(dh.ngay_dat AS DATE) = :ngay
""", nativeQuery = true)
    Long tinhDoanhThuTheoNgay(@Param("ngay") LocalDate ngay);

    @Query(value = """
    SELECT SUM(dh.tong_thanh_toan)
    FROM don_hang dh
    WHERE dh.id IN (
        SELECT DISTINCT ctdh.id_don_hang
        FROM chi_tiet_don_hang ctdh
        WHERE ctdh.id_trang_thai = 5
    )
    AND MONTH(dh.ngay_dat) = ?1 AND YEAR(dh.ngay_dat) = ?2
""", nativeQuery = true)
    Long tinhDoanhThuTheoThang(int thang, int nam);

    @Query(value = """
    SELECT SUM(dh.tong_thanh_toan)
    FROM don_hang dh
    WHERE dh.id IN (
        SELECT DISTINCT ctdh.id_don_hang
        FROM chi_tiet_don_hang ctdh
        WHERE ctdh.id_trang_thai = 5
    )
    AND YEAR(dh.ngay_dat) = ?1
""", nativeQuery = true)
    Long tinhDoanhThuTheoNam(int nam);

    @Query(value = """
    SELECT SUM(dh.tong_thanh_toan)
    FROM don_hang dh
    WHERE dh.id IN (
        SELECT DISTINCT ctdh.id_don_hang
        FROM chi_tiet_don_hang ctdh
        WHERE ctdh.id_trang_thai = 5
    )
    AND CAST(dh.ngay_dat AS DATE) BETWEEN :tuNgay AND :denNgay
""", nativeQuery = true)
    Long tinhDoanhThuTheoKhoangNgay(@Param("tuNgay") LocalDate tuNgay, @Param("denNgay") LocalDate denNgay);

    // ==================== HIỆU SUẤT NHÂN VIÊN ====================
    @Query(value = """
    SELECT 
        nv.id AS idNhanVien,
        nv.ho_ten AS hoTen,
        COUNT(DISTINCT ctdh.id_don_hang) AS soLuongDon,
        SUM(
            (ctdh.so_luong * ctsp.gia) -- tiền hàng
            - ISNULL(ctdh.tien_giam_gia, 0) -- trừ giảm giá
            + CASE WHEN dh.tong_thanh_toan < 500000 THEN ISNULL(ctdh.phi_van_chuyen, 0) ELSE 0 END -- cộng phí nếu chưa miễn phí
        ) AS tongDoanhThu
    FROM chi_tiet_don_hang ctdh
    JOIN nguoi_dung nv ON ctdh.id_nhan_vien_xu_ly = nv.id
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
    WHERE CAST(dh.ngay_dat AS DATE) = :ngay
    AND ctdh.id_trang_thai = 5
    GROUP BY nv.id, nv.ho_ten
    ORDER BY tongDoanhThu DESC
""", nativeQuery = true)
    List<Object[]> hieuSuatNhanVienTheoNgay(@Param("ngay") LocalDate ngay);

    @Query(value = """
    SELECT 
        nv.id AS idNhanVien,
        nv.ho_ten AS hoTen,
        COUNT(DISTINCT ctdh.id_don_hang) AS soLuongDon,
        SUM(
            (ctdh.so_luong * ctsp.gia) -- tiền hàng
            - ISNULL(ctdh.tien_giam_gia, 0) -- trừ giảm giá
            + CASE WHEN dh.tong_thanh_toan < 500000 THEN ISNULL(ctdh.phi_van_chuyen, 0) ELSE 0 END -- cộng phí nếu chưa miễn phí
        ) AS tongDoanhThu
    FROM chi_tiet_don_hang ctdh
    JOIN nguoi_dung nv ON ctdh.id_nhan_vien_xu_ly = nv.id
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
    WHERE MONTH(dh.ngay_dat) = ?1 AND YEAR(dh.ngay_dat) = ?2
    AND ctdh.id_trang_thai = 5
    GROUP BY nv.id, nv.ho_ten
    ORDER BY tongDoanhThu DESC
""", nativeQuery = true)
    List<Object[]> hieuSuatNhanVienTheoThang(int thang, int nam);

    @Query(value = """
    SELECT 
        nv.id AS idNhanVien,
        nv.ho_ten AS hoTen,
        COUNT(DISTINCT ctdh.id_don_hang) AS soLuongDon,
        SUM(
            (ctdh.so_luong * ctsp.gia) -- tiền hàng
            - ISNULL(ctdh.tien_giam_gia, 0) -- trừ giảm giá
            + CASE WHEN dh.tong_thanh_toan < 500000 THEN ISNULL(ctdh.phi_van_chuyen, 0) ELSE 0 END -- cộng phí nếu chưa miễn phí
        ) AS tongDoanhThu
    FROM chi_tiet_don_hang ctdh
    JOIN nguoi_dung nv ON ctdh.id_nhan_vien_xu_ly = nv.id
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
    WHERE YEAR(dh.ngay_dat) = ?1
    AND ctdh.id_trang_thai = 5
    GROUP BY nv.id, nv.ho_ten
    ORDER BY tongDoanhThu DESC
""", nativeQuery = true)
    List<Object[]> hieuSuatNhanVienTheoNam(int nam);

    @Query(value = """
    SELECT 
        nv.id AS idNhanVien,
        nv.ho_ten AS hoTen,
        COUNT(DISTINCT ctdh.id_don_hang) AS soLuongDon,
        SUM(
            (ctdh.so_luong * ctsp.gia) -- tiền hàng
            - ISNULL(ctdh.tien_giam_gia, 0) -- trừ giảm giá
            + CASE WHEN dh.tong_thanh_toan < 500000 THEN ISNULL(ctdh.phi_van_chuyen, 0) ELSE 0 END -- cộng phí nếu chưa miễn phí
        ) AS tongDoanhThu
    FROM chi_tiet_don_hang ctdh
    JOIN nguoi_dung nv ON ctdh.id_nhan_vien_xu_ly = nv.id
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
    WHERE CAST(dh.ngay_dat AS DATE) BETWEEN :tuNgay AND :denNgay
    AND ctdh.id_trang_thai = 5
    GROUP BY nv.id, nv.ho_ten
    ORDER BY tongDoanhThu DESC
""", nativeQuery = true)
    List<Object[]> hieuSuatNhanVienTheoKhoangNgay(@Param("tuNgay") LocalDate tuNgay, @Param("denNgay") LocalDate denNgay);

    // ==================== KHÁCH HÀNG CHI TIÊU ====================
    @Query(value = """
    SELECT 
        kh.id AS idKhachHang,
        kh.ho_ten AS hoTen,
        kh.email,
        kh.so_dien_thoai AS soDienThoai,
        COUNT(DISTINCT ctdh.id_don_hang) AS soLuongDon,
        SUM(
            (ctdh.so_luong * ctsp.gia) -- tiền hàng
            - ISNULL(ctdh.tien_giam_gia, 0) -- trừ giảm giá
            + CASE WHEN dh.tong_thanh_toan < 500000 THEN ISNULL(ctdh.phi_van_chuyen, 0) ELSE 0 END -- cộng phí nếu chưa miễn phí
        ) AS tongChiTieu
    FROM chi_tiet_don_hang ctdh
    JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
    WHERE CAST(dh.ngay_dat AS DATE) = :ngay
    AND ctdh.id_trang_thai IN (1, 2, 3, 4, 5)
    GROUP BY kh.id, kh.ho_ten, kh.email, kh.so_dien_thoai
    ORDER BY tongChiTieu DESC
""", nativeQuery = true)
    List<Object[]> khachHangChiTieuTheoNgay(@Param("ngay") LocalDate ngay);

    @Query(value = """
           SELECT 
        kh.id AS idKhachHang,
        kh.ho_ten AS hoTen,
        kh.email,
        kh.so_dien_thoai AS soDienThoai,
        COUNT(DISTINCT ctdh.id_don_hang) AS soLuongDon,
        SUM(
            (ctdh.so_luong * ctsp.gia) -- tiền hàng
            - ISNULL(ctdh.tien_giam_gia, 0) -- trừ giảm giá
            + CASE WHEN dh.tong_thanh_toan < 500000 THEN ISNULL(ctdh.phi_van_chuyen, 0) ELSE 0 END -- cộng phí nếu chưa miễn phí
        ) AS tongChiTieu
    FROM chi_tiet_don_hang ctdh
    JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
        WHERE MONTH(dh.ngay_dat) = ?1 AND YEAR(dh.ngay_dat) = ?2
        AND ctdh.id_trang_thai IN (1, 2, 3, 4, 5)
        GROUP BY kh.id, kh.ho_ten, kh.email, kh.so_dien_thoai
        ORDER BY tongChiTieu DESC
    """, nativeQuery = true)
    List<Object[]> khachHangChiTieuTheoThang(int thang, int nam);

    @Query(value = """
        SELECT 
        kh.id AS idKhachHang,
        kh.ho_ten AS hoTen,
        kh.email,
        kh.so_dien_thoai AS soDienThoai,
        COUNT(DISTINCT ctdh.id_don_hang) AS soLuongDon,
        SUM(
            (ctdh.so_luong * ctsp.gia) -- tiền hàng
            - ISNULL(ctdh.tien_giam_gia, 0) -- trừ giảm giá
            + CASE WHEN dh.tong_thanh_toan < 500000 THEN ISNULL(ctdh.phi_van_chuyen, 0) ELSE 0 END -- cộng phí nếu chưa miễn phí
        ) AS tongChiTieu
    FROM chi_tiet_don_hang ctdh
    JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
    WHERE YEAR(dh.ngay_dat) = ?1
    AND ctdh.id_trang_thai IN (1, 2, 3, 4, 5)
    GROUP BY kh.id, kh.ho_ten, kh.email, kh.so_dien_thoai
    ORDER BY tongChiTieu DESC
""", nativeQuery = true)
    List<Object[]> khachHangChiTieuTheoNam(int nam);

    @Query(value = """
    SELECT 
        kh.id AS idKhachHang,
        kh.ho_ten AS hoTen,
        kh.email,
        kh.so_dien_thoai AS soDienThoai,
        COUNT(DISTINCT ctdh.id_don_hang) AS soLuongDon,
        SUM(
            (ctdh.so_luong * ctsp.gia) -- tiền hàng
            - ISNULL(ctdh.tien_giam_gia, 0) -- trừ giảm giá
            + CASE WHEN dh.tong_thanh_toan < 500000 THEN ISNULL(ctdh.phi_van_chuyen, 0) ELSE 0 END -- cộng phí nếu chưa miễn phí
        ) AS tongChiTieu
    FROM chi_tiet_don_hang ctdh
    JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
    WHERE CAST(dh.ngay_dat AS DATE) BETWEEN :tuNgay AND :denNgay
    AND ctdh.id_trang_thai IN (1, 2, 3, 4, 5) -- tính tất cả đơn hàng
    GROUP BY kh.id, kh.ho_ten, kh.email, kh.so_dien_thoai
    ORDER BY tongChiTieu DESC
""", nativeQuery = true)
    List<Object[]> khachHangChiTieuTheoKhoangNgay(
            @Param("tuNgay") LocalDate tuNgay,
            @Param("denNgay") LocalDate denNgay
    );

    // ==================== THỐNG KÊ TỔNG QUAN ====================
    @Query(value = "SELECT COUNT(*) FROM don_hang", nativeQuery = true)
    Long getTongDonHang();

    @Query(value = "SELECT COUNT(*) FROM khach_hang", nativeQuery = true)
    Long getTongKhachHang();

    @Query(value = "SELECT COUNT(*) FROM san_pham WHERE trang_thai = 1", nativeQuery = true)
    Long getTongSanPham();

    @Query(value = """
    SELECT ISNULL(SUM(dh.tong_thanh_toan), 0)
    FROM don_hang dh
    WHERE dh.id IN (
        SELECT DISTINCT ctdh.id_don_hang
        FROM chi_tiet_don_hang ctdh
        WHERE ctdh.id_trang_thai = 5
    )
    AND CAST(dh.ngay_dat AS DATE) = CAST(GETDATE() AS DATE)
    """, nativeQuery = true)
    Double getDoanhThuHomNay();

    @Query(value = """
    SELECT ISNULL(SUM(dh.tong_thanh_toan), 0)
    FROM don_hang dh
    WHERE dh.id IN (
        SELECT DISTINCT ctdh.id_don_hang
        FROM chi_tiet_don_hang ctdh
        WHERE ctdh.id_trang_thai = 5
    )
    AND MONTH(dh.ngay_dat) = MONTH(GETDATE()) AND YEAR(dh.ngay_dat) = YEAR(GETDATE())
    """, nativeQuery = true)
    Double getDoanhThuThangNay();

    @Query(value = """
    SELECT ISNULL(SUM(dh.tong_thanh_toan), 0)
    FROM don_hang dh
    WHERE dh.id IN (
        SELECT DISTINCT ctdh.id_don_hang
        FROM chi_tiet_don_hang ctdh
        WHERE ctdh.id_trang_thai = 5
    )
    AND YEAR(dh.ngay_dat) = YEAR(GETDATE())
    """, nativeQuery = true)
    Double getDoanhThuNamNay();

    @Query(value = """
    SELECT 
        CASE 
            WHEN prev_month.total = 0 THEN 100.0
            ELSE ((curr_month.total - prev_month.total) / prev_month.total) * 100
        END as tangTruong
    FROM 
        (SELECT ISNULL(SUM(dh.tong_thanh_toan), 0) as total
         FROM don_hang dh
         WHERE dh.id IN (
             SELECT DISTINCT ctdh.id_don_hang
             FROM chi_tiet_don_hang ctdh
             WHERE ctdh.id_trang_thai = 5
         )
         AND MONTH(dh.ngay_dat) = MONTH(GETDATE()) 
         AND YEAR(dh.ngay_dat) = YEAR(GETDATE())) curr_month,
        (SELECT ISNULL(SUM(dh.tong_thanh_toan), 0) as total
         FROM don_hang dh
         WHERE dh.id IN (
             SELECT DISTINCT ctdh.id_don_hang
             FROM chi_tiet_don_hang ctdh
             WHERE ctdh.id_trang_thai = 5
         )
         AND MONTH(dh.ngay_dat) = MONTH(DATEADD(MONTH, -1, GETDATE()))
         AND YEAR(dh.ngay_dat) = YEAR(DATEADD(MONTH, -1, GETDATE()))) prev_month
    """, nativeQuery = true)
    Double getTangTruongThang();

    @Query(value = """
    SELECT 
        CASE 
            WHEN prev_year.total = 0 THEN 100.0
            ELSE ((curr_year.total - prev_year.total) / prev_year.total) * 100
        END as tangTruong
    FROM 
        (SELECT ISNULL(SUM(dh.tong_thanh_toan), 0) as total
         FROM don_hang dh
         WHERE dh.id IN (
             SELECT DISTINCT ctdh.id_don_hang
             FROM chi_tiet_don_hang ctdh
             WHERE ctdh.id_trang_thai = 5
         )
         AND YEAR(dh.ngay_dat) = YEAR(GETDATE())) curr_year,
        (SELECT ISNULL(SUM(dh.tong_thanh_toan), 0) as total
         FROM don_hang dh
         WHERE dh.id IN (
             SELECT DISTINCT ctdh.id_don_hang
             FROM chi_tiet_don_hang ctdh
             WHERE ctdh.id_trang_thai = 5
         )
         AND YEAR(dh.ngay_dat) = YEAR(GETDATE()) - 1) prev_year
    """, nativeQuery = true)
    Double getTangTruongNam();

    // ==================== THỐNG KÊ TỔNG QUAN BỔ SUNG ====================
    @Query(value = """
    SELECT COUNT(*) as khachHangMoi
    FROM khach_hang kh
    WHERE kh.id IN (
        SELECT DISTINCT dh.id_khach_hang
        FROM don_hang dh
        WHERE MONTH(dh.ngay_dat) = MONTH(GETDATE()) 
        AND YEAR(dh.ngay_dat) = YEAR(GETDATE())
    )
    """, nativeQuery = true)
    Integer getKhachHangMoi();

    @Query(value = """
    SELECT 
        CAST(
            (COUNT(CASE WHEN ctdh.id_trang_thai = 6 THEN 1 END) * 100.0 / COUNT(*))
        AS FLOAT) as tyLeHuy
    FROM chi_tiet_don_hang ctdh
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    WHERE MONTH(dh.ngay_dat) = MONTH(GETDATE()) 
    AND YEAR(dh.ngay_dat) = YEAR(GETDATE())
    """, nativeQuery = true)
    Double getTyLeHuy();

    // ==================== DANH SÁCH ĐƠN HÀNG ====================
    @Query(value = """
    SELECT 
        dh.ma_don_hang AS maDonHang,
        kh.ho_ten AS khachHang,
        dh.ngay_dat AS ngayDat,
        dh.tong_thanh_toan AS tongTien,
        CASE 
            WHEN ctdh.id_trang_thai = 1 THEN 'Chờ xác nhận'
            WHEN ctdh.id_trang_thai = 2 THEN 'Đã xác nhận'
            WHEN ctdh.id_trang_thai = 3 THEN 'Đang xử lý'
            WHEN ctdh.id_trang_thai = 4 THEN 'Đang giao'
            WHEN ctdh.id_trang_thai = 5 THEN 'Đã giao'
            WHEN ctdh.id_trang_thai = 6 THEN 'Hủy'
            ELSE 'Không xác định'
        END AS trangThai
    FROM don_hang dh
    JOIN khach_hang kh ON dh.id_khach_hang = kh.id
    JOIN chi_tiet_don_hang ctdh ON dh.id = ctdh.id_don_hang
    WHERE 1=1
    AND (:filterType = 'hom-nay' OR CAST(dh.ngay_dat AS DATE) = CAST(GETDATE() AS DATE))
    AND (:filterType = 'tuan-nay' OR CAST(dh.ngay_dat AS DATE) BETWEEN DATEADD(day, -7, CAST(GETDATE() AS DATE)) AND CAST(GETDATE() AS DATE))
    AND (:filterType = 'thang-nay' OR (MONTH(dh.ngay_dat) = MONTH(GETDATE()) AND YEAR(dh.ngay_dat) = YEAR(GETDATE())))
    AND (:filterType = 'quy-nay' OR (DATEPART(quarter, dh.ngay_dat) = DATEPART(quarter, GETDATE()) AND YEAR(dh.ngay_dat) = YEAR(GETDATE())))
    AND (:selectedDate IS NULL OR CAST(dh.ngay_dat AS DATE) = :selectedDate)
    AND (:selectedMonth IS NULL OR MONTH(dh.ngay_dat) = :selectedMonth)
    AND (:selectedYear IS NULL OR YEAR(dh.ngay_dat) = :selectedYear)
    AND (:dateFrom IS NULL OR CAST(dh.ngay_dat AS DATE) >= :dateFrom)
    AND (:dateTo IS NULL OR CAST(dh.ngay_dat AS DATE) <= :dateTo)
    GROUP BY dh.ma_don_hang, kh.ho_ten, dh.ngay_dat, dh.tong_thanh_toan, ctdh.id_trang_thai
    ORDER BY dh.ngay_dat DESC
    """, nativeQuery = true)
    List<Object[]> getDonHangList(
        @Param("filterType") String filterType,
        @Param("selectedDate") LocalDate selectedDate,
        @Param("selectedMonth") Integer selectedMonth,
        @Param("selectedYear") Integer selectedYear,
        @Param("dateFrom") LocalDate dateFrom,
        @Param("dateTo") LocalDate dateTo
    );

    @Query(value = """
    SELECT TOP 5
        sp.ten_san_pham AS tenSanPham,
        SUM(ctdh.so_luong) AS soLuongBan,
        SUM(ctdh.so_luong * ctsp.gia) AS doanhThu
    FROM chi_tiet_don_hang ctdh
    JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
    JOIN san_pham sp ON ctsp.id_san_pham = sp.id
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    WHERE MONTH(dh.ngay_dat) = MONTH(GETDATE()) 
    AND YEAR(dh.ngay_dat) = YEAR(GETDATE())
    AND ctdh.id_trang_thai = 5
    GROUP BY sp.ten_san_pham
    ORDER BY soLuongBan DESC
    """, nativeQuery = true)
    List<Object[]> getTopSanPhamBanChayThang();

    @Query(value = """
    SELECT TOP 5
        kh.ho_ten AS hoTen,
        COUNT(DISTINCT ctdh.id_don_hang) AS soLuongDon,
        SUM(ctdh.so_luong * ctsp.gia) AS tongChiTieu
    FROM chi_tiet_don_hang ctdh
    JOIN khach_hang kh ON ctdh.id_khach_hang = kh.id
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
    WHERE MONTH(dh.ngay_dat) = MONTH(GETDATE()) 
    AND YEAR(dh.ngay_dat) = YEAR(GETDATE())
    AND ctdh.id_trang_thai = 5
    GROUP BY kh.ho_ten
    ORDER BY tongChiTieu DESC
    """, nativeQuery = true)
    List<Object[]> getTopKhachHangThang();

    // ==================== BIỂU ĐỒ VÀ PHÂN TÍCH ====================
    @Query(value = """
    SELECT 
        FORMAT(dh.ngay_dat, 'dd/MM') as thoiGian,
        SUM(dh.tong_thanh_toan) as doanhThu
    FROM don_hang dh
    WHERE dh.id IN (
        SELECT DISTINCT ctdh.id_don_hang
        FROM chi_tiet_don_hang ctdh
        WHERE ctdh.id_trang_thai = 5
    )
    AND (:nam IS NULL OR YEAR(dh.ngay_dat) = :nam)
    AND (:thang IS NULL OR MONTH(dh.ngay_dat) = :thang)
    GROUP BY FORMAT(dh.ngay_dat, 'dd/MM')
    ORDER BY thoiGian
    """, nativeQuery = true)
    List<Object[]> getBieuDoDoanhThu(@Param("loai") String loai, @Param("nam") Integer nam, @Param("thang") Integer thang);

    @Query(value = """
    SELECT 
        dm.ten_danh_muc AS tenDanhMuc,
        SUM(ctdh.so_luong * ctsp.gia) AS doanhThu
    FROM chi_tiet_don_hang ctdh
    JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id
    JOIN san_pham sp ON ctsp.id_san_pham = sp.id
    JOIN danh_muc dm ON sp.id_danh_muc = dm.id
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    WHERE ctdh.id_trang_thai = 5
    AND (:nam IS NULL OR YEAR(dh.ngay_dat) = :nam)
    AND (:thang IS NULL OR MONTH(dh.ngay_dat) = :thang)
    GROUP BY dm.ten_danh_muc
    ORDER BY doanhThu DESC
    """, nativeQuery = true)
    List<Object[]> getDoanhThuTheoDanhMuc(@Param("nam") Integer nam, @Param("thang") Integer thang);

    @Query(value = """
    SELECT 
        pttt.ten_phuong_thuc AS tenPhuongThuc,
        COUNT(DISTINCT ctdh.id_don_hang) as soLuong,
        SUM(dh.tong_thanh_toan) as tongTien
    FROM chi_tiet_don_hang ctdh
    JOIN don_hang dh ON ctdh.id_don_hang = dh.id
    JOIN phuong_thuc_thanh_toan pttt ON ctdh.id_phuong_thuc_thanh_toan = pttt.id
    WHERE ctdh.id_trang_thai = 5
    AND (:nam IS NULL OR YEAR(dh.ngay_dat) = :nam)
    AND (:thang IS NULL OR MONTH(dh.ngay_dat) = :thang)
    GROUP BY pttt.ten_phuong_thuc
    ORDER BY tongTien DESC
    """, nativeQuery = true)
    List<Object[]> getThongKeThanhToan(@Param("nam") Integer nam, @Param("thang") Integer thang);
}








