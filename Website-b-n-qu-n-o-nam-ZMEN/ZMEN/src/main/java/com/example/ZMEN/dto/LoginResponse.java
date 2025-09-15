package com.example.ZMEN.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponse {
    private Long id;
    private String ma;
    private String chucVu;
    private String tenDangNhap;
    private String hoTen;
    private String email;
    private String soDienThoai;
    private Boolean trangThai;
    private String token;
} 