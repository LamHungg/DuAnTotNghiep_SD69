package com.example.ZMEN.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class SanPhamDTO {
    private Integer id;

    // @NotBlank(message = "Mã sản phẩm không được để trống")
    private String maSanPham;

    @NotNull(message = "Danh mục không được để trống")
    private Integer idDanhMuc;

    @NotBlank(message = "Tên sản phẩm không được để trống")
    private String tenSanPham;

    private String moTa;

    // @NotNull(message = "Trạng thái không được để trống")
    private Byte trangThai;

    private Long idNguoiTao;
    private LocalDateTime ngayTao;

    private Long idNguoiCapNhat;
    private LocalDateTime ngayCapNhat;

    private Long idNguoiXoa;
    private LocalDateTime deletedAt;

    public SanPhamDTO() {}

    public SanPhamDTO(
            Integer id, String maSanPham, Integer idDanhMuc, String tenSanPham,
            String moTa, Byte trangThai, Long idNguoiTao, LocalDateTime ngayTao,
            Long idNguoiCapNhat, LocalDateTime ngayCapNhat,
            Long idNguoiXoa, LocalDateTime deletedAt
    ) {
        this.id = id;
        this.maSanPham = maSanPham;
        this.idDanhMuc = idDanhMuc;
        this.tenSanPham = tenSanPham;
        this.moTa = moTa;
        this.trangThai = trangThai;
        this.idNguoiTao = idNguoiTao;
        this.ngayTao = ngayTao;
        this.idNguoiCapNhat = idNguoiCapNhat;
        this.ngayCapNhat = ngayCapNhat;
        this.idNguoiXoa = idNguoiXoa;
        this.deletedAt = deletedAt;
    }

    // Getters and Setters
    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getMaSanPham() { return maSanPham; }
    public void setMaSanPham(String maSanPham) { this.maSanPham = maSanPham; }

    public Integer getIdDanhMuc() { return idDanhMuc; }
    public void setIdDanhMuc(Integer idDanhMuc) { this.idDanhMuc = idDanhMuc; }

    public String getTenSanPham() { return tenSanPham; }
    public void setTenSanPham(String tenSanPham) { this.tenSanPham = tenSanPham; }

    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }

    public Byte getTrangThai() { return trangThai; }
    public void setTrangThai(Byte trangThai) { this.trangThai = trangThai; }

    public Long getIdNguoiTao() { return idNguoiTao; }
    public void setIdNguoiTao(Long idNguoiTao) { this.idNguoiTao = idNguoiTao; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }

    public Long getIdNguoiCapNhat() { return idNguoiCapNhat; }
    public void setIdNguoiCapNhat(Long idNguoiCapNhat) { this.idNguoiCapNhat = idNguoiCapNhat; }

    public LocalDateTime getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(LocalDateTime ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }

    public Long getIdNguoiXoa() { return idNguoiXoa; }
    public void setIdNguoiXoa(Long idNguoiXoa) { this.idNguoiXoa = idNguoiXoa; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
    public void setDeletedAt(LocalDateTime deletedAt) { this.deletedAt = deletedAt; }
}
