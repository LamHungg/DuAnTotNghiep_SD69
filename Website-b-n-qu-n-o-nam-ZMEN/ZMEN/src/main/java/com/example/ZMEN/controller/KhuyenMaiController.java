package com.example.ZMEN.controller;


import com.example.ZMEN.dto.KhuyenMaiDTO;
import com.example.ZMEN.service.KhuyenMaiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/api/khuyenmai")
public class KhuyenMaiController {
    private final KhuyenMaiService khuyenMaiService;

    public KhuyenMaiController(KhuyenMaiService khuyenMaiService) {
        this.khuyenMaiService = khuyenMaiService;
    }

    @GetMapping
    public ResponseEntity<List<KhuyenMaiDTO>> getAllKhuyenMai() {
        return ResponseEntity.ok(khuyenMaiService.getAllKhuyenMai());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KhuyenMaiDTO> getKhuyenMaiById(@PathVariable Integer id) {
        return ResponseEntity.ok(khuyenMaiService.getKhuyenMaiById(id));
    }

    @PostMapping
    public ResponseEntity<KhuyenMaiDTO> createKhuyenMai(@Valid @RequestBody KhuyenMaiDTO dto) {
        return ResponseEntity.ok(khuyenMaiService.createKhuyenMai(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KhuyenMaiDTO> updateKhuyenMai(@PathVariable Integer id, @Valid @RequestBody KhuyenMaiDTO dto) {
        return ResponseEntity.ok(khuyenMaiService.updateKhuyenMai(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKhuyenMai(@PathVariable Integer id) {
        khuyenMaiService.deleteKhuyenMai(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<KhuyenMaiDTO>> searchKhuyenMai(
            @RequestParam(required = false) String tenKhuyenMai,
            @RequestParam(required = false) String maKhuyenMai,
            @RequestParam(required = false) BigDecimal phanTramGiam,
            @RequestParam(required = false) String ngayBatDau,
            @RequestParam(required = false) String ngayKetThuc,
            @RequestParam(required = false) Byte trangThai) {
        Date startDate = ngayBatDau != null ? java.sql.Date.valueOf(ngayBatDau) : null;
        Date endDate = ngayKetThuc != null ? java.sql.Date.valueOf(ngayKetThuc) : null;
        return ResponseEntity.ok(khuyenMaiService.searchKhuyenMai(tenKhuyenMai, maKhuyenMai, phanTramGiam, startDate, endDate, trangThai));
    }
}