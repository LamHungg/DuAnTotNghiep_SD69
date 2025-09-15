package com.example.ZMEN.dto;

import java.time.LocalDateTime;

public class DiaChiDto {
    private Integer id;
    private String hoTen;
    private String soDienThoai;
    private String tinhThanh;
    private String quanHuyen;
    private String phuongXa;
    private String diaChiChiTiet;
    private String loaiDiaChi;
    private Boolean macDinh;
    private LocalDateTime ngayTao;
    private LocalDateTime ngayCapNhat;

    // Constructors
    public DiaChiDto() {}

    public DiaChiDto(Integer id, String hoTen, String soDienThoai, String tinhThanh, 
                    String quanHuyen, String phuongXa, String diaChiChiTiet, 
                    String loaiDiaChi, Boolean macDinh, LocalDateTime ngayTao, LocalDateTime ngayCapNhat) {
        this.id = id;
        this.hoTen = hoTen;
        this.soDienThoai = soDienThoai;
        this.tinhThanh = tinhThanh;
        this.quanHuyen = quanHuyen;
        this.phuongXa = phuongXa;
        this.diaChiChiTiet = diaChiChiTiet;
        this.loaiDiaChi = loaiDiaChi;
        this.macDinh = macDinh;
        this.ngayTao = ngayTao;
        this.ngayCapNhat = ngayCapNhat;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getHoTen() { return hoTen; }
    public void setHoTen(String hoTen) { this.hoTen = hoTen; }

    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }

    public String getTinhThanh() { return tinhThanh; }
    public void setTinhThanh(String tinhThanh) { this.tinhThanh = tinhThanh; }

    public String getQuanHuyen() { return quanHuyen; }
    public void setQuanHuyen(String quanHuyen) { this.quanHuyen = quanHuyen; }

    public String getPhuongXa() { return phuongXa; }
    public void setPhuongXa(String phuongXa) { this.phuongXa = phuongXa; }

    public String getDiaChiChiTiet() { return diaChiChiTiet; }
    public void setDiaChiChiTiet(String diaChiChiTiet) { this.diaChiChiTiet = diaChiChiTiet; }

    public String getLoaiDiaChi() { return loaiDiaChi; }
    public void setLoaiDiaChi(String loaiDiaChi) { this.loaiDiaChi = loaiDiaChi; }

    public Boolean getMacDinh() { return macDinh; }
    public void setMacDinh(Boolean macDinh) { this.macDinh = macDinh; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }

    public LocalDateTime getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(LocalDateTime ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
    
    // Debug method
    @Override
    public String toString() {
        return "DiaChiDto{" +
                "id=" + id +
                ", hoTen='" + hoTen + '\'' +
                ", soDienThoai='" + soDienThoai + '\'' +
                ", tinhThanh='" + tinhThanh + '\'' +
                ", quanHuyen='" + quanHuyen + '\'' +
                ", phuongXa='" + phuongXa + '\'' +
                ", diaChiChiTiet='" + diaChiChiTiet + '\'' +
                ", loaiDiaChi='" + loaiDiaChi + '\'' +
                ", macDinh=" + macDinh +
                ", ngayTao=" + ngayTao +
                ", ngayCapNhat=" + ngayCapNhat +
                '}';
    }
}
