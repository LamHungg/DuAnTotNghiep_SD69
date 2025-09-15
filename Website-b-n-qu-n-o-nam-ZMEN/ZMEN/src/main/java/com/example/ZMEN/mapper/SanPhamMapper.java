package com.example.ZMEN.mapper;

import com.example.ZMEN.dto.SanPhamDTO;
import com.example.ZMEN.entity.SanPham;
import com.example.ZMEN.entity.DanhMuc;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class SanPhamMapper {

    private final ModelMapper modelMapper;

    public SanPhamMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public SanPhamDTO toDTO(SanPham entity) {
        SanPhamDTO dto = modelMapper.map(entity, SanPhamDTO.class);
        if (entity.getDanhMuc() != null) {
            dto.setIdDanhMuc(entity.getDanhMuc().getId());
        }
        return dto;
    }

    public SanPham toEntity(SanPhamDTO dto) {
        SanPham entity = modelMapper.map(dto, SanPham.class);
        if (dto.getIdDanhMuc() != null) {
            DanhMuc danhMuc = new DanhMuc();
            danhMuc.setId(dto.getIdDanhMuc());
            entity.setDanhMuc(danhMuc);
        }
        return entity;
    }
}
