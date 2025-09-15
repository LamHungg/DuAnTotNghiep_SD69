package com.example.ZMEN.controller;

import com.example.ZMEN.dto.DanhGiaDTO;
import com.example.ZMEN.dto.ThongKeDanhGiaDTO;
import com.example.ZMEN.service.DanhGiaService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/danhgia")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class DanhGiaController {

    @Autowired
    private DanhGiaService danhGiaService;

    // Lấy tất cả đánh giá của sản phẩm
    @GetMapping("/sanpham/{idSanPham}")
    public ResponseEntity<List<DanhGiaDTO>> getDanhGiaBySanPham(@PathVariable Integer idSanPham) {
        try {
            List<DanhGiaDTO> danhGias = danhGiaService.getDanhGiaBySanPhamId(idSanPham);
            return ResponseEntity.ok(danhGias);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Lấy thống kê đánh giá của sản phẩm
    @GetMapping("/thongke/{idSanPham}")
    public ResponseEntity<ThongKeDanhGiaDTO> getThongKeDanhGia(@PathVariable Integer idSanPham) {
        try {
            ThongKeDanhGiaDTO thongKe = danhGiaService.getThongKeDanhGiaBySanPhamId(idSanPham);
            return ResponseEntity.ok(thongKe);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Tạo đánh giá mới
    @PostMapping
    public ResponseEntity<?> createDanhGia(@Valid @RequestBody DanhGiaDTO danhGiaDTO) {
        try {
            DanhGiaDTO createdDanhGia = danhGiaService.createDanhGia(danhGiaDTO);
            return ResponseEntity.ok(createdDanhGia);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Có lỗi xảy ra khi tạo đánh giá");
        }
    }

    // Cập nhật đánh giá
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDanhGia(@PathVariable Integer id, @Valid @RequestBody DanhGiaDTO danhGiaDTO) {
        try {
            DanhGiaDTO updatedDanhGia = danhGiaService.updateDanhGia(id, danhGiaDTO);
            return ResponseEntity.ok(updatedDanhGia);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Có lỗi xảy ra khi cập nhật đánh giá");
        }
    }

    // Xóa đánh giá (ẩn)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDanhGia(@PathVariable Integer id) {
        try {
            danhGiaService.deleteDanhGia(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Kiểm tra khách hàng đã đánh giá sản phẩm chưa
    @GetMapping("/check/{idKhachHang}/{idSanPham}")
    public ResponseEntity<Boolean> hasKhachHangReviewed(@PathVariable Integer idKhachHang, @PathVariable Integer idSanPham) {
        try {
            boolean hasReviewed = danhGiaService.hasKhachHangReviewed(idKhachHang, idSanPham);
            return ResponseEntity.ok(hasReviewed);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Lấy đánh giá của khách hàng cho sản phẩm
    @GetMapping("/khachhang/{idKhachHang}/sanpham/{idSanPham}")
    public ResponseEntity<DanhGiaDTO> getDanhGiaByKhachHangAndSanPham(@PathVariable Integer idKhachHang, @PathVariable Integer idSanPham) {
        try {
            DanhGiaDTO danhGia = danhGiaService.getDanhGiaByKhachHangAndSanPham(idKhachHang, idSanPham);
            return ResponseEntity.ok(danhGia);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
