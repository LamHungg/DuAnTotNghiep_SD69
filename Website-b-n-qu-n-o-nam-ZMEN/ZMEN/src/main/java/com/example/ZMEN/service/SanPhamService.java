package com.example.ZMEN.service;

import com.example.ZMEN.dto.SanPhamDTO;
import com.example.ZMEN.dto.SanPhamTaoNhanhDTO;

import java.util.List;

public interface SanPhamService {
    List<SanPhamDTO> getAllSanPham();

    SanPhamDTO getSanPhamById(Integer id);

    SanPhamDTO createSanPham(SanPhamDTO dto);

    SanPhamDTO updateSanPham(Integer id, SanPhamDTO dto);

    void deleteSanPham(Integer id);

    List<SanPhamDTO> searchSanPham(String keyword, String tenSanPham, String maSanPham, Byte trangThai, Integer idDanhMuc);


    SanPhamDTO themNhanhSanPham(SanPhamTaoNhanhDTO dto);

}
