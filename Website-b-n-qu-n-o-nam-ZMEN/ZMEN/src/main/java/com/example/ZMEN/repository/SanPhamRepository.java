package com.example.ZMEN.repository;

import com.example.ZMEN.entity.SanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {
    @Query("SELECT sp FROM SanPham sp WHERE " +
            "((:ten IS NULL OR sp.tenSanPham LIKE %:ten%) " +
            "OR (:ma IS NULL OR sp.maSanPham LIKE %:ma%)) AND " +
            "(:trangThai IS NULL OR sp.trangThai = :trangThai) AND " +
            "(:idDanhMuc IS NULL OR sp.danhMuc.id = :idDanhMuc)")
    List<SanPham> searchSanPham(@Param("ten") String ten,
                                @Param("ma") String maSanPham,
                                @Param("trangThai") Byte trangThai,
                                @Param("idDanhMuc") Integer idDanhMuc);


    @Query("SELECT MAX(s.maSanPham) FROM SanPham s")
    String findMaxMaSanPham();
}