package com.example.ZMEN.controller;

import com.example.ZMEN.dto.CheckoutRequest;
import com.example.ZMEN.dto.CheckoutResponse;
import com.example.ZMEN.service.CheckoutService;
import com.example.ZMEN.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/checkout")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class CheckoutController {

    @GetMapping("/ping")
    public ResponseEntity<?> ping() {
        return ResponseEntity.ok("Checkout controller is working");
    }

    @GetMapping("/simple")
    public ResponseEntity<?> simple() {
        return ResponseEntity.ok("Simple endpoint works");
    }

    @GetMapping("/basic")
    public ResponseEntity<?> basic() {
        return ResponseEntity.ok("Basic endpoint works");
    }

    @Autowired
    private CheckoutService checkoutService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/process")
    public ResponseEntity<?> processCheckout(@RequestBody CheckoutRequest request, HttpServletRequest httpRequest) {
        try {
            System.out.println("Debug - Bắt đầu processCheckout endpoint");
            System.out.println("Debug - Request: " + request);

            // Thử JWT authentication trước
            String authHeader = httpRequest.getHeader("Authorization");
            Integer khachHangId = null;
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                // Token format: "customer-token-{id}"
                if (token.startsWith("customer-token-")) {
                    try {
                        khachHangId = Integer.parseInt(token.substring(15));
                        System.out.println("Debug - KhachHangId từ JWT token: " + khachHangId);
                    } catch (NumberFormatException e) {
                        System.out.println("Debug - Token không hợp lệ: " + token);
                    }
                }
            }
            
            // Fallback to session authentication
            if (khachHangId == null) {
                Object userObj = httpRequest.getSession().getAttribute("user");
                if (userObj != null && userObj instanceof com.example.ZMEN.entity.KhachHang) {
                    khachHangId = ((com.example.ZMEN.entity.KhachHang) userObj).getId();
                    System.out.println("Debug - KhachHangId từ session: " + khachHangId);
                }
            }

            // Thử lấy từ request body nếu có
            if (khachHangId == null && request.getKhachHangId() != null) {
                khachHangId = request.getKhachHangId();
                System.out.println("Debug - KhachHangId từ request body: " + khachHangId);
            }

            // Fallback cuối cùng: sử dụng ID mặc định cho test
            if (khachHangId == null) {
                khachHangId = 7; // ID khách hàng mặc định
                System.out.println("Debug - Sử dụng KhachHangId mặc định: " + khachHangId);
            }

            System.out.println("Debug - KhachHangId cuối cùng: " + khachHangId);

            // Xử lý checkout
            CheckoutResponse response = checkoutService.processCheckout(request, khachHangId);

            System.out.println("Debug - Checkout thành công: " + response);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Debug - Lỗi checkout: " + e.getMessage());
            e.printStackTrace();
            
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("error", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/test")
    public ResponseEntity<?> testCheckout(HttpServletRequest request) {
        try {
            System.out.println("Debug - Test endpoint called");
            
            // Lấy thông tin khách hàng từ session
            Object userObj = request.getSession().getAttribute("user");
            if (userObj == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Vui lòng đăng nhập để test checkout"));
            }

            // Lấy khachHangId từ session
            Integer khachHangId = null;
            if (userObj instanceof com.example.ZMEN.entity.KhachHang) {
                khachHangId = ((com.example.ZMEN.entity.KhachHang) userObj).getId();
            }
            
            if (khachHangId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Không tìm thấy thông tin khách hàng"));
            }

            return ResponseEntity.ok(Map.of(
                "message", "Checkout endpoint hoạt động bình thường",
                "khachHangId", khachHangId
            ));

        } catch (Exception e) {
            System.err.println("Debug - Test error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }



    @PostMapping("/test-process")
    public ResponseEntity<?> testProcessCheckout(@RequestBody CheckoutRequest request, HttpServletRequest httpRequest) {
        try {
            System.out.println("Debug - Test process checkout");
            System.out.println("Debug - Request: " + request);
            
            // Thử JWT authentication trước
            String authHeader = httpRequest.getHeader("Authorization");
            Integer khachHangId = null;
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                // Token format: "customer-token-{id}"
                if (token.startsWith("customer-token-")) {
                    try {
                        khachHangId = Integer.parseInt(token.substring(15));
                        System.out.println("Debug - Test: KhachHangId từ JWT token: " + khachHangId);
                    } catch (NumberFormatException e) {
                        System.out.println("Debug - Test: Token không hợp lệ: " + token);
                    }
                }
            }
            
            // Fallback to session authentication
            if (khachHangId == null) {
                Object userObj = httpRequest.getSession().getAttribute("user");
                if (userObj != null && userObj instanceof com.example.ZMEN.entity.KhachHang) {
                    khachHangId = ((com.example.ZMEN.entity.KhachHang) userObj).getId();
                    System.out.println("Debug - Test: KhachHangId từ session: " + khachHangId);
                }
            }

            // Thử lấy từ request body nếu có
            if (khachHangId == null && request.getKhachHangId() != null) {
                khachHangId = request.getKhachHangId();
                System.out.println("Debug - Test: KhachHangId từ request body: " + khachHangId);
            }

            // Fallback cuối cùng: sử dụng ID mặc định cho test
            if (khachHangId == null) {
                // Thử lấy từ request body trước khi dùng default
                if (request.getKhachHangId() != null) {
                    khachHangId = request.getKhachHangId();
                    System.out.println("Debug - Test: KhachHangId từ request body: " + khachHangId);
                } else {
                    khachHangId = 7; // ID khách hàng mặc định
                    System.out.println("Debug - Test: Sử dụng KhachHangId mặc định: " + khachHangId);
                }
            }

            System.out.println("Debug - KhachHangId: " + khachHangId);
            System.out.println("Debug - Cart items count: " + (request.getCartItems() != null ? request.getCartItems().size() : 0));
            System.out.println("Debug - DiaChiId: " + request.getDiaChiId());
            System.out.println("Debug - PhuongThucThanhToanId: " + request.getPhuongThucThanhToanId());

            return ResponseEntity.ok(Map.of(
                "message", "Test checkout data received successfully",
                "khachHangId", khachHangId,
                "cartItemsCount", request.getCartItems() != null ? request.getCartItems().size() : 0,
                "diaChiId", request.getDiaChiId(),
                "phuongThucThanhToanId", request.getPhuongThucThanhToanId()
            ));

        } catch (Exception e) {
            System.err.println("Debug - Test error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/generate-order-number")
    public ResponseEntity<?> generateOrderNumber() {
        try {
            String orderNumber = checkoutService.generateMaDonHang();
            return ResponseEntity.ok(Map.of("maDonHang", orderNumber));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    private String extractToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
