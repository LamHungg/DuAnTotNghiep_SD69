package com.example.ZMEN.service.Impl;



import com.example.ZMEN.dto.ChatLieuDTO;
import com.example.ZMEN.entity.ChatLieu;
import com.example.ZMEN.exception.ResourceNotFoundException;
import com.example.ZMEN.mapper.ChatLieuMapper;
import com.example.ZMEN.repository.ChatLieuRepository;
import com.example.ZMEN.service.ChatLieuService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatLieuServiceImpl implements ChatLieuService {
    private final ChatLieuRepository chatLieuRepository;
    private final ChatLieuMapper chatLieuMapper;

    public ChatLieuServiceImpl(ChatLieuRepository chatLieuRepository, ChatLieuMapper chatLieuMapper) {
        this.chatLieuRepository = chatLieuRepository;
        this.chatLieuMapper = chatLieuMapper;
    }

    @Override
    public List<ChatLieuDTO> getAllChatLieu() {
        return chatLieuRepository.findAll().stream()
                .map(chatLieuMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ChatLieuDTO getChatLieuById(Integer id) {
        ChatLieu chatLieu = chatLieuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chất liệu không tồn tại với ID: " + id));
        return chatLieuMapper.toDTO(chatLieu);
    }

    @Override
    public ChatLieuDTO createChatLieu(ChatLieuDTO dto) {
        ChatLieu chatLieu = chatLieuMapper.toEntity(dto);
        chatLieu = chatLieuRepository.save(chatLieu);
        return chatLieuMapper.toDTO(chatLieu);
    }

    @Override
    public ChatLieuDTO updateChatLieu(Integer id, ChatLieuDTO dto) {
        ChatLieu chatLieu = chatLieuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chất liệu không tồn tại với ID: " + id));
        chatLieu.setTenChatLieu(dto.getTenChatLieu());
        chatLieu.setTrangThai(dto.getTrangThai());
        chatLieu = chatLieuRepository.save(chatLieu);
        return chatLieuMapper.toDTO(chatLieu);
    }

    @Override
    public void deleteChatLieu(Integer id) {
        ChatLieu chatLieu = chatLieuRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chất liệu không tồn tại với ID: " + id));
        chatLieu.setTrangThai((byte) 0); // 0 = đã bị vô hiệu hóa
        chatLieuRepository.save(chatLieu);
    }

    @Override
    public List<ChatLieuDTO> searchChatLieu(String ten, Byte trangThai) {
        return chatLieuRepository.searchByTenAndTrangThai(ten, trangThai).stream()
                .map(chatLieuMapper::toDTO)
                .collect(Collectors.toList());
    }


}