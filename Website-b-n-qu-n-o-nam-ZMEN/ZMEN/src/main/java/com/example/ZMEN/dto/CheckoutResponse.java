package com.example.ZMEN.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CheckoutResponse {
    private Integer donHangId;
    private String maDonHang;
    private String trangThai;
    private BigDecimal tongThanhToan;
    private LocalDateTime ngayDat;
    private String message;

    // Constructors
    public CheckoutResponse() {}

    public CheckoutResponse(Integer donHangId, String maDonHang, String trangThai, 
                           BigDecimal tongThanhToan, LocalDateTime ngayDat, String message) {
        this.donHangId = donHangId;
        this.maDonHang = maDonHang;
        this.trangThai = trangThai;
        this.tongThanhToan = tongThanhToan;
        this.ngayDat = ngayDat;
        this.message = message;
    }

    // Getters and Setters
    public Integer getDonHangId() { return donHangId; }
    public void setDonHangId(Integer donHangId) { this.donHangId = donHangId; }

    public String getMaDonHang() { return maDonHang; }
    public void setMaDonHang(String maDonHang) { this.maDonHang = maDonHang; }

    public String getTrangThai() { return trangThai; }
    public void setTrangThai(String trangThai) { this.trangThai = trangThai; }

    public BigDecimal getTongThanhToan() { return tongThanhToan; }
    public void setTongThanhToan(BigDecimal tongThanhToan) { this.tongThanhToan = tongThanhToan; }

    public LocalDateTime getNgayDat() { return ngayDat; }
    public void setNgayDat(LocalDateTime ngayDat) { this.ngayDat = ngayDat; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    @Override
    public String toString() {
        return "CheckoutResponse{" +
                "donHangId=" + donHangId +
                ", maDonHang='" + maDonHang + '\'' +
                ", trangThai='" + trangThai + '\'' +
                ", tongThanhToan=" + tongThanhToan +
                ", ngayDat=" + ngayDat +
                ", message='" + message + '\'' +
                '}';
    }
}
