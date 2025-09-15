package com.example.ZMEN.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MauSacDTO {
    private Integer id;

    @NotBlank(message = "Tên màu sắc không được để trống")
    private String tenMauSac;

    @NotNull(message = "Trạng thái không được để trống")
    private Byte trangThai;

    public MauSacDTO() {}

    public MauSacDTO(Integer id, String tenMauSac, Byte trangThai) {
        this.id = id;
        this.tenMauSac = tenMauSac;
        this.trangThai = trangThai;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTenMauSac() { return tenMauSac; }
    public void setTenMauSac(String tenMauSac) { this.tenMauSac = tenMauSac; }
    public Byte getTrangThai() { return trangThai; }
    public void setTrangThai(Byte trangThai) { this.trangThai = trangThai; }
}