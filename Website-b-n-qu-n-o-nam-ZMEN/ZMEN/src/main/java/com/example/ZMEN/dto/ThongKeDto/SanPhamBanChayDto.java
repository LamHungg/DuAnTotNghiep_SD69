package com.example.ZMEN.dto.ThongKeDto;

public class SanPhamBanChayDto {
    private String tenSanPham;
    private Long soLuongBan;
    private Double doanhThu;

    public SanPhamBanChayDto(String tenSanPham, Long soLuongBan) {
        this.tenSanPham = tenSanPham;
        this.soLuongBan = soLuongBan;
    }

    public SanPhamBanChayDto(String tenSanPham, Long soLuongBan, Double doanhThu) {
        this.tenSanPham = tenSanPham;
        this.soLuongBan = soLuongBan;
        this.doanhThu = doanhThu;
    }

    public String getTenSanPham() {
        return tenSanPham;
    }

    public void setTenSanPham(String tenSanPham) {
        this.tenSanPham = tenSanPham;
    }

    public Long getSoLuongBan() {
        return soLuongBan;
    }

    public void setSoLuongBan(Long soLuongBan) {
        this.soLuongBan = soLuongBan;
    }

    public Double getDoanhThu() {
        return doanhThu;
    }

    public void setDoanhThu(Double doanhThu) {
        this.doanhThu = doanhThu;
    }
}
