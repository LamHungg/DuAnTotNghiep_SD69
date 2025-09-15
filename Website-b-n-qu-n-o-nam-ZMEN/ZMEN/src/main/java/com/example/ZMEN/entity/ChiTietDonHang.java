package com.example.ZMEN.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.DynamicUpdate;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "chi_tiet_don_hang")
@DynamicUpdate
public class ChiTietDonHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_don_hang")
    private DonHang donHang;

    @ManyToOne
    @JoinColumn(name = "id_chi_tiet_san_pham")
    private ChiTietSanPham chiTietSanPham;

    @ManyToOne
    @JoinColumn(name = "id_trang_thai")
    private TrangThaiDonHang trangThai;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

    @ManyToOne
    @JoinColumn(name = "id_dia_chi")
    private DiaChi diaChi;

    @ManyToOne
    @JoinColumn(name = "id_nhan_vien_xu_ly")
    private NguoiDung nhanVienXuLy;

    @ManyToOne
    @JoinColumn(name = "id_voucher")
    private Voucher voucher;

    @ManyToOne
    @JoinColumn(name = "id_phuong_thuc_thanh_toan")
    private PhuongThucThanhToan phuongThucThanhToan;

    @Column(name = "ngay_thanh_toan")
    private LocalDateTime ngayThanhToan;

    @Column(name = "phi_van_chuyen")
    private BigDecimal phiVanChuyen;

    @Column(name = "tien_giam_gia")
    private BigDecimal tienGiamGia;

    @Column(name = "so_luong")
    private Integer soLuong;

    @Column(name = "ghi_chu_khach_hang")
    private String ghiChuKhachHang;

    @Column(name = "ly_do_huy")
    private String lyDoHuy;

    // Constructors
    public ChiTietDonHang() {}

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public DonHang getDonHang() { return donHang; }
    public void setDonHang(DonHang donHang) { this.donHang = donHang; }

    public ChiTietSanPham getChiTietSanPham() { return chiTietSanPham; }
    public void setChiTietSanPham(ChiTietSanPham chiTietSanPham) { this.chiTietSanPham = chiTietSanPham; }

    public TrangThaiDonHang getTrangThai() { return trangThai; }
    public void setTrangThai(TrangThaiDonHang trangThai) { this.trangThai = trangThai; }

    public KhachHang getKhachHang() { return khachHang; }
    public void setKhachHang(KhachHang khachHang) { this.khachHang = khachHang; }

    public DiaChi getDiaChi() { return diaChi; }
    public void setDiaChi(DiaChi diaChi) { this.diaChi = diaChi; }

    public NguoiDung getNhanVienXuLy() { return nhanVienXuLy; }
    public void setNhanVienXuLy(NguoiDung nhanVienXuLy) { this.nhanVienXuLy = nhanVienXuLy; }

    public Voucher getVoucher() { return voucher; }
    public void setVoucher(Voucher voucher) { this.voucher = voucher; }

    public PhuongThucThanhToan getPhuongThucThanhToan() { return phuongThucThanhToan; }
    public void setPhuongThucThanhToan(PhuongThucThanhToan phuongThucThanhToan) { this.phuongThucThanhToan = phuongThucThanhToan; }

    public LocalDateTime getNgayThanhToan() { return ngayThanhToan; }
    public void setNgayThanhToan(LocalDateTime ngayThanhToan) { this.ngayThanhToan = ngayThanhToan; }

    public BigDecimal getPhiVanChuyen() { return phiVanChuyen; }
    public void setPhiVanChuyen(BigDecimal phiVanChuyen) { this.phiVanChuyen = phiVanChuyen; }

    public BigDecimal getTienGiamGia() { return tienGiamGia; }
    public void setTienGiamGia(BigDecimal tienGiamGia) { this.tienGiamGia = tienGiamGia; }

    public Integer getSoLuong() { return soLuong; }
    public void setSoLuong(Integer soLuong) { this.soLuong = soLuong; }

    public String getGhiChuKhachHang() { return ghiChuKhachHang; }
    public void setGhiChuKhachHang(String ghiChuKhachHang) { this.ghiChuKhachHang = ghiChuKhachHang; }

    public String getLyDoHuy() { return lyDoHuy; }
    public void setLyDoHuy(String lyDoHuy) { this.lyDoHuy = lyDoHuy; }

    // Helper method để tương thích với DonHangImpl
    public Integer getIdTrangThai() {
        return trangThai != null ? trangThai.getId() : null;
    }

    public void setIdTrangThai(Integer trangThaiId) {
        if (trangThaiId != null) {
            TrangThaiDonHang newTrangThai = new TrangThaiDonHang();
            newTrangThai.setId(trangThaiId);
            this.trangThai = newTrangThai;
        }
    }

    // Helper method để tương thích với DonHangMapper
    public Integer getIdDonHang() {
        return donHang != null ? donHang.getId() : null;
    }

    public void setIdDonHang(Integer donHangId) {
        if (donHangId != null) {
            DonHang newDonHang = new DonHang();
            newDonHang.setId(donHangId);
            this.donHang = newDonHang;
        }
    }
}
