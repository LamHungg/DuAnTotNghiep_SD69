package com.example.ZMEN.service.Impl;


import com.example.ZMEN.dto.VoucherDTO;
import com.example.ZMEN.entity.Voucher;
import com.example.ZMEN.exception.ResourceNotFoundException;
import com.example.ZMEN.mapper.VoucherMapper;
import com.example.ZMEN.repository.VoucherRepository;
import com.example.ZMEN.service.VoucherService;
import com.example.ZMEN.util.VoucherCodeGenerator;


import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class VoucherServiceImpl implements VoucherService {
    private final VoucherRepository voucherRepository;
    private final VoucherMapper voucherMapper;
    private final VoucherCodeGenerator voucherCodeGenerator;

    public VoucherServiceImpl(VoucherRepository voucherRepository, VoucherMapper voucherMapper, VoucherCodeGenerator voucherCodeGenerator) {
        this.voucherRepository = voucherRepository;
        this.voucherMapper = voucherMapper;
        this.voucherCodeGenerator = voucherCodeGenerator;
    }

    @Override
    public List<VoucherDTO> getAllVoucher() {
        return voucherRepository.findAll().stream()
                .map(voucherMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public VoucherDTO getVoucherById(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher không tồn tại với ID: " + id));
        return voucherMapper.toDTO(voucher);
    }

    @Override
    public VoucherDTO createVoucher(VoucherDTO dto) {
        Voucher voucher = voucherMapper.toEntity(dto);
        
        // Tự động generate mã voucher nếu không được cung cấp hoặc rỗng
        if (dto.getMaVoucher() == null || dto.getMaVoucher().trim().isEmpty()) {
            String generatedCode = voucherCodeGenerator.generateVoucherCodeByType(dto.getLoaiGiamGia());
            voucher.setMaVoucher(generatedCode);
        }
        
        // Xử lý các trường có thể null
        if (voucher.getGiaTriToiThieu() == null) {
            voucher.setGiaTriToiThieu(BigDecimal.ZERO);
        }
        if (voucher.getGiamToiDa() == null) {
            voucher.setGiamToiDa(BigDecimal.ZERO);
        }
        if (voucher.getSoLuong() == null) {
            voucher.setSoLuong(0);
        }
        if (voucher.getMoTa() == null) {
            voucher.setMoTa("");
        }
        
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toDTO(voucher);
    }

    @Override
    public VoucherDTO updateVoucher(Integer id, VoucherDTO dto) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher không tồn tại với ID: " + id));
        
        // Chỉ cập nhật maVoucher nếu được cung cấp và không rỗng
        if (dto.getMaVoucher() != null && !dto.getMaVoucher().trim().isEmpty()) {
            voucher.setMaVoucher(dto.getMaVoucher());
        }
        
        voucher.setTenVoucher(dto.getTenVoucher());
        voucher.setLoaiGiamGia(dto.getLoaiGiamGia());
        voucher.setGiaTriGiam(dto.getGiaTriGiam());
        
        // Xử lý các trường có thể null
        voucher.setGiaTriToiThieu(dto.getGiaTriToiThieu() != null ? dto.getGiaTriToiThieu() : BigDecimal.ZERO);
        voucher.setGiamToiDa(dto.getGiamToiDa() != null ? dto.getGiamToiDa() : BigDecimal.ZERO);
        voucher.setSoLuong(dto.getSoLuong() != null ? dto.getSoLuong() : 0);
        voucher.setNgayBatDau(dto.getNgayBatDau());
        voucher.setNgayKetThuc(dto.getNgayKetThuc());
        voucher.setTrangThai(dto.getTrangThai());
        voucher.setMoTa(dto.getMoTa() != null ? dto.getMoTa() : "");
        
        voucher = voucherRepository.save(voucher);
        return voucherMapper.toDTO(voucher);
    }

    @Override
    public void deleteVoucher(Integer id) {
        Voucher voucher = voucherRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Voucher không tồn tại với ID: " + id));

        voucher.setTrangThai(0); // Đã kết thúc hoặc ngừng hoạt động
        voucherRepository.save(voucher);
    }

    @Override
    public List<VoucherDTO> searchVoucher(String tenVoucher, String maVoucher, BigDecimal giaTriGiam, LocalDate ngayBatDau, LocalDate ngayKetThuc, Integer trangThai) {
        return voucherRepository.searchVoucher(tenVoucher, maVoucher, giaTriGiam, ngayBatDau, ngayKetThuc, trangThai)
                .stream()
                .map(voucherMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Scheduled(cron = "0 0 0 * * ?") // chạy vào 00:00 mỗi ngày
//    @Scheduled(cron = "0 * * * * ?")
    public void capNhatTrangThaiVoucher() {
        List<Voucher> danhSachVoucherHetHan = voucherRepository.findAllVoucherHetHan();

        for (Voucher voucher : danhSachVoucherHetHan) {
            voucher.setTrangThai(0); // 0 = hết hạn
            voucherRepository.save(voucher);
            System.out.println("Cập nhật voucher ID " + voucher.getId() + " -> ĐÃ KẾT THÚC");
        }
    }

    // POS methods
    @Override
    public List<VoucherDTO> getActiveVouchers() {
        return voucherRepository.findByTrangThai(1) // 1 = đang hoạt động
                .stream()
                .map(voucherMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public java.util.Map<String, Object> validateVoucher(String maVoucher, Double tongTien) {
        java.util.Map<String, Object> result = new java.util.HashMap<>();
        
        try {
            Voucher voucher = voucherRepository.findByMaVoucher(maVoucher)
                    .orElse(null);
            
            if (voucher == null) {
                result.put("valid", false);
                result.put("message", "Voucher không tồn tại");
                return result;
            }
            
            // Kiểm tra trạng thái
            if (voucher.getTrangThai() != 1) {
                result.put("valid", false);
                result.put("message", "Voucher không còn hiệu lực");
                return result;
            }
            
            // Kiểm tra ngày hiệu lực
            LocalDate today = LocalDate.now();
            if (today.isBefore(voucher.getNgayBatDau()) || today.isAfter(voucher.getNgayKetThuc())) {
                result.put("valid", false);
                result.put("message", "Voucher chưa có hiệu lực hoặc đã hết hạn");
                return result;
            }
            
            // Kiểm tra giá trị tối thiểu
            if (voucher.getGiaTriToiThieu() != null && tongTien < voucher.getGiaTriToiThieu().doubleValue()) {
                result.put("valid", false);
                result.put("message", "Đơn hàng chưa đạt giá trị tối thiểu để áp dụng voucher");
                return result;
            }
            
            // Kiểm tra số lượng còn lại
            if (voucher.getSoLuong() != null && voucher.getSoLuong() <= 0) {
                result.put("valid", false);
                result.put("message", "Voucher đã hết lượt sử dụng");
                return result;
            }
            
            result.put("valid", true);
            result.put("message", "Voucher hợp lệ");
            result.put("voucher", voucherMapper.toDTO(voucher));
            
        } catch (Exception e) {
            result.put("valid", false);
            result.put("message", "Lỗi khi kiểm tra voucher: " + e.getMessage());
        }
        
        return result;
    }
}
