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
@Table(name = "kich_co")
public class KichCo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_kich_co", nullable = false)
    private String tenKichCo;

    @Column(name = "trang_thai", nullable = false)
    private Byte trangThai = 1;

    public KichCo() {}

    public KichCo(Integer id, String tenKichCo, Byte trangThai) {
        this.id = id;
        this.tenKichCo = tenKichCo;
        this.trangThai = trangThai;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTenKichCo() { return tenKichCo; }
    public void setTenKichCo(String tenKichCo) { this.tenKichCo = tenKichCo; }
    public Byte getTrangThai() { return trangThai; }
    public void setTrangThai(Byte trangThai) { this.trangThai = trangThai; }
}