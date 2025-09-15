package com.example.ZMEN.mapper;

import com.example.ZMEN.dto.DanhGiaDTO;
import com.example.ZMEN.entity.DanhGia;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.entity.SanPham;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class DanhGiaMapper {
    
    public DanhGiaDTO toDTO(DanhGia entity) {
        if (entity == null) return null;
        
        DanhGiaDTO dto = new DanhGiaDTO();
        dto.setId(entity.getId());
        dto.setSoSao(entity.getSoSao());
        dto.setBinhLuan(entity.getBinhLuan());
        dto.setNgayDanhGia(entity.getNgayDanhGia());
        dto.setTrangThai(entity.getTrangThai());
        
        // Map thông tin khách hàng
        if (entity.getKhachHang() != null) {
            dto.setIdKhachHang(entity.getKhachHang().getId());
            dto.setTenKhachHang(entity.getKhachHang().getHoTen());
        }
        
        // Map thông tin sản phẩm
        if (entity.getSanPham() != null) {
            dto.setIdSanPham(entity.getSanPham().getId());
            dto.setTenSanPham(entity.getSanPham().getTenSanPham());
        }
        
        return dto;
    }
    
    public DanhGia toEntity(DanhGiaDTO dto, KhachHang khachHang, SanPham sanPham) {
        if (dto == null) return null;
        
        DanhGia entity = new DanhGia();
        entity.setId(dto.getId());
        entity.setKhachHang(khachHang);
        entity.setSanPham(sanPham);
        entity.setSoSao(dto.getSoSao());
        entity.setBinhLuan(dto.getBinhLuan());
        entity.setNgayDanhGia(dto.getNgayDanhGia());
        entity.setTrangThai(dto.getTrangThai());
        
        return entity;
    }
    
    public List<DanhGiaDTO> toDTOList(List<DanhGia> entities) {
        if (entities == null) return null;
        return entities.stream().map(this::toDTO).collect(Collectors.toList());
    }
}
