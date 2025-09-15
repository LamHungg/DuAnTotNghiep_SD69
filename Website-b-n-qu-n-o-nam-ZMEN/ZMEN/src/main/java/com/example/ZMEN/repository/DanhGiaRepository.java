package com.example.ZMEN.repository;

import com.example.ZMEN.entity.DanhGia;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DanhGiaRepository extends JpaRepository<DanhGia, Integer> {
    
    // Lấy tất cả đánh giá của một sản phẩm
    @Query("SELECT d FROM DanhGia d WHERE d.sanPham.id = :idSanPham AND d.trangThai = 1 ORDER BY d.ngayDanhGia DESC")
    List<DanhGia> findBySanPhamId(@Param("idSanPham") Integer idSanPham);
    
    // Lấy đánh giá của khách hàng cho sản phẩm
    @Query("SELECT d FROM DanhGia d WHERE d.khachHang.id = :idKhachHang AND d.sanPham.id = :idSanPham")
    Optional<DanhGia> findByKhachHangAndSanPham(@Param("idKhachHang") Integer idKhachHang, @Param("idSanPham") Integer idSanPham);
    
    // Đếm số đánh giá của sản phẩm
    @Query("SELECT COUNT(d) FROM DanhGia d WHERE d.sanPham.id = :idSanPham AND d.trangThai = 1")
    Long countBySanPhamId(@Param("idSanPham") Integer idSanPham);
    
    // Tính trung bình số sao của sản phẩm
    @Query("SELECT AVG(d.soSao) FROM DanhGia d WHERE d.sanPham.id = :idSanPham AND d.trangThai = 1")
    Double getAverageRatingBySanPhamId(@Param("idSanPham") Integer idSanPham);
    
    // Lấy phân bố số sao của sản phẩm
    @Query("SELECT d.soSao, COUNT(d) FROM DanhGia d WHERE d.sanPham.id = :idSanPham AND d.trangThai = 1 GROUP BY d.soSao ORDER BY d.soSao DESC")
    List<Object[]> getRatingDistributionBySanPhamId(@Param("idSanPham") Integer idSanPham);
    
    // Lấy đánh giá gần đây nhất của sản phẩm
    @Query("SELECT d FROM DanhGia d WHERE d.sanPham.id = :idSanPham AND d.trangThai = 1 ORDER BY d.ngayDanhGia DESC")
    List<DanhGia> findRecentReviewsBySanPhamId(@Param("idSanPham") Integer idSanPham);
}