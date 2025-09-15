package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.DiaChidto.DiaChidto;
import com.example.ZMEN.entity.DiaChi;
import com.example.ZMEN.repository.DiaChiRepository;
import com.example.ZMEN.service.DiaChiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DiaChiImpl implements DiaChiService {
    @Autowired
    private DiaChiRepository diaChiRepo;

    private DiaChidto toDTO(DiaChi dc) {
        return new DiaChidto(dc.getId(), dc.getIdKhachHang(), dc.getTinhThanh(),
                dc.getQuanHuyen(), dc.getPhuongXa(), dc.getDuong(), dc.getDiaChiMacDinh());
    }

    private DiaChi toEntity(DiaChidto dto) {
        DiaChi diaChi = new DiaChi();
        diaChi.setId(dto.getId());
        diaChi.setIdKhachHang(dto.getIdKhachHang());
        diaChi.setTinhThanh(dto.getTinhThanh());
        diaChi.setQuanHuyen(dto.getQuanHuyen());
        diaChi.setPhuongXa(dto.getPhuongXa());
        diaChi.setDuong(dto.getDuong());
        diaChi.setDiaChiMacDinh(dto.getDiaChiMacDinh());
        return diaChi;
    }

    @Override
    public DiaChidto create(DiaChidto dto) {
        if (dto.getDiaChiMacDinh() != null && dto.getDiaChiMacDinh()) {
            // Nếu địa chỉ này là mặc định -> hủy mặc định tất cả địa chỉ cũ
            List<DiaChi> diaChiList = diaChiRepo.findByIdKhachHang(dto.getIdKhachHang());
            for (DiaChi item : diaChiList) {
                item.setDiaChiMacDinh(false);
            }
            diaChiRepo.saveAll(diaChiList);
        }
        DiaChi saved = diaChiRepo.save(toEntity(dto));
        return toDTO(saved);
    }

    @Override
    public DiaChidto update(Integer id, DiaChidto dto) {
        Optional<DiaChi> optional = diaChiRepo.findById(id);
        if (optional.isEmpty()) return null;

        DiaChi dc = optional.get();
        dc.setTinhThanh(dto.getTinhThanh());
        dc.setQuanHuyen(dto.getQuanHuyen());
        dc.setPhuongXa(dto.getPhuongXa());
        dc.setDuong(dto.getDuong());

        // Chỉ xử lý nếu client có truyền giá trị diaChiMacDinh
        if (dto.getDiaChiMacDinh() != null) {
            if (dto.getDiaChiMacDinh()) {
                // Nếu chọn là mặc định -> hủy mặc định các địa chỉ khác
                List<DiaChi> diaChiList = diaChiRepo.findByIdKhachHang(dc.getIdKhachHang());
                for (DiaChi item : diaChiList) {
                    item.setDiaChiMacDinh(false);
                }
                diaChiRepo.saveAll(diaChiList);
                dc.setDiaChiMacDinh(true);
            } else {
                dc.setDiaChiMacDinh(false); // gán false nếu client yêu cầu
            }
        }

        return toDTO(diaChiRepo.save(dc));
    }

    @Override
    public void delete(Integer id) {
        diaChiRepo.deleteById(id);
    }

    @Override
    public DiaChidto getById(Integer id) {
        return diaChiRepo.findById(id).map(this::toDTO).orElse(null);
    }

    @Override
    public List<DiaChidto> getByKhachHangId(Integer idKhachHang) {
        return diaChiRepo.findByIdKhachHang(idKhachHang)
                .stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Override
    public void setDiaChiMacDinh(Integer idDiaChi) {
        Optional<DiaChi> optional = diaChiRepo.findById(idDiaChi);
        if (optional.isEmpty()) return;

        DiaChi dc = optional.get();
        Integer idKhachHang = dc.getIdKhachHang();

        List<DiaChi> diaChiList = diaChiRepo.findByIdKhachHang(idKhachHang);
        for (DiaChi item : diaChiList) {
            item.setDiaChiMacDinh(false);
        }
        diaChiRepo.saveAll(diaChiList);

        dc.setDiaChiMacDinh(true);
        diaChiRepo.save(dc);
    }
}
