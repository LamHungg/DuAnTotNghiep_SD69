package com.example.ZMEN.dto;

import lombok.Data;
import java.math.BigDecimal; // Dùng BigDecimal cho tiền tệ để tránh sai số
import java.util.List;

/**
 * "Thực đơn" chứa tất cả thông tin cần thiết để hiển thị 1 thẻ sản phẩm.
 */
@Data
public class ProductCardDTO {

    /**
     * ID của sản phẩm.
     * Để làm gì? Khi người dùng bấm vào sản phẩm này, 
     * frontend sẽ biết phải mở trang chi tiết của sản phẩm có ID là bao nhiêu.
     */
    private Integer sanPhamId;

    /**
     * Tên sản phẩm để hiển thị.
     * Ví dụ: "Áo Thun Local Brand Unisex Teelab"
     */
    private String tenSanPham;

    /**
     * Đường dẫn tới cái ảnh đại diện để hiển thị.
     */
    private String hinhAnhUrl;

    /**
     * Giá bán cuối cùng mà khách hàng phải trả (giá màu đỏ).
     * Ví dụ: 210,000đ
     */
    private BigDecimal giaBan;

    /**
     * Giá gốc của sản phẩm (giá bị gạch đi).
     * Trường này có thể không có giá trị (null) nếu sản phẩm không giảm giá.
     * Frontend sẽ kiểm tra: nếu `giaGoc` tồn tại, thì hiển thị nó và gạch đi.
     * Ví dụ: 300,000đ
     */
    private BigDecimal giaGoc;

    /**
     * Danh sách các màu sắc có sẵn của sản phẩm.
     * Đây là nơi chúng ta dùng lại cái "menu màu sắc" (MauSacDTO) ở trên.
     * Nó là một danh sách các chấm tròn màu.
     */
    private List<MauSacDTO> danhSachMauSac;
}