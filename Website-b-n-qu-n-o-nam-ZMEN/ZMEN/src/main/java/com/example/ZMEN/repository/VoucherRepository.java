package com.example.ZMEN.repository;

import com.example.ZMEN.entity.Voucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface VoucherRepository extends JpaRepository<Voucher, Integer> {
    @Query("SELECT v FROM Voucher v WHERE v.trangThai <> 0 AND v.ngayKetThuc < CURRENT_DATE")
    List<Voucher> findAllVoucherHetHan();


    @Query("SELECT v FROM Voucher v WHERE " +
            "(:tenVoucher IS NULL OR v.tenVoucher LIKE %:tenVoucher%) AND " +
            "(:maVoucher IS NULL OR v.maVoucher LIKE %:maVoucher%) AND " +
            "(:giaTriGiam IS NULL OR v.giaTriGiam = :giaTriGiam) AND " +
            "(:ngayBatDau IS NULL OR v.ngayBatDau >= :ngayBatDau) AND " +
            "(:ngayKetThuc IS NULL OR v.ngayKetThuc <= :ngayKetThuc) AND " +
            "(:trangThai IS NULL OR v.trangThai = :trangThai)")
    List<Voucher> searchVoucher(
            @Param("tenVoucher") String tenVoucher,
            @Param("maVoucher") String maVoucher,
            @Param("giaTriGiam") BigDecimal giaTriGiam,
            @Param("ngayBatDau") LocalDate ngayBatDau,
            @Param("ngayKetThuc") LocalDate ngayKetThuc,
            @Param("trangThai") Integer trangThai);

    // POS methods
    List<Voucher> findByTrangThai(Integer trangThai);
    
    java.util.Optional<Voucher> findByMaVoucher(String maVoucher);
}
