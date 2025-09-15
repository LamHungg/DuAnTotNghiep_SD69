package com.example.ZMEN.dto;


import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

public class DanhMucDTO {
    private Integer id;

    @NotBlank(message = "Tên danh mục không được để trống")
    private String tenDanhMuc;

    private Integer idDanhMucCha;

    @NotNull(message = "Trạng thái không được để trống")
    private Byte trangThai;

    private Integer idNguoiTao;
    private LocalDateTime ngayTao;
    private Integer idNguoiCapNhat;
    private LocalDateTime ngayCapNhat;
    public DanhMucDTO() {}

    public DanhMucDTO(Integer id, String tenDanhMuc, Integer idDanhMucCha, Byte trangThai, Integer idNguoiTao, LocalDateTime ngayTao, Integer idNguoiCapNhat, LocalDateTime ngayCapNhat) {
        this.id = id;
        this.tenDanhMuc = tenDanhMuc;
        this.idDanhMucCha = idDanhMucCha;
        this.trangThai = trangThai;
        this.idNguoiTao = idNguoiTao;
        this.ngayTao = ngayTao;
        this.idNguoiCapNhat = idNguoiCapNhat;
        this.ngayCapNhat = ngayCapNhat;
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }
    public String getTenDanhMuc() { return tenDanhMuc; }
    public void setTenDanhMuc(String tenDanhMuc) { this.tenDanhMuc = tenDanhMuc; }
    public Integer getIdDanhMucCha() { return idDanhMucCha; }
    public void setIdDanhMucCha(Integer idDanhMucCha) { this.idDanhMucCha = idDanhMucCha; }
    public Byte getTrangThai() { return trangThai; }
    public void setTrangThai(Byte trangThai) { this.trangThai = trangThai; }
    public Integer getIdNguoiTao() { return idNguoiTao; }
    public void setIdNguoiTao(Integer idNguoiTao) { this.idNguoiTao = idNguoiTao; }
    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }
    public Integer getIdNguoiCapNhat() { return idNguoiCapNhat; }
    public void setIdNguoiCapNhat(Integer idNguoiCapNhat) { this.idNguoiCapNhat = idNguoiCapNhat; }
    public LocalDateTime getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(LocalDateTime ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }
}