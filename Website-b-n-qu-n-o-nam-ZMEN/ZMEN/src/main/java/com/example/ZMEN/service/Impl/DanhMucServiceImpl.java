package com.example.ZMEN.service.Impl;


import com.example.ZMEN.dto.DanhMucDTO;
import com.example.ZMEN.entity.DanhMuc;
import com.example.ZMEN.exception.ResourceNotFoundException;
import com.example.ZMEN.mapper.DanhMucMapper;
import com.example.ZMEN.repository.DanhMucRepository;
import com.example.ZMEN.service.DanhMucService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DanhMucServiceImpl implements DanhMucService {
    private final DanhMucRepository danhMucRepository;
    private final DanhMucMapper danhMucMapper;

    public DanhMucServiceImpl(DanhMucRepository danhMucRepository, DanhMucMapper danhMucMapper) {
        this.danhMucRepository = danhMucRepository;
        this.danhMucMapper = danhMucMapper;
    }

    @Override
    public List<DanhMucDTO> getAllDanhMuc() {
        return danhMucRepository.findAll().stream()
                .map(danhMucMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public DanhMucDTO getDanhMucById(Integer id) {
        DanhMuc danhMuc = danhMucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại với ID: " + id));
        return danhMucMapper.toDTO(danhMuc);
    }

    @Override
    public DanhMucDTO createDanhMuc(DanhMucDTO dto) {
        DanhMuc danhMuc = danhMucMapper.toEntity(dto);
        if (dto.getIdDanhMucCha() != null) {
            DanhMuc danhMucCha = danhMucRepository.findById(dto.getIdDanhMucCha())
                    .orElseThrow(() -> new ResourceNotFoundException("Danh mục cha không tồn tại với ID: " + dto.getIdDanhMucCha()));
            danhMuc.setDanhMucCha(danhMucCha);
        }
        danhMuc = danhMucRepository.save(danhMuc);
        return danhMucMapper.toDTO(danhMuc);
    }

    @Override
    public DanhMucDTO updateDanhMuc(Integer id, DanhMucDTO dto) {
        DanhMuc danhMuc = danhMucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại với ID: " + id));
        danhMuc.setTenDanhMuc(dto.getTenDanhMuc());
        danhMuc.setTrangThai(dto.getTrangThai());
        if (dto.getIdDanhMucCha() != null) {
            DanhMuc danhMucCha = danhMucRepository.findById(dto.getIdDanhMucCha())
                    .orElseThrow(() -> new ResourceNotFoundException("Danh mục cha không tồn tại với ID: " + dto.getIdDanhMucCha()));
            danhMuc.setDanhMucCha(danhMucCha);
        } else {
            danhMuc.setDanhMucCha(null);
        }
        danhMuc = danhMucRepository.save(danhMuc);
        return danhMucMapper.toDTO(danhMuc);
    }

    @Override
    public void deleteDanhMuc(Integer id) {
        DanhMuc danhMuc = danhMucRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Danh mục không tồn tại với ID: " + id));
        danhMuc.setTrangThai((byte) 0); // 0 = ẩn / không hoạt động
        danhMucRepository.save(danhMuc);
    }

    @Override
    public List<DanhMucDTO> searchDanhMuc(String tenDanhMuc, Byte trangThai) {
        return danhMucRepository.searchByTenVaTrangThai(tenDanhMuc, trangThai)
                .stream()
                .map(danhMucMapper::toDTO)
                .collect(Collectors.toList());
    }


}