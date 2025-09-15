package com.example.ZMEN.service;

import com.example.ZMEN.dto.ThongKeDto.DoanhThuDto;
import com.example.ZMEN.dto.ThongKeDto.HieuSuatNVDto;
import com.example.ZMEN.dto.ThongKeDto.KhachHangChiTieuDto;
import com.example.ZMEN.dto.ThongKeDto.SanPhamBanChayDto;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface ThongKeService {
    // ==================== SẢN PHẨM BÁN CHẠY ====================
    List<SanPhamBanChayDto> thongKeTheoNgay(LocalDate ngay);
    List<SanPhamBanChayDto> thongKeTheoThang(int thang, int nam);
    List<SanPhamBanChayDto> thongKeTheoNam(int nam);
    List<SanPhamBanChayDto> thongKeTheoKhoangNgay(LocalDate tuNgay, LocalDate denNgay);

    // ==================== DOANH THU ====================
    DoanhThuDto tinhDoanhThuTheoNgay(LocalDate ngay);
    DoanhThuDto tinhDoanhThuTheoThang(int thang, int nam);
    DoanhThuDto tinhDoanhThuTheoNam(int nam);
    DoanhThuDto tinhDoanhThuTheoKhoangNgay(LocalDate tuNgay, LocalDate denNgay);
    
    // Các method mới cho doanh thu
    DoanhThuDto getDoanhThuTheoNgay(LocalDate ngay);
    DoanhThuDto getDoanhThuTheoThang(int thang, int nam);
    DoanhThuDto getDoanhThuTheoNam(int nam);
    DoanhThuDto getDoanhThuKhoangNgay(LocalDate tuNgay, LocalDate denNgay);

    // ==================== HIỆU SUẤT NHÂN VIÊN ====================
    List<HieuSuatNVDto> hieuSuatNhanVienTheoNgay(LocalDate ngay);
    List<HieuSuatNVDto> hieuSuatNhanVienTheoThang(int thang, int nam);
    List<HieuSuatNVDto> hieuSuatNhanVienTheoNam(int nam);
    List<HieuSuatNVDto> hieuSuatNhanVienTheoKhoangNgay(LocalDate tuNgay, LocalDate denNgay);
    
    // Các method mới cho hiệu suất nhân viên
    List<HieuSuatNVDto> getHieuSuatNVTheoNgay(LocalDate ngay);
    List<HieuSuatNVDto> getHieuSuatNVTheoThang(int thang, int nam);
    List<HieuSuatNVDto> getHieuSuatNVTheoNam(int nam);
    List<HieuSuatNVDto> getHieuSuatNVKhoangNgay(LocalDate tuNgay, LocalDate denNgay);

    // ==================== KHÁCH HÀNG CHI TIÊU ====================
    List<KhachHangChiTieuDto> khachHangChiTieuTheoNgay(LocalDate ngay);
    List<KhachHangChiTieuDto> khachHangChiTieuTheoThang(int thang, int nam);
    List<KhachHangChiTieuDto> khachHangChiTieuTheoNam(int nam);
    List<KhachHangChiTieuDto> khachHangChiTieuTheoKhoangNgay(LocalDate batDau, LocalDate ketThuc);
    
    // Các method mới cho khách hàng chi tiêu
    List<KhachHangChiTieuDto> getKhachHangChiTieuTheoNgay(LocalDate ngay);
    List<KhachHangChiTieuDto> getKhachHangChiTieuTheoThang(int thang, int nam);
    List<KhachHangChiTieuDto> getKhachHangChiTieuTheoNam(int nam);
    List<KhachHangChiTieuDto> getKhachHangChiTieuKhoangNgay(LocalDate tuNgay, LocalDate denNgay);

    // ==================== DANH SÁCH ĐƠN HÀNG ====================
    List<Map<String, Object>> getDonHangList(String filterType, LocalDate selectedDate, Integer selectedMonth, Integer selectedYear, LocalDate dateFrom, LocalDate dateTo);

    // ==================== THỐNG KÊ TỔNG QUAN ====================
    Long getTongDonHang();
    Long getTongKhachHang();
    Long getTongSanPham();
    Double getDoanhThuHomNay();
    Double getDoanhThuThangNay();
    Double getDoanhThuNamNay();
    Double getTangTruongThang();
    Double getTangTruongNam();
    Integer getKhachHangMoi();
    Double getTyLeHuy();
    List<Map<String, Object>> getTopSanPhamBanChayThang();
    List<Map<String, Object>> getTopKhachHangThang();
    
    // Method tổng hợp cho thống kê tổng quan
    Map<String, Object> getThongKeTongQuan();

    // ==================== BIỂU ĐỒ VÀ PHÂN TÍCH ====================
    List<Map<String, Object>> getBieuDoDoanhThu(String loai, Integer nam, Integer thang);
    List<Map<String, Object>> getDoanhThuTheoDanhMuc(Integer nam, Integer thang);
    List<Map<String, Object>> getThongKeThanhToan(Integer nam, Integer thang);
}
