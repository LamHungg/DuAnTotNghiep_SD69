package com.example.ZMEN.dto;

import java.math.BigDecimal;

public class ChiTietDonHangDto {
    private Integer id;
    private Integer sanPhamId;
    private String tenSanPham;
    private String hinhAnh;
    private Integer soLuong;
    private BigDecimal donGia;
    private BigDecimal thanhTien;

    // Constructors
    public ChiTietDonHangDto() {}

    public ChiTietDonHangDto(Integer id, Integer sanPhamId, String tenSanPham, String hinhAnh,
                            Integer soLuong, BigDecimal donGia, BigDecimal thanhTien) {
        this.id = id;
        this.sanPhamId = sanPhamId;
        this.tenSanPham = tenSanPham;
        this.hinhAnh = hinhAnh;
        this.soLuong = soLuong;
        this.donGia = donGia;
        this.thanhTien = thanhTien;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getSanPhamId() { return sanPhamId; }
    public void setSanPhamId(Integer sanPhamId) { this.sanPhamId = sanPhamId; }

    public String getTenSanPham() { return tenSanPham; }
    public void setTenSanPham(String tenSanPham) { this.tenSanPham = tenSanPham; }

    public String getHinhAnh() { return hinhAnh; }
    public void setHinhAnh(String hinhAnh) { this.hinhAnh = hinhAnh; }

    public Integer getSoLuong() { return soLuong; }
    public void setSoLuong(Integer soLuong) { this.soLuong = soLuong; }

    public BigDecimal getDonGia() { return donGia; }
    public void setDonGia(BigDecimal donGia) { this.donGia = donGia; }

    public BigDecimal getThanhTien() { return thanhTien; }
    public void setThanhTien(BigDecimal thanhTien) { this.thanhTien = thanhTien; }
}
