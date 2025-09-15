package com.example.ZMEN.dto;

import java.math.BigDecimal;

public class CartItemDTO {
    private Integer id;
    private Integer chiTietSanPhamId;
    private String tenSanPham;
    private String hinhAnh;
    private String kichCo;
    private String mauSac;
    private String chatLieu;
    private Integer soLuong;
    private BigDecimal gia;
    private BigDecimal thanhTien;
    private Integer soLuongTonKho;

    // Constructors
    public CartItemDTO() {}

    public CartItemDTO(Integer id, Integer chiTietSanPhamId, String tenSanPham, String hinhAnh, 
                      String kichCo, String mauSac, String chatLieu, Integer soLuong, 
                      BigDecimal gia, BigDecimal thanhTien, Integer soLuongTonKho) {
        this.id = id;
        this.chiTietSanPhamId = chiTietSanPhamId;
        this.tenSanPham = tenSanPham;
        this.hinhAnh = hinhAnh;
        this.kichCo = kichCo;
        this.mauSac = mauSac;
        this.chatLieu = chatLieu;
        this.soLuong = soLuong;
        this.gia = gia;
        this.thanhTien = thanhTien;
        this.soLuongTonKho = soLuongTonKho;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getChiTietSanPhamId() { return chiTietSanPhamId; }
    public void setChiTietSanPhamId(Integer chiTietSanPhamId) { this.chiTietSanPhamId = chiTietSanPhamId; }

    public String getTenSanPham() { return tenSanPham; }
    public void setTenSanPham(String tenSanPham) { this.tenSanPham = tenSanPham; }

    public String getHinhAnh() { return hinhAnh; }
    public void setHinhAnh(String hinhAnh) { this.hinhAnh = hinhAnh; }

    public String getKichCo() { return kichCo; }
    public void setKichCo(String kichCo) { this.kichCo = kichCo; }

    public String getMauSac() { return mauSac; }
    public void setMauSac(String mauSac) { this.mauSac = mauSac; }

    public String getChatLieu() { return chatLieu; }
    public void setChatLieu(String chatLieu) { this.chatLieu = chatLieu; }

    public Integer getSoLuong() { return soLuong; }
    public void setSoLuong(Integer soLuong) { this.soLuong = soLuong; }

    public BigDecimal getGia() { return gia; }
    public void setGia(BigDecimal gia) { this.gia = gia; }

    public BigDecimal getThanhTien() { return thanhTien; }
    public void setThanhTien(BigDecimal thanhTien) { this.thanhTien = thanhTien; }

    public Integer getSoLuongTonKho() { return soLuongTonKho; }
    public void setSoLuongTonKho(Integer soLuongTonKho) { this.soLuongTonKho = soLuongTonKho; }
}
