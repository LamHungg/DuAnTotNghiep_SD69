package com.example.ZMEN.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class KichCoDTO {
    private Integer id;

    @NotBlank(message = "Tên kích cỡ không được để trống")
    private String tenKichCo;

    @NotNull(message = "Trạng thái không được để trống")
    private Byte trangThai;

    public KichCoDTO() {}

    public KichCoDTO(Integer id, String tenKichCo, Byte trangThai) {
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