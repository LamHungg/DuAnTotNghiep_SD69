package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.CartItemRequest;
import com.example.ZMEN.dto.CheckoutRequest;
import com.example.ZMEN.dto.CheckoutResponse;
import com.example.ZMEN.entity.*;
import com.example.ZMEN.repository.*;
import com.example.ZMEN.entity.DiaChiKhachHang;
import com.example.ZMEN.repository.DiaChiKhachHangRepository;
import com.example.ZMEN.service.CheckoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class CheckoutServiceImpl implements CheckoutService {

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private ChiTietDonHangRepository chiTietDonHangRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private DiaChiKhachHangRepository diaChiRepository;

    @Autowired
    private VoucherRepository voucherRepository;

    @Autowired
    private PhuongThucThanhToanRepository phuongThucThanhToanRepository;

    @Autowired
    private TrangThaiDonHangRepository trangThaiDonHangRepository;

    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    @Override
    @Transactional(isolation = org.springframework.transaction.annotation.Isolation.SERIALIZABLE)
    public CheckoutResponse processCheckout(CheckoutRequest request, Integer khachHangId) {
        try {
            System.out.println("Debug - Bắt đầu processCheckout");
            System.out.println("Debug - Request: " + request);
            System.out.println("Debug - KhachHangId: " + khachHangId);
            
            // KIỂM TRA SỐ LƯỢNG TRƯỚC KHI CHECKOUT
            System.out.println("Debug - Kiểm tra số lượng sản phẩm trước checkout:");
            for (CartItemRequest cartItem : request.getCartItems()) {
                ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(cartItem.getChiTietSanPhamId()).orElse(null);
                if (chiTietSanPham != null) {
                    System.out.println("Debug - Sản phẩm ID " + cartItem.getChiTietSanPhamId() + 
                        " (" + chiTietSanPham.getSanPham().getTenSanPham() + "): " + 
                        "Số lượng trước = " + chiTietSanPham.getSoLuong() + ", Sẽ trừ = " + cartItem.getSoLuong());
                }
            }

            // 1. Validate dữ liệu
            validateCheckoutRequest(request, khachHangId);

            // 2. Lấy thông tin khách hàng
            KhachHang khachHang = khachHangRepository.findById(khachHangId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng"));
            System.out.println("Debug - Đã tìm thấy khách hàng: " + khachHang.getHoTen());

            // 3. Tạo đơn hàng
            DonHang donHang = createDonHang(request, khachHang);
            System.out.println("Debug - Đã tạo đối tượng DonHang");
            
            donHang = donHangRepository.save(donHang);
            System.out.println("Debug - Đã lưu đơn hàng: " + donHang.getId());

            // 4. Tạo chi tiết đơn hàng
            createChiTietDonHang(request, donHang, khachHang);
            System.out.println("Debug - Đã tạo chi tiết đơn hàng");

            // 5. Tạo response
            CheckoutResponse response = new CheckoutResponse(
                    donHang.getId(),
                    donHang.getMaDonHang(),
                    "CHỜ XÁC NHẬN",
                    donHang.getTongThanhToan(),
                    donHang.getNgayDat(),
                    "Đặt hàng thành công!"
            );

            System.out.println("Debug - Checkout thành công: " + response);
            
            // KIỂM TRA SỐ LƯỢNG SAU KHI CHECKOUT
            System.out.println("Debug - Kiểm tra số lượng sản phẩm sau checkout:");
            for (CartItemRequest cartItem : request.getCartItems()) {
                ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(cartItem.getChiTietSanPhamId()).orElse(null);
                if (chiTietSanPham != null) {
                    System.out.println("Debug - Sản phẩm ID " + cartItem.getChiTietSanPhamId() + 
                        " (" + chiTietSanPham.getSanPham().getTenSanPham() + "): " + 
                        "Số lượng hiện tại = " + chiTietSanPham.getSoLuong());
                }
            }
            
            return response;

        } catch (Exception e) {
            System.err.println("Debug - Lỗi checkout: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Lỗi khi xử lý đơn hàng: " + e.getMessage());
        }
    }

    private void validateCheckoutRequest(CheckoutRequest request, Integer khachHangId) {
        if (request.getCartItems() == null || request.getCartItems().isEmpty()) {
            throw new RuntimeException("Giỏ hàng không được để trống");
        }

        // VALIDATE SẢN PHẨM VÀ SỐ LƯỢNG TỒN KHO
        System.out.println("Debug - Validating sản phẩm và số lượng tồn kho...");
        List<CartItemRequest> validItems = new ArrayList<>();
        List<String> invalidProducts = new ArrayList<>();
        List<String> insufficientStock = new ArrayList<>();
        
        for (CartItemRequest cartItem : request.getCartItems()) {
            System.out.println("Debug - Kiểm tra sản phẩm ID: " + cartItem.getChiTietSanPhamId());
            
            // Kiểm tra sản phẩm có tồn tại không
            ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(cartItem.getChiTietSanPhamId()).orElse(null);
            
            if (chiTietSanPham == null) {
                invalidProducts.add("ID: " + cartItem.getChiTietSanPhamId());
                System.err.println("Debug - Sản phẩm ID " + cartItem.getChiTietSanPhamId() + " KHÔNG tồn tại!");
                continue;
            }
            
            // Kiểm tra số lượng tồn kho
            if (chiTietSanPham.getSoLuong() < cartItem.getSoLuong()) {
                insufficientStock.add(chiTietSanPham.getSanPham().getTenSanPham() + 
                    " (Có: " + chiTietSanPham.getSoLuong() + ", Cần: " + cartItem.getSoLuong() + ")");
                System.err.println("Debug - Sản phẩm " + chiTietSanPham.getSanPham().getTenSanPham() + 
                    " không đủ số lượng. Có: " + chiTietSanPham.getSoLuong() + ", Cần: " + cartItem.getSoLuong());
                continue;
            }
            
            // Kiểm tra trạng thái sản phẩm
            if (chiTietSanPham.getTrangThai() != null && chiTietSanPham.getTrangThai() != 1) {
                invalidProducts.add(chiTietSanPham.getSanPham().getTenSanPham() + " (Đã ngừng bán)");
                System.err.println("Debug - Sản phẩm " + chiTietSanPham.getSanPham().getTenSanPham() + " đã ngừng bán");
                continue;
            }
            
            validItems.add(cartItem);
            System.out.println("Debug - Sản phẩm ID " + cartItem.getChiTietSanPhamId() + " hợp lệ");
        }
        
        // Báo lỗi nếu có sản phẩm không hợp lệ
        if (!invalidProducts.isEmpty()) {
            String errorMsg = "Các sản phẩm sau không tồn tại hoặc đã ngừng bán: " + String.join(", ", invalidProducts);
            System.err.println("Debug - " + errorMsg);
            throw new RuntimeException(errorMsg);
        }
        
        // Báo lỗi nếu không đủ số lượng
        if (!insufficientStock.isEmpty()) {
            String errorMsg = "Các sản phẩm sau không đủ số lượng: " + String.join(", ", insufficientStock);
            System.err.println("Debug - " + errorMsg);
            throw new RuntimeException(errorMsg);
        }
        
        // Cập nhật request với chỉ sản phẩm hợp lệ
        request.setCartItems(validItems);
        System.out.println("Debug - Tất cả sản phẩm đều hợp lệ. Số lượng: " + validItems.size());

        if (request.getDiaChiId() == null) {
            throw new RuntimeException("Vui lòng chọn địa chỉ giao hàng");
        }

        if (request.getPhuongThucThanhToanId() == null) {
            throw new RuntimeException("Vui lòng chọn phương thức thanh toán");
        }

        // Validate địa chỉ
        System.out.println("Debug - Validating địa chỉ với ID: " + request.getDiaChiId());
        if (!diaChiRepository.existsById(request.getDiaChiId())) {
            System.err.println("Debug - Địa chỉ không tồn tại với ID: " + request.getDiaChiId());
            throw new RuntimeException("Địa chỉ không hợp lệ");
        }
        
        // Kiểm tra địa chỉ có thuộc về khách hàng này không
        DiaChiKhachHang diaChi = diaChiRepository.findById(request.getDiaChiId()).orElse(null);
        if (diaChi != null && diaChi.getKhachHangId() != null && !diaChi.getKhachHangId().equals(khachHangId)) {
            System.err.println("Debug - Địa chỉ không thuộc về khách hàng này. Địa chỉ khách hàng ID: " + diaChi.getKhachHangId() + ", Khách hàng hiện tại ID: " + khachHangId);
            throw new RuntimeException("Địa chỉ không thuộc về khách hàng này");
        }
        System.out.println("Debug - Địa chỉ hợp lệ");

        // Validate phương thức thanh toán
        System.out.println("Debug - Validating phương thức thanh toán với ID: " + request.getPhuongThucThanhToanId());
        if (!phuongThucThanhToanRepository.existsById(request.getPhuongThucThanhToanId())) {
            System.err.println("Debug - Phương thức thanh toán không tồn tại với ID: " + request.getPhuongThucThanhToanId());
            throw new RuntimeException("Phương thức thanh toán không hợp lệ");
        }
        System.out.println("Debug - Phương thức thanh toán hợp lệ");

        // Validate voucher (nếu có)
        if (request.getVoucherId() != null) {
            if (!voucherRepository.existsById(request.getVoucherId())) {
                throw new RuntimeException("Voucher không hợp lệ");
            }
        }
    }

    private DonHang createDonHang(CheckoutRequest request, KhachHang khachHang) {
        DonHang donHang = new DonHang();
        donHang.setMaDonHang(generateMaDonHang());
        donHang.setLoaiDonHang(true); // Online
        donHang.setNgayDat(LocalDateTime.now());
        donHang.setTongTienHang(request.getTongTienHang());
        donHang.setTongThanhToan(request.getTongThanhToan());
        donHang.setKhachHang(khachHang);
        return donHang;
    }

    private void createChiTietDonHang(CheckoutRequest request, DonHang donHang, KhachHang khachHang) {
        try {
            System.out.println("Debug - Bắt đầu createChiTietDonHang");
            
            // Lấy địa chỉ
            System.out.println("Debug - Tìm địa chỉ với ID: " + request.getDiaChiId());
            DiaChiKhachHang diaChi = diaChiRepository.findById(request.getDiaChiId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy địa chỉ"));
            System.out.println("Debug - Đã tìm thấy địa chỉ: " + diaChi.getDiaChiChiTiet() + ", " + diaChi.getPhuongXa() + ", " + diaChi.getQuanHuyen() + ", " + diaChi.getTinhThanh());

            // Lấy phương thức thanh toán
            System.out.println("Debug - Tìm phương thức thanh toán với ID: " + request.getPhuongThucThanhToanId());
            PhuongThucThanhToan phuongThucThanhToan = phuongThucThanhToanRepository.findById(request.getPhuongThucThanhToanId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy phương thức thanh toán"));
            System.out.println("Debug - Đã tìm thấy phương thức thanh toán: " + phuongThucThanhToan.getTenPhuongThuc());

            // Lấy trạng thái mặc định (Chờ xác nhận)
            System.out.println("Debug - Tìm trạng thái đơn hàng với ID: 1");
            TrangThaiDonHang trangThai = trangThaiDonHangRepository.findById(1)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy trạng thái đơn hàng"));
            System.out.println("Debug - Đã tìm thấy trạng thái: " + trangThai.getTenTrangThai());

            // Lấy voucher (nếu có)
            Voucher voucher = null;
            if (request.getVoucherId() != null) {
                System.out.println("Debug - Tìm voucher với ID: " + request.getVoucherId());
                voucher = voucherRepository.findById(request.getVoucherId())
                        .orElse(null);
                if (voucher != null) {
                    System.out.println("Debug - Đã tìm thấy voucher: " + voucher.getTenVoucher());
                } else {
                    System.out.println("Debug - Không tìm thấy voucher");
                }
            } else {
                System.out.println("Debug - Không có voucher");
            }

            // Tạo chi tiết đơn hàng cho từng sản phẩm
            System.out.println("Debug - Số lượng cart items: " + request.getCartItems().size());
            for (int i = 0; i < request.getCartItems().size(); i++) {
                CartItemRequest cartItem = request.getCartItems().get(i);
                System.out.println("Debug - Xử lý cart item " + (i + 1) + ": " + cartItem);
                
                System.out.println("Debug - Tìm chi tiết sản phẩm với ID: " + cartItem.getChiTietSanPhamId());
                ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(cartItem.getChiTietSanPhamId())
                        .orElseThrow(() -> new RuntimeException("Không tìm thấy sản phẩm: " + cartItem.getChiTietSanPhamId()));
                System.out.println("Debug - Đã tìm thấy sản phẩm: " + chiTietSanPham.getSanPham().getTenSanPham());

                System.out.println("Debug - Tạo ChiTietDonHang object");
                ChiTietDonHang chiTietDonHang = new ChiTietDonHang();
                chiTietDonHang.setDonHang(donHang);
                chiTietDonHang.setChiTietSanPham(chiTietSanPham);
                chiTietDonHang.setTrangThai(trangThai);
                chiTietDonHang.setKhachHang(khachHang);
                // Tạo DiaChi object từ DiaChiKhachHang để tương thích với ChiTietDonHang
                DiaChi diaChiForOrder = new DiaChi();
                diaChiForOrder.setId(diaChi.getId());
                // Tạo KhachHang object
                KhachHang khachHangForAddress = new KhachHang();
                khachHangForAddress.setId(diaChi.getKhachHangId());
                diaChiForOrder.setKhachHang(khachHangForAddress);
                diaChiForOrder.setTinhThanh(diaChi.getTinhThanh());
                diaChiForOrder.setQuanHuyen(diaChi.getQuanHuyen());
                diaChiForOrder.setPhuongXa(diaChi.getPhuongXa());
                diaChiForOrder.setDuong(diaChi.getDiaChiChiTiet());
                
                chiTietDonHang.setDiaChi(diaChiForOrder);
                chiTietDonHang.setVoucher(voucher);
                chiTietDonHang.setPhuongThucThanhToan(phuongThucThanhToan);
                chiTietDonHang.setNgayThanhToan(LocalDateTime.now());
                chiTietDonHang.setPhiVanChuyen(request.getPhiVanChuyen());
                chiTietDonHang.setTienGiamGia(request.getTongTienHang().subtract(request.getTongThanhToan()));
                chiTietDonHang.setSoLuong(cartItem.getSoLuong());
                chiTietDonHang.setGhiChuKhachHang(request.getGhiChuKhachHang());

                System.out.println("Debug - Lưu ChiTietDonHang");
                chiTietDonHangRepository.save(chiTietDonHang);
                System.out.println("Debug - Đã lưu ChiTietDonHang thành công");

                // TRỪ SỐ LƯỢNG SẢN PHẨM TRONG KHO
                System.out.println("Debug - Trừ số lượng sản phẩm trong kho");
                System.out.println("Debug - Số lượng trước khi trừ: " + chiTietSanPham.getSoLuong());
                System.out.println("Debug - Số lượng đặt: " + cartItem.getSoLuong());
                
                int soLuongMoi = chiTietSanPham.getSoLuong() - cartItem.getSoLuong();
                if (soLuongMoi < 0) {
                    throw new RuntimeException("Số lượng tồn kho không đủ cho sản phẩm: " + chiTietSanPham.getSanPham().getTenSanPham());
                }
                
                chiTietSanPham.setSoLuong(soLuongMoi);
                System.out.println("Debug - Đã set số lượng mới: " + soLuongMoi);
                
                try {
                    ChiTietSanPham savedChiTietSanPham = chiTietSanPhamRepository.save(chiTietSanPham);
                    System.out.println("Debug - Đã lưu chiTietSanPham. Số lượng sau khi lưu: " + savedChiTietSanPham.getSoLuong());
                    System.out.println("Debug - Đã trừ số lượng sản phẩm thành công!");
                } catch (Exception e) {
                    System.err.println("Debug - Lỗi khi lưu chiTietSanPham: " + e.getMessage());
                    e.printStackTrace();
                    throw e;
                }
            }
            
            System.out.println("Debug - Hoàn thành createChiTietDonHang");
            
        } catch (Exception e) {
            System.err.println("Debug - Lỗi trong createChiTietDonHang: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public String generateMaDonHang() {
        LocalDateTime now = LocalDateTime.now();
        String dateStr = now.format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        
        // Đếm số đơn hàng hôm nay
        LocalDateTime startOfDay = now.toLocalDate().atStartOfDay();
        Long countToday = donHangRepository.countDonHangToday(startOfDay);
        
        // Tạo mã: DH + YYYYMMDD + số thứ tự (4 chữ số)
        String orderNumber = String.format("%04d", countToday + 1);
        return "DH" + dateStr + orderNumber;
    }
}
