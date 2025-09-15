package com.example.ZMEN.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class KhachHangViewDto {

    private String maKhachHang;
    private String hoTen;
    private String soDienThoai;
    private String email;
    private short trangThaiTaiKhoan;
}
