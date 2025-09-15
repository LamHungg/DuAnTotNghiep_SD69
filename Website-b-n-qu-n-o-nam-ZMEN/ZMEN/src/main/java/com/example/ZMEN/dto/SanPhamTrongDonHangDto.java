package com.example.ZMEN.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class SanPhamTrongDonHangDto {
    @NotNull(message = "ID chi tiết sản phẩm không được để trống")
    private Integer chiTietSanPhamId;

    @NotNull(message = "Số lượng không được để trống")
    @Min(value = 1, message = "Số lượng phải lớn hơn 0")
    private Integer soLuong;

    // Getters and Setters
    public Integer getChiTietSanPhamId() { return chiTietSanPhamId; }
    public void setChiTietSanPhamId(Integer chiTietSanPhamId) { this.chiTietSanPhamId = chiTietSanPhamId; }
    public Integer getSoLuong() { return soLuong; }
    public void setSoLuong(Integer soLuong) { this.soLuong = soLuong; }
}