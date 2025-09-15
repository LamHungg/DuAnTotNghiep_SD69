package com.example.ZMEN.dto;

import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

public class ChiTietSanPhamDTO {
    private Integer id;

    @NotNull(message = "Sản phẩm không được để trống")
    private Integer idSanPham;

    @NotNull(message = "Kích cỡ không được để trống")
    private Integer idKichCo;

    @NotNull(message = "Màu sắc không được để trống")
    private Integer idMauSac;

    @NotNull(message = "Chất liệu không được để trống")
    private Integer idChatLieu;

    @Min(value = 0, message = "Số lượng phải lớn hơn hoặc bằng 0")
    private Integer soLuong;

    @NotNull(message = "Giá không được để trống")
    @Min(value = 0, message = "Giá phải lớn hơn hoặc bằng 0")
    private Double gia;

    @NotNull(message = "Giá nhập không được để trống")
    @Min(value = 0, message = "Giá nhập phải lớn hơn hoặc bằng 0")
    private Double giaNhap;

    private Long idNguoiTao;
    private LocalDateTime ngayTao;

    private Long idNguoiCapNhat;
    private LocalDateTime ngayCapNhat;

    private Integer idHinhAnhSanPham;
    private String[] hinhAnh; // Mảng URL ảnh
    private Byte trangThai; // Trạng thái chi tiết sản phẩm

    // -------- Các trường tên --------
    private String tenSanPham;
    private String maSanPham;
    private String tenKichCo;
    private String tenMauSac;
    private String tenChatLieu;
    private String tenNguoiTao;
    private String tenNguoiCapNhat;
    private String moTa; // Thêm field mô tả từ SanPham

    public ChiTietSanPhamDTO() {}

    // Các constructor nếu cần (giữ nguyên như bạn có)
    public ChiTietSanPhamDTO(Integer id, Integer idSanPham, Integer idKichCo, Integer idMauSac, Integer idChatLieu,
                             Integer soLuong, Double gia, Double giaNhap, Long idNguoiTao, LocalDateTime ngayTao,
                             Long idNguoiCapNhat, LocalDateTime ngayCapNhat, Integer idHinhAnhSanPham, Byte trangThai) {
        this.id = id;
        this.idSanPham = idSanPham;
        this.idKichCo = idKichCo;
        this.idMauSac = idMauSac;
        this.idChatLieu = idChatLieu;
        this.soLuong = soLuong;
        this.gia = gia;
        this.giaNhap = giaNhap;
        this.idNguoiTao = idNguoiTao;
        this.ngayTao = ngayTao;
        this.idNguoiCapNhat = idNguoiCapNhat;
        this.ngayCapNhat = ngayCapNhat;
        this.idHinhAnhSanPham = idHinhAnhSanPham;
        this.trangThai = trangThai;
    }

    // Getter & Setter

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getIdSanPham() { return idSanPham; }
    public void setIdSanPham(Integer idSanPham) { this.idSanPham = idSanPham; }

    public Integer getIdKichCo() { return idKichCo; }
    public void setIdKichCo(Integer idKichCo) { this.idKichCo = idKichCo; }

    public Integer getIdMauSac() { return idMauSac; }
    public void setIdMauSac(Integer idMauSac) { this.idMauSac = idMauSac; }

    public Integer getIdChatLieu() { return idChatLieu; }
    public void setIdChatLieu(Integer idChatLieu) { this.idChatLieu = idChatLieu; }

    public Integer getSoLuong() { return soLuong; }
    public void setSoLuong(Integer soLuong) { this.soLuong = soLuong; }

    public Double getGia() { return gia; }
    public void setGia(Double gia) { this.gia = gia; }

    public Double getGiaNhap() { return giaNhap; }
    public void setGiaNhap(Double giaNhap) { this.giaNhap = giaNhap; }

    public Long getIdNguoiTao() { return idNguoiTao; }
    public void setIdNguoiTao(Long idNguoiTao) { this.idNguoiTao = idNguoiTao; }

    public LocalDateTime getNgayTao() { return ngayTao; }
    public void setNgayTao(LocalDateTime ngayTao) { this.ngayTao = ngayTao; }

    public Long getIdNguoiCapNhat() { return idNguoiCapNhat; }
    public void setIdNguoiCapNhat(Long idNguoiCapNhat) { this.idNguoiCapNhat = idNguoiCapNhat; }

    public LocalDateTime getNgayCapNhat() { return ngayCapNhat; }
    public void setNgayCapNhat(LocalDateTime ngayCapNhat) { this.ngayCapNhat = ngayCapNhat; }

    public Integer getIdHinhAnhSanPham() { return idHinhAnhSanPham; }
    public void setIdHinhAnhSanPham(Integer idHinhAnhSanPham) { this.idHinhAnhSanPham = idHinhAnhSanPham; }

    public String[] getHinhAnh() { return hinhAnh; }
    public void setHinhAnh(String[] hinhAnh) { this.hinhAnh = hinhAnh; }

    public String getTenSanPham() { return tenSanPham; }
    public void setTenSanPham(String tenSanPham) { this.tenSanPham = tenSanPham; }

    public String getMaSanPham() { return maSanPham; }
    public void setMaSanPham(String maSanPham) { this.maSanPham = maSanPham; }

    public String getTenKichCo() { return tenKichCo; }
    public void setTenKichCo(String tenKichCo) { this.tenKichCo = tenKichCo; }

    public String getTenMauSac() { return tenMauSac; }
    public void setTenMauSac(String tenMauSac) { this.tenMauSac = tenMauSac; }

    public String getTenChatLieu() { return tenChatLieu; }
    public void setTenChatLieu(String tenChatLieu) { this.tenChatLieu = tenChatLieu; }

    public String getTenNguoiTao() { return tenNguoiTao; }
    public void setTenNguoiTao(String tenNguoiTao) { this.tenNguoiTao = tenNguoiTao; }

    public String getTenNguoiCapNhat() { return tenNguoiCapNhat; }
    public void setTenNguoiCapNhat(String tenNguoiCapNhat) { this.tenNguoiCapNhat = tenNguoiCapNhat; }

    public String getMoTa() { return moTa; }
    public void setMoTa(String moTa) { this.moTa = moTa; }

    public Byte getTrangThai() { return trangThai; }
    public void setTrangThai(Byte trangThai) { this.trangThai = trangThai; }
}
