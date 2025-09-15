package com.example.ZMEN.dto.request;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class AddToCartRequestDTO {
    private Integer chiTietSanPhamId;
    private Integer soLuong;
}
