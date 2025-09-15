package com.example.ZMEN.repository;

import com.example.ZMEN.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface TaiKhoanKHRepository extends JpaRepository<KhachHang, Integer> {
    KhachHang findByEmail(String email);

    boolean existsByTenDangNhap(String tenDangNhap);
    boolean existsByEmail(String email);

    @Query("SELECT MAX(kh.maKhachHang) FROM KhachHang kh")
    String findMaxMaKhachHang();

}
