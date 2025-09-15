package com.example.ZMEN.dto.ThongKeDto;

import java.math.BigDecimal;

public class HieuSuatNVDto {
    private Long idNhanVien;
    private String hoTen;
    private Long soLuongDon;
    private BigDecimal tongDoanhThu;

    public HieuSuatNVDto(Long idNhanVien, String hoTen, Long soLuongDon, BigDecimal tongDoanhThu) {
        this.idNhanVien = idNhanVien;
        this.hoTen = hoTen;
        this.soLuongDon = soLuongDon;
        this.tongDoanhThu = tongDoanhThu;
    }

    public Long getIdNhanVien() {
        return idNhanVien;
    }

    public void setIdNhanVien(Long idNhanVien) {
        this.idNhanVien = idNhanVien;
    }

    public String getHoTen() {
        return hoTen;
    }

    public void setHoTen(String hoTen) {
        this.hoTen = hoTen;
    }

    public Long getSoLuongDon() {
        return soLuongDon;
    }

    public void setSoLuongDon(Long soLuongDon) {
        this.soLuongDon = soLuongDon;
    }

    public BigDecimal getTongDoanhThu() {
        return tongDoanhThu;
    }

    public void setTongDoanhThu(BigDecimal tongDoanhThu) {
        this.tongDoanhThu = tongDoanhThu;
    }
}
