package com.example.ZMEN.service;

import com.example.ZMEN.dto.HinhAnhSanPhamDTO;

public interface HinhAnhSanPhamService {
    HinhAnhSanPhamDTO addHinhAnh(HinhAnhSanPhamDTO dto);
    HinhAnhSanPhamDTO updateHinhAnh(Integer id, HinhAnhSanPhamDTO dto);
}