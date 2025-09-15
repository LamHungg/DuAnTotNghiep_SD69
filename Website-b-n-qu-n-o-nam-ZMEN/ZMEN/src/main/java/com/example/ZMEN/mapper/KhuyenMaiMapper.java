package com.example.ZMEN.mapper;

import com.example.ZMEN.dto.KhuyenMaiDTO;
import com.example.ZMEN.entity.KhuyenMai;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class KhuyenMaiMapper {
    private final ModelMapper modelMapper;

    public KhuyenMaiMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public KhuyenMaiDTO toDTO(KhuyenMai entity) {
        return modelMapper.map(entity, KhuyenMaiDTO.class);
    }

    public KhuyenMai toEntity(KhuyenMaiDTO dto) {
        return modelMapper.map(dto, KhuyenMai.class);
    }
}