package com.example.ZMEN.repository;

import com.example.ZMEN.entity.ChiTietGioHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ChiTietGioHangRepository extends JpaRepository<ChiTietGioHang, Integer> {
    Optional<ChiTietGioHang> findByIdGioHang_IdAndIdChiTietSanPham_Id(Integer idGioHang, Integer idChiTietSanPham);
    
    @Query("SELECT ctgh FROM ChiTietGioHang ctgh WHERE ctgh.idGioHang.id = :idGioHang")
    List<ChiTietGioHang> findByIdGioHang_Id(@Param("idGioHang") Integer idGioHang);
}