package com.example.ZMEN.service;

import com.example.ZMEN.dto.ChatLieuDTO;

import java.util.List;

public interface ChatLieuService {
    List<ChatLieuDTO> getAllChatLieu();

    ChatLieuDTO getChatLieuById(Integer id);

    ChatLieuDTO createChatLieu(ChatLieuDTO dto);

    ChatLieuDTO updateChatLieu(Integer id, ChatLieuDTO dto);

    void deleteChatLieu(Integer id);

    List<ChatLieuDTO> searchChatLieu(String ten, Byte trangThai);

}
