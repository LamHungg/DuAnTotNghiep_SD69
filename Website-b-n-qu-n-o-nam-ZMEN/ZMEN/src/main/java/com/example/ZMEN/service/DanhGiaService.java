package com.example.ZMEN.service;

import com.example.ZMEN.dto.DanhGiaDTO;
import com.example.ZMEN.dto.ThongKeDanhGiaDTO;

import java.util.List;

public interface DanhGiaService {
    
    // Lấy tất cả đánh giá của sản phẩm
    List<DanhGiaDTO> getDanhGiaBySanPhamId(Integer idSanPham);
    
    // Lấy thống kê đánh giá của sản phẩm
    ThongKeDanhGiaDTO getThongKeDanhGiaBySanPhamId(Integer idSanPham);
    
    // Tạo đánh giá mới
    DanhGiaDTO createDanhGia(DanhGiaDTO danhGiaDTO);
    
    // Cập nhật đánh giá
    DanhGiaDTO updateDanhGia(Integer id, DanhGiaDTO danhGiaDTO);
    
    // Xóa đánh giá (ẩn)
    void deleteDanhGia(Integer id);
    
    // Kiểm tra khách hàng đã đánh giá sản phẩm chưa
    boolean hasKhachHangReviewed(Integer idKhachHang, Integer idSanPham);
    
    // Lấy đánh giá của khách hàng cho sản phẩm
    DanhGiaDTO getDanhGiaByKhachHangAndSanPham(Integer idKhachHang, Integer idSanPham);
}
