package com.example.ZMEN.repository;

import com.example.ZMEN.entity.DonHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Integer> {
    
    // Lấy tất cả đơn hàng - tạm thời lấy tất cả vì không có khach_hang_id
    @Query("SELECT d FROM DonHang d ORDER BY d.ngayDat DESC")
    List<DonHang> findAllOrderByNgayDatDesc();
    
    // Lấy đơn hàng với phân trang
    @Query("SELECT d FROM DonHang d ORDER BY d.ngayDat DESC")
    Page<DonHang> findAllOrderByNgayDatDesc(Pageable pageable);
    
    // Tìm đơn hàng theo mã đơn hàng
    DonHang findByMaDonHang(String maDonHang);
    
    // Lấy đơn hàng gần đây nhất
    @Query("SELECT d FROM DonHang d ORDER BY d.ngayDat DESC")
    DonHang findFirstOrderByNgayDatDesc();
    
    // Tạo mã đơn hàng mới
    @Query("SELECT COUNT(d) FROM DonHang d WHERE d.ngayDat >= :startOfDay")
    Long countDonHangToday(@Param("startOfDay") LocalDateTime startOfDay);
    
    // Lấy đơn hàng theo khách hàng
    @Query("SELECT d FROM DonHang d WHERE d.khachHang.id = :khachHangId ORDER BY d.ngayDat DESC")
    List<DonHang> findByKhachHangId(@Param("khachHangId") Integer khachHangId);
}