package com.example.ZMEN.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;



import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
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
@Table(name = "danh_muc")
public class DanhMuc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "ten_danh_muc", nullable = false)
    private String tenDanhMuc;

    @ManyToOne
    @JoinColumn(name = "id_danh_muc_cha")
    private DanhMuc danhMucCha;

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

    public DanhMuc() {}

    public DanhMuc(Integer id, String tenDanhMuc, DanhMuc danhMucCha, Byte trangThai, NguoiDung nguoiTao, LocalDateTime ngayTao, NguoiDung nguoiCapNhat, LocalDateTime ngayCapNhat) {
        this.id = id;
        this.tenDanhMuc = tenDanhMuc;
        this.danhMucCha = danhMucCha;
        this.trangThai = trangThai;
        this.nguoiTao = nguoiTao;
        this.ngayTao = ngayTao;
        this.nguoiCapNhat = nguoiCapNhat;
        this.ngayCapNhat = ngayCapNhat;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTenDanhMuc() { return tenDanhMuc; }
    public void setTenDanhMuc(String tenDanhMuc) { this.tenDanhMuc = tenDanhMuc; }
    public DanhMuc getDanhMucCha() { return danhMucCha; }
    public void setDanhMucCha(DanhMuc danhMucCha) { this.danhMucCha = danhMucCha; }
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
}