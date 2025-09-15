package com.example.ZMEN.mapper;

import com.example.ZMEN.dto.ChiTietDonHangDto;
import com.example.ZMEN.dto.ChiTietSanPhamDTO;
import com.example.ZMEN.dto.DonHangDto;
import com.example.ZMEN.dto.LichSuDonHangDto;
import com.example.ZMEN.entity.ChiTietDonHang;
import com.example.ZMEN.entity.DiaChi;
import com.example.ZMEN.entity.DonHang;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.entity.LichSuDonHang;
import com.example.ZMEN.entity.NguoiDung;
import com.example.ZMEN.entity.TrangThaiDonHang;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class DonHangMapper {
    private DonHangMapper() {}

    public static DonHangDto toDonHangDto(List<ChiTietDonHang> chiTietList) {
        if (chiTietList == null || chiTietList.isEmpty()) {
            return null;
        }
        
        ChiTietDonHang firstItem = chiTietList.get(0);
        DonHang donHang = firstItem.getDonHang();
        
        if (donHang == null) {
            return null;
        }
        
        DonHangDto dto = new DonHangDto();
        
        // Map các trường từ DonHang
        dto.setId(donHang.getId());
        dto.setMaDonHang(donHang.getMaDonHang());
        dto.setNgayDat(donHang.getNgayDat());
        // dto.setNgayGiao(donHang.getNgayGiao()); // Không có trường này
        dto.setTongTien(donHang.getTongThanhToan()); // Sử dụng tongThanhToan làm tongTien
        // dto.setGhiChu(donHang.getGhiChuKhachHang()); // Không có trường này
        
        // Map hình thức đơn hàng
        Boolean loaiDonHang = donHang.getLoaiDonHang();
        if (loaiDonHang != null) {
            dto.setHinhThucDonHang(loaiDonHang ? "Đơn hàng online" : "Đơn hàng tại quầy");
        } else {
            dto.setHinhThucDonHang("Không xác định");
        }
        
        // Map thông tin khách hàng
        KhachHang khachHang = donHang.getKhachHang();
        if (khachHang != null) {
            dto.setHoTenNguoiNhan(khachHang.getHoTen());
            dto.setSoDienThoaiGiao(khachHang.getSoDienThoai());
        }
        
        // Map địa chỉ giao hàng từ ChiTietDonHang
        DiaChi diaChi = firstItem.getDiaChi();
        if (diaChi != null) {
            StringBuilder diaChiGiao = new StringBuilder();
            if (diaChi.getTinhThanh() != null) diaChiGiao.append(diaChi.getTinhThanh());
            if (diaChi.getQuanHuyen() != null) diaChiGiao.append(", ").append(diaChi.getQuanHuyen());
            if (diaChi.getPhuongXa() != null) diaChiGiao.append(", ").append(diaChi.getPhuongXa());
            // if (diaChi.getDiaChiChiTiet() != null) diaChiGiao.append(", ").append(diaChi.getDiaChiChiTiet());
            String diaChiString = diaChiGiao.toString();
            if (!diaChiString.isEmpty()) {
                dto.setDiaChiGiao(diaChiString);
            } else {
                // Fallback: sử dụng thông tin từ khách hàng nếu có
                if (khachHang != null) {
                    dto.setDiaChiGiao("Địa chỉ khách hàng");
                }
            }
        } else {
            // Fallback: sử dụng thông tin từ khách hàng nếu có
            if (khachHang != null) {
                dto.setDiaChiGiao("Địa chỉ khách hàng");
            }
        }
        
        // Map trạng thái từ ChiTietDonHang
        TrangThaiDonHang trangThai = firstItem.getTrangThai();
        if (trangThai != null) {
            dto.setTrangThai(trangThai.getTenTrangThai());
        }
        
        // Map chi tiết đơn hàng
        List<ChiTietDonHangDto> chiTietDtos = chiTietList.stream()
            .map(ctdh -> {
                ChiTietDonHangDto ctdto = new ChiTietDonHangDto();
                ctdto.setId(ctdh.getId());
                ctdto.setSoLuong(ctdh.getSoLuong());
                
                // Lấy giá từ ChiTietSanPham
                if (ctdh.getChiTietSanPham() != null) {
                    ctdto.setDonGia(BigDecimal.valueOf(ctdh.getChiTietSanPham().getGia()));
                    // Tính thành tiền = giá * số lượng
                    BigDecimal gia = BigDecimal.valueOf(ctdh.getChiTietSanPham().getGia());
                    BigDecimal soLuong = BigDecimal.valueOf(ctdh.getSoLuong());
                    ctdto.setThanhTien(gia.multiply(soLuong));
                    
                    ctdto.setSanPhamId(ctdh.getChiTietSanPham().getId());
                    if (ctdh.getChiTietSanPham().getSanPham() != null) {
                        ctdto.setTenSanPham(ctdh.getChiTietSanPham().getSanPham().getTenSanPham());
                        // ctdto.setHinhAnh(ctdh.getChiTietSanPham().getSanPham().getHinhAnh()); // Không có trường này
                    }
                }
                
                return ctdto;
            })
            .collect(Collectors.toList());
        
        dto.setChiTietDonHang(chiTietDtos);
        
        return dto;
    }

    public static ChiTietDonHangDto toChiTietDonHangDto(List<ChiTietDonHang> chiTietDonHangList, List<LichSuDonHang> lichSuDonHangList) {
        if (chiTietDonHangList == null || chiTietDonHangList.isEmpty()) {
            return null;
        }
        ChiTietDonHang firstItem = chiTietDonHangList.get(0);
        ChiTietDonHangDto dto = new ChiTietDonHangDto();
        // Nếu ChiTietDonHangDto không có setIdDonHang thì bỏ dòng này
        // dto.setIdDonHang(firstItem.getIdDonHang());
        return dto;
    }

    public static LichSuDonHangDto toLichSuDonHangDto(LichSuDonHang lichSu) {
        if (lichSu == null) {
            return null;
        }

        LichSuDonHangDto dto = new LichSuDonHangDto();

        // Map các trường cơ bản
        dto.setThoiGianCapNhat(lichSu.getThoiGianCapNhat());
        dto.setGhiChu(lichSu.getGhiChu());

        // Map tên trạng thái (cần kiểm tra null)
        if (lichSu.getIdTrangThaiMoi() != null) {
            dto.setTenTrangThai(lichSu.getIdTrangThaiMoi().getTenTrangThai());
        } else {
            dto.setTenTrangThai("Không xác định");
        }

        // Map người tạo (cần kiểm tra null)
        NguoiDung nguoiTao = lichSu.getIdNguoiCapNhat();
        if (nguoiTao != null) {
            dto.setTenNguoiCapNhat(nguoiTao.getHoTen());
        } else {
            dto.setTenNguoiCapNhat("Không xác định");
        }

        return dto;
    }

}