package com.example.ZMEN.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "dia_chi")
public class DiaChi {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

    @Column(name = "tinh_thanh")
    private String tinhThanh;

    @Column(name = "quan_huyen")
    private String quanHuyen;

    @Column(name = "phuong_xa")
    private String phuongXa;

    @Column(name = "duong")
    private String duong;

    @Column(name = "dia_chi_mac_dinh")
    private Boolean diaChiMacDinh;

    // Constructors
    public DiaChi() {}

    public DiaChi(Integer id, KhachHang khachHang, String tinhThanh, String quanHuyen, 
                  String phuongXa, String duong, Boolean diaChiMacDinh) {
        this.id = id;
        this.khachHang = khachHang;
        this.tinhThanh = tinhThanh;
        this.quanHuyen = quanHuyen;
        this.phuongXa = phuongXa;
        this.duong = duong;
        this.diaChiMacDinh = diaChiMacDinh;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public KhachHang getKhachHang() { return khachHang; }
    public void setKhachHang(KhachHang khachHang) { this.khachHang = khachHang; }

    public String getTinhThanh() { return tinhThanh; }
    public void setTinhThanh(String tinhThanh) { this.tinhThanh = tinhThanh; }

    public String getQuanHuyen() { return quanHuyen; }
    public void setQuanHuyen(String quanHuyen) { this.quanHuyen = quanHuyen; }

    public String getPhuongXa() { return phuongXa; }
    public void setPhuongXa(String phuongXa) { this.phuongXa = phuongXa; }

    public String getDuong() { return duong; }
    public void setDuong(String duong) { this.duong = duong; }

    public Boolean getDiaChiMacDinh() { return diaChiMacDinh; }
    public void setDiaChiMacDinh(Boolean diaChiMacDinh) { this.diaChiMacDinh = diaChiMacDinh; }

    // Helper method để tương thích với DiaChidto
    public Integer getIdKhachHang() {
        return khachHang != null ? khachHang.getId() : null;
    }

    public void setIdKhachHang(Integer idKhachHang) {
        if (idKhachHang != null) {
            KhachHang newKhachHang = new KhachHang();
            newKhachHang.setId(idKhachHang);
            this.khachHang = newKhachHang;
        }
    }
}
