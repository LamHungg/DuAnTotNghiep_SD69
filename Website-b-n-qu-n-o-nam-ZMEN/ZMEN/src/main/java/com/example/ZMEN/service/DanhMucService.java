package com.example.ZMEN.service;

import com.example.ZMEN.dto.DanhMucDTO;

import java.util.List;

public interface DanhMucService {
    List<DanhMucDTO> getAllDanhMuc();

    DanhMucDTO getDanhMucById(Integer id);

    DanhMucDTO createDanhMuc(DanhMucDTO dto);

    DanhMucDTO updateDanhMuc(Integer id, DanhMucDTO dto);

    void deleteDanhMuc(Integer id);

    List<DanhMucDTO> searchDanhMuc(String tenDanhMuc, Byte trangThai);

}