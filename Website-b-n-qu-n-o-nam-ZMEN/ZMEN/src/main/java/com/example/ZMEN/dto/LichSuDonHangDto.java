package com.example.ZMEN.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.w3c.dom.Text;

import java.time.Instant;

@Data
@NoArgsConstructor
public class LichSuDonHangDto {

    private String tenTrangThai;

    private Instant thoiGianCapNhat;

    private String ghiChu;

    private String tenNguoiCapNhat;

}
