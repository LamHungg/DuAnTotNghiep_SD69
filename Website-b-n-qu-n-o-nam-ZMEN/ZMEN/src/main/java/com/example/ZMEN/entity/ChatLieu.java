package com.example.ZMEN.entity;

import jakarta.persistence.*;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

@Getter
@Setter
@Entity
@Table(name = "chat_lieu")
public class ChatLieu {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_chat_lieu", nullable = false)
    private String tenChatLieu;

    @Column(name = "trang_thai", nullable = false)
    private Byte trangThai = 1;

    public ChatLieu() {}

    public ChatLieu(Integer id, String tenChatLieu, Byte trangThai) {
        this.id = id;
        this.tenChatLieu = tenChatLieu;
        this.trangThai = trangThai;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTenChatLieu() { return tenChatLieu; }
    public void setTenChatLieu(String tenChatLieu) { this.tenChatLieu = tenChatLieu; }
    public Byte getTrangThai() { return trangThai; }
    public void setTrangThai(Byte trangThai) { this.trangThai = trangThai; }
}