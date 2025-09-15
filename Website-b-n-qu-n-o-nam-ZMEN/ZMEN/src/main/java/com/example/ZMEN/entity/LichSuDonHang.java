package com.example.ZMEN.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "lich_su_don_hang")
public class LichSuDonHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_don_hang", nullable = false)
    private DonHang idDonHang;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_trang_thai_moi", nullable = false)
    private TrangThaiDonHang idTrangThaiMoi;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_nguoi_cap_nhat", nullable = false)
    private NguoiDung idNguoiCapNhat;

    @ColumnDefault("getdate()")
    @Column(name = "thoi_gian_cap_nhat")
    private Instant thoiGianCapNhat;

    @Lob
    @Column(name = "ghi_chu")
    private String ghiChu;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_trang_thai_cu")
    private TrangThaiDonHang idTrangThaiCu;

    // Manual getters and setters để tránh Lombok issues
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public DonHang getIdDonHang() { return idDonHang; }
    public void setIdDonHang(DonHang idDonHang) { this.idDonHang = idDonHang; }

    public TrangThaiDonHang getIdTrangThaiMoi() { return idTrangThaiMoi; }
    public void setIdTrangThaiMoi(TrangThaiDonHang idTrangThaiMoi) { this.idTrangThaiMoi = idTrangThaiMoi; }

    public NguoiDung getIdNguoiCapNhat() { return idNguoiCapNhat; }
    public void setIdNguoiCapNhat(NguoiDung idNguoiCapNhat) { this.idNguoiCapNhat = idNguoiCapNhat; }

    public Instant getThoiGianCapNhat() { return thoiGianCapNhat; }
    public void setThoiGianCapNhat(Instant thoiGianCapNhat) { this.thoiGianCapNhat = thoiGianCapNhat; }

    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }

    public TrangThaiDonHang getIdTrangThaiCu() { return idTrangThaiCu; }
    public void setIdTrangThaiCu(TrangThaiDonHang idTrangThaiCu) { this.idTrangThaiCu = idTrangThaiCu; }
}