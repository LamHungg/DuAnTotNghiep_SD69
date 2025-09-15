package com.example.ZMEN.controller;

import com.example.ZMEN.dto.CartItemDTO;
import com.example.ZMEN.dto.request.AddToCartRequestDTO;
import com.example.ZMEN.entity.ChiTietSanPham;
import com.example.ZMEN.entity.GioHang;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.entity.ChiTietGioHang;
import com.example.ZMEN.repository.ChiTietSanPhamRepository;
import com.example.ZMEN.repository.GioHangRepository;
import com.example.ZMEN.repository.ChiTietGioHangRepository;
import com.example.ZMEN.repository.KhachHangRepository;
import com.example.ZMEN.service.GioHangService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Optional;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowCredentials = "true")
public class GioHangContro {
    @Autowired
    private GioHangService gioHangService;
    
    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    @Autowired
    private GioHangRepository gioHangRepository;

    @Autowired
    private ChiTietGioHangRepository chiTietGioHangRepository;

    // Helper method để lấy user từ session
    private KhachHang getUserFromSession(HttpServletRequest request) {
        try {
            System.out.println("Debug - Session ID: " + request.getSession().getId());
            System.out.println("Debug - Session attributes: " + request.getSession().getAttributeNames());
            
            // Lấy user từ session (customer authentication)
            Object userObj = request.getSession().getAttribute("user");
            System.out.println("Debug - User object from session: " + userObj);
            
            if (userObj instanceof KhachHang) {
                KhachHang kh = (KhachHang) userObj;
                System.out.println("Debug - Found user in session: " + kh.getId() + " - " + kh.getHoTen());
                return kh;
            }
            
            // Fallback: thử lấy từ JWT token nếu có
            String authHeader = request.getHeader("Authorization");
            System.out.println("Debug - Authorization header: " + authHeader);
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                // Token format: "customer-token-{id}"
                if (token.startsWith("customer-token-")) {
                    try {
                        Integer userId = Integer.parseInt(token.substring(15));
                        KhachHang kh = khachHangRepository.findById(userId).orElse(null);
                        System.out.println("Debug - Found user from token: " + (kh != null ? kh.getId() : "null"));
                        return kh;
                    } catch (NumberFormatException e) {
                        System.err.println("Debug - Invalid token format: " + token);
                        return null;
                    }
                }
            }
            
            System.out.println("Debug - No user found in session or token");
            return null;
        } catch (Exception e) {
            System.err.println("Lỗi khi lấy user từ session: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    // Test endpoint
    @GetMapping("/test")
    public ResponseEntity<?> testEndpoint() {
        return ResponseEntity.ok("Cart API hoạt động bình thường!");
    }

    // Test endpoint không cần authentication
    @GetMapping("/test-no-auth")
    public ResponseEntity<?> testNoAuthEndpoint() {
        return ResponseEntity.ok("Cart API không cần auth hoạt động bình thường!");
    }

    // Thêm sản phẩm vào giỏ hàng
    @PostMapping("/add")
    public ResponseEntity<?> themVaoGioHang(@RequestBody AddToCartRequestDTO request, HttpServletRequest httpRequest) {
        try {
            System.out.println("Debug - Thêm vào giỏ hàng với request: " + request);
            
            KhachHang khachHang = getUserFromSession(httpRequest);
            if (khachHang == null) {
                return ResponseEntity.status(401).body("Vui lòng đăng nhập để thêm vào giỏ hàng");
            }

            System.out.println("Debug - Khách hàng: " + khachHang.getId() + " - " + khachHang.getHoTen());
            gioHangService.addItemToCart(khachHang.getId(), request);
            return ResponseEntity.ok("Thêm sản phẩm vào giỏ hàng thành công!");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi không mong muốn: " + e.getMessage());
        }
    }

    // Lấy danh sách sản phẩm trong giỏ hàng
    @GetMapping
    public ResponseEntity<?> layGioHang(HttpServletRequest request) {
        try {
            KhachHang khachHang = getUserFromSession(request);
            if (khachHang == null) {
                return ResponseEntity.status(401).body("Vui lòng đăng nhập để xem giỏ hàng");
            }

            List<CartItemDTO> cartItems = gioHangService.getCartItems(khachHang.getId());
            return ResponseEntity.ok(cartItems);
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi không mong muốn: " + e.getMessage());
        }
    }

    // Cập nhật số lượng sản phẩm
    @PutMapping("/{cartItemId}")
    public ResponseEntity<?> capNhatSoLuong(@PathVariable Integer cartItemId, 
                                           @RequestBody AddToCartRequestDTO request,
                                           HttpServletRequest httpRequest) {
        try {
            KhachHang khachHang = getUserFromSession(httpRequest);
            if (khachHang == null) {
                return ResponseEntity.status(401).body("Vui lòng đăng nhập để cập nhật giỏ hàng");
            }

            gioHangService.updateCartItemQuantity(khachHang.getId(), cartItemId, request.getSoLuong());
            return ResponseEntity.ok("Cập nhật số lượng thành công!");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi không mong muốn: " + e.getMessage());
        }
    }

    // Xóa sản phẩm khỏi giỏ hàng
    @DeleteMapping("/{cartItemId}")
    public ResponseEntity<?> xoaKhoiGioHang(@PathVariable Integer cartItemId, HttpServletRequest request) {
        try {
            KhachHang khachHang = getUserFromSession(request);
            if (khachHang == null) {
                return ResponseEntity.status(401).body("Vui lòng đăng nhập để xóa sản phẩm");
            }

            gioHangService.removeFromCart(khachHang.getId(), cartItemId);
            return ResponseEntity.ok("Xóa sản phẩm khỏi giỏ hàng thành công!");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi không mong muốn: " + e.getMessage());
        }
    }

    // Xóa tất cả sản phẩm trong giỏ hàng
    @DeleteMapping("/clear")
    public ResponseEntity<?> xoaGioHang(HttpServletRequest request) {
        try {
            KhachHang khachHang = getUserFromSession(request);
            if (khachHang == null) {
                return ResponseEntity.status(401).body("Vui lòng đăng nhập để xóa giỏ hàng");
            }

            gioHangService.clearCart(khachHang.getId());
            return ResponseEntity.ok("Xóa giỏ hàng thành công!");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Đã xảy ra lỗi không mong muốn: " + e.getMessage());
        }
    }

    // Lấy số lượng sản phẩm trong giỏ hàng
    @GetMapping("/count")
    public ResponseEntity<?> laySoLuongGioHang(HttpServletRequest request) {
        try {
            KhachHang khachHang = getUserFromSession(request);
            if (khachHang == null) {
                return ResponseEntity.status(401).body("Vui lòng đăng nhập để xem số lượng giỏ hàng");
            }

            Integer count = gioHangService.getCartItemCount(khachHang.getId());
            return ResponseEntity.ok(count);
        } catch (Exception e) {
            return ResponseEntity.ok(0); // Trả về 0 nếu có lỗi
        }
    }

    // Kiểm tra số lượng tồn kho real-time
    @GetMapping("/check-stock/{chiTietSanPhamId}")
    public ResponseEntity<Map<String, Object>> checkStock(@PathVariable Integer chiTietSanPhamId, HttpServletRequest httpRequest) {
        try {
            KhachHang user = getUserFromSession(httpRequest);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Vui lòng đăng nhập"));
            }

            // Tìm chi tiết sản phẩm
            ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(chiTietSanPhamId)
                .orElse(null);

            if (chiTietSanPham == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Không tìm thấy sản phẩm"));
            }

            // Kiểm tra trạng thái sản phẩm
            if (chiTietSanPham.getTrangThai() != null && chiTietSanPham.getTrangThai() != 1) {
                return ResponseEntity.ok(Map.of(
                    "available", false,
                    "message", "Sản phẩm đã ngừng bán",
                    "stock", 0
                ));
            }

            // Kiểm tra số lượng trong giỏ hàng của user
            GioHang gioHang = gioHangRepository.findByIdKhachHang_Id(user.getId()).orElse(null);
            int soLuongTrongGio = 0;
            
            if (gioHang != null) {
                Optional<ChiTietGioHang> cartItem = chiTietGioHangRepository
                    .findByIdGioHang_IdAndIdChiTietSanPham_Id(gioHang.getId(), chiTietSanPhamId);
                if (cartItem.isPresent()) {
                    soLuongTrongGio = cartItem.get().getSoLuong();
                }
            }

            // Tính số lượng có thể mua thêm
            int soLuongCoTheMua = chiTietSanPham.getSoLuong() - soLuongTrongGio;
            boolean available = soLuongCoTheMua > 0;

            Map<String, Object> response = new HashMap<>();
            response.put("available", available);
            response.put("stock", chiTietSanPham.getSoLuong());
            response.put("inCart", soLuongTrongGio);
            response.put("canAdd", soLuongCoTheMua);
            response.put("productName", chiTietSanPham.getSanPham().getTenSanPham());
            
            if (!available) {
                response.put("message", "Sản phẩm đã hết hàng hoặc đã có đủ trong giỏ");
            } else {
                response.put("message", "Có thể thêm vào giỏ hàng");
            }

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Lỗi check stock: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Lỗi kiểm tra tồn kho: " + e.getMessage()));
        }
    }

    // Kiểm tra tồn kho cho nhiều sản phẩm
    @PostMapping("/check-stock-batch")
    public ResponseEntity<Map<String, Object>> checkStockBatch(@RequestBody List<Integer> chiTietSanPhamIds, HttpServletRequest httpRequest) {
        try {
            KhachHang user = getUserFromSession(httpRequest);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Vui lòng đăng nhập"));
            }

            Map<String, Object> response = new HashMap<>();
            List<Map<String, Object>> stockInfo = new ArrayList<>();

            // Lấy giỏ hàng của user
            GioHang gioHang = gioHangRepository.findByIdKhachHang_Id(user.getId()).orElse(null);
            Map<Integer, Integer> cartQuantities = new HashMap<>();
            
            if (gioHang != null) {
                List<ChiTietGioHang> cartItems = chiTietGioHangRepository.findByIdGioHang_Id(gioHang.getId());
                for (ChiTietGioHang item : cartItems) {
                    cartQuantities.put(item.getIdChiTietSanPham().getId(), item.getSoLuong());
                }
            }

            for (Integer chiTietSanPhamId : chiTietSanPhamIds) {
                ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(chiTietSanPhamId).orElse(null);
                
                Map<String, Object> itemInfo = new HashMap<>();
                itemInfo.put("chiTietSanPhamId", chiTietSanPhamId);
                
                if (chiTietSanPham == null) {
                    itemInfo.put("available", false);
                    itemInfo.put("message", "Không tìm thấy sản phẩm");
                    itemInfo.put("stock", 0);
                } else {
                    int soLuongTrongGio = cartQuantities.getOrDefault(chiTietSanPhamId, 0);
                    int soLuongCoTheMua = chiTietSanPham.getSoLuong() - soLuongTrongGio;
                    boolean available = soLuongCoTheMua > 0 && 
                        (chiTietSanPham.getTrangThai() == null || chiTietSanPham.getTrangThai() == 1);

                    itemInfo.put("available", available);
                    itemInfo.put("stock", chiTietSanPham.getSoLuong());
                    itemInfo.put("inCart", soLuongTrongGio);
                    itemInfo.put("canAdd", soLuongCoTheMua);
                    itemInfo.put("productName", chiTietSanPham.getSanPham().getTenSanPham());
                    
                    if (!available) {
                        if (chiTietSanPham.getTrangThai() != null && chiTietSanPham.getTrangThai() != 1) {
                            itemInfo.put("message", "Sản phẩm đã ngừng bán");
                        } else {
                            itemInfo.put("message", "Sản phẩm đã hết hàng hoặc đã có đủ trong giỏ");
                        }
                    } else {
                        itemInfo.put("message", "Có thể thêm vào giỏ hàng");
                    }
                }
                
                stockInfo.add(itemInfo);
            }

            response.put("stockInfo", stockInfo);
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("Lỗi check stock batch: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Lỗi kiểm tra tồn kho: " + e.getMessage()));
        }
    }
}
