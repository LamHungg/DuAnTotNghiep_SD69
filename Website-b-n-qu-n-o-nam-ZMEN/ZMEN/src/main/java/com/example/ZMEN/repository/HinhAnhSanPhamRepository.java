package com.example.ZMEN.repository;

import com.example.ZMEN.entity.HinhAnhSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface HinhAnhSanPhamRepository extends JpaRepository<HinhAnhSanPham, Integer> {
    
    // Tìm tất cả ảnh theo chi tiết sản phẩm
    @Query("SELECT h FROM HinhAnhSanPham h WHERE h.chiTietSanPham.id = :chiTietSanPhamId")
    List<HinhAnhSanPham> findByChiTietSanPhamId(@Param("chiTietSanPhamId") Integer chiTietSanPhamId);
    
    // Tìm tất cả ảnh theo sản phẩm
    @Query("SELECT h FROM HinhAnhSanPham h WHERE h.sanPham.id = :sanPhamId")
    List<HinhAnhSanPham> findBySanPhamId(@Param("sanPhamId") Integer sanPhamId);
    
    // Xóa tất cả ảnh theo chi tiết sản phẩm
    @Modifying
    @Transactional
    @Query("DELETE FROM HinhAnhSanPham h WHERE h.chiTietSanPham.id = :chiTietSanPhamId")
    void deleteByChiTietSanPhamId(@Param("chiTietSanPhamId") Integer chiTietSanPhamId);
    
    // Tìm ảnh thumbnail theo chi tiết sản phẩm
    @Query("SELECT h FROM HinhAnhSanPham h WHERE h.chiTietSanPham.id = :chiTietSanPhamId AND h.isThumbnail = true")
    HinhAnhSanPham findThumbnailByChiTietSanPhamId(@Param("chiTietSanPhamId") Integer chiTietSanPhamId);
    
    // Tìm ảnh thumbnail theo sản phẩm
    @Query("SELECT h FROM HinhAnhSanPham h WHERE h.sanPham.id = :sanPhamId AND h.isThumbnail = true")
    HinhAnhSanPham findThumbnailBySanPhamId(@Param("sanPhamId") Integer sanPhamId);
}
