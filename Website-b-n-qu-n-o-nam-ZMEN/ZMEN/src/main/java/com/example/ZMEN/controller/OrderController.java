package com.example.ZMEN.controller;

import com.example.ZMEN.entity.DonHang;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.entity.TrangThaiDonHang;
import com.example.ZMEN.repository.DonHangRepository;
import com.example.ZMEN.repository.TrangThaiDonHangRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.ArrayList;
import java.time.Instant;

@RestController
@RequestMapping("/api/customer-orders")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class OrderController {

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private TrangThaiDonHangRepository trangThaiDonHangRepository;

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok(Map.of("message", "Orders API is working"));
    }

    // Lấy tất cả đơn hàng của khách hàng
    @GetMapping
    public ResponseEntity<?> getCustomerOrders(HttpServletRequest request, HttpSession session) {
        try {
            System.out.println("Debug - getCustomerOrders called");
            System.out.println("Debug - Session ID: " + session.getId());
            
            // Lấy thông tin khách hàng từ session
            Object userObj = session.getAttribute("user");
            System.out.println("Debug - User object from session: " + userObj);
            
            // Thử lấy từ header nếu session không có
            String userIdHeader = request.getHeader("X-User-ID");
            System.out.println("Debug - User ID from header: " + userIdHeader);
            
            Integer khachHangId = null;
            
            if (userObj != null && userObj instanceof KhachHang) {
                KhachHang khachHang = (KhachHang) userObj;
                khachHangId = khachHang.getId();
                System.out.println("Debug - KhachHang ID from session: " + khachHangId);
            } else if (userIdHeader != null) {
                try {
                    khachHangId = Integer.parseInt(userIdHeader);
                    System.out.println("Debug - KhachHang ID from header: " + khachHangId);
                } catch (NumberFormatException e) {
                    System.out.println("Debug - Invalid user ID in header: " + userIdHeader);
                }
            }
            
            if (khachHangId == null) {
                System.out.println("Debug - No valid user found");
                return ResponseEntity.status(401).body(Map.of("error", "Vui lòng đăng nhập"));
            }
            
            List<DonHang> orders = donHangRepository.findByKhachHangId(khachHangId);
            System.out.println("Debug - Found orders count: " + orders.size());

            // Convert to simple Map structure to avoid circular reference
            List<Map<String, Object>> orderMaps = new ArrayList<>();
            for (DonHang order : orders) {
                Map<String, Object> orderMap = new HashMap<>();
                orderMap.put("id", order.getId());
                orderMap.put("maDonHang", order.getMaDonHang());
                orderMap.put("loaiDonHang", order.getLoaiDonHang());
                orderMap.put("ngayDat", order.getNgayDat());
                orderMap.put("tongTienHang", order.getTongTienHang());
                orderMap.put("tongThanhToan", order.getTongThanhToan());
                
                // Add customer info
                if (order.getKhachHang() != null) {
                    Map<String, Object> customerMap = new HashMap<>();
                    customerMap.put("id", order.getKhachHang().getId());
                    customerMap.put("maKhachHang", order.getKhachHang().getMaKhachHang());
                    customerMap.put("hoTen", order.getKhachHang().getHoTen());
                    customerMap.put("soDienThoai", order.getKhachHang().getSoDienThoai());
                    customerMap.put("email", order.getKhachHang().getEmail());
                    orderMap.put("khachHang", customerMap);
                }
                
                // Add status from ChiTietDonHang
                Map<String, Object> statusMap = new HashMap<>();
                if (order.getChiTietDonHang() != null && !order.getChiTietDonHang().isEmpty()) {
                    var firstItem = order.getChiTietDonHang().get(0);
                    if (firstItem.getTrangThai() != null) {
                        statusMap.put("id", firstItem.getTrangThai().getId());
                        statusMap.put("tenTrangThai", firstItem.getTrangThai().getTenTrangThai());
                        statusMap.put("moTa", "Trạng thái: " + firstItem.getTrangThai().getTenTrangThai());
                    } else {
                        // Default status if no status found
                        statusMap.put("id", 1);
                        statusMap.put("tenTrangThai", "Chờ xác nhận");
                        statusMap.put("moTa", "Đơn hàng đang chờ xác nhận");
                    }
                } else {
                    // Default status if no items
                    statusMap.put("id", 1);
                    statusMap.put("tenTrangThai", "Chờ xác nhận");
                    statusMap.put("moTa", "Đơn hàng đang chờ xác nhận");
                }
                orderMap.put("trangThaiDonHang", statusMap);
                
                // Add order items
                if (order.getChiTietDonHang() != null) {
                    List<Map<String, Object>> itemMaps = new ArrayList<>();
                    for (var item : order.getChiTietDonHang()) {
                        Map<String, Object> itemMap = new HashMap<>();
                        itemMap.put("id", item.getId());
                        itemMap.put("soLuong", item.getSoLuong());
                        
                        // Lấy giá từ ChiTietSanPham
                        double donGia = 0.0;
                        if (item.getChiTietSanPham() != null) {
                            donGia = item.getChiTietSanPham().getGia().doubleValue();
                        }
                        itemMap.put("donGia", donGia);
                        itemMap.put("thanhTien", donGia * item.getSoLuong());
                        
                        // Add product info
                        if (item.getChiTietSanPham() != null) {
                            Map<String, Object> productMap = new HashMap<>();
                            var sanPham = item.getChiTietSanPham().getSanPham();
                            productMap.put("id", sanPham != null ? sanPham.getId() : null);
                            productMap.put("tenSanPham", sanPham != null ? sanPham.getTenSanPham() : "Sản phẩm không xác định");
                            productMap.put("moTa", sanPham != null ? sanPham.getMoTa() : "");
                            productMap.put("gia", item.getChiTietSanPham().getGia());
                            itemMap.put("chiTietSanPham", productMap);
                        }
                        
                        itemMaps.add(itemMap);
                    }
                    orderMap.put("chiTietDonHang", itemMaps);
                }
                
                orderMaps.add(orderMap);
            }

            return ResponseEntity.ok(orderMaps);
        } catch (Exception e) {
            System.err.println("Debug - Error in getCustomerOrders: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Lấy chi tiết đơn hàng theo ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Integer id, HttpServletRequest request, HttpSession session) {
        try {
            System.out.println("Debug - getOrderById called for order: " + id);
            
            // Lấy thông tin khách hàng từ session hoặc header
            Object userObj = session.getAttribute("user");
            String userIdHeader = request.getHeader("X-User-ID");
            
            Integer khachHangId = null;
            if (userObj != null && userObj instanceof KhachHang) {
                khachHangId = ((KhachHang) userObj).getId();
            } else if (userIdHeader != null) {
                khachHangId = Integer.parseInt(userIdHeader);
            }
            
            if (khachHangId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Vui lòng đăng nhập"));
            }
            
            DonHang order = donHangRepository.findById(id).orElse(null);
            if (order == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Kiểm tra quyền sở hữu
            if (!order.getKhachHang().getId().equals(khachHangId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Không có quyền truy cập đơn hàng này"));
            }
            
            // Convert to Map structure to avoid circular reference
            Map<String, Object> orderMap = new HashMap<>();
            orderMap.put("id", order.getId());
            orderMap.put("maDonHang", order.getMaDonHang());
            orderMap.put("loaiDonHang", order.getLoaiDonHang());
            orderMap.put("ngayDat", order.getNgayDat());
            orderMap.put("tongTienHang", order.getTongTienHang());
            orderMap.put("tongThanhToan", order.getTongThanhToan());
            
            // Add customer info
            if (order.getKhachHang() != null) {
                Map<String, Object> customerMap = new HashMap<>();
                customerMap.put("id", order.getKhachHang().getId());
                customerMap.put("maKhachHang", order.getKhachHang().getMaKhachHang());
                customerMap.put("hoTen", order.getKhachHang().getHoTen());
                customerMap.put("soDienThoai", order.getKhachHang().getSoDienThoai());
                customerMap.put("email", order.getKhachHang().getEmail());
                orderMap.put("khachHang", customerMap);
            }
            
            // Add status from ChiTietDonHang
            Map<String, Object> statusMap = new HashMap<>();
            if (order.getChiTietDonHang() != null && !order.getChiTietDonHang().isEmpty()) {
                var firstItem = order.getChiTietDonHang().get(0);
                if (firstItem.getTrangThai() != null) {
                    statusMap.put("id", firstItem.getTrangThai().getId());
                    statusMap.put("tenTrangThai", firstItem.getTrangThai().getTenTrangThai());
                    statusMap.put("moTa", "Trạng thái: " + firstItem.getTrangThai().getTenTrangThai());
                } else {
                    // Default status if no status found
                    statusMap.put("id", 1);
                    statusMap.put("tenTrangThai", "Chờ xác nhận");
                    statusMap.put("moTa", "Đơn hàng đang chờ xác nhận");
                }
            } else {
                // Default status if no items
                statusMap.put("id", 1);
                statusMap.put("tenTrangThai", "Chờ xác nhận");
                statusMap.put("moTa", "Đơn hàng đang chờ xác nhận");
            }
            orderMap.put("trangThaiDonHang", statusMap);
            
            // Add order items
            if (order.getChiTietDonHang() != null) {
                List<Map<String, Object>> itemMaps = new ArrayList<>();
                for (var item : order.getChiTietDonHang()) {
                    Map<String, Object> itemMap = new HashMap<>();
                    itemMap.put("id", item.getId());
                    itemMap.put("soLuong", item.getSoLuong());
                    
                    // Lấy giá từ ChiTietSanPham
                    double donGia = 0.0;
                    if (item.getChiTietSanPham() != null) {
                        donGia = item.getChiTietSanPham().getGia().doubleValue();
                    }
                    itemMap.put("donGia", donGia);
                    itemMap.put("thanhTien", donGia * item.getSoLuong());
                    
                    // Add product info
                    if (item.getChiTietSanPham() != null) {
                        Map<String, Object> productMap = new HashMap<>();
                        var sanPham = item.getChiTietSanPham().getSanPham();
                        productMap.put("id", sanPham != null ? sanPham.getId() : null);
                        productMap.put("tenSanPham", sanPham != null ? sanPham.getTenSanPham() : "Sản phẩm không xác định");
                        productMap.put("moTa", sanPham != null ? sanPham.getMoTa() : "");
                        productMap.put("gia", item.getChiTietSanPham().getGia());
                        itemMap.put("chiTietSanPham", productMap);
                    }
                    
                    itemMaps.add(itemMap);
                }
                orderMap.put("chiTietDonHang", itemMaps);
            }
            
            return ResponseEntity.ok(orderMap);
        } catch (Exception e) {
            System.err.println("Debug - Error in getOrderById: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Hủy đơn hàng
    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Integer id, HttpServletRequest request, HttpSession session) {
        try {
            System.out.println("Debug - cancelOrder called for order: " + id);
            
            // Lấy thông tin khách hàng từ session hoặc header
            Object userObj = session.getAttribute("user");
            String userIdHeader = request.getHeader("X-User-ID");
            
            Integer khachHangId = null;
            if (userObj != null && userObj instanceof KhachHang) {
                khachHangId = ((KhachHang) userObj).getId();
            } else if (userIdHeader != null) {
                khachHangId = Integer.parseInt(userIdHeader);
            }
            
            if (khachHangId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Vui lòng đăng nhập"));
            }
            
            DonHang order = donHangRepository.findById(id).orElse(null);
            if (order == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Kiểm tra quyền sở hữu
            if (!order.getKhachHang().getId().equals(khachHangId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Không có quyền hủy đơn hàng này"));
            }
            
            // Lấy trạng thái "Đã hủy" (ID = 5 theo database)
            TrangThaiDonHang trangThaiHuy = trangThaiDonHangRepository.findById(5).orElse(null);
            if (trangThaiHuy == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy trạng thái hủy"));
            }
            
            // Cập nhật trạng thái đơn hàng trong database
            // Không cần set vào entity vì trạng thái được lưu trong ChiTietDonHang
            // Chỉ cần trả về thông báo thành công
            
            return ResponseEntity.ok(Map.of(
                "message", "Hủy đơn hàng thành công",
                "orderId", id,
                "newStatus", trangThaiHuy.getTenTrangThai()
            ));
            
        } catch (Exception e) {
            System.err.println("Debug - Error in cancelOrder: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    // Xác nhận đã nhận hàng
    @PutMapping("/{id}/confirm-received")
    public ResponseEntity<?> confirmReceived(@PathVariable Integer id, HttpServletRequest request, HttpSession session) {
        try {
            System.out.println("Debug - confirmReceived called for order: " + id);
            
            // Lấy thông tin khách hàng từ session hoặc header
            Object userObj = session.getAttribute("user");
            String userIdHeader = request.getHeader("X-User-ID");
            
            Integer khachHangId = null;
            if (userObj != null && userObj instanceof KhachHang) {
                khachHangId = ((KhachHang) userObj).getId();
            } else if (userIdHeader != null) {
                khachHangId = Integer.parseInt(userIdHeader);
            }
            
            if (khachHangId == null) {
                return ResponseEntity.status(401).body(Map.of("error", "Vui lòng đăng nhập"));
            }
            
            DonHang order = donHangRepository.findById(id).orElse(null);
            if (order == null) {
                return ResponseEntity.notFound().build();
            }
            
            // Kiểm tra quyền sở hữu
            if (!order.getKhachHang().getId().equals(khachHangId)) {
                return ResponseEntity.status(403).body(Map.of("error", "Không có quyền xác nhận đơn hàng này"));
            }
            
            // Lấy trạng thái "Hoàn thành" (ID = 6 theo database)
            TrangThaiDonHang trangThaiHoanThanh = trangThaiDonHangRepository.findById(6).orElse(null);
            if (trangThaiHoanThanh == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Không tìm thấy trạng thái hoàn thành"));
            }
            
            // Cập nhật trạng thái đơn hàng trong database
            // Không cần set vào entity vì trạng thái được lưu trong ChiTietDonHang
            // Chỉ cần trả về thông báo thành công
            
            return ResponseEntity.ok(Map.of(
                "message", "Xác nhận đã nhận hàng thành công",
                "orderId", id,
                "newStatus", trangThaiHoanThanh.getTenTrangThai()
            ));
            
        } catch (Exception e) {
            System.err.println("Debug - Error in confirmReceived: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
