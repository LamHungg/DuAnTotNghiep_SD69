package com.example.ZMEN.dto;

import java.math.BigDecimal;
import java.util.List;

public class CheckoutRequest {
    private List<CartItemRequest> cartItems;
    private Integer diaChiId;
    private Integer voucherId;
    private Integer phuongThucThanhToanId;
    private String ghiChuKhachHang;
    private BigDecimal phiVanChuyen;
    private BigDecimal tongTienHang;
    private BigDecimal tongThanhToan;
    private Integer khachHangId; // Thêm field này

    // Constructors
    public CheckoutRequest() {}

    public CheckoutRequest(List<CartItemRequest> cartItems, Integer diaChiId, Integer voucherId, 
                          Integer phuongThucThanhToanId, String ghiChuKhachHang, 
                          BigDecimal phiVanChuyen, BigDecimal tongTienHang, BigDecimal tongThanhToan, Integer khachHangId) {
        this.cartItems = cartItems;
        this.diaChiId = diaChiId;
        this.voucherId = voucherId;
        this.phuongThucThanhToanId = phuongThucThanhToanId;
        this.ghiChuKhachHang = ghiChuKhachHang;
        this.phiVanChuyen = phiVanChuyen;
        this.tongTienHang = tongTienHang;
        this.tongThanhToan = tongThanhToan;
        this.khachHangId = khachHangId;
    }

    // Getters and Setters
    public List<CartItemRequest> getCartItems() { return cartItems; }
    public void setCartItems(List<CartItemRequest> cartItems) { this.cartItems = cartItems; }

    public Integer getDiaChiId() { return diaChiId; }
    public void setDiaChiId(Integer diaChiId) { this.diaChiId = diaChiId; }

    public Integer getVoucherId() { return voucherId; }
    public void setVoucherId(Integer voucherId) { this.voucherId = voucherId; }

    public Integer getPhuongThucThanhToanId() { return phuongThucThanhToanId; }
    public void setPhuongThucThanhToanId(Integer phuongThucThanhToanId) { this.phuongThucThanhToanId = phuongThucThanhToanId; }

    public String getGhiChuKhachHang() { return ghiChuKhachHang; }
    public void setGhiChuKhachHang(String ghiChuKhachHang) { this.ghiChuKhachHang = ghiChuKhachHang; }

    public BigDecimal getPhiVanChuyen() { return phiVanChuyen; }
    public void setPhiVanChuyen(BigDecimal phiVanChuyen) { this.phiVanChuyen = phiVanChuyen; }

    public BigDecimal getTongTienHang() { return tongTienHang; }
    public void setTongTienHang(BigDecimal tongTienHang) { this.tongTienHang = tongTienHang; }

    public BigDecimal getTongThanhToan() { return tongThanhToan; }
    public void setTongThanhToan(BigDecimal tongThanhToan) { this.tongThanhToan = tongThanhToan; }

    public Integer getKhachHangId() { return khachHangId; }
    public void setKhachHangId(Integer khachHangId) { this.khachHangId = khachHangId; }

    @Override
    public String toString() {
        return "CheckoutRequest{" +
                "cartItems=" + cartItems +
                ", diaChiId=" + diaChiId +
                ", voucherId=" + voucherId +
                ", phuongThucThanhToanId=" + phuongThucThanhToanId +
                ", ghiChuKhachHang='" + ghiChuKhachHang + '\'' +
                ", phiVanChuyen=" + phiVanChuyen +
                ", tongTienHang=" + tongTienHang +
                ", tongThanhToan=" + tongThanhToan +
                ", khachHangId=" + khachHangId +
                '}';
    }
}
