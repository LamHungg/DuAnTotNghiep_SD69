package com.example.ZMEN.controller;

import com.example.ZMEN.dto.LoginRequest;
import com.example.ZMEN.dto.LoginResponse;
import com.example.ZMEN.dto.RegisterRequest;
import com.example.ZMEN.dto.ForgotPasswordRequest;
import com.example.ZMEN.service.NguoiDungService;
import com.example.ZMEN.service.TaiKhoanKHService;
import com.example.ZMEN.entity.KhachHang;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowCredentials = "true")
public class AuthController {

    @Autowired
    private NguoiDungService nguoiDungService;
    
    @Autowired
    private TaiKhoanKHService taiKhoanKHService;

    @Autowired
    private com.example.ZMEN.repository.KhachHangRepository khachHangRepository;

    // Test endpoint không yêu cầu authentication
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok("API authentication hoạt động bình thường!");
    }

    // Test endpoint kiểm tra session không yêu cầu authentication
    @GetMapping("/test-check-session")
    public ResponseEntity<?> testCheckSession(HttpServletRequest request, HttpSession session) {
        try {
            System.out.println("Debug - Test check session endpoint called");
            Object userObj = session.getAttribute("user");
            if (userObj == null) {
                System.out.println("Debug - No user in session");
                return ResponseEntity.status(401).body(Map.of("error", "Không có session"));
            }
            System.out.println("Debug - User found in session: " + userObj);
            return ResponseEntity.ok(Map.of("message", "Session hợp lệ", "user", userObj));
        } catch (Exception e) {
            System.err.println("Debug - Session check error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            // Kiểm tra email đã tồn tại chưa
            if (taiKhoanKHService.emailDaTonTai(request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Email đã tồn tại, vui lòng sử dụng email khác."));
            }
            
            // Kiểm tra tên đăng nhập đã tồn tại chưa
            if (taiKhoanKHService.tenDangNhapDaTonTai(request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Tên đăng nhập đã tồn tại, vui lòng chọn tên khác."));
            }
            
            // Tạo DTO cho việc đăng ký
            com.example.ZMEN.dto.TaiKhoanKHDto.DangKyDto dangKyDto = new com.example.ZMEN.dto.TaiKhoanKHDto.DangKyDto();
            dangKyDto.setHoTen(request.getFirstName() + " " + request.getLastName());
            dangKyDto.setEmail(request.getEmail());
            dangKyDto.setMatKhau(request.getPassword());
            dangKyDto.setTenDangNhap(request.getEmail()); // Sử dụng email làm tên đăng nhập
            dangKyDto.setSoDienThoai(request.getPhone() != null ? request.getPhone() : "");
            
            // Đăng ký khách hàng
            KhachHang khachHang = taiKhoanKHService.dangKy(dangKyDto);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Đăng ký thành công!");
            response.put("user", khachHang);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(
            @Valid @RequestBody LoginRequest loginRequest,
            HttpSession session) {
        try {
            // Thử đăng nhập với khách hàng trước
            try {
                com.example.ZMEN.dto.TaiKhoanKHDto.DangNhapDto dangNhapDto = new com.example.ZMEN.dto.TaiKhoanKHDto.DangNhapDto();
                dangNhapDto.setTaiKhoan(loginRequest.getEmail());
                dangNhapDto.setMatKhau(loginRequest.getMatKhau());
                
                KhachHang khachHang = taiKhoanKHService.dangNhap(dangNhapDto);
                
                // Tạo response cho khách hàng
                Map<String, Object> response = new HashMap<>();
                response.put("id", khachHang.getId());
                response.put("email", khachHang.getEmail());
                response.put("hoTen", khachHang.getHoTen());
                response.put("soDienThoai", khachHang.getSoDienThoai());
                response.put("phone", khachHang.getSoDienThoai()); // Thêm field phone cho frontend
                response.put("token", "customer-token-" + khachHang.getId());
                response.put("role", "CUSTOMER");
                
                // Lưu thông tin khách hàng vào session
                session.setAttribute("user", khachHang);
                session.setAttribute("isLoggedIn", true);
                session.setAttribute("userRole", "CUSTOMER");
                
                return ResponseEntity.ok(response);
            } catch (RuntimeException e) {
                // Nếu không phải khách hàng, thử đăng nhập với admin/staff
                LoginResponse response = nguoiDungService.login(loginRequest);
                
                // Lưu thông tin người dùng vào session
                session.setAttribute("user", nguoiDungService.getNguoiDungById(response.getId()).orElse(null));
                session.setAttribute("isLoggedIn", true);
                session.setAttribute("userRole", "ADMIN");
                
                // Tạo header với token
                HttpHeaders headers = new HttpHeaders();
                headers.add("Authorization", "Bearer " + response.getToken());
                
                return ResponseEntity.ok()
                        .headers(headers)
                        .body(response);
            }
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(new ErrorResponse(e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            // Kiểm tra email có tồn tại không
            if (!taiKhoanKHService.emailDaTonTai(request.getEmail())) {
                return ResponseEntity.badRequest()
                    .body(new ErrorResponse("Email không tồn tại trong hệ thống."));
            }
            
            // TODO: Implement email service để gửi email reset password
            // Hiện tại chỉ trả về thông báo thành công
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok().build();
    }

    // Endpoint để kiểm tra session
    @GetMapping("/check-session")
    public ResponseEntity<?> checkSession(HttpServletRequest request, HttpSession session) {
        try {
            System.out.println("Debug - Check session endpoint called");
            
            // Thử JWT authentication trước
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                // Token format: "customer-token-{id}"
                if (token.startsWith("customer-token-")) {
                    try {
                        Integer userId = Integer.parseInt(token.substring(15));
                        KhachHang khachHang = khachHangRepository.findById(userId).orElse(null);
                        if (khachHang != null) {
                            Map<String, Object> userData = new HashMap<>();
                            userData.put("id", khachHang.getId());
                            userData.put("email", khachHang.getEmail());
                            userData.put("hoTen", khachHang.getHoTen());
                            userData.put("soDienThoai", khachHang.getSoDienThoai());
                            userData.put("phone", khachHang.getSoDienThoai());
                            userData.put("role", "CUSTOMER");
                            return ResponseEntity.ok(userData);
                        }
                    } catch (NumberFormatException e) {
                        // Token không hợp lệ
                    }
                }
            }
            
            // Fallback to session authentication
            Object userObj = session.getAttribute("user");
            if (userObj == null) {
                System.out.println("Debug - No user in session");
                return ResponseEntity.status(401).body(Map.of("error", "Không có session"));
            }
            System.out.println("Debug - User found in session: " + userObj);
            return ResponseEntity.ok(userObj);
        } catch (Exception e) {
            System.err.println("Debug - Session check error: " + e.getMessage());
            return ResponseEntity.status(500).body(Map.of("error", e.getMessage()));
        }
    }

    // Endpoint để cập nhật thông tin profile
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> request, HttpSession session) {
        try {
            Object userObj = session.getAttribute("user");
            if (userObj == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("Chưa đăng nhập"));
            }

            if (userObj instanceof KhachHang) {
                KhachHang khachHang = (KhachHang) userObj;
                
                // Tạo DTO cho việc cập nhật thông tin
                com.example.ZMEN.dto.TaiKhoanKHDto.UpdateThongTinCaNhanDto updateDto = new com.example.ZMEN.dto.TaiKhoanKHDto.UpdateThongTinCaNhanDto();
                
                if (request.containsKey("firstName") && request.containsKey("lastName")) {
                    String hoTen = request.get("firstName") + " " + request.get("lastName");
                    updateDto.setHoTen(hoTen);
                }
                
                if (request.containsKey("email")) {
                    updateDto.setEmail((String) request.get("email"));
                }
                
                if (request.containsKey("phone")) {
                    updateDto.setSoDienThoai((String) request.get("phone"));
                }
                
                if (request.containsKey("gender")) {
                    updateDto.setGioiTinh((String) request.get("gender"));
                }
                
                if (request.containsKey("birthDate")) {
                    String birthDateStr = (String) request.get("birthDate");
                    if (birthDateStr != null && !birthDateStr.isEmpty()) {
                        updateDto.setNgaySinh(java.time.LocalDate.parse(birthDateStr));
                    }
                }
                
                // Cập nhật thông tin
                KhachHang updatedKhachHang = taiKhoanKHService.capNhatThongTinCaNhan(khachHang.getId(), updateDto);
                
                // Cập nhật session
                session.setAttribute("user", updatedKhachHang);
                
                Map<String, Object> response = new HashMap<>();
                response.put("id", updatedKhachHang.getId());
                response.put("email", updatedKhachHang.getEmail());
                response.put("hoTen", updatedKhachHang.getHoTen());
                response.put("soDienThoai", updatedKhachHang.getSoDienThoai());
                response.put("phone", updatedKhachHang.getSoDienThoai()); // Thêm field phone cho frontend
                response.put("message", "Cập nhật thông tin thành công!");
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(new ErrorResponse("Không hỗ trợ cập nhật cho loại tài khoản này"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Endpoint để đổi mật khẩu
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request, HttpSession session) {
        try {
            Object userObj = session.getAttribute("user");
            if (userObj == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("Chưa đăng nhập"));
            }

            String oldPassword = request.get("oldPassword");
            String newPassword = request.get("newPassword");

            if (oldPassword == null || newPassword == null) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Thiếu thông tin mật khẩu"));
            }

            if (userObj instanceof KhachHang) {
                KhachHang khachHang = (KhachHang) userObj;
                
                // Kiểm tra mật khẩu cũ
                com.example.ZMEN.dto.TaiKhoanKHDto.DangNhapDto dangNhapDto = new com.example.ZMEN.dto.TaiKhoanKHDto.DangNhapDto();
                dangNhapDto.setTaiKhoan(khachHang.getEmail());
                dangNhapDto.setMatKhau(oldPassword);
                
                try {
                    taiKhoanKHService.dangNhap(dangNhapDto);
                } catch (RuntimeException e) {
                    return ResponseEntity.badRequest().body(new ErrorResponse("Mật khẩu hiện tại không đúng"));
                }
                
                // Tạo DTO cho việc reset mật khẩu
                com.example.ZMEN.dto.TaiKhoanKHDto.ResetMatKhauDto resetDto = new com.example.ZMEN.dto.TaiKhoanKHDto.ResetMatKhauDto();
                resetDto.setEmail(khachHang.getEmail());
                resetDto.setMatKhauMoi(newPassword);
                
                // Cập nhật mật khẩu mới
                taiKhoanKHService.updateMatKhau(resetDto);
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "Đổi mật khẩu thành công!");
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(new ErrorResponse("Không hỗ trợ đổi mật khẩu cho loại tài khoản này"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }
}

