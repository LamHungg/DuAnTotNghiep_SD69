package com.example.ZMEN.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ChiTietKhachHangDto {
    private String maKhachHang;
    private String hoTen;
    private String soDienThoai;
    private String email;
    private Date ngaySinh;
    private String gioiTinh;
    private String tinhThanh;
    private String quanHuyen;
    private String phuongXa;
    private String duong;
}
