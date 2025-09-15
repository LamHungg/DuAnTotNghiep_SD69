package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.KhachHangViewDto;
import java.util.stream.Collectors;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.repository.KhachHangRepository;
import com.example.ZMEN.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class KhachHangServiceImpl implements KhachHangService {
    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private com.example.ZMEN.repository.ChiTietDonHangRepository chiTietDonHangRepository;

    @Override
    public KhachHang addKhachHang(KhachHang khachHang) {
        if (khachHangRepository.existsBySoDienThoai(khachHang.getSoDienThoai())) {
            throw new RuntimeException("Số điện thoại đã tồn tại");
        }
        if (khachHangRepository.existsByEmail(khachHang.getEmail())) {
            throw new RuntimeException("Email đã tồn tại");
        }
        if (khachHangRepository.existsByTenDangNhap(khachHang.getTenDangNhap())) {
            throw new RuntimeException("Tên đăng nhập đã tồn tại");
        }
        long count = khachHangRepository.count();
        khachHang.setMaKhachHang("KH" + String.format("%03d", count + 1));
        khachHang.setNgayDangKy(LocalDateTime.now());
        khachHang.setTrangThaiTaiKhoan(1);
        return khachHangRepository.save(khachHang);
    }

    @Override
    public java.util.List<KhachHang> getAll() {
        return khachHangRepository.findAll();
    }

    @Override
    public java.util.List<KhachHang> search(String keyword) {
        return khachHangRepository.findAll().stream()
            .filter(kh -> kh.getHoTen() != null && kh.getHoTen().toLowerCase().contains(keyword.toLowerCase()))
            .collect(java.util.stream.Collectors.toList());
    }

    @Override
    public KhachHang updateKhachHang(Long id, KhachHang khachHang) {
        KhachHang existing = khachHangRepository.findById(Math.toIntExact(id))
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));
        existing.setHoTen(khachHang.getHoTen());
        existing.setSoDienThoai(khachHang.getSoDienThoai());
        existing.setEmail(khachHang.getEmail());
        existing.setNgaySinh(khachHang.getNgaySinh());
        existing.setGioiTinh(khachHang.getGioiTinh());
        existing.setTenDangNhap(khachHang.getTenDangNhap());
        existing.setMatKhau(khachHang.getMatKhau());
        return khachHangRepository.save(existing);
    }

    @Override
    public KhachHang changeTrangThai(Long id, Integer trangThai) {
        KhachHang khachHang = khachHangRepository.findById(Math.toIntExact(id))
            .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));
        khachHang.setTrangThaiTaiKhoan(trangThai);
        return khachHangRepository.save(khachHang);
    }

    @Override
    public java.util.List<KhachHang> getAllKhachHang() {
        return khachHangRepository.findAll();
    }

    @Override
    public java.util.List<com.example.ZMEN.dto.ChiTietDonHangFullDTO> getAllChiTietDonHangByKhachHang(Long khachHangId) {
        java.util.List<Object[]> rows = chiTietDonHangRepository.findAllChiTietDonHangByKhachHangId(khachHangId.intValue());
        java.util.List<com.example.ZMEN.dto.ChiTietDonHangFullDTO> result = new java.util.ArrayList<>();
        for (Object[] row : rows) {
            com.example.ZMEN.dto.ChiTietDonHangFullDTO dto = new com.example.ZMEN.dto.ChiTietDonHangFullDTO();
            dto.setIdDonHang(row[0] != null ? ((Number) row[0]).longValue() : null);
            dto.setMaDonHang((String) row[1]);
            dto.setNgayDat(row[2] != null ? ((java.sql.Timestamp) row[2]).toLocalDateTime() : null);
            dto.setTongTienHang((java.math.BigDecimal) row[3]);
            dto.setTongThanhToan((java.math.BigDecimal) row[4]);
            dto.setIdChiTietDonHang(row[5] != null ? ((Number) row[5]).longValue() : null);
            dto.setSoLuong(row[6] != null ? ((Number) row[6]).intValue() : null);
            dto.setGia((java.math.BigDecimal) row[7]);
            dto.setGiaNhap((java.math.BigDecimal) row[8]);
            dto.setTenSanPham((String) row[9]);
            dto.setMaSanPham((String) row[10]);
            dto.setTenDanhMuc((String) row[11]);
            dto.setKichCo((String) row[12]);
            dto.setMauSac((String) row[13]);
            dto.setChatLieu((String) row[14]);
            dto.setMaKhuyenMai((String) row[15]);
            dto.setTenKhuyenMai((String) row[16]);
            dto.setPhanTramGiam((java.math.BigDecimal) row[17]);
            result.add(dto);
        }
        return result;
    }

    // POS method
    @Override
    public KhachHang getKhachHangById(Integer id) {
        return khachHangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + id));
    }
} 