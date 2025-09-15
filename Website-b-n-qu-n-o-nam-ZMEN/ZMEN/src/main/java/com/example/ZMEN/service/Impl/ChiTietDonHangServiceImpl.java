package com.example.ZMEN.service.Impl;

import com.example.ZMEN.entity.ChiTietDonHang;
import com.example.ZMEN.repository.ChiTietDonHangRepository;
import com.example.ZMEN.service.ChiTietDonHangService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChiTietDonHangServiceImpl implements ChiTietDonHangService {

    @Autowired
    private ChiTietDonHangRepository chiTietDonHangRepository;

    @Override
    public List<ChiTietDonHang> getAllChiTietDonHang() {
        return chiTietDonHangRepository.findAll();
    }

    @Override
    public ChiTietDonHang getChiTietDonHangById(Integer id) {
        Optional<ChiTietDonHang> optional = chiTietDonHangRepository.findById(id);
        return optional.orElse(null);
    }

    @Override
    public List<ChiTietDonHang> getChiTietDonHangByDonHangId(Integer donHangId) {
        return chiTietDonHangRepository.findByIdDonHang(donHangId);
    }

    @Override
    public ChiTietDonHang saveChiTietDonHang(ChiTietDonHang chiTietDonHang) {
        return chiTietDonHangRepository.save(chiTietDonHang);
    }

    @Override
    public ChiTietDonHang updateChiTietDonHang(ChiTietDonHang chiTietDonHang) {
        if (chiTietDonHang.getId() != null && chiTietDonHangRepository.existsById(chiTietDonHang.getId())) {
            return chiTietDonHangRepository.save(chiTietDonHang);
        }
        return null;
    }

    @Override
    public void deleteChiTietDonHang(Integer id) {
        chiTietDonHangRepository.deleteById(id);
    }

    @Override
    public void deleteChiTietDonHangByDonHangId(Integer donHangId) {
        List<ChiTietDonHang> chiTietDonHangs = chiTietDonHangRepository.findByIdDonHang(donHangId);
        chiTietDonHangRepository.deleteAll(chiTietDonHangs);
    }
}
