package com.example.ZMEN.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class DonHangDto {
    private Integer id;
    private String maDonHang;
    private LocalDateTime ngayDat;
    private LocalDateTime ngayGiao;
    private BigDecimal tongTien;
    private String trangThai;
    private String ghiChu;
    private String diaChiGiao;
    private String soDienThoaiGiao;
    private String hoTenNguoiNhan;
    private String hinhThucDonHang;
    private List<ChiTietDonHangDto> chiTietDonHang;

    // Constructors
    public DonHangDto() {}

    public DonHangDto(Integer id, String maDonHang, LocalDateTime ngayDat, LocalDateTime ngayGiao,
                     BigDecimal tongTien, String trangThai, String ghiChu, String diaChiGiao,
                     String soDienThoaiGiao, String hoTenNguoiNhan, String hinhThucDonHang, List<ChiTietDonHangDto> chiTietDonHang) {
        this.id = id;
        this.maDonHang = maDonHang;
        this.ngayDat = ngayDat;
        this.ngayGiao = ngayGiao;
        this.tongTien = tongTien;
        this.trangThai = trangThai;
        this.ghiChu = ghiChu;
        this.diaChiGiao = diaChiGiao;
        this.soDienThoaiGiao = soDienThoaiGiao;
        this.hoTenNguoiNhan = hoTenNguoiNhan;
        this.hinhThucDonHang = hinhThucDonHang;
        this.chiTietDonHang = chiTietDonHang;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getMaDonHang() { return maDonHang; }
    public void setMaDonHang(String maDonHang) { this.maDonHang = maDonHang; }

    public LocalDateTime getNgayDat() { return ngayDat; }
    public void setNgayDat(LocalDateTime ngayDat) { this.ngayDat = ngayDat; }

    public LocalDateTime getNgayGiao() { return ngayGiao; }
    public void setNgayGiao(LocalDateTime ngayGiao) { this.ngayGiao = ngayGiao; }

    public BigDecimal getTongTien() { return tongTien; }
    public void setTongTien(BigDecimal tongTien) { this.tongTien = tongTien; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public String getDiaChiGiao() { return diaChiGiao; }
    public void setDiaChiGiao(String diaChiGiao) { this.diaChiGiao = diaChiGiao; }

    public String getSoDienThoaiGiao() { return soDienThoaiGiao; }
    public void setSoDienThoaiGiao(String soDienThoaiGiao) { this.soDienThoaiGiao = soDienThoaiGiao; }

    public String getHoTenNguoiNhan() { return hoTenNguoiNhan; }
    public void setHoTenNguoiNhan(String hoTenNguoiNhan) { this.hoTenNguoiNhan = hoTenNguoiNhan; }

    public String getHinhThucDonHang() { return hinhThucDonHang; }
    public void setHinhThucDonHang(String hinhThucDonHang) { this.hinhThucDonHang = hinhThucDonHang; }

    public List<ChiTietDonHangDto> getChiTietDonHang() { return chiTietDonHang; }
    public void setChiTietDonHang(List<ChiTietDonHangDto> chiTietDonHang) { this.chiTietDonHang = chiTietDonHang; }
}
