package com.example.ZMEN.mapper;

import com.example.ZMEN.dto.VoucherDTO;
import com.example.ZMEN.entity.Voucher;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class VoucherMapper {
    private final ModelMapper modelMapper;

    public VoucherMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public VoucherDTO toDTO(Voucher entity) {
        return modelMapper.map(entity, VoucherDTO.class);
    }

    public Voucher toEntity(VoucherDTO dto) {
        return modelMapper.map(dto, Voucher.class);
    }
}
