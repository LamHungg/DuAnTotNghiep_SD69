package com.example.ZMEN.controller;


import com.example.ZMEN.dto.VoucherDTO;
import com.example.ZMEN.service.VoucherService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/voucher")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class VoucherController {
    private final VoucherService voucherService;

    public VoucherController(VoucherService voucherService) {
        this.voucherService = voucherService;
    }

    @GetMapping
    public ResponseEntity<List<VoucherDTO>> getAllVoucher() {
        return ResponseEntity.ok(voucherService.getAllVoucher());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VoucherDTO> getVoucherById(@PathVariable Integer id) {
        return ResponseEntity.ok(voucherService.getVoucherById(id));
    }

    @PostMapping
    public ResponseEntity<VoucherDTO> createVoucher(@Valid @RequestBody VoucherDTO dto) {
        return ResponseEntity.ok(voucherService.createVoucher(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VoucherDTO> updateVoucher(@PathVariable Integer id, @Valid @RequestBody VoucherDTO dto) {
        return ResponseEntity.ok(voucherService.updateVoucher(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVoucher(@PathVariable Integer id) {
        voucherService.deleteVoucher(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<VoucherDTO>> searchVoucher(
            @RequestParam(required = false) String tenVoucher,
            @RequestParam(required = false) String maVoucher,
            @RequestParam(required = false) BigDecimal giaTriGiam,
            @RequestParam(required = false) String ngayBatDau,
            @RequestParam(required = false) String ngayKetThuc,
            @RequestParam(required = false) Integer trangThai) {
        LocalDate startDate = ngayBatDau != null ? LocalDate.parse(ngayBatDau) : null;
        LocalDate endDate = ngayKetThuc != null ? LocalDate.parse(ngayKetThuc) : null;
        return ResponseEntity.ok(voucherService.searchVoucher(tenVoucher, maVoucher, giaTriGiam, startDate, endDate, trangThai));
    }
}