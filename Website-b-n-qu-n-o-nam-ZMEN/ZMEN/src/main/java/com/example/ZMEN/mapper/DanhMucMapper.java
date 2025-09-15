package com.example.ZMEN.mapper;

import com.example.ZMEN.dto.DanhMucDTO;
import com.example.ZMEN.entity.DanhMuc;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class DanhMucMapper {
    private final ModelMapper modelMapper;

    public DanhMucMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public DanhMucDTO toDTO(DanhMuc entity) {
        DanhMucDTO dto = modelMapper.map(entity, DanhMucDTO.class);
        if (entity.getDanhMucCha() != null) {
            dto.setIdDanhMucCha(entity.getDanhMucCha().getId());
        }
        return dto;
    }

    public DanhMuc toEntity(DanhMucDTO dto) {
        return modelMapper.map(dto, DanhMuc.class);
    }
}