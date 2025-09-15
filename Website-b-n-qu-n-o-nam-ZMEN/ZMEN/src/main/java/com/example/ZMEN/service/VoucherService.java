package com.example.ZMEN.service;

import com.example.ZMEN.dto.VoucherDTO;


import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface VoucherService {
    List<VoucherDTO> getAllVoucher();

    VoucherDTO getVoucherById(Integer id);

    VoucherDTO createVoucher(VoucherDTO dto);

    VoucherDTO updateVoucher(Integer id, VoucherDTO dto);

    void deleteVoucher(Integer id);

    List<VoucherDTO> searchVoucher(String tenVoucher, String maVoucher, BigDecimal giaTriGiam, LocalDate ngayBatDau, LocalDate ngayKetThuc, Integer trangThai);

    // POS methods
    List<VoucherDTO> getActiveVouchers();
    
    java.util.Map<String, Object> validateVoucher(String maVoucher, Double tongTien);
}