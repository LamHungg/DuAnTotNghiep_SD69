package com.example.ZMEN.mapper;

import com.example.ZMEN.dto.MauSacDTO;
import com.example.ZMEN.entity.MauSac;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class MauSacMapper {
    private final ModelMapper modelMapper;

    public MauSacMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public MauSacDTO toDTO(MauSac entity) {
        return modelMapper.map(entity, MauSacDTO.class);
    }

    public MauSac toEntity(MauSacDTO dto) {
        return modelMapper.map(dto, MauSac.class);
    }
}