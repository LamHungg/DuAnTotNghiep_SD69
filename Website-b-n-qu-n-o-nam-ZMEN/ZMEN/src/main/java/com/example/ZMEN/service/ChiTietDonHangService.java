package com.example.ZMEN.service;

import com.example.ZMEN.entity.ChiTietDonHang;
import java.util.List;

public interface ChiTietDonHangService {
    
    // Lấy tất cả chi tiết đơn hàng
    List<ChiTietDonHang> getAllChiTietDonHang();
    
    // Lấy chi tiết đơn hàng theo ID
    ChiTietDonHang getChiTietDonHangById(Integer id);
    
    // Lấy chi tiết đơn hàng theo mã đơn hàng
    List<ChiTietDonHang> getChiTietDonHangByDonHangId(Integer donHangId);
    
    // Lưu chi tiết đơn hàng
    ChiTietDonHang saveChiTietDonHang(ChiTietDonHang chiTietDonHang);
    
    // Cập nhật chi tiết đơn hàng
    ChiTietDonHang updateChiTietDonHang(ChiTietDonHang chiTietDonHang);
    
    // Xóa chi tiết đơn hàng
    void deleteChiTietDonHang(Integer id);
    
    // Xóa tất cả chi tiết đơn hàng theo mã đơn hàng
    void deleteChiTietDonHangByDonHangId(Integer donHangId);
}
