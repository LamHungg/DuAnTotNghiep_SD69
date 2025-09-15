package com.example.ZMEN.mapper;

import com.example.ZMEN.dto.DonHangAddDto;
import com.example.ZMEN.entity.DonHang;

public class DonHangAddMapper {
    public static DonHangAddDto mapToDonHangAddDto(DonHang donHang){
        return new DonHangAddDto(
                donHang.getId(),
                donHang.getMaDonHang(),
                donHang.getLoaiDonHang(),
                donHang.getNgayDat(),
                donHang.getTongTienHang(),
                donHang.getTongThanhToan()
        );
    }

    public static DonHang mapToDonHang(DonHangAddDto donHangAddDto){
        return new DonHang(
                donHangAddDto.getId(),
                donHangAddDto.getMaDonHang(),
                donHangAddDto.getLoaiDonHang(),
                donHangAddDto.getNgayDat(),
                donHangAddDto.getTongTienHang(),
                donHangAddDto.getTongThanhToan()
        );
    }
}
