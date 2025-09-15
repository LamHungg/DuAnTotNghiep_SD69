package com.example.ZMEN.service.Impl;

import com.example.ZMEN.entity.PhuongThucThanhToan;
import com.example.ZMEN.exception.ResourceNotFoundException;
import com.example.ZMEN.repository.PhuongThucThanhToanRepository;
import com.example.ZMEN.service.PhuongThucThanhToanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PhuongThucThanhToanServiceImpl implements PhuongThucThanhToanService {

    @Autowired
    private PhuongThucThanhToanRepository phuongThucThanhToanRepository;

    @Override
    public List<PhuongThucThanhToan> getAllPhuongThucThanhToan() {
        return phuongThucThanhToanRepository.findAll();
    }

    @Override
    public PhuongThucThanhToan getPhuongThucThanhToanById(Integer id) {
        return phuongThucThanhToanRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Phương thức thanh toán không tồn tại với ID: " + id));
    }

    @Override
    public PhuongThucThanhToan createPhuongThucThanhToan(PhuongThucThanhToan phuongThucThanhToan) {
        return phuongThucThanhToanRepository.save(phuongThucThanhToan);
    }

    @Override
    public PhuongThucThanhToan updatePhuongThucThanhToan(Integer id, PhuongThucThanhToan phuongThucThanhToan) {
        PhuongThucThanhToan existingPhuongThuc = getPhuongThucThanhToanById(id);
        existingPhuongThuc.setTenPhuongThuc(phuongThucThanhToan.getTenPhuongThuc());
        return phuongThucThanhToanRepository.save(existingPhuongThuc);
    }

    @Override
    public void deletePhuongThucThanhToan(Integer id) {
        PhuongThucThanhToan phuongThucThanhToan = getPhuongThucThanhToanById(id);
        phuongThucThanhToanRepository.delete(phuongThucThanhToan);
    }
}
