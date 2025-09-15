package com.example.ZMEN.mapper;


import com.example.ZMEN.dto.ChatLieuDTO;
import com.example.ZMEN.entity.ChatLieu;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

@Component
public class ChatLieuMapper {
    private final ModelMapper modelMapper;

    public ChatLieuMapper(ModelMapper modelMapper) {
        this.modelMapper = modelMapper;
    }

    public ChatLieuDTO toDTO(ChatLieu entity) {
        return modelMapper.map(entity, ChatLieuDTO.class);
    }

    public ChatLieu toEntity(ChatLieuDTO dto) {
        return modelMapper.map(dto, ChatLieu.class);
    }
}