package com.example.ZMEN.controller;


import com.example.ZMEN.dto.KichCoDTO;
import com.example.ZMEN.service.KichCoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/kichco")
public class KichCoController {
    private final KichCoService kichCoService;

    public KichCoController(KichCoService kichCoService) {
        this.kichCoService = kichCoService;
    }

    @GetMapping
    public ResponseEntity<List<KichCoDTO>> getAllKichCo() {
        return ResponseEntity.ok(kichCoService.getAllKichCo());
    }

    @GetMapping("/{id}")
    public ResponseEntity<KichCoDTO> getKichCoById(@PathVariable Integer id) {
        return ResponseEntity.ok(kichCoService.getKichCoById(id));
    }

    @PostMapping
    public ResponseEntity<KichCoDTO> createKichCo(@Valid @RequestBody KichCoDTO dto) {
        return ResponseEntity.ok(kichCoService.createKichCo(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<KichCoDTO> updateKichCo(@PathVariable Integer id, @Valid @RequestBody KichCoDTO dto) {
        return ResponseEntity.ok(kichCoService.updateKichCo(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteKichCo(@PathVariable Integer id) {
        kichCoService.deleteKichCo(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tim-kiem")
    public ResponseEntity<List<KichCoDTO>> timKiem(
            @RequestParam(required = false) String tenKichCo,
            @RequestParam(required = false) Byte trangThai) {
        return ResponseEntity.ok(kichCoService.searchKichCo(tenKichCo, trangThai));
    }

}