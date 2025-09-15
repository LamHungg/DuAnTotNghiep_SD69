package com.example.ZMEN.controller;

import com.example.ZMEN.dto.DiaChiDto;
import com.example.ZMEN.entity.DiaChiKhachHang;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.repository.DiaChiKhachHangRepository;
import com.example.ZMEN.repository.KhachHangRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/addresses")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:3002"}, allowCredentials = "true")
public class DiaChiController {

    @Autowired
    private DiaChiKhachHangRepository diaChiRepository;

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
        return ResponseEntity.ok("API địa chỉ hoạt động bình thường!");
    }

    // Test endpoint đặt địa chỉ mặc định đơn giản
    @PostMapping("/test-set-default/{id}")
    public ResponseEntity<?> testSetDefault(@PathVariable Integer id) {
        try {
            System.out.println("Debug - Test set default for address ID: " + id);
            
            // Tìm địa chỉ
            DiaChiKhachHang address = diaChiRepository.findById(id).orElse(null);
            if (address == null) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Không tìm thấy địa chỉ với ID: " + id));
            }
            
            System.out.println("Debug - Found address: " + address);
            System.out.println("Debug - Customer ID: " + address.getKhachHangId());
            
            // Reset tất cả địa chỉ của khách hàng này
            diaChiRepository.resetMacDinhByKhachHangId(address.getKhachHangId());
            System.out.println("Debug - Reset completed");
            
            // Đặt địa chỉ này làm mặc định
            diaChiRepository.setMacDinhById(id);
            System.out.println("Debug - Set default completed");
            
            return ResponseEntity.ok().body(new ErrorResponse("Test đặt địa chỉ mặc định thành công cho ID: " + id));
        } catch (Exception e) {
            System.err.println("Debug - Error in test set default: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi test: " + e.getMessage()));
        }
    }

    // Test endpoint đơn giản nhất
    @GetMapping("/test-simple")
    public ResponseEntity<?> testSimple() {
        return ResponseEntity.ok("Backend đang chạy!");
    }

    // Test endpoint kiểm tra địa chỉ ID 17
    @GetMapping("/test-address-17")
    public ResponseEntity<?> testAddress17() {
        try {
            DiaChiKhachHang address = diaChiRepository.findById(17).orElse(null);
            if (address == null) {
                return ResponseEntity.ok("Không tìm thấy địa chỉ ID 17");
            } else {
                return ResponseEntity.ok("Tìm thấy địa chỉ ID 17: " + address.getHoTen() + " - " + address.getDiaChiChiTiet());
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi: " + e.getMessage()));
        }
    }

    // Test endpoint đơn giản để kiểm tra database
    @GetMapping("/test-db")
    public ResponseEntity<?> testDatabase() {
        try {
            long count = diaChiRepository.count();
            return ResponseEntity.ok("Database hoạt động bình thường! Số địa chỉ: " + count);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi database: " + e.getMessage()));
        }
    }

    // Test endpoint lấy danh sách địa chỉ không yêu cầu authentication
    @GetMapping("/test-list")
    public ResponseEntity<?> testGetAddresses() {
        try {
            // Debug: Log bắt đầu
            System.out.println("Debug - Bắt đầu testGetAddresses");
            
            // Debug: Kiểm tra repository
            System.out.println("Debug - Repository: " + (diaChiRepository != null ? "OK" : "NULL"));
            
            // Debug: Thử count trước
            try {
                long count = diaChiRepository.count();
                System.out.println("Debug - Count: " + count);
            } catch (Exception countEx) {
                System.err.println("Debug - Count error: " + countEx.getMessage());
                countEx.printStackTrace();
                return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi count: " + countEx.getMessage()));
            }
            
            // Debug: Thử findAll
            List<DiaChiKhachHang> addresses;
            try {
                addresses = diaChiRepository.findAll();
                System.out.println("Debug - FindAll OK, size: " + addresses.size());
            } catch (Exception findAllEx) {
                System.err.println("Debug - FindAll error: " + findAllEx.getMessage());
                findAllEx.printStackTrace();
                return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi findAll: " + findAllEx.getMessage()));
            }
            
            // Debug: Thử convert to DTO
            List<DiaChiDto> addressDtos;
            try {
                addressDtos = addresses.stream()
                    .map(this::convertToDto)
                    .collect(Collectors.toList());
                System.out.println("Debug - Convert to DTO OK, size: " + addressDtos.size());
            } catch (Exception convertEx) {
                System.err.println("Debug - Convert error: " + convertEx.getMessage());
                convertEx.printStackTrace();
                return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi convert: " + convertEx.getMessage()));
            }
            
            System.out.println("Debug - Trả về response OK");
            return ResponseEntity.ok(addressDtos);
        } catch (Exception e) {
            System.err.println("Debug - General error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Test endpoint thêm địa chỉ không yêu cầu authentication
    @PostMapping("/test-add")
    public ResponseEntity<?> testAddAddress(@RequestBody DiaChiDto addressDto) {
        try {
            // Debug: Log bắt đầu
            System.out.println("Debug - Bắt đầu testAddAddress");
            System.out.println("Debug - Address DTO: " + addressDto);
            
            // Tìm khách hàng đầu tiên để test
            List<KhachHang> khachHangs = khachHangRepository.findAll();
            if (khachHangs.isEmpty()) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Không có khách hàng nào trong hệ thống"));
            }

            KhachHang khachHang = khachHangs.get(0);
            
            // Debug: Log thông tin
            System.out.println("Debug - Khách hàng ID: " + khachHang.getId());
            
            // Test 1: Tạo entity với dữ liệu cố định
            DiaChiKhachHang newAddress1 = new DiaChiKhachHang();
            newAddress1.setKhachHangId(khachHang.getId());
            newAddress1.setHoTen("Test User Fixed");
            newAddress1.setSoDienThoai("0123456789");
            newAddress1.setTinhThanh("Hà Nội");
            newAddress1.setQuanHuyen("Cầu Giấy");
            newAddress1.setPhuongXa("Dịch Vọng");
            newAddress1.setDiaChiChiTiet("123 Đường Test");
            newAddress1.setLoaiDiaChi("Nhà riêng");
            newAddress1.setMacDinh(false);
            newAddress1.setNgayTao(LocalDateTime.now());
            newAddress1.setNgayCapNhat(LocalDateTime.now());

            // Debug: Log entity trước khi save
            System.out.println("Debug - Entity 1 trước save: " + newAddress1);
            
            DiaChiKhachHang savedAddress1;
            try {
                savedAddress1 = diaChiRepository.save(newAddress1);
                System.out.println("Debug - Save 1 OK: " + savedAddress1);
                
                // Xóa ngay để test
                diaChiRepository.delete(savedAddress1);
                System.out.println("Debug - Delete 1 OK");
            } catch (Exception saveEx) {
                System.err.println("Debug - Save 1 error: " + saveEx.getMessage());
                saveEx.printStackTrace();
                return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi lưu địa chỉ 1: " + saveEx.getMessage()));
            }
            
            // Test 2: Tạo entity với dữ liệu từ DTO
            DiaChiKhachHang newAddress2 = new DiaChiKhachHang();
            newAddress2.setKhachHangId(khachHang.getId());
            newAddress2.setHoTen(addressDto.getHoTen() != null ? addressDto.getHoTen() : "Test User DTO");
            newAddress2.setSoDienThoai(addressDto.getSoDienThoai() != null ? addressDto.getSoDienThoai() : "0123456789");
            newAddress2.setTinhThanh(addressDto.getTinhThanh() != null ? addressDto.getTinhThanh() : "Hà Nội");
            newAddress2.setQuanHuyen(addressDto.getQuanHuyen() != null ? addressDto.getQuanHuyen() : "Cầu Giấy");
            newAddress2.setPhuongXa(addressDto.getPhuongXa() != null ? addressDto.getPhuongXa() : "Dịch Vọng");
            newAddress2.setDiaChiChiTiet(addressDto.getDiaChiChiTiet() != null ? addressDto.getDiaChiChiTiet() : "123 Đường ABC");
            newAddress2.setLoaiDiaChi(addressDto.getLoaiDiaChi() != null ? addressDto.getLoaiDiaChi() : "Nhà riêng");
            newAddress2.setMacDinh(addressDto.getMacDinh() != null ? addressDto.getMacDinh() : false);
            newAddress2.setNgayTao(LocalDateTime.now());
            newAddress2.setNgayCapNhat(LocalDateTime.now());

            // Debug: Log entity trước khi save
            System.out.println("Debug - Entity 2 trước save: " + newAddress2);
            
            DiaChiKhachHang savedAddress2;
            try {
                savedAddress2 = diaChiRepository.save(newAddress2);
                System.out.println("Debug - Save 2 OK: " + savedAddress2);
            } catch (Exception saveEx) {
                System.err.println("Debug - Save 2 error: " + saveEx.getMessage());
                saveEx.printStackTrace();
                return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi lưu địa chỉ 2: " + saveEx.getMessage()));
            }
            
            DiaChiDto resultDto;
            try {
                resultDto = convertToDto(savedAddress2);
                System.out.println("Debug - Convert to DTO OK: " + resultDto);
            } catch (Exception convertEx) {
                System.err.println("Debug - Convert error: " + convertEx.getMessage());
                convertEx.printStackTrace();
                return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi chuyển đổi DTO: " + convertEx.getMessage()));
            }
            
            System.out.println("Debug - Trả về response OK");
            return ResponseEntity.ok(resultDto);
        } catch (Exception e) {
            // Debug: Log lỗi chi tiết
            System.err.println("Debug - General error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Test endpoint cập nhật địa chỉ không yêu cầu authentication
    @PutMapping("/test-add")
    public ResponseEntity<?> testUpdateAddress(@RequestBody DiaChiDto addressDto) {
        try {
            // Nếu có ID, tìm và cập nhật địa chỉ đó
            if (addressDto.getId() != null) {
                DiaChiKhachHang existingAddress = diaChiRepository.findById(addressDto.getId()).orElse(null);
                if (existingAddress != null) {
                    existingAddress.setHoTen(addressDto.getHoTen() != null ? addressDto.getHoTen() : existingAddress.getHoTen());
                    existingAddress.setSoDienThoai(addressDto.getSoDienThoai() != null ? addressDto.getSoDienThoai() : existingAddress.getSoDienThoai());
                    existingAddress.setTinhThanh(addressDto.getTinhThanh() != null ? addressDto.getTinhThanh() : existingAddress.getTinhThanh());
                    existingAddress.setQuanHuyen(addressDto.getQuanHuyen() != null ? addressDto.getQuanHuyen() : existingAddress.getQuanHuyen());
                    existingAddress.setPhuongXa(addressDto.getPhuongXa() != null ? addressDto.getPhuongXa() : existingAddress.getPhuongXa());
                    existingAddress.setDiaChiChiTiet(addressDto.getDiaChiChiTiet() != null ? addressDto.getDiaChiChiTiet() : existingAddress.getDiaChiChiTiet());
                    existingAddress.setLoaiDiaChi(addressDto.getLoaiDiaChi() != null ? addressDto.getLoaiDiaChi() : existingAddress.getLoaiDiaChi());
                    existingAddress.setMacDinh(addressDto.getMacDinh() != null ? addressDto.getMacDinh() : existingAddress.getMacDinh());
                    existingAddress.setNgayCapNhat(LocalDateTime.now());
                    
                    DiaChiKhachHang updatedAddress = diaChiRepository.save(existingAddress);
                    return ResponseEntity.ok(convertToDto(updatedAddress));
                }
            }
            
            // Nếu không có ID hoặc không tìm thấy, tạo mới
            return testAddAddress(addressDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Debug endpoint để kiểm tra JWT token và user
    @GetMapping("/debug")
    public ResponseEntity<?> debugEndpoint(HttpServletRequest request) {
        try {
            Map<String, Object> debugInfo = new HashMap<>();
            
            // Kiểm tra Authorization header
            String authHeader = request.getHeader("Authorization");
            debugInfo.put("hasAuthHeader", authHeader != null);
            debugInfo.put("authHeader", authHeader);
            
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                debugInfo.put("token", token);
                
                if (token.startsWith("customer-token-")) {
                    try {
                        Integer userId = Integer.parseInt(token.substring(15));
                        debugInfo.put("parsedUserId", userId);
                        
                        KhachHang khachHang = khachHangRepository.findById(userId).orElse(null);
                        debugInfo.put("userFound", khachHang != null);
                        if (khachHang != null) {
                            debugInfo.put("userName", khachHang.getHoTen());
                            debugInfo.put("userEmail", khachHang.getEmail());
                        }
                    } catch (NumberFormatException e) {
                        debugInfo.put("parseError", e.getMessage());
                    }
                }
            }
            
            // Kiểm tra database connection
            try {
                long count = diaChiRepository.count();
                debugInfo.put("totalAddresses", count);
                debugInfo.put("databaseOk", true);
            } catch (Exception e) {
                debugInfo.put("databaseError", e.getMessage());
                debugInfo.put("databaseOk", false);
            }
            
            return ResponseEntity.ok(debugInfo);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Debug error: " + e.getMessage()));
        }
    }

    // Lấy tất cả địa chỉ của khách hàng (với session hoặc JWT authentication)
    @GetMapping
    public ResponseEntity<?> getAddresses(HttpServletRequest request, HttpSession session) {
        try {
            // Thử lấy từ session trước
            Object userObj = session.getAttribute("user");
            String userIdHeader = request.getHeader("X-User-ID");
            
            KhachHang khachHang = null;
            
            if (userObj != null && userObj instanceof KhachHang) {
                khachHang = (KhachHang) userObj;
            } else if (userIdHeader != null) {
                try {
                    Integer userId = Integer.parseInt(userIdHeader);
                    khachHang = khachHangRepository.findById(userId).orElse(null);
                } catch (NumberFormatException e) {
                    // Ignore parsing error
                }
            }
            
            // Nếu không có từ session, thử JWT
            if (khachHang == null) {
                khachHang = getUserFromToken(request);
            }
            
            if (khachHang == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("Vui lòng đăng nhập"));
            }

            List<DiaChiKhachHang> addresses = diaChiRepository.findByKhachHangIdOrderByMacDinhDescNgayTaoDesc(khachHang.getId());
            
            List<DiaChiDto> addressDtos = addresses.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

            return ResponseEntity.ok(addressDtos);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Thêm địa chỉ mới (với session hoặc JWT authentication)
    @PostMapping
    public ResponseEntity<?> addAddress(@RequestBody DiaChiDto addressDto, HttpServletRequest request, HttpSession session) {
        try {
            // Debug: Log bắt đầu
            System.out.println("Debug - Bắt đầu addAddress (main endpoint)");
            System.out.println("Debug - Address DTO: " + addressDto);
            
            // Thử lấy từ session trước
            Object userObj = session.getAttribute("user");
            String userIdHeader = request.getHeader("X-User-ID");
            
            KhachHang khachHang = null;
            
            if (userObj != null && userObj instanceof KhachHang) {
                khachHang = (KhachHang) userObj;
            } else if (userIdHeader != null) {
                try {
                    Integer userId = Integer.parseInt(userIdHeader);
                    khachHang = khachHangRepository.findById(userId).orElse(null);
                } catch (NumberFormatException e) {
                    // Ignore parsing error
                }
            }
            
            // Nếu không có từ session, thử JWT
            if (khachHang == null) {
                khachHang = getUserFromToken(request);
            }
            
            if (khachHang == null) {
                System.err.println("Debug - Không tìm thấy user");
                return ResponseEntity.status(401).body(new ErrorResponse("Vui lòng đăng nhập"));
            }
            
            System.out.println("Debug - Khách hàng ID: " + khachHang.getId());
            
            // Nếu địa chỉ mới là mặc định, reset tất cả địa chỉ khác
            if (addressDto.getMacDinh() != null && addressDto.getMacDinh()) {
                try {
                    diaChiRepository.resetMacDinhByKhachHangId(khachHang.getId());
                    System.out.println("Debug - Reset mac dinh OK");
                } catch (Exception resetEx) {
                    System.err.println("Debug - Reset mac dinh error: " + resetEx.getMessage());
                    // Không return error, tiếp tục thêm địa chỉ
                }
            }

            DiaChiKhachHang newAddress = new DiaChiKhachHang();
            newAddress.setKhachHangId(khachHang.getId());
            newAddress.setHoTen(addressDto.getHoTen() != null ? addressDto.getHoTen() : "Không có tên");
            newAddress.setSoDienThoai(addressDto.getSoDienThoai() != null ? addressDto.getSoDienThoai() : "0000000000");
            newAddress.setTinhThanh(addressDto.getTinhThanh() != null ? addressDto.getTinhThanh() : "Không có");
            newAddress.setQuanHuyen(addressDto.getQuanHuyen() != null ? addressDto.getQuanHuyen() : "Không có");
            newAddress.setPhuongXa(addressDto.getPhuongXa() != null ? addressDto.getPhuongXa() : "Không có");
            newAddress.setDiaChiChiTiet(addressDto.getDiaChiChiTiet() != null ? addressDto.getDiaChiChiTiet() : "Không có");
            newAddress.setLoaiDiaChi(addressDto.getLoaiDiaChi() != null ? addressDto.getLoaiDiaChi() : "Nhà riêng");
            newAddress.setMacDinh(addressDto.getMacDinh() != null ? addressDto.getMacDinh() : false);
            newAddress.setNgayTao(LocalDateTime.now());
            newAddress.setNgayCapNhat(LocalDateTime.now());

            // Debug: Log entity trước khi save
            System.out.println("Debug - Entity trước save: " + newAddress);
            
            DiaChiKhachHang savedAddress;
            try {
                savedAddress = diaChiRepository.save(newAddress);
                System.out.println("Debug - Save OK: " + savedAddress);
            } catch (Exception saveEx) {
                System.err.println("Debug - Save error: " + saveEx.getMessage());
                saveEx.printStackTrace();
                return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi lưu địa chỉ: " + saveEx.getMessage()));
            }
            
            DiaChiDto resultDto;
            try {
                resultDto = convertToDto(savedAddress);
                System.out.println("Debug - Convert to DTO OK: " + resultDto);
            } catch (Exception convertEx) {
                System.err.println("Debug - Convert error: " + convertEx.getMessage());
                convertEx.printStackTrace();
                return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi chuyển đổi DTO: " + convertEx.getMessage()));
            }
            
            System.out.println("Debug - Trả về response OK");
            return ResponseEntity.ok(resultDto);
        } catch (Exception e) {
            System.err.println("Debug - General error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Cập nhật địa chỉ (với session hoặc JWT authentication)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAddress(@PathVariable Integer id, @RequestBody DiaChiDto addressDto, HttpServletRequest request, HttpSession session) {
        try {
            // Thử lấy từ session trước
            Object userObj = session.getAttribute("user");
            String userIdHeader = request.getHeader("X-User-ID");
            
            KhachHang khachHang = null;
            
            if (userObj != null && userObj instanceof KhachHang) {
                khachHang = (KhachHang) userObj;
            } else if (userIdHeader != null) {
                try {
                    Integer userId = Integer.parseInt(userIdHeader);
                    khachHang = khachHangRepository.findById(userId).orElse(null);
                } catch (NumberFormatException e) {
                    // Ignore parsing error
                }
            }
            
            // Nếu không có từ session, thử JWT
            if (khachHang == null) {
                khachHang = getUserFromToken(request);
            }
            
            if (khachHang == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("Vui lòng đăng nhập"));
            }

            DiaChiKhachHang existingAddress = diaChiRepository.findById(id).orElse(null);
            
            if (existingAddress == null) {
                return ResponseEntity.notFound().build();
            }

            // Kiểm tra quyền sở hữu
            if (!existingAddress.getKhachHangId().equals(khachHang.getId())) {
                return ResponseEntity.status(403).body(new ErrorResponse("Không có quyền cập nhật địa chỉ này"));
            }

            // Nếu địa chỉ được đặt làm mặc định, reset tất cả địa chỉ khác
            if (addressDto.getMacDinh() != null && addressDto.getMacDinh()) {
                diaChiRepository.resetMacDinhByKhachHangId(khachHang.getId());
            }

            existingAddress.setHoTen(addressDto.getHoTen());
            existingAddress.setSoDienThoai(addressDto.getSoDienThoai());
            existingAddress.setTinhThanh(addressDto.getTinhThanh());
            existingAddress.setQuanHuyen(addressDto.getQuanHuyen());
            existingAddress.setPhuongXa(addressDto.getPhuongXa());
            existingAddress.setDiaChiChiTiet(addressDto.getDiaChiChiTiet());
            existingAddress.setLoaiDiaChi(addressDto.getLoaiDiaChi());
            existingAddress.setMacDinh(addressDto.getMacDinh() != null ? addressDto.getMacDinh() : false);
            existingAddress.setNgayCapNhat(LocalDateTime.now());

            DiaChiKhachHang updatedAddress = diaChiRepository.save(existingAddress);
            return ResponseEntity.ok(convertToDto(updatedAddress));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Xóa địa chỉ (với session hoặc JWT authentication)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAddress(@PathVariable Integer id, HttpServletRequest request, HttpSession session) {
        try {
            // Thử lấy từ session trước
            Object userObj = session.getAttribute("user");
            String userIdHeader = request.getHeader("X-User-ID");
            
            KhachHang khachHang = null;
            
            if (userObj != null && userObj instanceof KhachHang) {
                khachHang = (KhachHang) userObj;
            } else if (userIdHeader != null) {
                try {
                    Integer userId = Integer.parseInt(userIdHeader);
                    khachHang = khachHangRepository.findById(userId).orElse(null);
                } catch (NumberFormatException e) {
                    // Ignore parsing error
                }
            }
            
            // Nếu không có từ session, thử JWT
            if (khachHang == null) {
                khachHang = getUserFromToken(request);
            }
            
            if (khachHang == null) {
                return ResponseEntity.status(401).body(new ErrorResponse("Vui lòng đăng nhập"));
            }

            DiaChiKhachHang existingAddress = diaChiRepository.findById(id).orElse(null);
            
            if (existingAddress == null) {
                return ResponseEntity.notFound().build();
            }

            // Kiểm tra quyền sở hữu
            if (!existingAddress.getKhachHangId().equals(khachHang.getId())) {
                return ResponseEntity.status(403).body(new ErrorResponse("Không có quyền xóa địa chỉ này"));
            }

            diaChiRepository.delete(existingAddress);
            return ResponseEntity.ok().body(new ErrorResponse("Xóa địa chỉ thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Đặt địa chỉ làm mặc định (với session hoặc JWT authentication)
    @PostMapping("/{id}/set-default")
    public ResponseEntity<?> setDefaultAddress(@PathVariable Integer id, HttpServletRequest request, HttpSession session) {
        try {
            System.out.println("Debug - Bắt đầu setDefaultAddress cho ID: " + id);
            
            // Debug: Log headers
            String userIdHeader = request.getHeader("X-User-ID");
            String authHeader = request.getHeader("Authorization");
            System.out.println("Debug - X-User-ID header: " + userIdHeader);
            System.out.println("Debug - Authorization header: " + authHeader);
            
            // Thử lấy từ session trước
            Object userObj = session.getAttribute("user");
            System.out.println("Debug - Session user: " + userObj);
            
            KhachHang khachHang = null;
            
            if (userObj != null && userObj instanceof KhachHang) {
                khachHang = (KhachHang) userObj;
                System.out.println("Debug - Lấy user từ session: " + khachHang.getId());
            } else if (userIdHeader != null) {
                try {
                    Integer userId = Integer.parseInt(userIdHeader);
                    khachHang = khachHangRepository.findById(userId).orElse(null);
                    System.out.println("Debug - Lấy user từ X-User-ID: " + (khachHang != null ? khachHang.getId() : "null"));
                } catch (NumberFormatException e) {
                    System.out.println("Debug - Lỗi parse X-User-ID: " + e.getMessage());
                }
            }
            
            // Nếu không có từ session, thử JWT
            if (khachHang == null) {
                khachHang = getUserFromToken(request);
                System.out.println("Debug - Lấy user từ JWT: " + (khachHang != null ? khachHang.getId() : "null"));
            }
            
            if (khachHang == null) {
                System.out.println("Debug - Không tìm thấy user, trả về 401");
                return ResponseEntity.status(401).body(new ErrorResponse("Vui lòng đăng nhập"));
            }

            System.out.println("Debug - User ID: " + khachHang.getId());
            
            DiaChiKhachHang existingAddress = diaChiRepository.findById(id).orElse(null);
            System.out.println("Debug - Tìm địa chỉ: " + (existingAddress != null ? "OK" : "NOT FOUND"));
            
            if (existingAddress == null) {
                System.out.println("Debug - Địa chỉ không tồn tại, trả về 404");
                return ResponseEntity.notFound().build();
            }

            System.out.println("Debug - Địa chỉ thuộc khách hàng ID: " + existingAddress.getKhachHangId());

            // Kiểm tra quyền sở hữu
            if (!existingAddress.getKhachHangId().equals(khachHang.getId())) {
                System.out.println("Debug - Không có quyền, trả về 403");
                return ResponseEntity.status(403).body(new ErrorResponse("Không có quyền thay đổi địa chỉ này"));
            }

            System.out.println("Debug - Bắt đầu reset và set default");
            
            // Reset tất cả địa chỉ về không mặc định
            diaChiRepository.resetMacDinhByKhachHangId(khachHang.getId());
            System.out.println("Debug - Reset completed");
            
            // Đặt địa chỉ này làm mặc định
            diaChiRepository.setMacDinhById(id);
            System.out.println("Debug - Set default completed");

            System.out.println("Debug - Thành công, trả về 200");
            return ResponseEntity.ok().body(new ErrorResponse("Đặt địa chỉ mặc định thành công"));
        } catch (Exception e) {
            System.err.println("Debug - Exception: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse("Có lỗi xảy ra: " + e.getMessage()));
        }
    }

    // Endpoint đơn giản để test ngay
    @PostMapping("/{id}/set-default-simple")
    @Transactional
    public ResponseEntity<?> setDefaultAddressSimple(@PathVariable Integer id) {
        try {
            System.out.println("Debug - setDefaultAddressSimple cho ID: " + id);
            
            // Tìm địa chỉ
            DiaChiKhachHang address = diaChiRepository.findById(id).orElse(null);
            if (address == null) {
                return ResponseEntity.badRequest().body(new ErrorResponse("Không tìm thấy địa chỉ với ID: " + id));
            }
            
            System.out.println("Debug - Found address: " + address);
            System.out.println("Debug - Customer ID: " + address.getKhachHangId());
            
            // Reset tất cả địa chỉ của khách hàng này
            try {
                diaChiRepository.resetMacDinhByKhachHangId(address.getKhachHangId());
                System.out.println("Debug - Reset completed");
            } catch (Exception resetEx) {
                System.err.println("Debug - Reset error: " + resetEx.getMessage());
                resetEx.printStackTrace();
                return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi reset: " + resetEx.getMessage()));
            }
            
            // Đặt địa chỉ này làm mặc định
            try {
                diaChiRepository.setMacDinhById(id);
                System.out.println("Debug - Set default completed");
            } catch (Exception setEx) {
                System.err.println("Debug - Set default error: " + setEx.getMessage());
                setEx.printStackTrace();
                return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi set default: " + setEx.getMessage()));
            }
            
            return ResponseEntity.ok().body(new ErrorResponse("Đặt địa chỉ mặc định thành công cho ID: " + id));
        } catch (Exception e) {
            System.err.println("Debug - Error in setDefaultAddressSimple: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi: " + e.getMessage()));
        }
    }

    // Endpoint test cực đơn giản
    @PostMapping("/{id}/test-set")
    public ResponseEntity<?> testSet(@PathVariable Integer id) {
        try {
            System.out.println("Debug - testSet cho ID: " + id);
            
            // Chỉ test tìm địa chỉ
            DiaChiKhachHang address = diaChiRepository.findById(id).orElse(null);
            if (address == null) {
                return ResponseEntity.ok().body(new ErrorResponse("Không tìm thấy địa chỉ ID: " + id));
            }
            
            return ResponseEntity.ok().body(new ErrorResponse("Tìm thấy địa chỉ ID: " + id + " - " + address.getHoTen()));
        } catch (Exception e) {
            System.err.println("Debug - Error in testSet: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().body(new ErrorResponse("Lỗi: " + e.getMessage()));
        }
    }

    // Chuyển đổi Entity sang DTO
    private DiaChiDto convertToDto(DiaChiKhachHang entity) {
        return new DiaChiDto(
            entity.getId(),
            entity.getHoTen(),
            entity.getSoDienThoai(),
            entity.getTinhThanh(),
            entity.getQuanHuyen(),
            entity.getPhuongXa(),
            entity.getDiaChiChiTiet(),
            entity.getLoaiDiaChi(),
            entity.getMacDinh(),
            entity.getNgayTao(),
            entity.getNgayCapNhat()
        );
    }
}
