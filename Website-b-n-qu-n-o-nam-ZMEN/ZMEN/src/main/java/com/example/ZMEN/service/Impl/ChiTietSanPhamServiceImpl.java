package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.ChiTietSanPhamDTO;
import com.example.ZMEN.entity.*;
import com.example.ZMEN.exception.ResourceNotFoundException;
import com.example.ZMEN.mapper.ChiTietSanPhamMapper;
import com.example.ZMEN.repository.*;
import com.example.ZMEN.service.ChiTietSanPhamService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChiTietSanPhamServiceImpl implements ChiTietSanPhamService {
    private final ChiTietSanPhamRepository chiTietSanPhamRepository;
    private final SanPhamRepository sanPhamRepository;
    private final KichCoRepository kichCoRepository;
    private final MauSacRepository mauSacRepository;
    private final ChatLieuRepository chatLieuRepository;
    private final HinhAnhSanPhamRepository hinhAnhSanPhamRepository;
    private final NguoiDungRepository nguoiDungRepository;
    private final ChiTietSanPhamMapper chiTietSanPhamMapper;

    public ChiTietSanPhamServiceImpl(ChiTietSanPhamRepository chiTietSanPhamRepository,
                                     SanPhamRepository sanPhamRepository,
                                     KichCoRepository kichCoRepository,
                                     MauSacRepository mauSacRepository,
                                     ChatLieuRepository chatLieuRepository,
                                     HinhAnhSanPhamRepository hinhAnhSanPhamRepository,
                                     NguoiDungRepository nguoiDungRepository,
                                     ChiTietSanPhamMapper chiTietSanPhamMapper) {
        this.chiTietSanPhamRepository = chiTietSanPhamRepository;
        this.sanPhamRepository = sanPhamRepository;
        this.kichCoRepository = kichCoRepository;
        this.mauSacRepository = mauSacRepository;
        this.chatLieuRepository = chatLieuRepository;
        this.hinhAnhSanPhamRepository = hinhAnhSanPhamRepository;
        this.nguoiDungRepository = nguoiDungRepository;
        this.chiTietSanPhamMapper = chiTietSanPhamMapper;
    }

    @Override
    public List<ChiTietSanPhamDTO> getAllChiTietSanPham() {
        return chiTietSanPhamRepository.findAll().stream()
                .map(chiTietSanPhamMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ChiTietSanPhamDTO getChiTietSanPhamById(Integer id) {
        ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chi tiết sản phẩm không tồn tại với ID: " + id));
        return chiTietSanPhamMapper.toDTO(chiTietSanPham);
    }

    @Override
    public ChiTietSanPhamDTO createChiTietSanPham(ChiTietSanPhamDTO dto) {
        // Validate các entity liên quan
        SanPham sanPham = sanPhamRepository.findById(dto.getIdSanPham())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + dto.getIdSanPham()));
        KichCo kichCo = kichCoRepository.findById(dto.getIdKichCo())
                .orElseThrow(() -> new ResourceNotFoundException("Kích cỡ không tồn tại với ID: " + dto.getIdKichCo()));
        MauSac mauSac = mauSacRepository.findById(dto.getIdMauSac())
                .orElseThrow(() -> new ResourceNotFoundException("Màu sắc không tồn tại với ID: " + dto.getIdMauSac()));
        ChatLieu chatLieu = chatLieuRepository.findById(dto.getIdChatLieu())
                .orElseThrow(() -> new ResourceNotFoundException("Chất liệu không tồn tại với ID: " + dto.getIdChatLieu()));

        // Lấy thông tin người tạo
        NguoiDung nguoiTao = null;
        if (dto.getIdNguoiTao() != null) {
            nguoiTao = nguoiDungRepository.findById(dto.getIdNguoiTao())
                    .orElseThrow(() -> new ResourceNotFoundException("Người tạo không tồn tại với ID: " + dto.getIdNguoiTao()));
        } else {
            // Lấy người dùng đầu tiên làm mặc định
            List<NguoiDung> nguoiDungList = nguoiDungRepository.findAll();
            if (!nguoiDungList.isEmpty()) {
                nguoiTao = nguoiDungList.get(0);
            } else {
                throw new ResourceNotFoundException("Không tìm thấy người dùng mặc định");
            }
        }

        // Tạo chi tiết sản phẩm
        ChiTietSanPham chiTietSanPham = chiTietSanPhamMapper.toEntity(dto);
        chiTietSanPham.setSanPham(sanPham);
        chiTietSanPham.setKichCo(kichCo);
        chiTietSanPham.setMauSac(mauSac);
        chiTietSanPham.setChatLieu(chatLieu);
        chiTietSanPham.setNguoiTao(nguoiTao);
        chiTietSanPham.setNgayTao(java.time.LocalDateTime.now());
        chiTietSanPham.setTrangThai(dto.getTrangThai() != null ? dto.getTrangThai() : (byte) 1);
        
        // Lưu chi tiết sản phẩm trước
        chiTietSanPham = chiTietSanPhamRepository.save(chiTietSanPham);
        
        // Xử lý hình ảnh sản phẩm
        if (dto.getHinhAnh() != null && dto.getHinhAnh().length > 0) {
            // Lưu ảnh đầu tiên làm ảnh chính
            HinhAnhSanPham hinhAnhChinh = new HinhAnhSanPham();
            hinhAnhChinh.setUrl(dto.getHinhAnh()[0]);
            hinhAnhChinh.setIsThumbnail(true);
            hinhAnhChinh.setSanPham(sanPham);
            hinhAnhChinh.setChiTietSanPham(chiTietSanPham);
            hinhAnhChinh = hinhAnhSanPhamRepository.save(hinhAnhChinh);
            
            // Cập nhật lại chi tiết sản phẩm với ảnh chính
            chiTietSanPham.setIdHinhAnhSanPham(hinhAnhChinh);
            chiTietSanPham = chiTietSanPhamRepository.save(chiTietSanPham);
            
            // Lưu các ảnh còn lại
            for (int i = 1; i < dto.getHinhAnh().length; i++) {
                HinhAnhSanPham hinhAnh = new HinhAnhSanPham();
                hinhAnh.setUrl(dto.getHinhAnh()[i]);
                hinhAnh.setIsThumbnail(false);
                hinhAnh.setSanPham(sanPham);
                hinhAnh.setChiTietSanPham(chiTietSanPham);
                hinhAnhSanPhamRepository.save(hinhAnh);
            }
        }

        return chiTietSanPhamMapper.toDTO(chiTietSanPham);
    }

    @Override
    public ChiTietSanPhamDTO updateChiTietSanPham(Integer id, ChiTietSanPhamDTO dto) {
        // Tìm chi tiết sản phẩm cần cập nhật
        ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chi tiết sản phẩm không tồn tại với ID: " + id));

        // Validate các entity liên quan
        SanPham sanPham = sanPhamRepository.findById(dto.getIdSanPham())
                .orElseThrow(() -> new ResourceNotFoundException("Sản phẩm không tồn tại với ID: " + dto.getIdSanPham()));
        KichCo kichCo = kichCoRepository.findById(dto.getIdKichCo())
                .orElseThrow(() -> new ResourceNotFoundException("Kích cỡ không tồn tại với ID: " + dto.getIdKichCo()));
        MauSac mauSac = mauSacRepository.findById(dto.getIdMauSac())
                .orElseThrow(() -> new ResourceNotFoundException("Màu sắc không tồn tại với ID: " + dto.getIdMauSac()));
        ChatLieu chatLieu = chatLieuRepository.findById(dto.getIdChatLieu())
                .orElseThrow(() -> new ResourceNotFoundException("Chất liệu không tồn tại với ID: " + dto.getIdChatLieu()));

        // Cập nhật thông tin cơ bản
        chiTietSanPham.setSanPham(sanPham);
        chiTietSanPham.setKichCo(kichCo);
        chiTietSanPham.setMauSac(mauSac);
        chiTietSanPham.setChatLieu(chatLieu);
        chiTietSanPham.setSoLuong(dto.getSoLuong());
        chiTietSanPham.setGia(dto.getGia());
        chiTietSanPham.setGiaNhap(dto.getGiaNhap());
        chiTietSanPham.setTrangThai(dto.getTrangThai() != null ? dto.getTrangThai() : (byte) 1);
        
        // Xử lý hình ảnh sản phẩm
        if (dto.getHinhAnh() != null && dto.getHinhAnh().length > 0) {
            // Lưu ảnh đầu tiên làm ảnh chính
            HinhAnhSanPham hinhAnhChinh = new HinhAnhSanPham();
            hinhAnhChinh.setUrl(dto.getHinhAnh()[0]);
            hinhAnhChinh.setIsThumbnail(true);
            hinhAnhChinh.setSanPham(sanPham);
            hinhAnhChinh.setChiTietSanPham(chiTietSanPham);
            hinhAnhChinh = hinhAnhSanPhamRepository.save(hinhAnhChinh);
            
            // Cập nhật lại chi tiết sản phẩm với ảnh chính
            chiTietSanPham.setIdHinhAnhSanPham(hinhAnhChinh);
            
            // Lưu các ảnh còn lại
            for (int i = 1; i < dto.getHinhAnh().length; i++) {
                HinhAnhSanPham hinhAnh = new HinhAnhSanPham();
                hinhAnh.setUrl(dto.getHinhAnh()[i]);
                hinhAnh.setIsThumbnail(false);
                hinhAnh.setSanPham(sanPham);
                hinhAnh.setChiTietSanPham(chiTietSanPham);
                hinhAnhSanPhamRepository.save(hinhAnh);
            }
            
            // Sau khi lưu ảnh mới, xóa ảnh cũ (trừ ảnh chính hiện tại)
            List<HinhAnhSanPham> anhCu = hinhAnhSanPhamRepository.findByChiTietSanPhamId(id);
            for (HinhAnhSanPham anh : anhCu) {
                if (!anh.getId().equals(hinhAnhChinh.getId())) {
                    hinhAnhSanPhamRepository.delete(anh);
                }
            }
        }

        // Cập nhật người cập nhật và ngày cập nhật
        if (dto.getIdNguoiCapNhat() != null) {
            NguoiDung nguoiCapNhat = nguoiDungRepository.findById(dto.getIdNguoiCapNhat())
                    .orElseThrow(() -> new ResourceNotFoundException("Người cập nhật không tồn tại với ID: " + dto.getIdNguoiCapNhat()));
            chiTietSanPham.setNguoiCapNhat(nguoiCapNhat);
        }
        chiTietSanPham.setNgayCapNhat(java.time.LocalDateTime.now());

        chiTietSanPham = chiTietSanPhamRepository.save(chiTietSanPham);
        return chiTietSanPhamMapper.toDTO(chiTietSanPham);
    }

    @Override
    public void deleteChiTietSanPham(Integer id) {
        ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chi tiết sản phẩm không tồn tại với ID: " + id));
        chiTietSanPhamRepository.deleteById(id);
    }

    @Override
    public List<ChiTietSanPhamDTO> locChiTietSanPham(Integer idKichCo, Integer idMauSac, Integer idChatLieu) {
        return chiTietSanPhamRepository.findByBoLoc(idKichCo, idMauSac, idChatLieu)
                .stream()
                .map(chiTietSanPhamMapper::toDTO)
                .collect(Collectors.toList());
    }

    // POS methods
    @Override
    public List<ChiTietSanPhamDTO> getAllChiTietSanPhamForPOS() {
        return chiTietSanPhamRepository.findBySoLuongGreaterThanZero()
                .stream()
                .map(chiTietSanPhamMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<ChiTietSanPhamDTO> searchProductsForPOS(String keyword) {
        return chiTietSanPhamRepository.searchProductsForPOS(keyword)
                .stream()
                .map(chiTietSanPhamMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ChiTietSanPhamDTO updateStock(Integer id, Integer soLuongThayDoi) {
        ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chi tiết sản phẩm không tồn tại với ID: " + id));
        
        int soLuongMoi = chiTietSanPham.getSoLuong() + soLuongThayDoi;
        if (soLuongMoi < 0) {
            throw new RuntimeException("Không đủ tồn kho để thực hiện thao tác này");
        }
        
        chiTietSanPham.setSoLuong(soLuongMoi);
        chiTietSanPham = chiTietSanPhamRepository.save(chiTietSanPham);
        return chiTietSanPhamMapper.toDTO(chiTietSanPham);
    }

    @Override
    public com.example.ZMEN.entity.ChiTietSanPham getChiTietSanPhamEntityById(Integer id) {
        return chiTietSanPhamRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Chi tiết sản phẩm không tồn tại với ID: " + id));
    }
}
