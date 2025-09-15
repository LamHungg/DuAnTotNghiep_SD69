package com.example.ZMEN.repository;

import com.example.ZMEN.entity.DiaChi;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DiaChiRepository extends JpaRepository<DiaChi, Integer> {
    @Query("SELECT d FROM DiaChi d WHERE d.khachHang.id = :idKhachHang")
    List<DiaChi> findByIdKhachHang(@Param("idKhachHang") Integer idKhachHang);
}
