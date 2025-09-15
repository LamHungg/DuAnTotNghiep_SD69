package com.example.ZMEN.controller;


import com.example.ZMEN.dto.ChatLieuDTO;
import com.example.ZMEN.service.ChatLieuService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/chatlieu")
public class ChatLieuController {
    private final ChatLieuService chatLieuService;

    public ChatLieuController(ChatLieuService chatLieuService) {
        this.chatLieuService = chatLieuService;
    }

    @GetMapping
    public ResponseEntity<List<ChatLieuDTO>> getAllChatLieu() {
        return ResponseEntity.ok(chatLieuService.getAllChatLieu());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChatLieuDTO> getChatLieuById(@PathVariable Integer id) {
        return ResponseEntity.ok(chatLieuService.getChatLieuById(id));
    }

    @PostMapping
    public ResponseEntity<ChatLieuDTO> createChatLieu(@Valid @RequestBody ChatLieuDTO dto) {
        return ResponseEntity.ok(chatLieuService.createChatLieu(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChatLieuDTO> updateChatLieu(@PathVariable Integer id, @Valid @RequestBody ChatLieuDTO dto) {
        return ResponseEntity.ok(chatLieuService.updateChatLieu(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChatLieu(@PathVariable Integer id) {
        chatLieuService.deleteChatLieu(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<List<ChatLieuDTO>> searchChatLieu(
            @RequestParam(required = false) String ten,
            @RequestParam(required = false) Byte trangThai) {
        return ResponseEntity.ok(chatLieuService.searchChatLieu(ten, trangThai));
    }

}