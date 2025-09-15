package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.ThongKeDto.DoanhThuDto;
import com.example.ZMEN.dto.ThongKeDto.HieuSuatNVDto;
import com.example.ZMEN.dto.ThongKeDto.KhachHangChiTieuDto;
import com.example.ZMEN.dto.ThongKeDto.SanPhamBanChayDto;
import com.example.ZMEN.repository.ThongKeRepository;
import com.example.ZMEN.service.ThongKeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ThongKeImpl implements ThongKeService {
    @Autowired
    private ThongKeRepository thongKeRepository;

    private SanPhamBanChayDto mapToDto(Object[] obj) {
        return new SanPhamBanChayDto(
                (String) obj[0],
                ((Number) obj[1]).longValue(),
                obj.length > 2 ? ((Number) obj[2]).doubleValue() : 0.0
        );
    }

    @Override
    public List<SanPhamBanChayDto> thongKeTheoNgay(LocalDate ngay) {
        return thongKeRepository.thongKeTheoNgay(ngay).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SanPhamBanChayDto> thongKeTheoThang(int thang, int nam) {
        return thongKeRepository.thongKeTheoThang(thang, nam)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SanPhamBanChayDto> thongKeTheoNam(int nam) {
        return thongKeRepository.thongKeTheoNam(nam)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SanPhamBanChayDto> thongKeTheoKhoangNgay(LocalDate tuNgay, LocalDate denNgay) {
        return thongKeRepository.thongKeTheoKhoangNgay(tuNgay, denNgay)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    // ==================== DOANH THU ====================
    @Override
    public DoanhThuDto tinhDoanhThuTheoNgay(LocalDate ngay) {
        Long tong = thongKeRepository.tinhDoanhThuTheoNgay(ngay);
        return new DoanhThuDto(ngay.toString(), tong != null ? tong : 0L);
    }

    @Override
    public DoanhThuDto tinhDoanhThuTheoThang(int thang, int nam) {
        Long tong = thongKeRepository.tinhDoanhThuTheoThang(thang, nam);
        return new DoanhThuDto("Tháng " + thang + "/" + nam, tong != null ? tong : 0L);
    }

    @Override
    public DoanhThuDto tinhDoanhThuTheoNam(int nam) {
        Long tong = thongKeRepository.tinhDoanhThuTheoNam(nam);
        return new DoanhThuDto("Năm " + nam, tong != null ? tong : 0L);
    }

    @Override
    public DoanhThuDto tinhDoanhThuTheoKhoangNgay(LocalDate tuNgay, LocalDate denNgay) {
        Long tong = thongKeRepository.tinhDoanhThuTheoKhoangNgay(tuNgay, denNgay);
        String moTa = "Từ " + tuNgay.toString() + " đến " + denNgay.toString();
        return new DoanhThuDto(moTa, tong != null ? tong : 0L);
    }

    // Các method mới cho doanh thu
    @Override
    public DoanhThuDto getDoanhThuTheoNgay(LocalDate ngay) {
        return tinhDoanhThuTheoNgay(ngay);
    }

    @Override
    public DoanhThuDto getDoanhThuTheoThang(int thang, int nam) {
        return tinhDoanhThuTheoThang(thang, nam);
    }

    @Override
    public DoanhThuDto getDoanhThuTheoNam(int nam) {
        return tinhDoanhThuTheoNam(nam);
    }

    @Override
    public DoanhThuDto getDoanhThuKhoangNgay(LocalDate tuNgay, LocalDate denNgay) {
        return tinhDoanhThuTheoKhoangNgay(tuNgay, denNgay);
    }

    // ==================== HIỆU SUẤT NHÂN VIÊN ====================
    private HieuSuatNVDto mapToNhanVienDto(Object[] row) {
        return new HieuSuatNVDto(
                ((Number) row[0]).longValue(),    // idNhanVien
                (String) row[1],                  // hoTen
                ((Number) row[2]).longValue(),    // soLuongDon
                ((BigDecimal) row[3])             // tongDoanhThu
        );
    }

    @Override
    public List<HieuSuatNVDto> hieuSuatNhanVienTheoNgay(LocalDate ngay) {
        return thongKeRepository.hieuSuatNhanVienTheoNgay(ngay)
                .stream().map(this::mapToNhanVienDto).collect(Collectors.toList());
    }

    @Override
    public List<HieuSuatNVDto> hieuSuatNhanVienTheoThang(int thang, int nam) {
        return thongKeRepository.hieuSuatNhanVienTheoThang(thang, nam)
                .stream().map(this::mapToNhanVienDto).collect(Collectors.toList());
    }

    @Override
    public List<HieuSuatNVDto> hieuSuatNhanVienTheoNam(int nam) {
        return thongKeRepository.hieuSuatNhanVienTheoNam(nam)
                .stream().map(this::mapToNhanVienDto).collect(Collectors.toList());
    }

    @Override
    public List<HieuSuatNVDto> hieuSuatNhanVienTheoKhoangNgay(LocalDate tuNgay, LocalDate denNgay) {
        return thongKeRepository.hieuSuatNhanVienTheoKhoangNgay(tuNgay, denNgay)
                .stream().map(this::mapToNhanVienDto).collect(Collectors.toList());
    }

    // Các method mới cho hiệu suất nhân viên
    @Override
    public List<HieuSuatNVDto> getHieuSuatNVTheoNgay(LocalDate ngay) {
        return hieuSuatNhanVienTheoNgay(ngay);
    }

    @Override
    public List<HieuSuatNVDto> getHieuSuatNVTheoThang(int thang, int nam) {
        return hieuSuatNhanVienTheoThang(thang, nam);
    }

    @Override
    public List<HieuSuatNVDto> getHieuSuatNVTheoNam(int nam) {
        return hieuSuatNhanVienTheoNam(nam);
    }

    @Override
    public List<HieuSuatNVDto> getHieuSuatNVKhoangNgay(LocalDate tuNgay, LocalDate denNgay) {
        return hieuSuatNhanVienTheoKhoangNgay(tuNgay, denNgay);
    }

    // ==================== KHÁCH HÀNG CHI TIÊU ====================
    private KhachHangChiTieuDto mapToKhachHangDto(Object[] row) {
        return new KhachHangChiTieuDto(
                ((Number) row[0]).intValue(),              // id
                (String) row[1],                           // hoTen
                (String) row[2],                           // email
                (String) row[3],                           // sdt
                ((Number) row[4]).longValue(),             // soLuongDon
                ((BigDecimal) row[5])                      // tongChiTieu
        );
    }

    @Override
    public List<KhachHangChiTieuDto> khachHangChiTieuTheoNgay(LocalDate ngay) {
        return thongKeRepository.khachHangChiTieuTheoNgay(ngay)
                .stream().map(this::mapToKhachHangDto).collect(Collectors.toList());
    }

    @Override
    public List<KhachHangChiTieuDto> khachHangChiTieuTheoThang(int thang, int nam) {
        return thongKeRepository.khachHangChiTieuTheoThang(thang, nam)
                .stream().map(this::mapToKhachHangDto).collect(Collectors.toList());
    }

    @Override
    public List<KhachHangChiTieuDto> khachHangChiTieuTheoNam(int nam) {
        return thongKeRepository.khachHangChiTieuTheoNam(nam)
                .stream().map(this::mapToKhachHangDto).collect(Collectors.toList());
    }

    @Override
    public List<KhachHangChiTieuDto> khachHangChiTieuTheoKhoangNgay(LocalDate batDau, LocalDate ketThuc) {
        return thongKeRepository.khachHangChiTieuTheoKhoangNgay(batDau, ketThuc)
                .stream().map(this::mapToKhachHangDto).collect(Collectors.toList());
    }

    // Các method mới cho khách hàng chi tiêu
    @Override
    public List<KhachHangChiTieuDto> getKhachHangChiTieuTheoNgay(LocalDate ngay) {
        return khachHangChiTieuTheoNgay(ngay);
    }

    @Override
    public List<KhachHangChiTieuDto> getKhachHangChiTieuTheoThang(int thang, int nam) {
        return khachHangChiTieuTheoThang(thang, nam);
    }

    @Override
    public List<KhachHangChiTieuDto> getKhachHangChiTieuTheoNam(int nam) {
        return khachHangChiTieuTheoNam(nam);
    }

    @Override
    public List<KhachHangChiTieuDto> getKhachHangChiTieuKhoangNgay(LocalDate tuNgay, LocalDate denNgay) {
        return khachHangChiTieuTheoKhoangNgay(tuNgay, denNgay);
    }

    // ==================== THỐNG KÊ TỔNG QUAN ====================
    @Override
    public Long getTongDonHang() {
        return thongKeRepository.getTongDonHang();
    }

    @Override
    public Long getTongKhachHang() {
        return thongKeRepository.getTongKhachHang();
    }

    @Override
    public Long getTongSanPham() {
        return thongKeRepository.getTongSanPham();
    }

    @Override
    public Double getDoanhThuHomNay() {
        return thongKeRepository.getDoanhThuHomNay();
    }

    @Override
    public Double getDoanhThuThangNay() {
        return thongKeRepository.getDoanhThuThangNay();
    }

    @Override
    public Double getDoanhThuNamNay() {
        return thongKeRepository.getDoanhThuNamNay();
    }

    @Override
    public Double getTangTruongThang() {
        return thongKeRepository.getTangTruongThang();
    }

    @Override
    public Double getTangTruongNam() {
        return thongKeRepository.getTangTruongNam();
    }

    @Override
    public Integer getKhachHangMoi() {
        return thongKeRepository.getKhachHangMoi();
    }

    @Override
    public Double getTyLeHuy() {
        return thongKeRepository.getTyLeHuy();
    }

    @Override
    public List<Map<String, Object>> getDonHangList(String filterType, LocalDate selectedDate, Integer selectedMonth, Integer selectedYear, LocalDate dateFrom, LocalDate dateTo) {
        List<Object[]> results = thongKeRepository.getDonHangList(filterType, selectedDate, selectedMonth, selectedYear, dateFrom, dateTo);
        return results.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("maDonHang", obj[0]);
            map.put("khachHang", obj[1]);
            map.put("ngayDat", obj[2]);
            map.put("tongTien", obj[3]);
            map.put("trangThai", obj[4]);
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getTopSanPhamBanChayThang() {
        List<Object[]> results = thongKeRepository.getTopSanPhamBanChayThang();
        return results.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("tenSanPham", obj[0]);
            map.put("soLuongBan", obj[1]);
            map.put("doanhThu", obj[2]);
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getTopKhachHangThang() {
        List<Object[]> results = thongKeRepository.getTopKhachHangThang();
        return results.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("hoTen", obj[0]);
            map.put("soLuongDon", obj[1]);
            map.put("tongChiTieu", obj[2]);
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public Map<String, Object> getThongKeTongQuan() {
        Map<String, Object> result = new HashMap<>();
        
        // Thống kê tổng quan
        result.put("tongDonHang", getTongDonHang());
        result.put("tongKhachHang", getTongKhachHang());
        result.put("tongSanPham", getTongSanPham());
        result.put("doanhThuHomNay", getDoanhThuHomNay());
        result.put("doanhThuThangNay", getDoanhThuThangNay());
        result.put("doanhThuNamNay", getDoanhThuNamNay());
        
        // Tỷ lệ tăng trưởng
        result.put("tangTruongThang", getTangTruongThang());
        result.put("tangTruongNam", getTangTruongNam());
        
        // Top sản phẩm bán chạy tháng
        result.put("topSanPhamThang", getTopSanPhamBanChayThang());
        
        // Top khách hàng tháng
        result.put("topKhachHangThang", getTopKhachHangThang());
        
        return result;
    }

    // ==================== BIỂU ĐỒ VÀ PHÂN TÍCH ====================
    @Override
    public List<Map<String, Object>> getBieuDoDoanhThu(String loai, Integer nam, Integer thang) {
        List<Object[]> results = thongKeRepository.getBieuDoDoanhThu(loai, nam, thang);
        return results.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("thoiGian", obj[0]);
            map.put("doanhThu", obj[1]);
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getDoanhThuTheoDanhMuc(Integer nam, Integer thang) {
        List<Object[]> results = thongKeRepository.getDoanhThuTheoDanhMuc(nam, thang);
        return results.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("tenDanhMuc", obj[0]);
            map.put("doanhThu", obj[1]);
            return map;
        }).collect(Collectors.toList());
    }

    @Override
    public List<Map<String, Object>> getThongKeThanhToan(Integer nam, Integer thang) {
        List<Object[]> results = thongKeRepository.getThongKeThanhToan(nam, thang);
        return results.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("phuongThuc", obj[0]);
            map.put("soLuong", obj[1]);
            map.put("tongTien", obj[2]);
            return map;
        }).collect(Collectors.toList());
    }
}

