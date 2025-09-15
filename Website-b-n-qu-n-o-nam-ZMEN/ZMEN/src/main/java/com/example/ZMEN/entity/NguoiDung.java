package com.example.ZMEN.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "nguoi_dung")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NguoiDung {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ma", unique = true)
    private String ma;

    @NotBlank(message = "Chức vụ không được để trống")
    @Column(name = "chuc_vu", nullable = false)
    private String chucVu;

    @NotBlank(message = "Tên đăng nhập không được để trống")
    @Column(name = "ten_dang_nhap", nullable = false, unique = true)
    private String tenDangNhap;

    @NotBlank(message = "Mật khẩu không được để trống")
    @Column(name = "mat_khau", nullable = false)
    private String matKhau;

    @Column(name = "ho_ten")
    private String hoTen;

    @Email(message = "Email không hợp lệ")
    @Column(name = "email", unique = true)
    private String email;

    @Pattern(regexp = "^\\d{10,11}$", message = "Số điện thoại không hợp lệ")
    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "trang_thai", nullable = false)
    private Boolean trangThai = true; // true: DANG_LAM_VIEC, false: DA_NGHI_VIEC

    @CreationTimestamp
    @Column(name = "ngay_tao", nullable = false, updatable = false)
    private LocalDateTime ngayTao;

    @UpdateTimestamp
    @Column(name = "ngay_cap_nhat")
    private LocalDateTime ngayCapNhat;
}
