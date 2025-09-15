package com.example.ZMEN.service;

import com.example.ZMEN.dto.MauSacDTO;


import java.util.List;

public interface MauSacService {
    List<MauSacDTO> getAllMauSac();

    MauSacDTO getMauSacById(Integer id);

    MauSacDTO createMauSac(MauSacDTO dto);

    MauSacDTO updateMauSac(Integer id, MauSacDTO dto);

    void deleteMauSac(Integer id);

    List<MauSacDTO> searchMauSac(String tenMauSac, Byte trangThai);

}
