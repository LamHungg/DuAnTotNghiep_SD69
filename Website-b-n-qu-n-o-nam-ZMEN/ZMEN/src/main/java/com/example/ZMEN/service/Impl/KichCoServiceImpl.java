package com.example.ZMEN.service.Impl;


import com.example.ZMEN.dto.KichCoDTO;
import com.example.ZMEN.entity.KichCo;
import com.example.ZMEN.exception.ResourceNotFoundException;
import com.example.ZMEN.mapper.KichCoMapper;
import com.example.ZMEN.repository.KichCoRepository;
import com.example.ZMEN.service.KichCoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class KichCoServiceImpl implements KichCoService {
    private final KichCoRepository kichCoRepository;
    private final KichCoMapper kichCoMapper;

    public KichCoServiceImpl(KichCoRepository kichCoRepository, KichCoMapper kichCoMapper) {
        this.kichCoRepository = kichCoRepository;
        this.kichCoMapper = kichCoMapper;
    }

    @Override
    public List<KichCoDTO> getAllKichCo() {
        return kichCoRepository.findAll().stream()
                .map(kichCoMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public KichCoDTO getKichCoById(Integer id) {
        KichCo kichCo = kichCoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kích cỡ không tồn tại với ID: " + id));
        return kichCoMapper.toDTO(kichCo);
    }

    @Override
    public KichCoDTO createKichCo(KichCoDTO dto) {
        KichCo kichCo = kichCoMapper.toEntity(dto);
        kichCo = kichCoRepository.save(kichCo);
        return kichCoMapper.toDTO(kichCo);
    }

    @Override
    public KichCoDTO updateKichCo(Integer id, KichCoDTO dto) {
        KichCo kichCo = kichCoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kích cỡ không tồn tại với ID: " + id));
        kichCo.setTenKichCo(dto.getTenKichCo());
        kichCo.setTrangThai(dto.getTrangThai());
        kichCo = kichCoRepository.save(kichCo);
        return kichCoMapper.toDTO(kichCo);
    }

    @Override
    public void deleteKichCo(Integer id) {
        KichCo kichCo = kichCoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Kích cỡ không tồn tại với ID: " + id));
        kichCo.setTrangThai((byte) 0); // 0 = không hoạt động
        kichCoRepository.save(kichCo);
    }

    @Override
    public List<KichCoDTO> searchKichCo(String tenKichCo, Byte trangThai) {
        return kichCoRepository.searchByTenAndTrangThai(tenKichCo, trangThai)
                .stream()
                .map(kichCoMapper::toDTO)
                .collect(Collectors.toList());
    }


}