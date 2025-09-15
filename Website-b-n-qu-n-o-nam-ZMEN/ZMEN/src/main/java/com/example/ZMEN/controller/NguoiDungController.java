package com.example.ZMEN.controller;

import com.example.ZMEN.entity.NguoiDung;
import com.example.ZMEN.service.NguoiDungService;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import java.util.List;
import java.util.Map;
import com.example.ZMEN.dto.ResetPasswordRequest;

@RestController
@RequestMapping("/api/nguoi-dung")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class NguoiDungController {

    @Autowired
    private NguoiDungService nguoiDungService;

    @GetMapping
    public ResponseEntity<List<NguoiDung>> getAllNguoiDung() {
        return ResponseEntity.ok(nguoiDungService.getAllNguoiDung());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NguoiDung> getNguoiDungById(@PathVariable Long id) {
        return nguoiDungService.getNguoiDungById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createNguoiDung(
            @Valid @RequestBody NguoiDung nguoiDung,
            HttpSession session) {
        NguoiDung currentUser = (NguoiDung) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.ok(nguoiDungService.createNguoiDung(currentUser, nguoiDung));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/admin")
    public ResponseEntity<?> createAdmin(
            @Valid @RequestBody NguoiDung nguoiDung,
            HttpSession session) {
        NguoiDung currentUser = (NguoiDung) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            // Đặt chuc_vu là ADMIN trước khi tạo
            nguoiDung.setChucVu("ADMIN");
            return ResponseEntity.ok(nguoiDungService.createNguoiDung(currentUser, nguoiDung));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateNguoiDung(
            @PathVariable Long id,
            @Valid @RequestBody NguoiDung nguoiDungDetails,
            HttpSession session) {
        NguoiDung currentUser = (NguoiDung) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.ok(nguoiDungService.updateNguoiDung(currentUser, id, nguoiDungDetails));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam boolean status,
            HttpSession session) {
        NguoiDung currentUser = (NguoiDung) session.getAttribute("user");
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        try {
            return ResponseEntity.ok(nguoiDungService.updateStatus(currentUser, id, status));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteNguoiDung(@PathVariable Long id) {
        nguoiDungService.deleteNguoiDung(id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<NguoiDung>> searchNguoiDung(@RequestParam String hoTen) {
        return ResponseEntity.ok(nguoiDungService.searchNguoiDung(hoTen));
    }

    @GetMapping("/check-email")
    public ResponseEntity<?> checkEmailExists(@RequestParam String email) {
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Email không hợp lệ"));
        }
        try {
            boolean exists = nguoiDungService.existsByEmail(email);
            return ResponseEntity.ok(Map.of("exists", exists));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Lỗi kiểm tra email"));
        }
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<?> validateOtp(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        String otp = payload.get("otp");
        RestTemplate restTemplate = new RestTemplate();
        String url = "https://open-api.duonguyen.site/otp/validate";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        Map<String, String> body = Map.of("email", email, "otp", otp);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
        try {
            Map response = restTemplate.postForObject(url, request, Map.class);
            boolean valid = Boolean.TRUE.equals(response.get("valid"));
            if (valid) {
                return ResponseEntity.ok(Map.of("success", true, "message", "OTP hợp lệ. Chuyển sang màn hình đặt lại mật khẩu."));
            } else {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Mã OTP sai."));
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("success", false, "message", "Lỗi xác thực OTP."));
        }
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        boolean result = nguoiDungService.resetPassword(request);
        if (result) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Đặt lại mật khẩu thành công"));
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("success", false, "message", "Không tìm thấy người dùng với email này"));
        }
    }
}
