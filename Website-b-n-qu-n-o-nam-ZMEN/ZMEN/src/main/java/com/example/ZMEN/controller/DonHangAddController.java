package com.example.ZMEN.controller;

import com.example.ZMEN.dto.DonHangAddDto;
import com.example.ZMEN.entity.DonHang;
import com.example.ZMEN.service.DonHangAddService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
@RestController
@AllArgsConstructor
@RequestMapping("zmen/don-hang-add")
public class DonHangAddController {

    private final DonHangAddService donHangAddService;

    @PostMapping
    public ResponseEntity<DonHangAddDto> addDonHang(@RequestBody DonHangAddDto donHangAddDto){
        DonHangAddDto createdDonHang = donHangAddService.addDonHang(donHangAddDto);

        // Trả về ResponseEntity với DTO của đơn hàng đã tạo và mã trạng thái HTTP 201 Created
        return new ResponseEntity<>(createdDonHang, HttpStatus.CREATED);
    }
}
