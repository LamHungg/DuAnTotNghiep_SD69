package com.example.ZMEN.mapper;


import com.example.ZMEN.dto.HinhAnhSanPhamDTO;
import com.example.ZMEN.entity.HinhAnhSanPham;

public class HinhAnhSanPhamMapper {
    public static HinhAnhSanPham toEntity(HinhAnhSanPhamDTO dto) {
        HinhAnhSanPham entity = new HinhAnhSanPham();
        entity.setId(dto.getId());
        entity.setUrl(dto.getUrl());
        entity.setIsThumbnail(dto.getIsThumbnail());
        return entity;
    }

    public static HinhAnhSanPhamDTO toDTO(HinhAnhSanPham entity) {
        HinhAnhSanPhamDTO dto = new HinhAnhSanPhamDTO();
        dto.setId(entity.getId());
        dto.setUrl(entity.getUrl());
        dto.setIsThumbnail(entity.getIsThumbnail());
        return dto;
    }
}
