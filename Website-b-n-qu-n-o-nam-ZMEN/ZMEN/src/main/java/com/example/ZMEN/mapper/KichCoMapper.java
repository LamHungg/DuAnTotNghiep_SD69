package com.example.ZMEN.mapper;


import com.example.ZMEN.dto.KichCoDTO;
import com.example.ZMEN.entity.KichCo;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class KichCoMapper {
    private final ModelMapper modelMapper;

    public KichCoMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public KichCoDTO toDTO(KichCo entity) {
        return modelMapper.map(entity, KichCoDTO.class);
    }

    public KichCo toEntity(KichCoDTO dto) {
        return modelMapper.map(dto, KichCo.class);
    }
}