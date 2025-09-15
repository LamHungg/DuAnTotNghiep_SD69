package com.example.ZMEN.controller;


import com.example.ZMEN.dto.MauSacDTO;
import com.example.ZMEN.service.MauSacService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/mausac")
public class MauSacController {
    private final MauSacService mauSacService;

    public MauSacController(MauSacService mauSacService) {
        this.mauSacService = mauSacService;
    }

    @GetMapping
    public ResponseEntity<List<MauSacDTO>> getAllMauSac() {
        return ResponseEntity.ok(mauSacService.getAllMauSac());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MauSacDTO> getMauSacById(@PathVariable Integer id) {
        return ResponseEntity.ok(mauSacService.getMauSacById(id));
    }

    @PostMapping
    public ResponseEntity<MauSacDTO> createMauSac(@Valid @RequestBody MauSacDTO dto) {
        return ResponseEntity.ok(mauSacService.createMauSac(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MauSacDTO> updateMauSac(@PathVariable Integer id, @Valid @RequestBody MauSacDTO dto) {
        return ResponseEntity.ok(mauSacService.updateMauSac(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMauSac(@PathVariable Integer id) {
        mauSacService.deleteMauSac(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<List<MauSacDTO>> timKiemMauSac(
            @RequestParam(required = false) String tenMauSac,
            @RequestParam(required = false) Byte trangThai
    ) {
        return ResponseEntity.ok(mauSacService.searchMauSac(tenMauSac, trangThai));
    }
}