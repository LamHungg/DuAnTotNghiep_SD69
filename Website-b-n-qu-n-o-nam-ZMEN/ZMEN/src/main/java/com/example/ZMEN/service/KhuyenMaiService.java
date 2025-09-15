package com.example.ZMEN.service;

import com.example.ZMEN.dto.KhuyenMaiDTO;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

public interface KhuyenMaiService {
    List<KhuyenMaiDTO> getAllKhuyenMai();
    KhuyenMaiDTO getKhuyenMaiById(Integer id);
    KhuyenMaiDTO createKhuyenMai(KhuyenMaiDTO dto);
    KhuyenMaiDTO updateKhuyenMai(Integer id, KhuyenMaiDTO dto);
    void deleteKhuyenMai(Integer id);
    List<KhuyenMaiDTO> searchKhuyenMai(String tenKhuyenMai, String maKhuyenMai, BigDecimal phanTramGiam, Date ngayBatDau, Date ngayKetThuc, Byte trangThai);
}