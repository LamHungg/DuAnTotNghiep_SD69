package com.example.ZMEN.repository;

import com.example.ZMEN.entity.KhuyenMai;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public interface KhuyenMaiRepository extends JpaRepository<KhuyenMai, Integer> {

    @Query("SELECT k FROM KhuyenMai k WHERE k.ngayKetThuc < CURRENT_DATE AND k.trangThai != 0")
    List<KhuyenMai> findAllKhuyenMaiHetHan();

    @Query("SELECT km FROM KhuyenMai km WHERE " +
            "(:tenKhuyenMai IS NULL OR km.tenKhuyenMai LIKE %:tenKhuyenMai%) AND " +
            "(:maKhuyenMai IS NULL OR km.maKhuyenMai LIKE %:maKhuyenMai%) AND " +
            "(:phanTramGiam IS NULL OR km.phanTramGiam = :phanTramGiam) AND " +
            "(:ngayBatDau IS NULL OR km.ngayBatDau >= :ngayBatDau) AND " +
            "(:ngayKetThuc IS NULL OR km.ngayKetThuc <= :ngayKetThuc) AND " +
            "(:trangThai IS NULL OR km.trangThai = :trangThai)")
    List<KhuyenMai> searchKhuyenMai(
            @Param("tenKhuyenMai") String tenKhuyenMai,
            @Param("maKhuyenMai") String maKhuyenMai,
            @Param("phanTramGiam") BigDecimal phanTramGiam,
            @Param("ngayBatDau") Date ngayBatDau,
            @Param("ngayKetThuc") Date ngayKetThuc,
            @Param("trangThai") Byte trangThai);
}