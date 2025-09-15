package com.example.ZMEN.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "don_hang")
public class DonHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ma_don_hang", unique = true)
    private String maDonHang;

    @Column(name = "loai_don_hang")
    private Boolean loaiDonHang; // 0: offline, 1: online

    @Column(name = "ngay_dat")
    private LocalDateTime ngayDat;

    @Column(name = "tong_tien_hang")
    private BigDecimal tongTienHang;

    @Column(name = "tong_thanh_toan")
    private BigDecimal tongThanhToan;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

    @OneToMany(mappedBy = "donHang", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<ChiTietDonHang> chiTietDonHang;

    // Constructors
    public DonHang() {}

    public DonHang(Integer id, String maDonHang, Boolean loaiDonHang, LocalDateTime ngayDat, BigDecimal tongTienHang, BigDecimal tongThanhToan) {
        this.id = id;
        this.maDonHang = maDonHang;
        this.loaiDonHang = loaiDonHang;
        this.ngayDat = ngayDat;
        this.tongTienHang = tongTienHang;
        this.tongThanhToan = tongThanhToan;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getMaDonHang() { return maDonHang; }
    public void setMaDonHang(String maDonHang) { this.maDonHang = maDonHang; }

    public Boolean getLoaiDonHang() { return loaiDonHang; }
    public void setLoaiDonHang(Boolean loaiDonHang) { this.loaiDonHang = loaiDonHang; }

    public LocalDateTime getNgayDat() { return ngayDat; }
    public void setNgayDat(LocalDateTime ngayDat) { this.ngayDat = ngayDat; }

    public BigDecimal getTongTienHang() { return tongTienHang; }
    public void setTongTienHang(BigDecimal tongTienHang) { this.tongTienHang = tongTienHang; }

    public BigDecimal getTongThanhToan() { return tongThanhToan; }
    public void setTongThanhToan(BigDecimal tongThanhToan) { this.tongThanhToan = tongThanhToan; }

    public KhachHang getKhachHang() { return khachHang; }
    public void setKhachHang(KhachHang khachHang) { this.khachHang = khachHang; }

    public List<ChiTietDonHang> getChiTietDonHang() { return chiTietDonHang; }
    public void setChiTietDonHang(List<ChiTietDonHang> chiTietDonHang) { this.chiTietDonHang = chiTietDonHang; }
}