package com.example.ZMEN.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeDanhGiaDTO {
    private Integer idSanPham;
    private String tenSanPham;
    private Double trungBinhSao;
    private Integer tongSoDanhGia;
    private Map<Integer, Integer> phanBoSao; // Key: số sao, Value: số lượng
    private List<DanhGiaDTO> danhGiaGanDay;
    
    // Constructor
    public ThongKeDanhGiaDTO(Integer idSanPham, String tenSanPham) {
        this.idSanPham = idSanPham;
        this.tenSanPham = tenSanPham;
        this.trungBinhSao = 0.0;
        this.tongSoDanhGia = 0;
    }
}
