package com.example.ZMEN.repository;

import com.example.ZMEN.entity.MauSac;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MauSacRepository extends JpaRepository<MauSac, Integer> {
    @Query("SELECT m FROM MauSac m " +
            "WHERE (:tenMauSac IS NULL OR m.tenMauSac LIKE %:tenMauSac%) " +
            "AND (:trangThai IS NULL OR m.trangThai = :trangThai)")
    List<MauSac> searchByTenVaTrangThai(@Param("tenMauSac") String tenMauSac, @Param("trangThai") Byte trangThai);

}

