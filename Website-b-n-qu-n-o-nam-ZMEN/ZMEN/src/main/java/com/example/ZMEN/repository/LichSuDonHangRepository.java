package com.example.ZMEN.repository;

import com.example.ZMEN.entity.LichSuDonHang;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LichSuDonHangRepository extends JpaRepository<LichSuDonHang, Integer> {
    List<LichSuDonHang> findByIdDonHang_IdOrderByThoiGianCapNhatDesc(Integer id);
}