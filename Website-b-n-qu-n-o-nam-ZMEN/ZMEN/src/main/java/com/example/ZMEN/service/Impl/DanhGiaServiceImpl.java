package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.DanhGiaDTO;
import com.example.ZMEN.dto.ThongKeDanhGiaDTO;
import com.example.ZMEN.entity.DanhGia;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.entity.SanPham;
import com.example.ZMEN.exception.ResourceNotFoundException;
import com.example.ZMEN.mapper.DanhGiaMapper;
import com.example.ZMEN.repository.DanhGiaRepository;
import com.example.ZMEN.repository.KhachHangRepository;
import com.example.ZMEN.repository.SanPhamRepository;
import com.example.ZMEN.service.DanhGiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DanhGiaServiceImpl implements DanhGiaService {

    @Autowired
    private DanhGiaRepository danhGiaRepository;

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private DanhGiaMapper danhGiaMapper;

    @Override
    public List<DanhGiaDTO> getDanhGiaBySanPhamId(Integer idSanPham) {
        List<DanhGia> danhGias = danhGiaRepository.findBySanPhamId(idSanPham);
        return danhGiaMapper.toDTOList(danhGias);
    }

    @Override
    public ThongKeDanhGiaDTO getThongKeDanhGiaBySanPhamId(Integer idSanPham) {
        // Lấy thông tin sản phẩm
        SanPham sanPham = sanPhamRepository.findById(idSanPham)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + idSanPham));

        ThongKeDanhGiaDTO thongKe = new ThongKeDanhGiaDTO(idSanPham, sanPham.getTenSanPham());

        // Tính trung bình số sao
        Double trungBinhSao = danhGiaRepository.getAverageRatingBySanPhamId(idSanPham);
        thongKe.setTrungBinhSao(trungBinhSao != null ? trungBinhSao : 0.0);

        // Đếm tổng số đánh giá
        Long tongSoDanhGia = danhGiaRepository.countBySanPhamId(idSanPham);
        thongKe.setTongSoDanhGia(tongSoDanhGia != null ? tongSoDanhGia.intValue() : 0);

        // Lấy phân bố số sao
        List<Object[]> phanBoSaoData = danhGiaRepository.getRatingDistributionBySanPhamId(idSanPham);
        Map<Integer, Integer> phanBoSao = new HashMap<>();
        for (Object[] data : phanBoSaoData) {
            Short soSao = (Short) data[0];
            Long count = (Long) data[1];
            phanBoSao.put(soSao.intValue(), count.intValue());
        }
        thongKe.setPhanBoSao(phanBoSao);

        // Lấy đánh giá gần đây (5 đánh giá mới nhất)
        List<DanhGia> danhGiaGanDay = danhGiaRepository.findRecentReviewsBySanPhamId(idSanPham);
        List<DanhGiaDTO> danhGiaGanDayDTO = danhGiaMapper.toDTOList(danhGiaGanDay);
        thongKe.setDanhGiaGanDay(danhGiaGanDayDTO);

        return thongKe;
    }

    @Override
    public DanhGiaDTO createDanhGia(DanhGiaDTO danhGiaDTO) {
        // Kiểm tra khách hàng đã đánh giá sản phẩm này chưa
        if (hasKhachHangReviewed(danhGiaDTO.getIdKhachHang(), danhGiaDTO.getIdSanPham())) {
            throw new IllegalStateException("Bạn đã đánh giá sản phẩm này rồi");
        }

        // Lấy thông tin khách hàng và sản phẩm
        KhachHang khachHang = khachHangRepository.findById(danhGiaDTO.getIdKhachHang())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng với ID: " + danhGiaDTO.getIdKhachHang()));

        SanPham sanPham = sanPhamRepository.findById(danhGiaDTO.getIdSanPham())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy sản phẩm với ID: " + danhGiaDTO.getIdSanPham()));

        // Tạo entity mới
        DanhGia danhGia = danhGiaMapper.toEntity(danhGiaDTO, khachHang, sanPham);
        danhGia.setNgayDanhGia(java.time.Instant.now());

        // Lưu vào database
        DanhGia savedDanhGia = danhGiaRepository.save(danhGia);

        return danhGiaMapper.toDTO(savedDanhGia);
    }

    @Override
    public DanhGiaDTO updateDanhGia(Integer id, DanhGiaDTO danhGiaDTO) {
        DanhGia existingDanhGia = danhGiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá với ID: " + id));

        // Cập nhật thông tin
        existingDanhGia.setSoSao(danhGiaDTO.getSoSao());
        existingDanhGia.setBinhLuan(danhGiaDTO.getBinhLuan());
        existingDanhGia.setNgayDanhGia(java.time.Instant.now());

        DanhGia updatedDanhGia = danhGiaRepository.save(existingDanhGia);
        return danhGiaMapper.toDTO(updatedDanhGia);
    }

    @Override
    public void deleteDanhGia(Integer id) {
        DanhGia danhGia = danhGiaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy đánh giá với ID: " + id));

        // Ẩn đánh giá thay vì xóa
        danhGia.setTrangThai((byte) 0);
        danhGiaRepository.save(danhGia);
    }

    @Override
    public boolean hasKhachHangReviewed(Integer idKhachHang, Integer idSanPham) {
        return danhGiaRepository.findByKhachHangAndSanPham(idKhachHang, idSanPham).isPresent();
    }

    @Override
    public DanhGiaDTO getDanhGiaByKhachHangAndSanPham(Integer idKhachHang, Integer idSanPham) {
        return danhGiaRepository.findByKhachHangAndSanPham(idKhachHang, idSanPham)
                .map(danhGiaMapper::toDTO)
                .orElse(null);
    }
}
