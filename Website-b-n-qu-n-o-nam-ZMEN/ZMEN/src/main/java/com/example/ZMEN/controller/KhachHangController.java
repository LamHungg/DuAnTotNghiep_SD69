package com.example.ZMEN.controller;

import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.service.KhachHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/khach-hang")
public class KhachHangController {
    @Autowired
    private KhachHangService khachHangService;

    @PostMapping
    public ResponseEntity<KhachHang> addKhachHang(@RequestBody KhachHang khachHang) {
        return ResponseEntity.ok(khachHangService.addKhachHang(khachHang));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KhachHang> updateKhachHang(@PathVariable Long id, @RequestBody KhachHang khachHang) {
        return ResponseEntity.ok(khachHangService.updateKhachHang(id, khachHang));
    }

    @PutMapping("/{id}/trang-thai")
    public ResponseEntity<KhachHang> changeTrangThai(@PathVariable Long id, @RequestParam Integer trangThai) {
        return ResponseEntity.ok(khachHangService.changeTrangThai(id, trangThai));
    }

    @GetMapping
    public ResponseEntity<java.util.List<KhachHang>> getAllKhachHang() {
        return ResponseEntity.ok(khachHangService.getAllKhachHang());
    }

    @GetMapping("/{id}/chi-tiet-don-hang")
    public ResponseEntity<java.util.List<com.example.ZMEN.dto.ChiTietDonHangFullDTO>> getAllChiTietDonHangByKhachHang(@PathVariable Long id) {
        return ResponseEntity.ok(khachHangService.getAllChiTietDonHangByKhachHang(id));
    }
} 