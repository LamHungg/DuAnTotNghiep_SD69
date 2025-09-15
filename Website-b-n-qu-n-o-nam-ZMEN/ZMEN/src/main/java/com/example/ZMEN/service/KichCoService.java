package com.example.ZMEN.service;

import com.example.ZMEN.dto.KichCoDTO;


import java.util.List;

public interface KichCoService {
    List<KichCoDTO> getAllKichCo();

    KichCoDTO getKichCoById(Integer id);

    KichCoDTO createKichCo(KichCoDTO dto);

    KichCoDTO updateKichCo(Integer id, KichCoDTO dto);

    void deleteKichCo(Integer id);

    List<KichCoDTO> searchKichCo(String tenKichCo, Byte trangThai);

}