package com.example.ZMEN.repository;

import com.example.ZMEN.entity.KhachHang;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {

    Optional<KhachHang> findByMaKhachHang(String maKhachHang);

    boolean existsBySoDienThoai(String soDienThoai);
    boolean existsByEmail(String email);
    boolean existsByTenDangNhap(String tenDangNhap);
    Optional<KhachHang> findByEmailOrSoDienThoai (String email, String soDienThoai);

    Optional<KhachHang> findByEmail(String email);
    Optional<KhachHang> findBySoDienThoai(String soDienThoai);


}
