package com.example.ZMEN.controller;

import com.example.ZMEN.dto.ChiTietSanPhamDTO;
import com.example.ZMEN.service.ChiTietSanPhamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/api/chi-tiet-san-pham")
public class ChiTietSanPhamController {

    private final ChiTietSanPhamService chiTietSanPhamService;

    public ChiTietSanPhamController(ChiTietSanPhamService chiTietSanPhamService) {
        this.chiTietSanPhamService = chiTietSanPhamService;
    }

    @GetMapping
    public ResponseEntity<List<ChiTietSanPhamDTO>> getAllChiTietSanPham() {
        return ResponseEntity.ok(chiTietSanPhamService.getAllChiTietSanPham());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChiTietSanPhamDTO> getChiTietSanPhamById(@PathVariable Integer id) {
        return ResponseEntity.ok(chiTietSanPhamService.getChiTietSanPhamById(id));
    }

    @PostMapping
    public ResponseEntity<ChiTietSanPhamDTO> createChiTietSanPham(@Valid @RequestBody ChiTietSanPhamDTO dto) {
        return ResponseEntity.ok(chiTietSanPhamService.createChiTietSanPham(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ChiTietSanPhamDTO> updateChiTietSanPham(
            @PathVariable Integer id,
            @Valid @RequestBody ChiTietSanPhamDTO dto
    ) {
        return ResponseEntity.ok(chiTietSanPhamService.updateChiTietSanPham(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChiTietSanPham(@PathVariable Integer id) {
        chiTietSanPhamService.deleteChiTietSanPham(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/loc")
    public ResponseEntity<List<ChiTietSanPhamDTO>> locChiTietSanPham(
            @RequestParam(required = false) Integer idKichCo,
            @RequestParam(required = false) Integer idMauSac,
            @RequestParam(required = false) Integer idChatLieu) {
        return ResponseEntity.ok(
                chiTietSanPhamService.locChiTietSanPham(idKichCo, idMauSac, idChatLieu)
        );
    }

}
