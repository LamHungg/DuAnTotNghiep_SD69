package com.example.ZMEN.repository;

import com.example.ZMEN.entity.ChiTietDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChiTietDonHangRepository extends JpaRepository<ChiTietDonHang, Integer> {
    // Giữ lại query tìm chi tiết đơn hàng theo khách hàng
    @org.springframework.data.jpa.repository.Query(value = "SELECT dh.id AS idDonHang, dh.ma_don_hang, dh.ngay_dat, dh.tong_tien_hang, dh.tong_thanh_toan, " +
            "ctdh.id AS idChiTietDonHang, ctdh.so_luong, " +
            "ctsp.gia, ctsp.gia_nhap, " +
            "sp.ten_san_pham, sp.ma_san_pham, dm.ten_danh_muc, " +
            "kc.ten_kich_co, ms.ten_mau_sac, cl.ten_chat_lieu, " +
            "km.ma_khuyen_mai, km.ten_khuyen_mai, km.phan_tram_giam " +
            "FROM don_hang dh " +
            "JOIN chi_tiet_don_hang ctdh ON dh.id = ctdh.id_don_hang " +
            "JOIN chi_tiet_san_pham ctsp ON ctdh.id_chi_tiet_san_pham = ctsp.id " +
            "JOIN san_pham sp ON ctsp.id_san_pham = sp.id " +
            "JOIN danh_muc dm ON sp.id_danh_muc = dm.id " +
            "JOIN kich_co kc ON ctsp.id_kich_co = kc.id " +
            "JOIN mau_sac ms ON ctsp.id_mau_sac = ms.id " +
            "JOIN chat_lieu cl ON ctsp.id_chat_lieu = cl.id " +
            "LEFT JOIN khuyen_mai km ON ctsp.id_khuyen_mai = km.id " +
            "WHERE ctdh.id_khach_hang = :khachHangId", nativeQuery = true)
    List<Object[]> findAllChiTietDonHangByKhachHangId(@org.springframework.data.repository.query.Param("khachHangId") Integer khachHangId);

    @org.springframework.data.jpa.repository.Query("SELECT ctdh FROM ChiTietDonHang ctdh " +
            "LEFT JOIN FETCH ctdh.donHang " +
            "LEFT JOIN FETCH ctdh.khachHang " +
            "LEFT JOIN FETCH ctdh.trangThai " +
            "LEFT JOIN FETCH ctdh.diaChi " +
            "LEFT JOIN FETCH ctdh.chiTietSanPham " +
            "LEFT JOIN FETCH ctdh.chiTietSanPham.sanPham " +
            "WHERE ctdh.donHang.id = :idDonHang")
    List<ChiTietDonHang> findByIdDonHang(@org.springframework.data.repository.query.Param("idDonHang") Integer idDonHang);
    
    @org.springframework.data.jpa.repository.Query("SELECT ctdh FROM ChiTietDonHang ctdh " +
            "LEFT JOIN FETCH ctdh.donHang " +
            "LEFT JOIN FETCH ctdh.khachHang " +
            "LEFT JOIN FETCH ctdh.trangThai " +
            "LEFT JOIN FETCH ctdh.diaChi " +
            "LEFT JOIN FETCH ctdh.chiTietSanPham " +
            "LEFT JOIN FETCH ctdh.chiTietSanPham.sanPham")
    List<ChiTietDonHang> findAllWithRelationships();
    
    // Method để cập nhật chỉ trạng thái - sử dụng native SQL
    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying(clearAutomatically = true)
    @org.springframework.data.jpa.repository.Query(value = "UPDATE chi_tiet_don_hang SET id_trang_thai = :newTrangThaiId WHERE id = :id", nativeQuery = true)
    void updateTrangThaiById(@org.springframework.data.repository.query.Param("id") Integer id, 
                            @org.springframework.data.repository.query.Param("newTrangThaiId") Integer newTrangThaiId);
}
