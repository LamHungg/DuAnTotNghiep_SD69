package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.CartItemDTO;
import com.example.ZMEN.dto.request.AddToCartRequestDTO;
import com.example.ZMEN.entity.ChiTietGioHang;
import com.example.ZMEN.entity.ChiTietSanPham;
import com.example.ZMEN.entity.GioHang;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.repository.ChiTietGioHangRepository;
import com.example.ZMEN.repository.ChiTietSanPhamRepository;
import com.example.ZMEN.repository.GioHangRepository;
import com.example.ZMEN.repository.KhachHangRepository;
import com.example.ZMEN.service.GioHangService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class GioHangImpl implements GioHangService {
    @Autowired
    private GioHangRepository gioHangRepository;

    @Autowired
    private ChiTietGioHangRepository chiTietGioHangRepository;

    @Autowired
    private ChiTietSanPhamRepository chiTietSanPhamRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Override
    @Transactional
    public void addItemToCart(Integer idKhachHang, AddToCartRequestDTO request) {
        // 1. Lấy thông tin chi tiết sản phẩm và khách hàng
        ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(request.getChiTietSanPhamId())
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy chi tiết sản phẩm với ID: " + request.getChiTietSanPhamId()));

        KhachHang khachHang = khachHangRepository.findById(idKhachHang)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy khách hàng với ID: " + idKhachHang));

        // 2. Kiểm tra trạng thái sản phẩm
        if (chiTietSanPham.getTrangThai() != null && chiTietSanPham.getTrangThai() != 1) {
            throw new IllegalStateException("Sản phẩm " + chiTietSanPham.getSanPham().getTenSanPham() + " đã ngừng bán");
        }

        // 3. Tìm hoặc tạo giỏ hàng cho khách
        GioHang gioHang = gioHangRepository.findByIdKhachHang_Id(idKhachHang)
                .orElseGet(() -> {
                    GioHang newCart = new GioHang();
                    newCart.setIdKhachHang(khachHang);
                    newCart.setNgayTao(LocalDateTime.now());
                    return gioHangRepository.save(newCart);
                });

        // 4. Kiểm tra sản phẩm đã có trong giỏ chưa
        Optional<ChiTietGioHang> existingItem = chiTietGioHangRepository.findByIdGioHang_IdAndIdChiTietSanPham_Id(gioHang.getId(), chiTietSanPham.getId());

        int soLuongMoi = request.getSoLuong();
        
        if (existingItem.isPresent()) {
            // Nếu đã có, tính tổng số lượng mới
            ChiTietGioHang item = existingItem.get();
            soLuongMoi = item.getSoLuong() + request.getSoLuong();
        }

        // 5. Kiểm tra số lượng tồn kho
        if (chiTietSanPham.getSoLuong() < soLuongMoi) {
            throw new IllegalStateException("Số lượng tồn kho không đủ. Có: " + chiTietSanPham.getSoLuong() + ", Cần: " + soLuongMoi);
        }

        // 6. Cập nhật hoặc tạo mới item trong giỏ hàng
        if (existingItem.isPresent()) {
            // Nếu đã có, cập nhật số lượng
            ChiTietGioHang item = existingItem.get();
            item.setSoLuong(soLuongMoi);
            chiTietGioHangRepository.save(item);
        } else {
            // Nếu chưa có, tạo mới
            ChiTietGioHang newItem = new ChiTietGioHang();
            newItem.setIdGioHang(gioHang);
            newItem.setIdChiTietSanPham(chiTietSanPham);
            newItem.setSoLuong(request.getSoLuong());
            chiTietGioHangRepository.save(newItem);
        }

        // 7. Cập nhật thời gian cho giỏ hàng
        gioHang.setNgayCapNhat(LocalDateTime.now());
        gioHangRepository.save(gioHang);
    }

    @Override
    public List<CartItemDTO> getCartItems(Integer idKhachHang) {
        try {
            // Tìm giỏ hàng của khách hàng
            GioHang gioHang = gioHangRepository.findByIdKhachHang_Id(idKhachHang)
                    .orElse(null);
            
            // Nếu không có giỏ hàng, trả về list rỗng
            if (gioHang == null) {
                return new ArrayList<>();
            }

            // Lấy tất cả items trong giỏ hàng
            List<ChiTietGioHang> cartItems = chiTietGioHangRepository.findByIdGioHang_Id(gioHang.getId());

            return cartItems.stream().map(this::convertToCartItemDTO).collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("Lỗi getCartItems: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    @Override
    @Transactional
    public void updateCartItemQuantity(Integer idKhachHang, Integer cartItemId, Integer soLuong) {
        // Kiểm tra quyền sở hữu
        ChiTietGioHang cartItem = chiTietGioHangRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy item trong giỏ hàng"));

        GioHang gioHang = gioHangRepository.findByIdKhachHang_Id(idKhachHang)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy giỏ hàng"));

        if (!cartItem.getIdGioHang().getId().equals(gioHang.getId())) {
            throw new IllegalStateException("Không có quyền cập nhật item này");
        }

        // Kiểm tra số lượng tồn kho
        ChiTietSanPham chiTietSanPham = cartItem.getIdChiTietSanPham();
        if (chiTietSanPham.getSoLuong() < soLuong) {
            throw new IllegalStateException("Số lượng tồn kho không đủ");
        }

        // Cập nhật số lượng
        cartItem.setSoLuong(soLuong);
        chiTietGioHangRepository.save(cartItem);

        // Cập nhật thời gian giỏ hàng
        gioHang.setNgayCapNhat(LocalDateTime.now());
        gioHangRepository.save(gioHang);
    }

    @Override
    @Transactional
    public void removeFromCart(Integer idKhachHang, Integer cartItemId) {
        // Kiểm tra quyền sở hữu
        ChiTietGioHang cartItem = chiTietGioHangRepository.findById(cartItemId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy item trong giỏ hàng"));

        GioHang gioHang = gioHangRepository.findByIdKhachHang_Id(idKhachHang)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy giỏ hàng"));

        if (!cartItem.getIdGioHang().getId().equals(gioHang.getId())) {
            throw new IllegalStateException("Không có quyền xóa item này");
        }

        // Xóa item
        chiTietGioHangRepository.delete(cartItem);

        // Cập nhật thời gian giỏ hàng
        gioHang.setNgayCapNhat(LocalDateTime.now());
        gioHangRepository.save(gioHang);
    }

    @Override
    @Transactional
    public void clearCart(Integer idKhachHang) {
        GioHang gioHang = gioHangRepository.findByIdKhachHang_Id(idKhachHang)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy giỏ hàng"));

        // Xóa tất cả items trong giỏ hàng
        List<ChiTietGioHang> cartItems = chiTietGioHangRepository.findByIdGioHang_Id(gioHang.getId());
        chiTietGioHangRepository.deleteAll(cartItems);

        // Cập nhật thời gian giỏ hàng
        gioHang.setNgayCapNhat(LocalDateTime.now());
        gioHangRepository.save(gioHang);
    }

    @Override
    public Integer getCartItemCount(Integer idKhachHang) {
        try {
            GioHang gioHang = gioHangRepository.findByIdKhachHang_Id(idKhachHang)
                    .orElse(null);
            
            if (gioHang == null) {
                return 0;
            }

            List<ChiTietGioHang> cartItems = chiTietGioHangRepository.findByIdGioHang_Id(gioHang.getId());
            return cartItems.stream().mapToInt(ChiTietGioHang::getSoLuong).sum();
        } catch (Exception e) {
            return 0;
        }
    }

    // Helper method để convert entity sang DTO
    private CartItemDTO convertToCartItemDTO(ChiTietGioHang cartItem) {
        ChiTietSanPham chiTietSanPham = cartItem.getIdChiTietSanPham();
        
        // Lấy URL ảnh đầu tiên nếu có
        String hinhAnh = "";
        if (chiTietSanPham.getIdHinhAnhSanPham() != null) {
            hinhAnh = chiTietSanPham.getIdHinhAnhSanPham().getUrl();
        }

        // Tính thành tiền
        BigDecimal thanhTien = BigDecimal.valueOf(chiTietSanPham.getGia() * cartItem.getSoLuong());

        return new CartItemDTO(
            cartItem.getId(), // ID của ChiTietGioHang (để xóa/cập nhật)
            chiTietSanPham.getId(), // ID của ChiTietSanPham (để checkout)
            chiTietSanPham.getSanPham().getTenSanPham(),
            hinhAnh,
            chiTietSanPham.getKichCo().getTenKichCo(),
            chiTietSanPham.getMauSac().getTenMauSac(),
            chiTietSanPham.getChatLieu().getTenChatLieu(),
            cartItem.getSoLuong(),
            BigDecimal.valueOf(chiTietSanPham.getGia()),
            thanhTien,
            chiTietSanPham.getSoLuong()
        );
    }
}
