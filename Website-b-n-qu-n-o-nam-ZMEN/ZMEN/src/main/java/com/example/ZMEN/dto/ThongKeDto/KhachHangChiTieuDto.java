package com.example.ZMEN.dto.ThongKeDto;

import java.math.BigDecimal;

public class KhachHangChiTieuDto {
    private Integer idKhachHang;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private Long soLuongDon;
    private BigDecimal tongChiTieu;

    public KhachHangChiTieuDto(Integer idKhachHang, String hoTen, String email, String soDienThoai, Long soLuongDon, BigDecimal tongChiTieu) {
        this.idKhachHang = idKhachHang;
        this.hoTen = hoTen;
        this.email = email;
        this.soDienThoai = soDienThoai;
        this.soLuongDon = soLuongDon;
        this.tongChiTieu = tongChiTieu;
    }

    public Integer getIdKhachHang() {
        return idKhachHang;
    }

    public void setIdKhachHang(Integer idKhachHang) {
        this.idKhachHang = idKhachHang;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getSoDienThoai() {
        return soDienThoai;
    }

    public void setSoDienThoai(String soDienThoai) {
        this.soDienThoai = soDienThoai;
    }

    public Long getSoLuongDon() {
        return soLuongDon;
    }

    public void setSoLuongDon(Long soLuongDon) {
        this.soLuongDon = soLuongDon;
    }

    public BigDecimal getTongChiTieu() {
        return tongChiTieu;
    }

    public void setTongChiTieu(BigDecimal tongChiTieu) {
        this.tongChiTieu = tongChiTieu;
    }
}
