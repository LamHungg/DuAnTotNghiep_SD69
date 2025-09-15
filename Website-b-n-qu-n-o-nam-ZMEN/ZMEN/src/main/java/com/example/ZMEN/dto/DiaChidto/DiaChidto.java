package com.example.ZMEN.dto.DiaChidto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class DiaChidto {
    private Integer id;
    private Integer idKhachHang;
    private String tinhThanh;
    private String quanHuyen;
    private String phuongXa;
    private String duong;
    private Boolean diaChiMacDinh;
}
