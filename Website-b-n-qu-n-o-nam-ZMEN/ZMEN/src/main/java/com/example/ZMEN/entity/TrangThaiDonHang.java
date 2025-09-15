package com.example.ZMEN.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "trang_thai_don_hang")
public class TrangThaiDonHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_trang_thai")
    private String tenTrangThai;

    // Constructors
    public TrangThaiDonHang() {}

    public TrangThaiDonHang(Integer id, String tenTrangThai) {
        this.id = id;
        this.tenTrangThai = tenTrangThai;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTenTrangThai() { return tenTrangThai; }
    public void setTenTrangThai(String tenTrangThai) { this.tenTrangThai = tenTrangThai; }
}