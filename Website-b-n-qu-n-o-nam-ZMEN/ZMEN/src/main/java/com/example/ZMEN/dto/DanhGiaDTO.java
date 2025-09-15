package com.example.ZMEN.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DanhGiaDTO {
    private Integer id;
    
    @NotNull(message = "ID khách hàng không được để trống")
    private Integer idKhachHang;
    
    private String tenKhachHang;
    
    @NotNull(message = "ID sản phẩm không được để trống")
    private Integer idSanPham;
    
    private String tenSanPham;
    
    @NotNull(message = "Số sao không được để trống")
    @Min(value = 1, message = "Số sao phải từ 1-5")
    @Max(value = 5, message = "Số sao phải từ 1-5")
    private Short soSao;
    
    @NotBlank(message = "Bình luận không được để trống")
    private String binhLuan;
    
    private Instant ngayDanhGia;
    
    private Byte trangThai;
    
    // Constructor cho việc tạo đánh giá mới
    public DanhGiaDTO(Integer idKhachHang, Integer idSanPham, Short soSao, String binhLuan) {
        this.idKhachHang = idKhachHang;
        this.idSanPham = idSanPham;
        this.soSao = soSao;
        this.binhLuan = binhLuan;
        this.ngayDanhGia = Instant.now();
        this.trangThai = 1;
    }
}
