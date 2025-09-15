package com.example.ZMEN.controller;

import com.example.ZMEN.dto.DonHangDto;
import com.example.ZMEN.entity.DonHang;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.repository.DonHangRepository;
import com.example.ZMEN.repository.KhachHangRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowCredentials = "true")
public class DonHangController {

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    // Helper method để lấy user từ JWT token
    private KhachHang getUserFromToken(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // Token format: "customer-token-{id}"
            if (token.startsWith("customer-token-")) {
                try {
                    Integer userId = Integer.parseInt(token.substring(15));
                    return khachHangRepository.findById(userId).orElse(null);
                } catch (NumberFormatException e) {
                    return null;
                }
            }
        }
        return null;
    }

    // Test endpoint không yêu cầu authentication
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok("API đơn hàng hoạt động bình thường!");
    }

    // Test endpoint lấy tất cả đơn hàng không yêu cầu authentication
    @GetMapping("/test-list")
    public ResponseEntity<?> testGetOrders() {
        try {
            List<DonHang> orders = donHangRepository.findAllOrderByNgayDatDesc();
            
            List<DonHangDto> orderDtos = orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

            return ResponseEntity.ok(orderDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Test endpoint lấy đơn hàng theo ID không yêu cầu authentication
    @GetMapping("/test/{id}")
    public ResponseEntity<?> testGetOrderById(@PathVariable Integer id) {
        try {
            DonHang order = donHangRepository.findById(id).orElse(null);
            
            if (order == null) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(convertToDto(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Test endpoint lấy đơn hàng theo trạng thái không yêu cầu authentication
    @GetMapping("/test/status/{status}")
    public ResponseEntity<?> testGetOrdersByStatus(@PathVariable String status) {
        try {
            List<DonHang> orders = donHangRepository.findAllOrderByNgayDatDesc();
            
            List<DonHangDto> orderDtos = orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

            return ResponseEntity.ok(orderDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Lấy tất cả đơn hàng của khách hàng (với JWT authentication)
    @GetMapping
    public ResponseEntity<?> getOrders(HttpServletRequest request) {
        try {
            KhachHang khachHang = getUserFromToken(request);
            if (khachHang == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("Token không hợp lệ"));
            }

            // Lấy đơn hàng theo khách hàng
            List<DonHang> orders = donHangRepository.findByKhachHangId(khachHang.getId());
            
            List<DonHangDto> orderDtos = orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

            return ResponseEntity.ok(orderDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Lấy chi tiết đơn hàng theo ID (với JWT authentication)
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer id, HttpServletRequest request) {
        try {
            KhachHang khachHang = getUserFromToken(request);
            if (khachHang == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("Token không hợp lệ"));
            }

            DonHang order = donHangRepository.findById(id).orElse(null);
            
            if (order == null) {
                return ResponseEntity.notFound().build();
            }

            // Kiểm tra xem đơn hàng có thuộc về customer đang đăng nhập không
            if (order.getKhachHang() == null || !order.getKhachHang().getId().equals(khachHang.getId())) {
                return ResponseEntity.status(403).body(new ErrorResponse("Không có quyền truy cập đơn hàng này"));
            }

            return ResponseEntity.ok(convertToDto(order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Lấy đơn hàng theo trạng thái (với JWT authentication)
    @GetMapping("/status/{status}")
    public ResponseEntity<?> getOrdersByStatus(@PathVariable String status, HttpServletRequest request) {
        try {
            KhachHang khachHang = getUserFromToken(request);
            if (khachHang == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("Token không hợp lệ"));
            }

            // Lấy đơn hàng theo khách hàng
            List<DonHang> orders = donHangRepository.findByKhachHangId(khachHang.getId());
            
            List<DonHangDto> orderDtos = orders.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

            return ResponseEntity.ok(orderDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Chuyển đổi Entity sang DTO
    private DonHangDto convertToDto(DonHang entity) {
        DonHangDto dto = new DonHangDto();
        dto.setId(entity.getId());
        dto.setMaDonHang(entity.getMaDonHang());
        dto.setNgayDat(entity.getNgayDat());
        dto.setNgayGiao(null); // Không có trong database hiện tại
        dto.setTongTien(entity.getTongThanhToan()); // Sử dụng tong_thanh_toan
        dto.setTrangThai("processing"); // Mặc định
        dto.setGhiChu("");
        dto.setDiaChiGiao("");
        dto.setSoDienThoaiGiao("");
        dto.setHoTenNguoiNhan("");
        
        // Convert chi tiết đơn hàng nếu có
        if (entity.getChiTietDonHang() != null) {
            dto.setChiTietDonHang(entity.getChiTietDonHang().stream()
                .map(this::convertChiTietToDto)
                .collect(Collectors.toList()));
        }
        
        return dto;
    }

    // Chuyển đổi ChiTietDonHang sang DTO
    private com.example.ZMEN.dto.ChiTietDonHangDto convertChiTietToDto(com.example.ZMEN.entity.ChiTietDonHang entity) {
        com.example.ZMEN.dto.ChiTietDonHangDto dto = new com.example.ZMEN.dto.ChiTietDonHangDto();
        dto.setId(entity.getId());
        
        // Lấy thông tin sản phẩm từ ChiTietSanPham
        if (entity.getChiTietSanPham() != null && entity.getChiTietSanPham().getSanPham() != null) {
            dto.setSanPhamId(entity.getChiTietSanPham().getSanPham().getId());
            dto.setTenSanPham(entity.getChiTietSanPham().getSanPham().getTenSanPham());
        } else {
            dto.setSanPhamId(null);
            dto.setTenSanPham("Sản phẩm không xác định");
        }
        
        dto.setHinhAnh(""); // Tạm thời để trống vì entity SanPham không có field hinhAnh
        dto.setSoLuong(entity.getSoLuong());
        
        // Tính đơn giá và thành tiền từ ChiTietSanPham
        if (entity.getChiTietSanPham() != null) {
            Double gia = entity.getChiTietSanPham().getGia();
            dto.setDonGia(java.math.BigDecimal.valueOf(gia != null ? gia : 0.0));
            dto.setThanhTien(java.math.BigDecimal.valueOf(gia != null ? gia * entity.getSoLuong() : 0.0));
        } else {
            dto.setDonGia(java.math.BigDecimal.ZERO);
            dto.setThanhTien(java.math.BigDecimal.ZERO);
        }
        
        return dto;
    }
}
