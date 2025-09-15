package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.SanPhamDTO;
import com.example.ZMEN.dto.SanPhamTaoNhanhDTO;
import com.example.ZMEN.entity.DanhMuc;
import com.example.ZMEN.entity.NguoiDung;
import com.example.ZMEN.entity.SanPham;
import com.example.ZMEN.exception.ResourceNotFoundException;
import com.example.ZMEN.mapper.SanPhamMapper;
import com.example.ZMEN.repository.DanhMucRepository;
import com.example.ZMEN.repository.SanPhamRepository;
import com.example.ZMEN.service.SanPhamService;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SanPhamServiceImpl implements SanPhamService {
    private final SanPhamRepository sanPhamRepository;
    private final DanhMucRepository danhMucRepository;
    private final SanPhamMapper sanPhamMapper;

    public SanPhamServiceImpl(SanPhamRepository sanPhamRepository, DanhMucRepository danhMucRepository, SanPhamMapper sanPhamMapper) {
        this.sanPhamRepository = sanPhamRepository;
        this.danhMucRepository = danhMucRepository;
        this.sanPhamMapper = sanPhamMapper;
    }

    private String generateMaSanPhamTuDong() {
        String maxMa = sanPhamRepository.findMaxMaSanPham();
        int nextNumber = 1;
        if (maxMa != null && maxMa.startsWith("SP")) {
            try {
                nextNumber = Integer.parseInt(maxMa.substring(2)) + 1;
            } catch (NumberFormatException ignored) {}
        }
        return String.format("SP%04d", nextNumber);
    }

    @Override
    public SanPhamDTO themNhanhSanPham(SanPhamTaoNhanhDTO dto) {
        DanhMuc danhMuc = danhMucRepository.findById(dto.getIdDanhMuc())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại"));

        SanPham sanPham = new SanPham();
        sanPham.setTenSanPham(dto.getTenSanPham());
        sanPham.setDanhMuc(danhMuc);
        sanPham.setMaSanPham(generateMaSanPhamTuDong());
        sanPham.setTrangThai((byte) 1);
        sanPham.setNgayTao(LocalDateTime.now());
        sanPham.setNgayCapNhat(LocalDateTime.now());

        if (dto.getIdNguoiTao() != null) {
            NguoiDung nguoi = new NguoiDung();
            nguoi.setId(dto.getIdNguoiTao());
            sanPham.setNguoiTao(nguoi);
            sanPham.setNguoiCapNhat(nguoi);
        }

        sanPhamRepository.save(sanPham);
        return sanPhamMapper.toDTO(sanPham);
    }

    @Override
    public List<SanPhamDTO> getAllSanPham() {
        return sanPhamRepository.findAll().stream()
                .map(sanPhamMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public SanPhamDTO getSanPhamById(Integer id) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + id));
        return sanPhamMapper.toDTO(sanPham);
    }

    @Override
    public SanPhamDTO createSanPham(SanPhamDTO dto) {
        DanhMuc danhMuc = danhMucRepository.findById(dto.getIdDanhMuc())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại với ID: " + dto.getIdDanhMuc()));

        SanPham sanPham = sanPhamMapper.toEntity(dto);
        sanPham.setMaSanPham("SP-" + UUID.randomUUID().toString().substring(0, 8));
        sanPham.setDanhMuc(danhMuc);
        sanPham.setNgayTao(LocalDateTime.now());
        sanPham.setNgayCapNhat(LocalDateTime.now());

        if (dto.getIdNguoiTao() != null) {
            NguoiDung nguoiTao = new NguoiDung();
            nguoiTao.setId(dto.getIdNguoiTao());
            sanPham.setNguoiTao(nguoiTao);
            sanPham.setNguoiCapNhat(nguoiTao);
        }

        sanPham = sanPhamRepository.save(sanPham);
        return sanPhamMapper.toDTO(sanPham);
    }

    @Override
    public SanPhamDTO updateSanPham(Integer id, SanPhamDTO dto) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + id));

        DanhMuc danhMuc = danhMucRepository.findById(dto.getIdDanhMuc())
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại với ID: " + dto.getIdDanhMuc()));

        sanPham.setTenSanPham(dto.getTenSanPham());
        sanPham.setMoTa(dto.getMoTa());
        sanPham.setTrangThai(dto.getTrangThai());
        sanPham.setDanhMuc(danhMuc);
        sanPham.setNgayCapNhat(LocalDateTime.now());

        if (dto.getIdNguoiCapNhat() != null) {
            NguoiDung nguoiCapNhat = new NguoiDung();
            nguoiCapNhat.setId(dto.getIdNguoiCapNhat());
            sanPham.setNguoiCapNhat(nguoiCapNhat);
        }

        sanPham = sanPhamRepository.save(sanPham);
        return sanPhamMapper.toDTO(sanPham);
    }

    @Override
    public void deleteSanPham(Integer id) {
        SanPham sanPham = sanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + id));
        sanPham.setTrangThai((byte) 0);
        sanPhamRepository.save(sanPham);
    }

    @Override
    public List<SanPhamDTO> searchSanPham(String keyword, String tenSanPham, String maSanPham, Byte trangThai, Integer idDanhMuc) {
        // Nếu có keyword, sử dụng nó cho cả tenSanPham và maSanPham
        if (keyword != null && !keyword.trim().isEmpty()) {
            tenSanPham = keyword;
            maSanPham = keyword;
        }
        return sanPhamRepository.searchSanPham(tenSanPham, maSanPham, trangThai, idDanhMuc).stream()
                .map(sanPhamMapper::toDTO)
                .collect(Collectors.toList());
    }
}
