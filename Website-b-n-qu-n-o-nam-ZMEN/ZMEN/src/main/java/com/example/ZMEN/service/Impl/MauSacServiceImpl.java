package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.MauSacDTO;
import com.example.ZMEN.entity.MauSac;
import com.example.ZMEN.exception.ResourceNotFoundException;
import com.example.ZMEN.mapper.MauSacMapper;
import com.example.ZMEN.repository.MauSacRepository;
import com.example.ZMEN.service.MauSacService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MauSacServiceImpl implements MauSacService {
    private final MauSacRepository mauSacRepository;
    private final MauSacMapper mauSacMapper;

    public MauSacServiceImpl(MauSacRepository mauSacRepository, MauSacMapper mauSacMapper) {
        this.mauSacRepository = mauSacRepository;
        this.mauSacMapper = mauSacMapper;
    }

    @Override
    public List<MauSacDTO> getAllMauSac() {
        return mauSacRepository.findAll().stream()
                .map(mauSacMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public MauSacDTO getMauSacById(Integer id) {
        MauSac mauSac = mauSacRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Màu sắc không tồn tại với ID: " + id));
        return mauSacMapper.toDTO(mauSac);
    }

    @Override
    public MauSacDTO createMauSac(MauSacDTO dto) {
        MauSac mauSac = mauSacMapper.toEntity(dto);
        mauSac = mauSacRepository.save(mauSac);
        return mauSacMapper.toDTO(mauSac);
    }

    @Override
    public MauSacDTO updateMauSac(Integer id, MauSacDTO dto) {
        MauSac mauSac = mauSacRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Màu sắc không tồn tại với ID: " + id));
        mauSac.setTenMauSac(dto.getTenMauSac());
        mauSac.setTrangThai(dto.getTrangThai());
        mauSac = mauSacRepository.save(mauSac);
        return mauSacMapper.toDTO(mauSac);
    }

    @Override
    public void deleteMauSac(Integer id) {
        MauSac mauSac = mauSacRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Màu sắc không tồn tại với ID: " + id));
        mauSac.setTrangThai((byte) 0); // 0 = ẩn / không hoạt động
        mauSacRepository.save(mauSac);
    }

    @Override
    public List<MauSacDTO> searchMauSac(String tenMauSac, Byte trangThai) {
        return mauSacRepository.searchByTenVaTrangThai(tenMauSac, trangThai)
                .stream()
                .map(mauSacMapper::toDTO)
                .collect(Collectors.toList());
    }


}