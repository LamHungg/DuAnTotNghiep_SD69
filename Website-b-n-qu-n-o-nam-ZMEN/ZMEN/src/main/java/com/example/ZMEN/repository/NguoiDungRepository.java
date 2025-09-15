package com.example.ZMEN.repository;

import com.example.ZMEN.entity.NguoiDung;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface NguoiDungRepository extends JpaRepository<NguoiDung, Long> {
    Optional<NguoiDung> findByTenDangNhap(String tenDangNhap);
    List<NguoiDung> findByHoTenContaining(String hoTen);
    boolean existsByTenDangNhap(String tenDangNhap);
    boolean existsByEmail(String email);
    boolean existsByMa(String ma);
    Optional<NguoiDung> findByEmail(String email);
}
