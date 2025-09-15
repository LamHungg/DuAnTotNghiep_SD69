package com.example.ZMEN.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ChatLieuDTO {
    private Integer id;

    @NotBlank(message = "Tên chất liệu không được để trống")
    private String tenChatLieu;

    @NotNull(message = "Trạng thái không được để trống")
    private Byte trangThai;

    public ChatLieuDTO() {}

    public ChatLieuDTO(Integer id, String tenChatLieu, Byte trangThai) {
        this.id = id;
        this.tenChatLieu = tenChatLieu;
        this.trangThai = trangThai;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTenChatLieu() { return tenChatLieu; }
    public Byte getTrangThai() { return trangThai; }
    public void setTrangThai(Byte trangThai) { this.trangThai = trangThai; }

    public void setTenChatLieu(String tenChatLieu) {
        this.tenChatLieu = tenChatLieu;
    }
}