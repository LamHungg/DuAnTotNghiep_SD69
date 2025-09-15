package com.example.ZMEN.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class SanPhamTaoNhanhDTO {

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String tenSanPham;

    @NotNull(message = "Danh mục không được để trống")
    private Integer idDanhMuc;

    @NotNull(message = "Người tạo không được để trống")
    private Long idNguoiTao;

    public String getTenSanPham() {
        return tenSanPham;
    }

    public void setTenSanPham(String tenSanPham) {
        this.tenSanPham = tenSanPham;
    }

    public Integer getIdDanhMuc() {
        return idDanhMuc;
    }

    public void setIdDanhMuc(Integer idDanhMuc) {
        this.idDanhMuc = idDanhMuc;
    }

    public Long getIdNguoiTao() {
        return idNguoiTao;
    }

    public void setIdNguoiTao(Long idNguoiTao) {
        this.idNguoiTao = idNguoiTao;
    }
}
