package com.example.ZMEN.repository;

import com.example.ZMEN.entity.DanhMuc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DanhMucRepository extends JpaRepository<DanhMuc, Integer> {
    @Query("SELECT d FROM DanhMuc d " +
            "WHERE (:tenDanhMuc IS NULL OR d.tenDanhMuc LIKE %:tenDanhMuc%) " +
            "AND (:trangThai IS NULL OR d.trangThai = :trangThai)")
    List<DanhMuc> searchByTenVaTrangThai(@Param("tenDanhMuc") String tenDanhMuc,
                                         @Param("trangThai") Byte trangThai);
}