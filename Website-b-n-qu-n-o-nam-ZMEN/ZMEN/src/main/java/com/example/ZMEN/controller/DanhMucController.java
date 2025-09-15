package com.example.ZMEN.controller;


import com.example.ZMEN.dto.DanhMucDTO;
import com.example.ZMEN.service.DanhMucService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/danhmuc")
public class DanhMucController {
    private final DanhMucService danhMucService;

    public DanhMucController(DanhMucService danhMucService) {
        this.danhMucService = danhMucService;
    }

    @GetMapping
    public ResponseEntity<List<DanhMucDTO>> getAllDanhMuc() {
        return ResponseEntity.ok(danhMucService.getAllDanhMuc());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DanhMucDTO> getDanhMucById(@PathVariable Integer id) {
        return ResponseEntity.ok(danhMucService.getDanhMucById(id));
    }

    @PostMapping
    public ResponseEntity<DanhMucDTO> createDanhMuc(@Valid @RequestBody DanhMucDTO dto) {
        return ResponseEntity.ok(danhMucService.createDanhMuc(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DanhMucDTO> updateDanhMuc(@PathVariable Integer id, @Valid @RequestBody DanhMucDTO dto) {
        return ResponseEntity.ok(danhMucService.updateDanhMuc(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDanhMuc(@PathVariable Integer id) {
        danhMucService.deleteDanhMuc(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<List<DanhMucDTO>> timKiemDanhMuc(
            @RequestParam(required = false) String tenDanhMuc,
            @RequestParam(required = false) Byte trangThai
    ) {
        return ResponseEntity.ok(danhMucService.searchDanhMuc(tenDanhMuc, trangThai));
    }

}