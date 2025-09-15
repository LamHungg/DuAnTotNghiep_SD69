package com.example.ZMEN.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DonHangAddDto {
    private Integer id;
    private String maDonHang;
    private Boolean loaiDonHang;
    private LocalDateTime ngayDat;
    private BigDecimal tongTienHang;
    private BigDecimal tongThanhToan;
}
