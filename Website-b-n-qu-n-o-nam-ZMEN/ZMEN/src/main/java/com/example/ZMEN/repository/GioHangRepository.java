package com.example.ZMEN.repository;

import com.example.ZMEN.entity.GioHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface GioHangRepository extends JpaRepository<GioHang, Integer> {
  @Query("SELECT gh FROM GioHang gh WHERE gh.idKhachHang.id = :idKhachHang")
  Optional<GioHang> findByIdKhachHang_Id(@Param("idKhachHang") Integer idKhachHang);
}