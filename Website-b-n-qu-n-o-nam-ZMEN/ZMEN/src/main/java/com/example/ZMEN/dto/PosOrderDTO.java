package com.example.ZMEN.dto;

import java.util.List;

public class PosOrderDTO {
    private String maDonHang;
    private Integer khachHangId;
    private List<ChiTietDonHangDTO> chiTietDonHang;
    private Double tongThanhToan;
    private String phuongThucThanhToan;
    private String trangThai;
    private String ghiChu;
    private Integer voucherId;
    private Integer nguoiTaoId;

    // Constructors
    public PosOrderDTO() {}

    public PosOrderDTO(String maDonHang, Integer khachHangId, List<ChiTietDonHangDTO> chiTietDonHang, 
                       Double tongThanhToan, String phuongThucThanhToan, String trangThai, 
                       String ghiChu, Integer voucherId, Integer nguoiTaoId) {
        this.maDonHang = maDonHang;
        this.khachHangId = khachHangId;
        this.chiTietDonHang = chiTietDonHang;
        this.tongThanhToan = tongThanhToan;
        this.phuongThucThanhToan = phuongThucThanhToan;
        this.trangThai = trangThai;
        this.ghiChu = ghiChu;
        this.voucherId = voucherId;
        this.nguoiTaoId = nguoiTaoId;
    }

    // Getters and Setters
    public String getMaDonHang() {
        return maDonHang;
    }

    public void setMaDonHang(String maDonHang) {
        this.maDonHang = maDonHang;
    }

    public Integer getKhachHangId() {
        return khachHangId;
    }

    public void setKhachHangId(Integer khachHangId) {
        this.khachHangId = khachHangId;
    }

    public List<ChiTietDonHangDTO> getChiTietDonHang() {
        return chiTietDonHang;
    }

    public void setChiTietDonHang(List<ChiTietDonHangDTO> chiTietDonHang) {
        this.chiTietDonHang = chiTietDonHang;
    }

    public Double getTongThanhToan() {
        return tongThanhToan;
    }

    public void setTongThanhToan(Double tongThanhToan) {
        this.tongThanhToan = tongThanhToan;
    }

    public String getPhuongThucThanhToan() {
        return phuongThucThanhToan;
    }

    public void setPhuongThucThanhToan(String phuongThucThanhToan) {
        this.phuongThucThanhToan = phuongThucThanhToan;
    }

    public String getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
    }

    public String getGhiChu() {
        return ghiChu;
    }

    public void setGhiChu(String ghiChu) {
        this.ghiChu = ghiChu;
    }

    public Integer getVoucherId() {
        return voucherId;
    }

    public void setVoucherId(Integer voucherId) {
        this.voucherId = voucherId;
    }

    public Integer getNguoiTaoId() {
        return nguoiTaoId;
    }

    public void setNguoiTaoId(Integer nguoiTaoId) {
        this.nguoiTaoId = nguoiTaoId;
    }

    // Inner class for order details
    public static class ChiTietDonHangDTO {
        private Integer chiTietSanPhamId;
        private Integer soLuong;
        private Double gia;
        private Double thanhTien;

        // Constructors
        public ChiTietDonHangDTO() {}

        public ChiTietDonHangDTO(Integer chiTietSanPhamId, Integer soLuong, Double gia, Double thanhTien) {
            this.chiTietSanPhamId = chiTietSanPhamId;
            this.soLuong = soLuong;
            this.gia = gia;
            this.thanhTien = thanhTien;
        }

        // Getters and Setters
        public Integer getChiTietSanPhamId() {
            return chiTietSanPhamId;
        }

        public void setChiTietSanPhamId(Integer chiTietSanPhamId) {
            this.chiTietSanPhamId = chiTietSanPhamId;
        }

        public Integer getSoLuong() {
            return soLuong;
        }

        public void setSoLuong(Integer soLuong) {
            this.soLuong = soLuong;
        }

        public Double getGia() {
            return gia;
        }

        public void setGia(Double gia) {
            this.gia = gia;
        }

        public Double getThanhTien() {
            return thanhTien;
        }

        public void setThanhTien(Double thanhTien) {
            this.thanhTien = thanhTien;
        }

        @Override
        public String toString() {
            return "ChiTietDonHangDTO{" +
                    "chiTietSanPhamId=" + chiTietSanPhamId +
                    ", soLuong=" + soLuong +
                    ", gia=" + gia +
                    ", thanhTien=" + thanhTien +
                    '}';
        }
    }

    @Override
    public String toString() {
        return "PosOrderDTO{" +
                "maDonHang='" + maDonHang + '\'' +
                ", khachHangId=" + khachHangId +
                ", chiTietDonHang=" + chiTietDonHang +
                ", tongThanhToan=" + tongThanhToan +
                ", phuongThucThanhToan='" + phuongThucThanhToan + '\'' +
                ", trangThai='" + trangThai + '\'' +
                ", ghiChu='" + ghiChu + '\'' +
                ", voucherId=" + voucherId +
                ", nguoiTaoId=" + nguoiTaoId +
                '}';
    }
}
