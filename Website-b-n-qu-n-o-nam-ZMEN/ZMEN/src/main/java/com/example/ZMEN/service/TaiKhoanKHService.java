package com.example.ZMEN.service;

import com.example.ZMEN.dto.TaiKhoanKHDto.DangKyDto;
import com.example.ZMEN.dto.TaiKhoanKHDto.DangNhapDto;
import com.example.ZMEN.dto.TaiKhoanKHDto.ResetMatKhauDto;
import com.example.ZMEN.dto.TaiKhoanKHDto.UpdateThongTinCaNhanDto;
import com.example.ZMEN.entity.KhachHang;

public interface TaiKhoanKHService {
    KhachHang dangKy (DangKyDto dangKyDto);
    KhachHang dangNhap (DangNhapDto dangNhapDto);
    void updateMatKhau(ResetMatKhauDto dto);
    boolean emailDaTonTai(String email);
    boolean tenDangNhapDaTonTai(String tenDangNhap);
    KhachHang capNhatThongTinCaNhan(Integer id, UpdateThongTinCaNhanDto dto);
}
