package com.example.ZMEN.service;
import com.example.ZMEN.entity.KhachHang;

import com.example.ZMEN.dto.KhachHangViewDto;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.dto.ChiTietDonHangFullDTO;
import java.util.List;

public interface KhachHangService {
    KhachHang addKhachHang(KhachHang khachHang);
    KhachHang updateKhachHang(Long id, KhachHang khachHang);
    KhachHang changeTrangThai(Long id, Integer trangThai);
    List<KhachHang> getAllKhachHang();
    List<ChiTietDonHangFullDTO> getAllChiTietDonHangByKhachHang(Long khachHangId);
    java.util.List<KhachHang> getAll();
    java.util.List<KhachHang> search(String keyword);
    
    // POS method
    KhachHang getKhachHangById(Integer id);
}
