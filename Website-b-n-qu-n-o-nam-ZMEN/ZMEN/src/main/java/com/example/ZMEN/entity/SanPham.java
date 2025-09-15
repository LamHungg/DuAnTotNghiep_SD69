package com.example.ZMEN.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;
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
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@Entity
@Table(name = "san_pham")
public class SanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)

    private Integer id;

    @Column(name = "ma_san_pham", unique = true)
    private String maSanPham;

    @ManyToOne
    @JoinColumn(name = "id_danh_muc", nullable = false)
    private DanhMuc danhMuc;

    @Column(name = "ten_san_pham", nullable = false)
    private String tenSanPham;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "trang_thai", nullable = false)
    private Byte trangThai = 1;

    @ManyToOne
    @JoinColumn(name = "id_nguoi_tao")
    private NguoiDung nguoiTao;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "id_nguoi_cap_nhat")
    private NguoiDung nguoiCapNhat;

    @Column(name = "ngay_cap_nhat")
    private LocalDateTime ngayCapNhat;

    @Column(name = "deleted_at")
    private LocalDateTime deletedAt;

    @ManyToOne
    @JoinColumn(name = "id_nguoi_xoa")
    private NguoiDung nguoiXoa;

    public SanPham() {}

    public SanPham(Integer id, String maSanPham, DanhMuc danhMuc, String tenSanPham, String moTa, Byte trangThai, NguoiDung nguoiTao, LocalDateTime ngayTao, NguoiDung nguoiCapNhat, LocalDateTime ngayCapNhat, LocalDateTime deletedAt, NguoiDung nguoiXoa) {
        this.id = id;
        this.maSanPham = maSanPham;
        this.danhMuc = danhMuc;
        this.tenSanPham = tenSanPham;
        this.moTa = moTa;
        this.trangThai = trangThai;
        this.nguoiTao = nguoiTao;
        this.ngayTao = ngayTao;
        this.nguoiCapNhat = nguoiCapNhat;
        this.ngayCapNhat = ngayCapNhat;
        this.deletedAt = deletedAt;
        this.nguoiXoa = nguoiXoa;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getMaSanPham() { return maSanPham; }
    public void setMaSanPham(String maSanPham) { this.maSanPham = maSanPham; }
    public DanhMuc getDanhMuc() { return danhMuc; }
    public void setDanhMuc(DanhMuc danhMuc) { this.danhMuc = danhMuc; }
    public String getTenSanPham() { return tenSanPham; }
    public void setTenSanPham(String tenSanPham) { this.tenSanPham = tenSanPham; }
    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }
    public Byte getTrangThai() { return trangThai; }
    public void setTrangThai(Byte trangThai) { this.trangThai = trangThai; }
    public NguoiDung getNguoiTao() { return nguoiTao; }
    public void setNguoiTao(NguoiDung nguoiTao) { this.nguoiTao = nguoiTao; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public NguoiDung getNguoiCapNhat() { return nguoiCapNhat; }
    public void setNguoiCapNhat(NguoiDung nguoiCapNhat) { this.nguoiCapNhat = nguoiCapNhat; }
    public LocalDateTime getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(LocalDateTime ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
    public NguoiDung getNguoiXoa() { return nguoiXoa; }
    public void setNguoiXoa(NguoiDung nguoiXoa) { this.nguoiXoa = nguoiXoa; }
}