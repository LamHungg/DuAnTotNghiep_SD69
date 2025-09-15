package com.example.ZMEN.controller;

import com.example.ZMEN.dto.PosOrderDTO;
import com.example.ZMEN.dto.ChiTietSanPhamDTO;
import com.example.ZMEN.dto.KhachHangViewDto;
import com.example.ZMEN.dto.VoucherDTO;
import com.example.ZMEN.entity.*;
import com.example.ZMEN.repository.HinhAnhSanPhamRepository;
import com.example.ZMEN.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/pos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowCredentials = "true")
public class PosController {

    @Autowired
    private ChiTietSanPhamService chiTietSanPhamService;
    
    @Autowired
    private KhachHangService khachHangService;
    
    @Autowired
    private VoucherService voucherService;
    
    @Autowired
    private DonHangService donHangService;
    
    @Autowired
    private ChiTietDonHangService chiTietDonHangService;
    
    @Autowired
    private HinhAnhSanPhamRepository hinhAnhSanPhamRepository;

    // Lấy tất cả sản phẩm có sẵn để bán (có tồn kho > 0)
    @GetMapping("/products")
    public ResponseEntity<?> getAllProductsForPOS() {
        try {
            List<ChiTietSanPhamDTO> products = chiTietSanPhamService.getAllChiTietSanPhamForPOS();
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi lấy danh sách sản phẩm: " + e.getMessage()));
        }
    }

    // Tìm kiếm sản phẩm
    @GetMapping("/products/search")
    public ResponseEntity<?> searchProducts(@RequestParam String keyword) {
        try {
            List<ChiTietSanPhamDTO> products = chiTietSanPhamService.searchProductsForPOS(keyword);
            return ResponseEntity.ok(products);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi tìm kiếm sản phẩm: " + e.getMessage()));
        }
    }

    // Lấy danh sách khách hàng
    @GetMapping("/customers")
    public ResponseEntity<?> getAllCustomers() {
        try {
            List<KhachHang> customers = khachHangService.getAllKhachHang();
            return ResponseEntity.ok(customers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi lấy danh sách khách hàng: " + e.getMessage()));
        }
    }   

    // Tìm kiếm khách hàng
    @GetMapping("/customers/search")
    public ResponseEntity<?> searchCustomers(@RequestParam String keyword) {
        try {
            List<KhachHang> customers = khachHangService.search(keyword);
            return ResponseEntity.ok(customers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi tìm kiếm khách hàng: " + e.getMessage()));
        }
    }

    // Lấy danh sách voucher có hiệu lực
    @GetMapping("/vouchers/active")
    public ResponseEntity<?> getActiveVouchers() {
        try {
            List<VoucherDTO> vouchers = voucherService.getActiveVouchers();
            return ResponseEntity.ok(vouchers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi lấy danh sách voucher: " + e.getMessage()));
        }
    }

    // Kiểm tra voucher có hợp lệ không
    @PostMapping("/vouchers/validate")
    public ResponseEntity<?> validateVoucher(@RequestBody Map<String, Object> request) {
        try {
            String maVoucher = (String) request.get("maVoucher");
            Double tongTien = Double.valueOf(request.get("tongTien").toString());
            
            Map<String, Object> result = voucherService.validateVoucher(maVoucher, tongTien);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi kiểm tra voucher: " + e.getMessage()));
        }
    }

    // Kiểm tra tồn kho sản phẩm
    @GetMapping("/products/{id}/stock")
    public ResponseEntity<?> checkStock(@PathVariable Integer id) {
        try {
            ChiTietSanPhamDTO product = chiTietSanPhamService.getChiTietSanPhamById(id);
            if (product == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Không tìm thấy sản phẩm"));
            }
            
            return ResponseEntity.ok(Map.of(
                "id", product.getId(),
                "soLuong", product.getSoLuong(),
                "available", product.getSoLuong() > 0
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi kiểm tra tồn kho: " + e.getMessage()));
        }
    }

    // Cập nhật tồn kho sản phẩm
    @PutMapping("/products/{id}/stock")
    public ResponseEntity<?> updateStock(@PathVariable Integer id, @RequestBody Map<String, Integer> request) {
        try {
            Integer soLuongThayDoi = request.get("soLuong");
            ChiTietSanPhamDTO product = chiTietSanPhamService.updateStock(id, soLuongThayDoi);
            
            return ResponseEntity.ok(Map.of(
                "id", product.getId(),
                "soLuong", product.getSoLuong(),
                "message", "Cập nhật tồn kho thành công"
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi cập nhật tồn kho: " + e.getMessage()));
        }
    }

    // Tạo đơn hàng POS
    @PostMapping("/orders")
    public ResponseEntity<?> createPOSOrder(@RequestBody PosOrderDTO orderDTO) {
        try {
            System.out.println("Received order data: " + orderDTO);
            
            // Validate đơn hàng
            if (orderDTO.getChiTietDonHang() == null || orderDTO.getChiTietDonHang().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Đơn hàng phải có ít nhất 1 sản phẩm"));
            }

            // Tạo đơn hàng
            DonHang donHang = new DonHang();
            donHang.setMaDonHang(orderDTO.getMaDonHang());
            donHang.setNgayDat(LocalDateTime.now());
            donHang.setTongThanhToan(BigDecimal.valueOf(orderDTO.getTongThanhToan()));
            donHang.setTongTienHang(BigDecimal.valueOf(orderDTO.getTongThanhToan()));
            donHang.setLoaiDonHang(false); // false = POS/offline
            
            System.out.println("Created DonHang: " + donHang.getMaDonHang() + ", Total: " + donHang.getTongThanhToan());
            
            // Set customer if provided
            if (orderDTO.getKhachHangId() != null) {
                KhachHang khachHang = khachHangService.getKhachHangById(orderDTO.getKhachHangId());
                if (khachHang != null) {
                    donHang.setKhachHang(khachHang);
                    System.out.println("Set customer: " + khachHang.getHoTen());
                }
            }

            // Save order
            DonHang savedOrder = donHangService.saveDonHang(donHang);
            System.out.println("Saved order with ID: " + savedOrder.getId());

            // Create order details
            for (var chiTietDTO : orderDTO.getChiTietDonHang()) {
                System.out.println("Processing order detail: " + chiTietDTO);
                
                ChiTietDonHang chiTiet = new ChiTietDonHang();
                chiTiet.setDonHang(savedOrder);
                
                ChiTietSanPhamDTO chiTietSanPhamDTO = chiTietSanPhamService.getChiTietSanPhamById(chiTietDTO.getChiTietSanPhamId());
                if (chiTietSanPhamDTO == null) {
                    throw new RuntimeException("Không tìm thấy sản phẩm với ID: " + chiTietDTO.getChiTietSanPhamId());
                }
                
                System.out.println("Found product: " + chiTietSanPhamDTO.getTenSanPham() + ", Stock: " + chiTietSanPhamDTO.getSoLuong());
                
                // Check stock
                if (chiTietSanPhamDTO.getSoLuong() < chiTietDTO.getSoLuong()) {
                    throw new RuntimeException("Không đủ tồn kho cho sản phẩm với ID: " + chiTietDTO.getChiTietSanPhamId());
                }
                
                // Get entity for relationship
                ChiTietSanPham chiTietSanPhamEntity = chiTietSanPhamService.getChiTietSanPhamEntityById(chiTietDTO.getChiTietSanPhamId());
                chiTiet.setChiTietSanPham(chiTietSanPhamEntity);
                chiTiet.setSoLuong(chiTietDTO.getSoLuong());
                
                // Set required fields for POS orders
                chiTiet.setNgayThanhToan(LocalDateTime.now());
                chiTiet.setPhiVanChuyen(BigDecimal.ZERO);
                chiTiet.setTienGiamGia(BigDecimal.ZERO);
                chiTiet.setGhiChuKhachHang(orderDTO.getGhiChu());
                
                // Set default values for required fields
                // For POS orders, we'll set default values
                chiTiet.setKhachHang(savedOrder.getKhachHang()); // Same as order customer
                
                // Set default address for POS orders (ID = 1 = "Tại cửa hàng")
                // chiTiet.setDiaChi(diaChiService.getDiaChiById(1));
                
                // Set payment method based on order data
                if ("Tiền mặt".equals(orderDTO.getPhuongThucThanhToan())) {
                    // Set to cash payment method (ID = 1)
                    chiTiet.setPhuongThucThanhToan(null); // Will be handled by service
                } else if ("Chuyển khoản".equals(orderDTO.getPhuongThucThanhToan())) {
                    // Set to bank transfer payment method (ID = 2)
                    chiTiet.setPhuongThucThanhToan(null); // Will be handled by service
                }
                
                // Set voucher if provided
                if (orderDTO.getVoucherId() != null) {
                    // Get voucher entity and set it
                    // chiTiet.setVoucher(voucherService.getVoucherById(orderDTO.getVoucherId()));
                }
                
                // Set status to completed for POS orders
                // chiTiet.setTrangThai(trangThaiService.getTrangThaiById(1)); // ID 1 = Hoàn thành
                
                chiTietDonHangService.saveChiTietDonHang(chiTiet);
                System.out.println("Saved order detail for product: " + chiTietSanPhamDTO.getTenSanPham());
                
                // Update stock using service method
                chiTietSanPhamService.updateStock(chiTietDTO.getChiTietSanPhamId(), -chiTietDTO.getSoLuong());
                System.out.println("Updated stock for product: " + chiTietSanPhamDTO.getTenSanPham());
            }

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Tạo đơn hàng thành công");
            response.put("donHangId", savedOrder.getId());
            response.put("maDonHang", savedOrder.getMaDonHang());
            
            System.out.println("Order created successfully: " + savedOrder.getMaDonHang());
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            System.err.println("Error creating order: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi khi tạo đơn hàng: " + e.getMessage()));
        }
    }

    @GetMapping("/test-images")
    public ResponseEntity<?> testImages() {
        try {
            List<HinhAnhSanPham> allImages = hinhAnhSanPhamRepository.findAll();
            List<Map<String, Object>> result = allImages.stream()
                .map(img -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", img.getId());
                    map.put("url", img.getUrl());
                    map.put("isThumbnail", img.getIsThumbnail());
                    map.put("sanPhamId", img.getSanPham() != null ? img.getSanPham().getId() : null);
                    map.put("sanPhamName", img.getSanPham() != null ? img.getSanPham().getTenSanPham() : null);
                    map.put("chiTietSanPhamId", img.getChiTietSanPham() != null ? img.getChiTietSanPham().getId() : null);
                    return map;
                })
                .collect(Collectors.toList());
            
            return ResponseEntity.ok(Map.of(
                "totalImages", allImages.size(),
                "images", result
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", e.getMessage()));
        }
    }
}
