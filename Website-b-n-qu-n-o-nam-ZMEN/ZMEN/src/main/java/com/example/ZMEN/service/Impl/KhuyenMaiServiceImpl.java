package com.example.ZMEN.service.Impl;


import com.example.ZMEN.dto.KhuyenMaiDTO;
import com.example.ZMEN.entity.KhuyenMai;
import com.example.ZMEN.exception.ResourceNotFoundException;
import com.example.ZMEN.mapper.KhuyenMaiMapper;
import com.example.ZMEN.repository.KhuyenMaiRepository;
import com.example.ZMEN.service.KhuyenMaiService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class KhuyenMaiServiceImpl implements KhuyenMaiService {
    private final KhuyenMaiRepository khuyenMaiRepository;
    private final KhuyenMaiMapper khuyenMaiMapper;

    public KhuyenMaiServiceImpl(KhuyenMaiRepository khuyenMaiRepository, KhuyenMaiMapper khuyenMaiMapper) {
        this.khuyenMaiRepository = khuyenMaiRepository;
        this.khuyenMaiMapper = khuyenMaiMapper;
    }

    @Override
    public List<KhuyenMaiDTO> getAllKhuyenMai() {
        return khuyenMaiRepository.findAll().stream()
                .map(khuyenMaiMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public KhuyenMaiDTO getKhuyenMaiById(Integer id) {
        KhuyenMai khuyenMai = khuyenMaiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khuyến mãi không tồn tại với ID: " + id));
        return khuyenMaiMapper.toDTO(khuyenMai);
    }

    @Override
    public KhuyenMaiDTO createKhuyenMai(KhuyenMaiDTO dto) {
        KhuyenMai khuyenMai = khuyenMaiMapper.toEntity(dto);
        khuyenMai = khuyenMaiRepository.save(khuyenMai);
        return khuyenMaiMapper.toDTO(khuyenMai);
    }

    @Override
    public KhuyenMaiDTO updateKhuyenMai(Integer id, KhuyenMaiDTO dto) {
        KhuyenMai khuyenMai = khuyenMaiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khuyến mãi không tồn tại với ID: " + id));
        khuyenMai.setMaKhuyenMai(dto.getMaKhuyenMai());
        khuyenMai.setTenKhuyenMai(dto.getTenKhuyenMai());
        khuyenMai.setPhanTramGiam(dto.getPhanTramGiam());
        khuyenMai.setNgayBatDau(dto.getNgayBatDau());
        khuyenMai.setNgayKetThuc(dto.getNgayKetThuc());
        khuyenMai.setTrangThai(dto.getTrangThai());
        khuyenMai.setMoTa(dto.getMoTa());
        khuyenMai = khuyenMaiRepository.save(khuyenMai);
        return khuyenMaiMapper.toDTO(khuyenMai);
    }

    @Override
    public void deleteKhuyenMai(Integer id) {
        KhuyenMai khuyenMai = khuyenMaiRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Khuyến mãi không tồn tại với ID: " + id));

        khuyenMai.setTrangThai((byte) 0); // Đã kết thúc
        khuyenMaiRepository.save(khuyenMai);
    }


    @Override
    public List<KhuyenMaiDTO> searchKhuyenMai(String tenKhuyenMai, String maKhuyenMai, BigDecimal phanTramGiam, Date ngayBatDau, Date ngayKetThuc, Byte trangThai) {
        return khuyenMaiRepository.searchKhuyenMai(tenKhuyenMai, maKhuyenMai, phanTramGiam, ngayBatDau, ngayKetThuc, trangThai)
                .stream()
                .map(khuyenMaiMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Scheduled(cron = "0 0 0 * * ?") // chạy vào 00:00 mỗi ngày
//    @Scheduled(cron = "0 * * * * ?") // mỗi phút test
    public void capNhatTrangThaiKhuyenMai() {
        System.out.println(" Đang chạy hàm cập nhật trạng thái khuyến mãi...");
        List<KhuyenMai> danhSachHetHan = khuyenMaiRepository.findAllKhuyenMaiHetHan();

        for (KhuyenMai km : danhSachHetHan) {
            km.setTrangThai((byte) 0); // 0 = Đã kết thúc
            khuyenMaiRepository.save(km);
            System.out.println(" Đã cập nhật KM ID: " + km.getId());
        }
    }


}