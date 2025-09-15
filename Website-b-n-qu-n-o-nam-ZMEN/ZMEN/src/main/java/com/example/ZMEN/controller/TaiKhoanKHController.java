package com.example.ZMEN.controller;

import com.example.ZMEN.dto.TaiKhoanKHDto.DangKyDto;
import com.example.ZMEN.dto.TaiKhoanKHDto.DangNhapDto;
import com.example.ZMEN.dto.TaiKhoanKHDto.ResetMatKhauDto;
import com.example.ZMEN.dto.TaiKhoanKHDto.UpdateThongTinCaNhanDto;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.repository.TaiKhoanKHRepository;
import com.example.ZMEN.service.TaiKhoanKHService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/zmen")
public class TaiKhoanKHController {

    @Autowired
    private TaiKhoanKHService service;

    @Autowired
    private TaiKhoanKHRepository taiKhoanKHRepository;

    @PostMapping("/dang-ky")
    public ResponseEntity<?> dangKy(@RequestBody DangKyDto dto) {
        if (service.emailDaTonTai(dto.getEmail())) {
            return ResponseEntity.ok(Collections.singletonMap("message", "Email đã tồn tại, vui lòng sử dụng email khác."));
        }
        if (service.tenDangNhapDaTonTai(dto.getTenDangNhap())) {
            return ResponseEntity.ok(Collections.singletonMap("message", "Tên đăng nhập đã tồn tại, vui lòng chọn tên khác."));
        }

        KhachHang kh = service.dangKy(dto);
        return ResponseEntity.ok(Collections.singletonMap("message", "Đăng ký thành công."));
    }


    @PostMapping("/dang-nhap")
    public ResponseEntity<?> dangNhap(@RequestBody DangNhapDto dto) {
        try {
            KhachHang kh = service.dangNhap(dto);
            return ResponseEntity.ok(kh);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Collections.singletonMap("message", e.getMessage()));
        }
    }

    @PostMapping("/cap-nhat-mat-khau")
    public ResponseEntity<?> capNhatMatKhau(@RequestBody ResetMatKhauDto dto) {
        service.updateMatKhau(dto);
        return ResponseEntity.ok("Cập nhật mật khẩu thành công.");
    }

    @GetMapping("/kiem-tra-email")
    public ResponseEntity<?> kiemTraEmail(@RequestParam("email") String email) {
        boolean tonTai = service.emailDaTonTai(email);
        return ResponseEntity.ok(Collections.singletonMap("emailDaTonTai", tonTai));
    }

    @GetMapping("/capnhat/{id}")
    public ResponseEntity<?> layThongTinKhachHang(@PathVariable Integer id) {
        Optional<KhachHang> optional = taiKhoanKHRepository.findById(id);
        if (optional.isEmpty()) {
            return ResponseEntity.badRequest().body("Không tìm thấy khách hàng.");
        }
        KhachHang kh = optional.get();
        Map<String, Object> response = new HashMap<>();
        response.put("hoTen", kh.getHoTen());
        response.put("gioiTinh", kh.getGioiTinh());
        response.put("ngaySinh", kh.getNgaySinh());
        response.put("email", kh.getEmail());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/capnhat/{id}")
    public ResponseEntity<?> capNhatThongTin(@PathVariable Integer id, @RequestBody UpdateThongTinCaNhanDto dto) {
        KhachHang kh = taiKhoanKHRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng."));

        kh.setHoTen(dto.getHoTen());
        kh.setGioiTinh(dto.getGioiTinh());
        kh.setNgaySinh(dto.getNgaySinh());
        taiKhoanKHRepository.save(kh);

        return ResponseEntity.ok("Cập nhật thành công");

    }
}
