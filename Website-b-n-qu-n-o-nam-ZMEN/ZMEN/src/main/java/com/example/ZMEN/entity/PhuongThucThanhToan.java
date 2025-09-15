package com.example.ZMEN.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "phuong_thuc_thanh_toan")
public class PhuongThucThanhToan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_phuong_thuc")
    private String tenPhuongThuc;

    // Constructors
    public PhuongThucThanhToan() {}

    public PhuongThucThanhToan(Integer id, String tenPhuongThuc) {
        this.id = id;
        this.tenPhuongThuc = tenPhuongThuc;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getTenPhuongThuc() { return tenPhuongThuc; }
    public void setTenPhuongThuc(String tenPhuongThuc) { this.tenPhuongThuc = tenPhuongThuc; }
}