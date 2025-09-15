package com.example.ZMEN.repository;

import com.example.ZMEN.entity.DiaChiKhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiaChiKhachHangRepository extends JpaRepository<DiaChiKhachHang, Integer> {
    
    // Lấy tất cả địa chỉ của khách hàng
    @Query("SELECT d FROM DiaChiKhachHang d WHERE d.khachHangId = :khachHangId ORDER BY d.macDinh DESC, d.ngayTao DESC")
    List<DiaChiKhachHang> findByKhachHangIdOrderByMacDinhDescNgayTaoDesc(@Param("khachHangId") Integer khachHangId);
    
    // Lấy địa chỉ mặc định của khách hàng
    @Query("SELECT d FROM DiaChiKhachHang d WHERE d.khachHangId = :khachHangId AND d.macDinh = true")
    DiaChiKhachHang findByKhachHangIdAndMacDinhTrue(@Param("khachHangId") Integer khachHangId);
    
    // Đếm số địa chỉ của khách hàng
    @Query("SELECT COUNT(d) FROM DiaChiKhachHang d WHERE d.khachHangId = :khachHangId")
    long countByKhachHangId(@Param("khachHangId") Integer khachHangId);
    
    // Reset tất cả địa chỉ về không mặc định
    @Modifying
    @Query("UPDATE DiaChiKhachHang d SET d.macDinh = false WHERE d.khachHangId = :khachHangId")
    void resetMacDinhByKhachHangId(@Param("khachHangId") Integer khachHangId);
    
    // Đặt địa chỉ làm mặc định
    @Modifying
    @Query("UPDATE DiaChiKhachHang d SET d.macDinh = true WHERE d.id = :diaChiId")
    void setMacDinhById(@Param("diaChiId") Integer diaChiId);
}
