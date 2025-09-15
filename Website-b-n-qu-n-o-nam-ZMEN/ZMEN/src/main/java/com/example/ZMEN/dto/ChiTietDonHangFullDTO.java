package com.example.ZMEN.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ChiTietDonHangFullDTO {
    private Long idDonHang;
    private String maDonHang;
    private LocalDateTime ngayDat;
    private BigDecimal tongTienHang;
    private BigDecimal tongThanhToan;

    private Long idChiTietDonHang;
    private Integer soLuong;
    private BigDecimal gia;
    private BigDecimal giaNhap;

    private String tenSanPham;
    private String maSanPham;
    private String tenDanhMuc;
    private String kichCo;
    private String mauSac;
    private String chatLieu;
    private String maKhuyenMai;
    private String tenKhuyenMai;
    private BigDecimal phanTramGiam;

    // Getters and Setters
    public Long getIdDonHang() { return idDonHang; }
    public void setIdDonHang(Long idDonHang) { this.idDonHang = idDonHang; }
    public String getMaDonHang() { return maDonHang; }
    public void setMaDonHang(String maDonHang) { this.maDonHang = maDonHang; }
    public LocalDateTime getNgayDat() { return ngayDat; }
    public void setNgayDat(LocalDateTime ngayDat) { this.ngayDat = ngayDat; }
    public BigDecimal getTongTienHang() { return tongTienHang; }
    public void setTongTienHang(BigDecimal tongTienHang) { this.tongTienHang = tongTienHang; }
    public BigDecimal getTongThanhToan() { return tongThanhToan; }
    public void setTongThanhToan(BigDecimal tongThanhToan) { this.tongThanhToan = tongThanhToan; }
    public Long getIdChiTietDonHang() { return idChiTietDonHang; }
    public void setIdChiTietDonHang(Long idChiTietDonHang) { this.idChiTietDonHang = idChiTietDonHang; }
    public Integer getSoLuong() { return soLuong; }
    public void setSoLuong(Integer soLuong) { this.soLuong = soLuong; }
    public BigDecimal getGia() { return gia; }
    public void setGia(BigDecimal gia) { this.gia = gia; }
    public BigDecimal getGiaNhap() { return giaNhap; }
    public void setGiaNhap(BigDecimal giaNhap) { this.giaNhap = giaNhap; }
    public String getTenSanPham() { return tenSanPham; }
    public void setTenSanPham(String tenSanPham) { this.tenSanPham = tenSanPham; }
    public String getMaSanPham() { return maSanPham; }
    public void setMaSanPham(String maSanPham) { this.maSanPham = maSanPham; }
    public String getTenDanhMuc() { return tenDanhMuc; }
    public void setTenDanhMuc(String tenDanhMuc) { this.tenDanhMuc = tenDanhMuc; }
    public String getKichCo() { return kichCo; }
    public void setKichCo(String kichCo) { this.kichCo = kichCo; }
    public String getMauSac() { return mauSac; }
    public void setMauSac(String mauSac) { this.mauSac = mauSac; }
    public String getChatLieu() { return chatLieu; }
    public void setChatLieu(String chatLieu) { this.chatLieu = chatLieu; }
    public String getMaKhuyenMai() { return maKhuyenMai; }
    public void setMaKhuyenMai(String maKhuyenMai) { this.maKhuyenMai = maKhuyenMai; }
    public String getTenKhuyenMai() { return tenKhuyenMai; }
    public void setTenKhuyenMai(String tenKhuyenMai) { this.tenKhuyenMai = tenKhuyenMai; }
    public BigDecimal getPhanTramGiam() { return phanTramGiam; }
    public void setPhanTramGiam(BigDecimal phanTramGiam) { this.phanTramGiam = phanTramGiam; }
} 