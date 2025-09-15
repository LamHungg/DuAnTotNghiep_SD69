package com.example.ZMEN.mapper;

import com.example.ZMEN.dto.TaiKhoanKHDto.DangKyDto;
import com.example.ZMEN.entity.KhachHang;

public class TaiKhoanKHMapper {
    public static KhachHang fromDangKyDTO(DangKyDto dto) {
        KhachHang kh = new KhachHang();
        kh.setHoTen(dto.getHoTen());
        kh.setGioiTinh(dto.getGioiTinh());
        kh.setTenDangNhap(dto.getTenDangNhap());
        kh.setNgaySinh(dto.getNgaySinh());
        kh.setEmail(dto.getEmail());
        kh.setSoDienThoai(dto.getSoDienThoai());
        kh.setMatKhau(dto.getMatKhau()); // Mã hóa sau
        return kh;
    }
}
