package com.example.ZMEN.service;

import com.example.ZMEN.dto.DiaChidto.DiaChidto;

import java.util.List;

public interface DiaChiService {
    DiaChidto create(DiaChidto dto);
    DiaChidto update(Integer id, DiaChidto dto);
    void delete(Integer id);
    DiaChidto getById(Integer id);
    List<DiaChidto> getByKhachHangId(Integer idKhachHang);
    void setDiaChiMacDinh(Integer idDiaChi);
}
