package com.example.ZMEN.dto;

import java.math.BigDecimal;

public class CartItemRequest {
    private Integer chiTietSanPhamId;
    private Integer soLuong;
    private BigDecimal gia;
    private BigDecimal thanhTien;

    // Constructors
    public CartItemRequest() {}

    public CartItemRequest(Integer chiTietSanPhamId, Integer soLuong, BigDecimal gia, BigDecimal thanhTien) {
        this.chiTietSanPhamId = chiTietSanPhamId;
        this.soLuong = soLuong;
        this.gia = gia;
        this.thanhTien = thanhTien;
    }

    // Getters and Setters
    public Integer getChiTietSanPhamId() { return chiTietSanPhamId; }
    public void setChiTietSanPhamId(Integer chiTietSanPhamId) { this.chiTietSanPhamId = chiTietSanPhamId; }

    public Integer getSoLuong() { return soLuong; }
    public void setSoLuong(Integer soLuong) { this.soLuong = soLuong; }

    public BigDecimal getGia() { return gia; }
    public void setGia(BigDecimal gia) { this.gia = gia; }

    public BigDecimal getThanhTien() { return thanhTien; }
    public void setThanhTien(BigDecimal thanhTien) { this.thanhTien = thanhTien; }

    @Override
    public String toString() {
        return "CartItemRequest{" +
                "chiTietSanPhamId=" + chiTietSanPhamId +
                ", soLuong=" + soLuong +
                ", gia=" + gia +
                ", thanhTien=" + thanhTien +
                '}';
    }
}
