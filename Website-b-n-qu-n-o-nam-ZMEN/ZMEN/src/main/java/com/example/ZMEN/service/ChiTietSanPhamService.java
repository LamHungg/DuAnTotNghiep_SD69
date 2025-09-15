package com.example.ZMEN.service;

import com.example.ZMEN.dto.ChiTietSanPhamDTO;


import java.util.List;

public interface ChiTietSanPhamService {
    List<ChiTietSanPhamDTO> getAllChiTietSanPham();

    ChiTietSanPhamDTO getChiTietSanPhamById(Integer id);

    ChiTietSanPhamDTO createChiTietSanPham(ChiTietSanPhamDTO dto);

    ChiTietSanPhamDTO updateChiTietSanPham(Integer id, ChiTietSanPhamDTO dto);

    void deleteChiTietSanPham(Integer id);

    List<ChiTietSanPhamDTO> locChiTietSanPham(Integer idKichCo, Integer idMauSac, Integer idChatLieu);

    // POS methods
    List<ChiTietSanPhamDTO> getAllChiTietSanPhamForPOS();
    
    List<ChiTietSanPhamDTO> searchProductsForPOS(String keyword);
    
    ChiTietSanPhamDTO updateStock(Integer id, Integer soLuongThayDoi);
    
    // Method to get entity for internal use
    com.example.ZMEN.entity.ChiTietSanPham getChiTietSanPhamEntityById(Integer id);

}
