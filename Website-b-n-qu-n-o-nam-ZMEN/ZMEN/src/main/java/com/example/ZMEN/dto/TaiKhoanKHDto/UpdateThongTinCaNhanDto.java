package com.example.ZMEN.dto.TaiKhoanKHDto;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class UpdateThongTinCaNhanDto {
    private String hoTen;
    private String gioiTinh;
    private LocalDate ngaySinh;
    private String email;
    private String soDienThoai;
}
