package com.example.ZMEN.controller;

import com.example.ZMEN.dto.ChiTietSanPhamDTO;
import com.example.ZMEN.dto.DanhMucDTO;
import com.example.ZMEN.dto.VoucherDTO;
import com.example.ZMEN.dto.KhuyenMaiDTO;
import com.example.ZMEN.service.ChiTietSanPhamService;
import com.example.ZMEN.service.DanhMucService;
import com.example.ZMEN.service.VoucherService;
import com.example.ZMEN.service.KhuyenMaiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;
import java.util.ArrayList;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Date;

@RestController
@RequestMapping("/api/customer")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class CustomerController {

    private final ChiTietSanPhamService chiTietSanPhamService;
    private final DanhMucService danhMucService;
    private final VoucherService voucherService;
    private final KhuyenMaiService khuyenMaiService;

    public CustomerController(ChiTietSanPhamService chiTietSanPhamService, DanhMucService danhMucService, VoucherService voucherService, KhuyenMaiService khuyenMaiService) {
        this.chiTietSanPhamService = chiTietSanPhamService;
        this.danhMucService = danhMucService;
        this.voucherService = voucherService;
        this.khuyenMaiService = khuyenMaiService;
    }

    // ==================== PRODUCT ENDPOINTS ====================

    /**
     * Lấy tất cả sản phẩm cho customer (đã gộp theo nhóm)
     */
    @GetMapping("/products")
    public ResponseEntity<Map<String, Object>> getAllProducts() {
        try {
            List<ChiTietSanPhamDTO> products = chiTietSanPhamService.getAllChiTietSanPham();
            
            // Gộp sản phẩm theo idSanPham
            Map<Integer, Map<String, Object>> groupedProducts = new HashMap<>();
            
            for (ChiTietSanPhamDTO product : products) {
                Integer productId = product.getIdSanPham();
                if (productId == null) continue;
                
                if (!groupedProducts.containsKey(productId)) {
                    // Tạo sản phẩm chính
                    Map<String, Object> mainProduct = new HashMap<>();
                    mainProduct.put("id", productId);
                    mainProduct.put("maSanPham", "SP" + String.format("%03d", productId));
                    mainProduct.put("tenSanPham", product.getTenSanPham());
                    mainProduct.put("tenDanhMuc", getCategoryFromProductName(product.getTenSanPham()));
                    mainProduct.put("hinhAnh", product.getHinhAnh());
                    mainProduct.put("gia", product.getGia());
                    mainProduct.put("giaCu", product.getGiaNhap());
                    mainProduct.put("rating", 4.5);
                    mainProduct.put("daBan", (int) (Math.random() * 1000) + 100);
                    mainProduct.put("giamGia", 0);
                    mainProduct.put("variants", new ArrayList<>());
                    mainProduct.put("colors", new ArrayList<>());
                    mainProduct.put("sizes", new ArrayList<>());
                    
                    groupedProducts.put(productId, mainProduct);
                }
                
                // Thêm biến thể vào sản phẩm chính
                Map<String, Object> mainProduct = groupedProducts.get(productId);
                List<Map<String, Object>> variants = (List<Map<String, Object>>) mainProduct.get("variants");
                List<String> colors = (List<String>) mainProduct.get("colors");
                List<String> sizes = (List<String>) mainProduct.get("sizes");
                
                // Tạo biến thể
                Map<String, Object> variant = new HashMap<>();
                variant.put("id", product.getId());
                variant.put("tenMauSac", product.getTenMauSac());
                variant.put("tenKichCo", product.getTenKichCo());
                variant.put("gia", product.getGia());
                variant.put("giaCu", product.getGiaNhap());
                variant.put("soLuong", product.getSoLuong());
                variant.put("hinhAnh", product.getHinhAnh());
                variant.put("daBan", (int) (Math.random() * 100) + 10); // Thêm số lượng đã bán
                variants.add(variant);
                
                // Thêm màu và size vào danh sách
                if (product.getTenMauSac() != null && !colors.contains(product.getTenMauSac())) {
                    colors.add(product.getTenMauSac());
                }
                if (product.getTenKichCo() != null && !sizes.contains(product.getTenKichCo())) {
                    sizes.add(product.getTenKichCo());
                }
            }
            
            // Chuyển đổi thành list
            List<Map<String, Object>> customerProducts = new ArrayList<>(groupedProducts.values());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", customerProducts);
            response.put("total", customerProducts.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("Lỗi khi lấy danh sách sản phẩm", e);
        }
    }

    /**
     * Lấy chi tiết sản phẩm theo ID sản phẩm chính (đã gộp theo nhóm)
     */
    @GetMapping("/products/{id}")
    public ResponseEntity<Map<String, Object>> getProductById(@PathVariable String id) {
        try {
            // Convert String to Integer
            Integer productId = Integer.parseInt(id);
            
            // Get all products
            List<ChiTietSanPhamDTO> allProducts = chiTietSanPhamService.getAllChiTietSanPham();
            
            // Lọc sản phẩm theo idSanPham
            List<ChiTietSanPhamDTO> productVariants = allProducts.stream()
                .filter(product -> product.getIdSanPham() != null && product.getIdSanPham().equals(productId))
                .collect(Collectors.toList());
            
            if (productVariants.isEmpty()) {
                return createErrorResponse("Không tìm thấy sản phẩm với ID: " + id, null);
            }
            
            // Lấy sản phẩm đầu tiên để làm thông tin chính
            ChiTietSanPhamDTO mainProduct = productVariants.get(0);
            
            // Tạo response với tất cả biến thể
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("id", mainProduct.getIdSanPham());
            response.put("maSanPham", "SP" + String.format("%03d", mainProduct.getIdSanPham()));
            response.put("name", mainProduct.getTenSanPham());
            response.put("category", getCategoryFromProductName(mainProduct.getTenSanPham()));
            
            // Debug: Kiểm tra giá trị moTa
            System.out.println("DEBUG - Product ID: " + mainProduct.getIdSanPham());
            System.out.println("DEBUG - moTa: " + mainProduct.getMoTa());
            System.out.println("DEBUG - moTa is null: " + (mainProduct.getMoTa() == null));
            System.out.println("DEBUG - moTa is empty: " + (mainProduct.getMoTa() != null && mainProduct.getMoTa().trim().isEmpty()));
            System.out.println("DEBUG - moTa length: " + (mainProduct.getMoTa() != null ? mainProduct.getMoTa().length() : "null"));
            System.out.println("DEBUG - moTa trimmed: " + (mainProduct.getMoTa() != null ? mainProduct.getMoTa().trim() : "null"));
            System.out.println("DEBUG - Condition result: " + (mainProduct.getMoTa() != null && !mainProduct.getMoTa().trim().isEmpty()));
            
            response.put("description", mainProduct.getMoTa());
            response.put("rating", 4.5);
            response.put("sold", (int) (Math.random() * 1000) + 100);
            response.put("variants", productVariants.stream()
                .map(this::mapToVariantForDetail)
                .collect(Collectors.toList()));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("Lỗi khi lấy chi tiết sản phẩm: " + e.getMessage(), e);
        }
    }

    /**
     * Lấy chi tiết sản phẩm theo ID (legacy endpoint)
     */
    @GetMapping("/products/detail")
    public ResponseEntity<Map<String, Object>> getProductDetailById(@RequestParam String id) {
        try {
            // Get all products
            List<ChiTietSanPhamDTO> allProducts = chiTietSanPhamService.getAllChiTietSanPham();
            
            // Convert String to Integer
            Integer productId = Integer.parseInt(id);
            
            // Find product by ID
            ChiTietSanPhamDTO product = null;
            for (ChiTietSanPhamDTO p : allProducts) {
                if (p.getId() != null && p.getId().equals(productId)) {
                    product = p;
                    break;
                }
            }
            
            if (product == null) {
                return createErrorResponse("Không tìm thấy sản phẩm với ID: " + id, null);
            }
            
            // Create response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("id", product.getId());
            response.put("name", product.getTenSanPham());
            response.put("price", product.getGia());
            response.put("oldPrice", product.getGiaNhap());
            response.put("quantity", product.getSoLuong());
            response.put("material", product.getTenChatLieu());
            response.put("color", product.getTenMauSac());
            response.put("size", product.getTenKichCo());
            response.put("inStock", product.getSoLuong() != null && product.getSoLuong() > 0);
            response.put("description", "Sản phẩm " + product.getTenSanPham() + " chất lượng cao, phù hợp với mọi lứa tuổi.");
            response.put("rating", 4.5);
            response.put("sold", (int) (Math.random() * 1000) + 100);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("Lỗi khi lấy chi tiết sản phẩm: " + e.getMessage(), e);
        }
    }

    /**
     * Lấy sản phẩm theo danh mục (đã gộp theo nhóm)
     */
    @GetMapping("/products/category/{categoryName}")
    public ResponseEntity<Map<String, Object>> getProductsByCategory(@PathVariable String categoryName) {
        try {
            if (categoryName == null || categoryName.trim().isEmpty()) {
                return createErrorResponse("Tên danh mục không được để trống", null);
            }

            List<ChiTietSanPhamDTO> allProducts = chiTietSanPhamService.getAllChiTietSanPham();
            
            // Lọc sản phẩm theo danh mục trước
            List<ChiTietSanPhamDTO> filteredProducts = allProducts.stream()
                .filter(product -> matchesCategory(product, categoryName))
                .collect(Collectors.toList());
            
            // Gộp sản phẩm đã lọc theo idSanPham
            Map<Integer, Map<String, Object>> groupedProducts = new HashMap<>();
            
            for (ChiTietSanPhamDTO product : filteredProducts) {
                Integer productId = product.getIdSanPham();
                if (productId == null) continue;
                
                if (!groupedProducts.containsKey(productId)) {
                    // Tạo sản phẩm chính
                    Map<String, Object> mainProduct = new HashMap<>();
                    mainProduct.put("id", productId);
                    mainProduct.put("maSanPham", "SP" + String.format("%03d", productId));
                    mainProduct.put("tenSanPham", product.getTenSanPham());
                    mainProduct.put("tenDanhMuc", getCategoryFromProductName(product.getTenSanPham()));
                    mainProduct.put("hinhAnh", product.getHinhAnh());
                    mainProduct.put("gia", product.getGia());
                    mainProduct.put("giaCu", product.getGiaNhap());
                    mainProduct.put("rating", 4.5);
                    mainProduct.put("daBan", (int) (Math.random() * 1000) + 100);
                    mainProduct.put("giamGia", 0);
                    mainProduct.put("variants", new ArrayList<>());
                    mainProduct.put("colors", new ArrayList<>());
                    mainProduct.put("sizes", new ArrayList<>());
                    
                    groupedProducts.put(productId, mainProduct);
                }
                
                // Thêm biến thể vào sản phẩm chính
                Map<String, Object> mainProduct = groupedProducts.get(productId);
                List<Map<String, Object>> variants = (List<Map<String, Object>>) mainProduct.get("variants");
                List<String> colors = (List<String>) mainProduct.get("colors");
                List<String> sizes = (List<String>) mainProduct.get("sizes");
                
                // Tạo biến thể
                Map<String, Object> variant = new HashMap<>();
                variant.put("id", product.getId());
                variant.put("tenMauSac", product.getTenMauSac());
                variant.put("tenKichCo", product.getTenKichCo());
                variant.put("gia", product.getGia());
                variant.put("giaCu", product.getGiaNhap());
                variant.put("soLuong", product.getSoLuong());
                variant.put("hinhAnh", product.getHinhAnh());
                variant.put("daBan", (int) (Math.random() * 100) + 10);
                variants.add(variant);
                
                // Thêm màu và size vào danh sách
                if (product.getTenMauSac() != null && !colors.contains(product.getTenMauSac())) {
                    colors.add(product.getTenMauSac());
                }
                if (product.getTenKichCo() != null && !sizes.contains(product.getTenKichCo())) {
                    sizes.add(product.getTenKichCo());
                }
            }
            
            List<Map<String, Object>> customerProducts = new ArrayList<>(groupedProducts.values());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", customerProducts);
            response.put("category", categoryName);
            response.put("total", customerProducts.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("Lỗi khi lấy sản phẩm theo danh mục", e);
        }
    }

    /**
     * Lấy sản phẩm nổi bật (đã gộp theo nhóm)
     */
    @GetMapping("/products/featured")
    public ResponseEntity<Map<String, Object>> getFeaturedProducts() {
        try {
            List<ChiTietSanPhamDTO> allProducts = chiTietSanPhamService.getAllChiTietSanPham();
            
            // Gộp sản phẩm theo idSanPham (giống như getAllProducts)
            Map<Integer, Map<String, Object>> groupedProducts = new HashMap<>();
            
            for (ChiTietSanPhamDTO product : allProducts) {
                Integer productId = product.getIdSanPham();
                if (productId == null) continue;
                
                if (!groupedProducts.containsKey(productId)) {
                    // Tạo sản phẩm chính
                    Map<String, Object> mainProduct = new HashMap<>();
                    mainProduct.put("id", productId);
                    mainProduct.put("maSanPham", "SP" + String.format("%03d", productId));
                    mainProduct.put("tenSanPham", product.getTenSanPham());
                    mainProduct.put("tenDanhMuc", getCategoryFromProductName(product.getTenSanPham()));
                    mainProduct.put("hinhAnh", product.getHinhAnh());
                    mainProduct.put("gia", product.getGia());
                    mainProduct.put("giaCu", product.getGiaNhap());
                    mainProduct.put("rating", 4.5);
                    mainProduct.put("daBan", (int) (Math.random() * 1000) + 100);
                    mainProduct.put("giamGia", 0);
                    mainProduct.put("variants", new ArrayList<>());
                    mainProduct.put("colors", new ArrayList<>());
                    mainProduct.put("sizes", new ArrayList<>());
                    
                    groupedProducts.put(productId, mainProduct);
                }
                
                // Thêm biến thể vào sản phẩm chính
                Map<String, Object> mainProduct = groupedProducts.get(productId);
                List<Map<String, Object>> variants = (List<Map<String, Object>>) mainProduct.get("variants");
                List<String> colors = (List<String>) mainProduct.get("colors");
                List<String> sizes = (List<String>) mainProduct.get("sizes");
                
                // Tạo biến thể
                Map<String, Object> variant = new HashMap<>();
                variant.put("id", product.getId());
                variant.put("tenMauSac", product.getTenMauSac());
                variant.put("tenKichCo", product.getTenKichCo());
                variant.put("gia", product.getGia());
                variant.put("giaCu", product.getGiaNhap());
                variant.put("soLuong", product.getSoLuong());
                variant.put("hinhAnh", product.getHinhAnh());
                variant.put("daBan", (int) (Math.random() * 100) + 10);
                variants.add(variant);
                
                // Thêm màu và size vào danh sách
                if (product.getTenMauSac() != null && !colors.contains(product.getTenMauSac())) {
                    colors.add(product.getTenMauSac());
                }
                if (product.getTenKichCo() != null && !sizes.contains(product.getTenKichCo())) {
                    sizes.add(product.getTenKichCo());
                }
            }
            
            // Chọn ngẫu nhiên 4 sản phẩm đã gộp làm featured
            List<Map<String, Object>> allGroupedProducts = new ArrayList<>(groupedProducts.values());
            List<Map<String, Object>> featuredProducts = allGroupedProducts.stream()
                .sorted((a, b) -> Double.compare(Math.random(), 0.5))
                .limit(4)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", featuredProducts);
            response.put("total", featuredProducts.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("Lỗi khi lấy sản phẩm nổi bật", e);
        }
    }

    /**
     * Tìm kiếm sản phẩm
     */
    @GetMapping("/products/search")
    public ResponseEntity<Map<String, Object>> searchProducts(@RequestParam String keyword) {
        try {
            if (keyword == null || keyword.trim().isEmpty()) {
                return createErrorResponse("Từ khóa tìm kiếm không được để trống", null);
            }

            List<ChiTietSanPhamDTO> allProducts = chiTietSanPhamService.getAllChiTietSanPham();
            
            List<ChiTietSanPhamDTO> searchResults = allProducts.stream()
                .filter(product -> matchesSearchKeyword(product, keyword))
                .collect(Collectors.toList());
            
            List<Map<String, Object>> customerProducts = searchResults.stream()
                .map(this::mapToCustomerProduct)
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", customerProducts);
            response.put("keyword", keyword);
            response.put("total", customerProducts.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("Lỗi khi tìm kiếm sản phẩm", e);
        }
    }

    // ==================== CATEGORY ENDPOINTS ====================

    /**
     * Lấy danh mục với số lượng sản phẩm
     */
    @GetMapping("/categories")
    public ResponseEntity<Map<String, Object>> getCategoriesWithCount() {
        try {
            List<DanhMucDTO> categories = danhMucService.getAllDanhMuc();
            List<ChiTietSanPhamDTO> allProducts = chiTietSanPhamService.getAllChiTietSanPham();
            
            List<Map<String, Object>> categoriesWithCount = categories.stream()
                .map(category -> {
                    long count = allProducts.stream()
                        .filter(product -> matchesCategory(product, category.getTenDanhMuc()))
                        .count();
                    
                    Map<String, Object> categoryMap = new HashMap<>();
                    categoryMap.put("id", category.getId());
                    categoryMap.put("name", category.getTenDanhMuc());
                    categoryMap.put("icon", getCategoryIcon(category.getTenDanhMuc()));
                    categoryMap.put("count", count);
                    return categoryMap;
                })
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", categoriesWithCount);
            response.put("total", categoriesWithCount.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("Lỗi khi lấy danh mục", e);
        }
    }

    // ==================== VOUCHER & PROMOTION ENDPOINTS ====================

    /**
     * Lấy danh sách voucher có hiệu lực cho customer
     */
    @GetMapping("/vouchers")
    public ResponseEntity<Map<String, Object>> getActiveVouchers() {
        try {
            // Lấy tất cả voucher
            List<VoucherDTO> allVouchers = voucherService.getAllVoucher();
            
            // Lọc voucher có hiệu lực
            List<Map<String, Object>> activeVouchers = allVouchers.stream()
                .filter(voucher -> {
                    // Kiểm tra trạng thái
                    if (voucher.getTrangThai() == null || voucher.getTrangThai() != 1) {
                        return false;
                    }
                    
                    // Kiểm tra thời gian hiệu lực
                    LocalDate now = LocalDate.now();
                    if (voucher.getNgayBatDau() != null && now.isBefore(voucher.getNgayBatDau())) {
                        return false;
                    }
                    if (voucher.getNgayKetThuc() != null && now.isAfter(voucher.getNgayKetThuc())) {
                        return false;
                    }
                    
                    // Kiểm tra số lượng còn lại
                    if (voucher.getSoLuong() != null && voucher.getSoLuong() <= 0) {
                        return false;
                    }
                    
                    return true;
                })
                .map(voucher -> {
                    Map<String, Object> voucherMap = new HashMap<>();
                    voucherMap.put("id", voucher.getId());
                    voucherMap.put("maVoucher", voucher.getMaVoucher());
                    voucherMap.put("tenVoucher", voucher.getTenVoucher());
                    voucherMap.put("loaiGiamGia", voucher.getLoaiGiamGia());
                    voucherMap.put("giaTriGiam", voucher.getGiaTriGiam());
                    voucherMap.put("giaTriToiThieu", voucher.getGiaTriToiThieu());
                    voucherMap.put("giamToiDa", voucher.getGiamToiDa());
                    voucherMap.put("soLuong", voucher.getSoLuong());
                    voucherMap.put("ngayBatDau", voucher.getNgayBatDau());
                    voucherMap.put("ngayKetThuc", voucher.getNgayKetThuc());
                    voucherMap.put("moTa", voucher.getMoTa());
                    
                    // Tính toán thời gian còn lại
                    if (voucher.getNgayKetThuc() != null) {
                        LocalDate now = LocalDate.now();
                        long daysLeft = java.time.temporal.ChronoUnit.DAYS.between(now, voucher.getNgayKetThuc());
                        voucherMap.put("ngayConLai", Math.max(0, daysLeft));
                    }
                    
                    return voucherMap;
                })
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activeVouchers);
            response.put("total", activeVouchers.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("Lỗi khi lấy danh sách voucher", e);
        }
    }

    /**
     * Kiểm tra voucher có hợp lệ không
     */
    @PostMapping("/vouchers/validate")
    public ResponseEntity<Map<String, Object>> validateVoucher(
            @RequestParam String maVoucher,
            @RequestParam(required = false, defaultValue = "0") BigDecimal tongTienHang) {
        try {
            // Tìm voucher theo mã
            List<VoucherDTO> allVouchers = voucherService.getAllVoucher();
            VoucherDTO voucher = allVouchers.stream()
                .filter(v -> maVoucher.equalsIgnoreCase(v.getMaVoucher()))
                .findFirst()
                .orElse(null);
            
            Map<String, Object> response = new HashMap<>();
            
            if (voucher == null) {
                response.put("success", false);
                response.put("message", "Voucher không tồn tại");
                return ResponseEntity.ok(response);
            }
            
            // Kiểm tra trạng thái
            if (voucher.getTrangThai() == null || voucher.getTrangThai() != 1) {
                response.put("success", false);
                response.put("message", "Voucher đã bị vô hiệu hóa");
                return ResponseEntity.ok(response);
            }
            
            // Kiểm tra thời gian hiệu lực
            LocalDate now = LocalDate.now();
            if (voucher.getNgayBatDau() != null && now.isBefore(voucher.getNgayBatDau())) {
                response.put("success", false);
                response.put("message", "Voucher chưa có hiệu lực");
                return ResponseEntity.ok(response);
            }
            if (voucher.getNgayKetThuc() != null && now.isAfter(voucher.getNgayKetThuc())) {
                response.put("success", false);
                response.put("message", "Voucher đã hết hạn");
                return ResponseEntity.ok(response);
            }
            
            // Kiểm tra số lượng
            if (voucher.getSoLuong() != null && voucher.getSoLuong() <= 0) {
                response.put("success", false);
                response.put("message", "Voucher đã hết số lượng");
                return ResponseEntity.ok(response);
            }
            
            // Kiểm tra giá trị tối thiểu
            if (voucher.getGiaTriToiThieu() != null && tongTienHang.compareTo(voucher.getGiaTriToiThieu()) < 0) {
                response.put("success", false);
                response.put("message", "Đơn hàng chưa đạt giá trị tối thiểu " + voucher.getGiaTriToiThieu().toPlainString() + "đ");
                return ResponseEntity.ok(response);
            }
            
            // Tính toán giá trị giảm
            BigDecimal giaTriGiam = voucher.getGiaTriGiam();
            if ("PHAN_TRAM".equals(voucher.getLoaiGiamGia())) {
                giaTriGiam = tongTienHang.multiply(voucher.getGiaTriGiam()).divide(new BigDecimal("100"));
                if (voucher.getGiamToiDa() != null && giaTriGiam.compareTo(voucher.getGiamToiDa()) > 0) {
                    giaTriGiam = voucher.getGiamToiDa();
                }
            }
            
            response.put("success", true);
            response.put("message", "Voucher hợp lệ");
            response.put("voucher", voucher);
            response.put("giaTriGiam", giaTriGiam);
            response.put("tongTienSauGiam", tongTienHang.subtract(giaTriGiam));
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("Lỗi khi kiểm tra voucher", e);
        }
    }

    /**
     * Lấy danh sách khuyến mãi có hiệu lực
     */
    @GetMapping("/promotions")
    public ResponseEntity<Map<String, Object>> getActivePromotions() {
        try {
            // Lấy tất cả khuyến mãi
            List<KhuyenMaiDTO> allPromotions = khuyenMaiService.getAllKhuyenMai();
            
            // Lọc khuyến mãi có hiệu lực
            List<Map<String, Object>> activePromotions = allPromotions.stream()
                .filter(promotion -> {
                    // Kiểm tra trạng thái
                    if (promotion.getTrangThai() == null || promotion.getTrangThai() != 1) {
                        return false;
                    }
                    
                    // Kiểm tra thời gian hiệu lực
                    Date now = new Date();
                    if (promotion.getNgayBatDau() != null && now.before(promotion.getNgayBatDau())) {
                        return false;
                    }
                    if (promotion.getNgayKetThuc() != null && now.after(promotion.getNgayKetThuc())) {
                        return false;
                    }
                    
                    return true;
                })
                .map(promotion -> {
                    Map<String, Object> promotionMap = new HashMap<>();
                    promotionMap.put("id", promotion.getId());
                    promotionMap.put("maKhuyenMai", promotion.getMaKhuyenMai());
                    promotionMap.put("tenKhuyenMai", promotion.getTenKhuyenMai());
                    promotionMap.put("phanTramGiam", promotion.getPhanTramGiam());
                    promotionMap.put("ngayBatDau", promotion.getNgayBatDau());
                    promotionMap.put("ngayKetThuc", promotion.getNgayKetThuc());
                    promotionMap.put("moTa", promotion.getMoTa());
                    
                    // Tính toán thời gian còn lại
                    Date now = new Date();
                    if (promotion.getNgayKetThuc() != null) {
                        long timeLeft = promotion.getNgayKetThuc().getTime() - now.getTime();
                        long daysLeft = timeLeft / (1000 * 60 * 60 * 24);
                        promotionMap.put("ngayConLai", Math.max(0, daysLeft));
                    }
                    
                    return promotionMap;
                })
                .collect(Collectors.toList());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", activePromotions);
            response.put("total", activePromotions.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("Lỗi khi lấy danh sách khuyến mãi", e);
        }
    }

    // ==================== OTHER ENDPOINTS ====================

    /**
     * Lấy banner cho customer
     */
    @GetMapping("/banner")
    public ResponseEntity<Map<String, Object>> getBanners() {
        try {
            List<Map<String, Object>> banners = new ArrayList<>();
            banners.add(createBanner(1, "Bộ sưu tập thể thao mới nhất", 
                "Khám phá các sản phẩm thể thao chất lượng cao",
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=1920&q=100"));
            banners.add(createBanner(2, "Giảm giá lên đến 50%", 
                "Các sản phẩm thể thao với giá tốt nhất",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1920&q=100"));
            banners.add(createBanner(3, "Thể thao năng động", 
                "Phong cách thể thao hiện đại cho mọi lứa tuổi",
                "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?auto=format&fit=crop&w=1920&q=100"));
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", banners);
            response.put("total", banners.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("Lỗi khi lấy banner", e);
        }
    }

    /**
     * Lấy thống kê cho customer
     */
    @GetMapping("/statistics")
    public ResponseEntity<Map<String, Object>> getStatistics() {
        try {
            List<ChiTietSanPhamDTO> allProducts = chiTietSanPhamService.getAllChiTietSanPham();
            
            Map<String, Object> statistics = new HashMap<>();
            statistics.put("customers", 15000);
            statistics.put("products", allProducts.size());
            statistics.put("orders", 5000);
            statistics.put("satisfaction", 98);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", statistics);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return createErrorResponse("Lỗi khi lấy thống kê", e);
        }
    }

    // ==================== HELPER METHODS ====================

    /**
     * Map sản phẩm thành format cho customer
     */
    private Map<String, Object> mapToCustomerProduct(ChiTietSanPhamDTO product) {
        Map<String, Object> productMap = new HashMap<>();
        productMap.put("id", product.getId());
        productMap.put("idSanPham", product.getIdSanPham());
        productMap.put("name", product.getTenSanPham());
        productMap.put("price", product.getGia());
        productMap.put("oldPrice", product.getGiaNhap());
        productMap.put("image", getProductImage(product));
        productMap.put("colors", getProductColors(product));
        productMap.put("rating", 4.5);
        productMap.put("sold", generateRandomSold());
        productMap.put("category", getCategoryFromProductName(product.getTenSanPham()));
        productMap.put("sizes", getProductSizes(product));
        productMap.put("material", product.getTenChatLieu());
        productMap.put("quantity", product.getSoLuong());
        productMap.put("description", generateDescription(product.getTenSanPham()));
        productMap.put("inStock", isInStock(product));
        return productMap;
    }

    /**
     * Map sản phẩm thành format chi tiết
     */
    private Map<String, Object> mapToProductDetail(ChiTietSanPhamDTO product) {
        Map<String, Object> productMap = new HashMap<>();
        productMap.put("id", product.getId());
        productMap.put("name", product.getTenSanPham());
        productMap.put("price", product.getGia());
        productMap.put("oldPrice", product.getGiaNhap());
        productMap.put("images", getProductImages(product));
        productMap.put("colors", getProductColorObjects(product));
        productMap.put("sizes", getProductSizes(product));
        productMap.put("rating", 4.5);
        productMap.put("sold", generateRandomSold());
        productMap.put("description", generateDescription(product.getTenSanPham()));
        productMap.put("inStock", isInStock(product));
        productMap.put("quantity", product.getSoLuong());
        productMap.put("material", product.getTenChatLieu());
        productMap.put("category", getCategoryFromProductName(product.getTenSanPham()));
        return productMap;
    }

    /**
     * Map sản phẩm thành format featured
     */
    private Map<String, Object> mapToFeaturedProduct(ChiTietSanPhamDTO product) {
        Map<String, Object> productMap = mapToCustomerProduct(product);
        double discount = calculateDiscount(product.getGiaNhap(), product.getGia());
        productMap.put("discount", (int) discount);
        return productMap;
    }

    /**
     * Map biến thể cho trang chi tiết sản phẩm
     */
    private Map<String, Object> mapToVariantForDetail(ChiTietSanPhamDTO product) {
        Map<String, Object> variant = new HashMap<>();
        variant.put("id", product.getId());
        variant.put("color", product.getTenMauSac());
        variant.put("size", product.getTenKichCo());
        variant.put("price", product.getGia());
        variant.put("oldPrice", product.getGiaNhap());
        variant.put("stock", product.getSoLuong());
        variant.put("image", getProductImage(product));
        return variant;
    }

    /**
     * Lấy hình ảnh sản phẩm
     */
    private String getProductImage(ChiTietSanPhamDTO product) {
        if (product.getHinhAnh() != null && product.getHinhAnh().length > 0) {
            return product.getHinhAnh()[0];
        }
        return "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=500&q=100";
    }

    /**
     * Lấy danh sách hình ảnh sản phẩm
     */
    private List<String> getProductImages(ChiTietSanPhamDTO product) {
        List<String> images = new ArrayList<>();
        if (product.getHinhAnh() != null && product.getHinhAnh().length > 0) {
            for (String image : product.getHinhAnh()) {
                if (image != null && !image.trim().isEmpty()) {
                    images.add(image);
                }
            }
        }
        if (images.isEmpty()) {
            images.add("https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=400&h=500&q=100");
        }
        return images;
    }

    /**
     * Lấy màu sắc sản phẩm
     */
    private List<String> getProductColors(ChiTietSanPhamDTO product) {
        List<String> colors = new ArrayList<>();
        if (product.getTenMauSac() != null && !product.getTenMauSac().trim().isEmpty()) {
            colors.add(product.getTenMauSac());
        } else {
            colors.add("#222");
        }
        return colors;
    }

    /**
     * Lấy đối tượng màu sắc sản phẩm
     */
    private List<Map<String, String>> getProductColorObjects(ChiTietSanPhamDTO product) {
        List<Map<String, String>> colorObjects = new ArrayList<>();
        if (product.getTenMauSac() != null && !product.getTenMauSac().trim().isEmpty()) {
            Map<String, String> colorObj = new HashMap<>();
            colorObj.put("name", product.getTenMauSac());
            colorObj.put("code", getColorCode(product.getTenMauSac()));
            colorObjects.add(colorObj);
        } else {
            Map<String, String> colorObj = new HashMap<>();
            colorObj.put("name", "Đen");
            colorObj.put("code", "#222");
            colorObjects.add(colorObj);
        }
        return colorObjects;
    }

    /**
     * Lấy kích thước sản phẩm
     */
    private List<String> getProductSizes(ChiTietSanPhamDTO product) {
        List<String> sizes = new ArrayList<>();
        if (product.getTenKichCo() != null && !product.getTenKichCo().trim().isEmpty()) {
            sizes.add(product.getTenKichCo());
        } else {
            sizes.add("M");
        }
        return sizes;
    }

    /**
     * Kiểm tra sản phẩm còn hàng
     */
    private boolean isInStock(ChiTietSanPhamDTO product) {
        return product.getSoLuong() != null && product.getSoLuong() > 0;
    }

    /**
     * Tạo mô tả sản phẩm
     */
    private String generateDescription(String productName) {
        return "Sản phẩm " + productName + " chất lượng cao, phù hợp với mọi lứa tuổi.";
    }

    /**
     * Tạo số lượng đã bán ngẫu nhiên
     */
    private int generateRandomSold() {
        return (int) (Math.random() * 1000) + 100;
    }

    /**
     * Tính phần trăm giảm giá
     */
    private double calculateDiscount(Double oldPrice, Double newPrice) {
        if (oldPrice == null || oldPrice <= 0 || newPrice == null) {
            return 0;
        }
        return ((oldPrice - newPrice) / oldPrice) * 100;
    }

    /**
     * Chuyển đổi tên màu thành mã màu
     */
    private String getColorCode(String colorName) {
        if (colorName == null) return "#222";
        
        switch (colorName.toLowerCase()) {
            case "trắng":
            case "white":
                return "#ffffff";
            case "đen":
            case "black":
                return "#222222";
            case "xanh":
            case "blue":
                return "#007bff";
            case "đỏ":
            case "red":
                return "#dc3545";
            case "vàng":
            case "yellow":
                return "#ffc107";
            case "xanh lá":
            case "green":
                return "#28a745";
            case "hồng":
            case "pink":
                return "#e83e8c";
            case "cam":
            case "orange":
                return "#fd7e14";
            case "tím":
            case "purple":
                return "#6f42c1";
            default:
                return "#222222";
        }
    }

    /**
     * Kiểm tra sản phẩm có khớp với danh mục không
     */
    private boolean matchesCategory(ChiTietSanPhamDTO product, String categoryName) {
        if (product.getTenSanPham() == null || categoryName == null) {
            return false;
        }
        
        String productName = product.getTenSanPham().toLowerCase();
        String category = categoryName.toLowerCase();
        
        // Logic filter linh hoạt
        if (category.contains("áo") && (productName.contains("áo") || productName.contains("shirt"))) return true;
        if (category.contains("quần") && productName.contains("quần")) return true;
        if (category.contains("phụ kiện") && (productName.contains("túi") || productName.contains("mũ") || productName.contains("giày") || productName.contains("dép"))) return true;
        if (category.contains("váy") && productName.contains("váy")) return true;
        if (category.contains("giày") && (productName.contains("giày") || productName.contains("dép"))) return true;
        
        // Nếu tên sản phẩm chứa tên danh mục
        return productName.contains(category);
    }

    /**
     * Kiểm tra sản phẩm có khớp với từ khóa tìm kiếm không
     */
    private boolean matchesSearchKeyword(ChiTietSanPhamDTO product, String keyword) {
        if (product.getTenSanPham() == null || keyword == null) {
            return false;
        }
        
        String productName = product.getTenSanPham().toLowerCase();
        String searchTerm = keyword.toLowerCase();
        return productName.contains(searchTerm);
    }

    /**
     * Lấy danh mục từ tên sản phẩm
     */
    private String getCategoryFromProductName(String productName) {
        if (productName == null) return "Khác";
        
        String name = productName.toLowerCase();
        List<DanhMucDTO> categories = danhMucService.getAllDanhMuc();
        
        for (DanhMucDTO category : categories) {
            String categoryName = category.getTenDanhMuc().toLowerCase();
            
            if (categoryName.contains("áo") && (name.contains("áo") || name.contains("shirt"))) {
                return category.getTenDanhMuc();
            }
            if (categoryName.contains("quần") && name.contains("quần")) {
                return category.getTenDanhMuc();
            }
            if (categoryName.contains("phụ kiện") && (name.contains("túi") || name.contains("mũ") || name.contains("giày") || name.contains("dép"))) {
                return category.getTenDanhMuc();
            }
            if (categoryName.contains("váy") && name.contains("váy")) {
                return category.getTenDanhMuc();
            }
            if (categoryName.contains("giày") && (name.contains("giày") || name.contains("dép"))) {
                return category.getTenDanhMuc();
            }
            
            if (name.contains(categoryName)) {
                return category.getTenDanhMuc();
            }
        }
        
        return "Khác";
    }

    /**
     * Lấy icon cho danh mục
     */
    private String getCategoryIcon(String categoryName) {
        if (categoryName == null) return "👕";
        
        String name = categoryName.toLowerCase();
        
        if (name.contains("áo")) return "👕";
        if (name.contains("quần")) return "👖";
        if (name.contains("phụ kiện")) return "👜";
        if (name.contains("váy")) return "👗";
        if (name.contains("giày") || name.contains("dép")) return "👟";
        if (name.contains("túi")) return "👜";
        if (name.contains("mũ")) return "🧢";
        if (name.contains("kính")) return "🕶️";
        if (name.contains("đồng hồ")) return "⌚";
        
        return "👕";
    }

    /**
     * Tạo banner
     */
    private Map<String, Object> createBanner(int id, String title, String subtitle, String image) {
        Map<String, Object> banner = new HashMap<>();
        banner.put("id", id);
        banner.put("title", title);
        banner.put("subtitle", subtitle);
        banner.put("image", image);
        banner.put("buttonText", "Mua ngay");
        banner.put("buttonLink", "/products");
        return banner;
    }

    /**
     * Tạo response lỗi
     */
    private ResponseEntity<Map<String, Object>> createErrorResponse(String message, Exception e) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("success", false);
        errorResponse.put("message", message);
        errorResponse.put("timestamp", new Date());
        
        if (e != null) {
            errorResponse.put("error", e.getMessage());
        }
        
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
    }
}
