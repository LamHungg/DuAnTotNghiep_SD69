package com.example.ZMEN.mapper;

import com.example.ZMEN.dto.ChiTietSanPhamDTO;
import com.example.ZMEN.entity.ChiTietSanPham;
import com.example.ZMEN.entity.HinhAnhSanPham;
import com.example.ZMEN.repository.HinhAnhSanPhamRepository;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ChiTietSanPhamMapper {
    private final ModelMapper modelMapper;
    private final HinhAnhSanPhamRepository hinhAnhSanPhamRepository;

    public ChiTietSanPhamMapper(ModelMapper modelMapper, HinhAnhSanPhamRepository hinhAnhSanPhamRepository) {
        this.modelMapper = modelMapper;
        this.hinhAnhSanPhamRepository = hinhAnhSanPhamRepository;
    }

    public ChiTietSanPhamDTO toDTO(ChiTietSanPham entity) {
        ChiTietSanPhamDTO dto = modelMapper.map(entity, ChiTietSanPhamDTO.class);

        // Map các trường cơ bản
        if (entity.getSanPham() != null) {
            dto.setIdSanPham(entity.getSanPham().getId());
            dto.setTenSanPham(entity.getSanPham().getTenSanPham());
            dto.setMaSanPham(entity.getSanPham().getMaSanPham());
            dto.setMoTa(entity.getSanPham().getMoTa()); // Thêm mapping cho moTa
        }
        if (entity.getKichCo() != null) {
            dto.setIdKichCo(entity.getKichCo().getId());
            dto.setTenKichCo(entity.getKichCo().getTenKichCo());
        }
        if (entity.getMauSac() != null) {
            dto.setIdMauSac(entity.getMauSac().getId());
            dto.setTenMauSac(entity.getMauSac().getTenMauSac());
        }
        if (entity.getChatLieu() != null) {
            dto.setIdChatLieu(entity.getChatLieu().getId());
            dto.setTenChatLieu(entity.getChatLieu().getTenChatLieu());
        }
        if (entity.getNguoiTao() != null) {
            dto.setIdNguoiTao(entity.getNguoiTao().getId());
            dto.setTenNguoiTao(entity.getNguoiTao().getHoTen());
        }
        if (entity.getNguoiCapNhat() != null) {
            dto.setIdNguoiCapNhat(entity.getNguoiCapNhat().getId());
            dto.setTenNguoiCapNhat(entity.getNguoiCapNhat().getHoTen());
        }
        
        // Map ảnh chính
        if (entity.getIdHinhAnhSanPham() != null) {
            dto.setIdHinhAnhSanPham(entity.getIdHinhAnhSanPham().getId());
        }
        
        // Lấy tất cả ảnh của sản phẩm này (theo SanPhamId)
        if (entity.getSanPham() != null) {
            List<HinhAnhSanPham> hinhAnhs = hinhAnhSanPhamRepository.findBySanPhamId(entity.getSanPham().getId());
            System.out.println("Product: " + entity.getSanPham().getTenSanPham() + " (ID: " + entity.getSanPham().getId() + ")");
            System.out.println("Found images by SanPhamId: " + (hinhAnhs != null ? hinhAnhs.size() : 0));
            
            // Nếu không tìm thấy theo SanPhamId, thử tìm theo ChiTietSanPhamId
            if ((hinhAnhs == null || hinhAnhs.isEmpty()) && entity.getId() != null) {
                hinhAnhs = hinhAnhSanPhamRepository.findByChiTietSanPhamId(entity.getId());
                System.out.println("Found images by ChiTietSanPhamId: " + (hinhAnhs != null ? hinhAnhs.size() : 0));
            }
            
            if (hinhAnhs != null && !hinhAnhs.isEmpty()) {
                String[] urls = hinhAnhs.stream()
                        .map(HinhAnhSanPham::getUrl)
                        .toArray(String[]::new);
                System.out.println("Image URLs: " + java.util.Arrays.toString(urls));
                dto.setHinhAnh(urls);
            } else {
                System.out.println("No images found for product: " + entity.getSanPham().getTenSanPham());
                dto.setHinhAnh(new String[0]);
            }
        } else {
            dto.setHinhAnh(new String[0]);
        }

        dto.setNgayTao(entity.getNgayTao());
        dto.setNgayCapNhat(entity.getNgayCapNhat());
        dto.setTrangThai(entity.getTrangThai());

        return dto;
    }

    public ChiTietSanPham toEntity(ChiTietSanPhamDTO dto) {
        ChiTietSanPham entity = modelMapper.map(dto, ChiTietSanPham.class);

        if (dto.getIdHinhAnhSanPham() != null) {
            HinhAnhSanPham hinhAnh = new HinhAnhSanPham();
            hinhAnh.setId(dto.getIdHinhAnhSanPham());
            entity.setIdHinhAnhSanPham(hinhAnh);
        }

        entity.setNgayTao(dto.getNgayTao());
        entity.setNgayCapNhat(dto.getNgayCapNhat());

        return entity;
    }
}
