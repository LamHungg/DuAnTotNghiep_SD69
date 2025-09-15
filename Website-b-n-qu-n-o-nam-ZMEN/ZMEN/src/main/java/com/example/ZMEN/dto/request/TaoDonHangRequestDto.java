package com.example.ZMEN.dto.request;

import com.example.ZMEN.dto.SanPhamTrongDonHangDto;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

public class TaoDonHangRequestDto {

    @NotNull(message = "ID khách hàng không được để trống")
    private Integer khachHangId;

    @NotNull(message = "ID địa chỉ không được để trống")
    private Integer diaChiId;

    @JsonIgnore
    private Boolean loaiDonHang;

    private String ghiChu;

    @NotEmpty(message = "Đơn hàng phải có ít nhất một sản phẩm")
    @Valid // Quan trọng: Để kiểm tra validation của các đối tượng trong list
    private List<SanPhamTrongDonHangDto> chiTietSanPhams;

    // Getters and Setters
    public Integer getKhachHangId() { return khachHangId; }
    public void setKhachHangId(Integer khachHangId) { this.khachHangId = khachHangId; }
    public Integer getDiaChiId() { return diaChiId; }
    public Boolean getLoaiDonHang() {
        return loaiDonHang;
    }

    public void setLoaiDonHang(Boolean loaiDonHang) {
        this.loaiDonHang = loaiDonHang;
    }
    @JsonProperty("hinhThucDonHang") // Đặt tên cho trường trong JSON
    public String getHinhThucDonHangAsString() {
        return (this.loaiDonHang != null && this.loaiDonHang) ? "Online" : "Tại quầy";
    }
    public void setDiaChiId(Integer diaChiId) { this.diaChiId = diaChiId; }
    public String getGhiChu() { return ghiChu; }
    public void setGhiChu(String ghiChu) { this.ghiChu = ghiChu; }
    public List<SanPhamTrongDonHangDto> getChiTietSanPhams() { return chiTietSanPhams; }
    public void setChiTietSanPhams(List<SanPhamTrongDonHangDto> chiTietSanPhams) { this.chiTietSanPhams = chiTietSanPhams; }
}