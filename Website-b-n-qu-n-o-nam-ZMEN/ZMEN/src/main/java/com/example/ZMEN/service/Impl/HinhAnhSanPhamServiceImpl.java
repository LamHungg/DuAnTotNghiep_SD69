package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.HinhAnhSanPhamDTO;
import com.example.ZMEN.entity.HinhAnhSanPham;
import com.example.ZMEN.exception.ResourceNotFoundException;
import com.example.ZMEN.mapper.HinhAnhSanPhamMapper;
import com.example.ZMEN.repository.HinhAnhSanPhamRepository;
import com.example.ZMEN.service.HinhAnhSanPhamService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class HinhAnhSanPhamServiceImpl implements HinhAnhSanPhamService {

    @Autowired
    private HinhAnhSanPhamRepository repository;

    @Override
    public HinhAnhSanPhamDTO addHinhAnh(HinhAnhSanPhamDTO dto) {
        HinhAnhSanPham entity = HinhAnhSanPhamMapper.toEntity(dto);
        return HinhAnhSanPhamMapper.toDTO(repository.save(entity));
    }

    @Override
    public HinhAnhSanPhamDTO updateHinhAnh(Integer id, HinhAnhSanPhamDTO dto) {
        HinhAnhSanPham existing = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Hình ảnh không tồn tại với ID: " + id));
        existing.setUrl(dto.getUrl());
        existing.setIsThumbnail(dto.getIsThumbnail());
        return HinhAnhSanPhamMapper.toDTO(repository.save(existing));
    }
}