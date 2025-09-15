package com.example.ZMEN.controller;

import com.example.ZMEN.dto.SanPhamDTO;
import com.example.ZMEN.dto.SanPhamTaoNhanhDTO;
import com.example.ZMEN.service.SanPhamService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/sanpham")
public class SanPhamController {
    private final SanPhamService sanPhamService;

    public SanPhamController(SanPhamService sanPhamService) {
        this.sanPhamService = sanPhamService;
    }

    @GetMapping
    public ResponseEntity<List<SanPhamDTO>> getAllSanPham() {
        return ResponseEntity.ok(sanPhamService.getAllSanPham());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SanPhamDTO> getSanPhamById(@PathVariable Integer id) {
        return ResponseEntity.ok(sanPhamService.getSanPhamById(id));
    }

    @PostMapping
    public ResponseEntity<SanPhamDTO> createSanPham(@Valid @RequestBody SanPhamDTO dto) {
        return ResponseEntity.ok(sanPhamService.createSanPham(dto));
    }

    @PostMapping("/them-nhanh")
    public ResponseEntity<SanPhamDTO> themNhanhSanPham(@Valid @RequestBody SanPhamTaoNhanhDTO dto) {
        return ResponseEntity.ok(sanPhamService.themNhanhSanPham(dto));
    }


    @PutMapping("/{id}")
    public ResponseEntity<SanPhamDTO> updateSanPham(@PathVariable Integer id, @Valid @RequestBody SanPhamDTO dto) {
        return ResponseEntity.ok(sanPhamService.updateSanPham(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSanPham(@PathVariable Integer id) {
        sanPhamService.deleteSanPham(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<SanPhamDTO>> searchSanPham(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String tenSanPham,
            @RequestParam(required = false) String maSanPham,
            @RequestParam(required = false) Byte trangThai,
            @RequestParam(required = false) Integer idDanhMuc) {
        return ResponseEntity.ok(sanPhamService.searchSanPham(keyword, tenSanPham, maSanPham, trangThai, idDanhMuc));
    }



}