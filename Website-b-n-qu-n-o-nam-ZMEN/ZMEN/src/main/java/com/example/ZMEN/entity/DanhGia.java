package com.example.ZMEN.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import org.hibernate.annotations.ColumnDefault;

import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "danh_gia")
public class DanhGia {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Integer id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_khach_hang", nullable = false)
    private KhachHang khachHang;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_san_pham", nullable = false)
    private SanPham sanPham;

    @NotNull
    @Min(value = 1, message = "Số sao phải từ 1-5")
    @Max(value = 5, message = "Số sao phải từ 1-5")
    @Column(name = "so_sao", nullable = false)
    private Short soSao;

    @Column(name = "binh_luan", columnDefinition = "TEXT")
    private String binhLuan;

    @ColumnDefault("getdate()")
    @Column(name = "ngay_danh_gia")
    private Instant ngayDanhGia = Instant.now();

    @Column(name = "trang_thai", nullable = false)
    private Byte trangThai = 1; // 1: Hiển thị, 0: Ẩn

    // Constructor cho việc tạo đánh giá mới
    public DanhGia(KhachHang khachHang, SanPham sanPham, Short soSao, String binhLuan) {
        this.khachHang = khachHang;
        this.sanPham = sanPham;
        this.soSao = soSao;
        this.binhLuan = binhLuan;
        this.ngayDanhGia = Instant.now();
        this.trangThai = 1;
    }
}