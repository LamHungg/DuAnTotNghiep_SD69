package com.example.ZMEN.repository;

import com.example.ZMEN.entity.ChiTietSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChiTietSanPhamRepository extends JpaRepository<ChiTietSanPham, Integer> {

    @Query("SELECT c FROM ChiTietSanPham c " +
            "WHERE (:idKichCo IS NULL OR c.kichCo.id = :idKichCo) " +
            "AND (:idMauSac IS NULL OR c.mauSac.id = :idMauSac) " +
            "AND (:idChatLieu IS NULL OR c.chatLieu.id = :idChatLieu)")
    List<ChiTietSanPham> findByBoLoc(
            @Param("idKichCo") Integer idKichCo,
            @Param("idMauSac") Integer idMauSac,
            @Param("idChatLieu") Integer idChatLieu
    );

    // POS methods
    @Query("SELECT c FROM ChiTietSanPham c WHERE c.soLuong > 0")
    List<ChiTietSanPham> findBySoLuongGreaterThanZero();

    @Query("SELECT c FROM ChiTietSanPham c " +
            "WHERE (c.sanPham.tenSanPham LIKE %:keyword% OR c.sanPham.maSanPham LIKE %:keyword%) " +
            "AND c.soLuong > 0")
    List<ChiTietSanPham> searchProductsForPOS(@Param("keyword") String keyword);
}
