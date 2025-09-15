package com.example.ZMEN.dto.ThongKeDto;

public class DoanhThuDto {
    private String moTa; // ví dụ: "2025-06-21", "Tháng 6/2025", "Năm 2025", "20-21/06/2025"
    private Long tongDoanhThu;

    public DoanhThuDto(String moTa, Long tongDoanhThu) {
        this.moTa = moTa;
        this.tongDoanhThu = tongDoanhThu;
    }

    public String getMoTa() {
        return moTa;
    }

    public void setMoTa(String moTa) {
        this.moTa = moTa;
    }

    public Long getTongDoanhThu() {
        return tongDoanhThu;
    }

    public void setTongDoanhThu(Long tongDoanhThu) {
        this.tongDoanhThu = tongDoanhThu;
    }
}
