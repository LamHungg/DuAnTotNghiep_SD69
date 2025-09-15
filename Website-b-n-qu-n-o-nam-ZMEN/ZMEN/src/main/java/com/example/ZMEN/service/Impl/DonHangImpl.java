package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.ChiTietDonHangDto;
import com.example.ZMEN.dto.DonHangDto;
import com.example.ZMEN.dto.SanPhamTrongDonHangDto;
import com.example.ZMEN.dto.request.TaoDonHangRequestDto;
import com.example.ZMEN.entity.ChiTietDonHang;
import com.example.ZMEN.entity.ChiTietSanPham;
import com.example.ZMEN.entity.DiaChi;
import com.example.ZMEN.entity.DonHang;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.entity.LichSuDonHang;
import com.example.ZMEN.entity.TrangThaiDonHang;
import com.example.ZMEN.entity.TrangThaiDonHangConstant;
import com.example.ZMEN.exception.ResourceNotFoundException;
import com.example.ZMEN.mapper.DonHangMapper;
import com.example.ZMEN.repository.ChiTietDonHangRepository;
import com.example.ZMEN.repository.ChiTietSanPhamRepository;
import com.example.ZMEN.repository.DiaChiRepository;
import com.example.ZMEN.repository.DonHangRepository;
import com.example.ZMEN.repository.KhachHangRepository;
import com.example.ZMEN.repository.LichSuDonHangRepository;
import com.example.ZMEN.repository.TrangThaiDonHangRepository;
import com.example.ZMEN.service.DonHangService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class DonHangImpl implements DonHangService {
    private final LichSuDonHangRepository lichSuDonHangRepository;
    private final DonHangRepository donHangRepository;
    private final ChiTietDonHangRepository chiTietDonHangRepository;
    private final KhachHangRepository khachHangRepository;
    private final DiaChiRepository diaChiRepository;
    private final ChiTietSanPhamRepository chiTietSanPhamRepository;
    private final TrangThaiDonHangRepository trangThaiDonHangRepository;

    public DonHangImpl(LichSuDonHangRepository lichSuDonHangRepository, DonHangRepository donHangRepository, ChiTietDonHangRepository chiTietDonHangRepository, KhachHangRepository khachHangRepository, DiaChiRepository diaChiRepository, ChiTietSanPhamRepository chiTietSanPhamRepository,
                       TrangThaiDonHangRepository trangThaiDonHangRepository) {
        this.lichSuDonHangRepository = lichSuDonHangRepository;
        this.donHangRepository = donHangRepository;
        this.chiTietDonHangRepository = chiTietDonHangRepository;
        this.khachHangRepository = khachHangRepository;
        this.diaChiRepository = diaChiRepository;
        this.chiTietSanPhamRepository = chiTietSanPhamRepository;
        this.trangThaiDonHangRepository = trangThaiDonHangRepository;
    }

    // --- CÁC HÀM PUBLIC - KHÔNG THAY ĐỔI CÁCH GỌI ---
    // Chúng vẫn gọi đến helper `updateStatus`
// --- Các hàm lấy dữ liệu ---
    @Override
    public List<DonHangDto> layDanhSachDonHangTomTat() {
        List<ChiTietDonHang> allDetails = chiTietDonHangRepository.findAllWithRelationships();
        // Gom nhóm theo donHang.id
        return allDetails.stream()
                .collect(Collectors.groupingBy(ctdh -> ctdh.getDonHang().getId()))
                .values().stream()
                .map(DonHangMapper::toDonHangDto)
                .collect(Collectors.toList());
    }

    @Override
    public ChiTietDonHangDto layChiTietDonHangTheoId(Integer id) {
        List<ChiTietDonHang> chiTietList = chiTietDonHangRepository.findByIdDonHang(id);
        if (chiTietList == null || chiTietList.isEmpty()) {
            return null;
        }
        // TODO: Lấy lịch sử đơn hàng nếu cần, hiện tại để null
        return DonHangMapper.toChiTietDonHangDto(chiTietList, null);
    }

    @Override
    public DonHangDto daXacNhan(Integer donHangId) {
        return updateStatus(donHangId, TrangThaiDonHangConstant.CHO_XAC_NHAN, TrangThaiDonHangConstant.DA_XAC_NHAN, "Chỉ có thể xác nhận đơn hàng đang ở trạng thái 'Chờ xác nhận'.");
    }

    @Override
    public DonHangDto dangGiao(Integer donHangId) {
        return updateStatus(donHangId, TrangThaiDonHangConstant.DA_XAC_NHAN, TrangThaiDonHangConstant.DANG_GIAO, "Chỉ có thể giao hàng khi đơn đã được xác nhận.");
    }

    @Override
    public DonHangDto daGiao(Integer donHangId) {
        return updateStatus(donHangId, TrangThaiDonHangConstant.DANG_GIAO, TrangThaiDonHangConstant.DA_GIAO, "Chỉ có thể cập nhật 'Đã giao' cho đơn hàng đang được vận chuyển.");
    }

    @Override
    public DonHangDto hoanThanhDonHang(Integer donHangId) {
        return updateStatus(donHangId, TrangThaiDonHangConstant.DA_GIAO, TrangThaiDonHangConstant.HOAN_THANH, "Chỉ có thể hoàn thành đơn hàng đã được giao thành công.");
    }

    @Override
    public DonHangDto huyDonHang(Integer donHangId) {
        return updateStatus(donHangId, TrangThaiDonHangConstant.CHO_XAC_NHAN, TrangThaiDonHangConstant.DA_HUY, "Chỉ có thể hủy đơn hàng đang ở trạng thái 'Chờ xác nhận'.");
    }


    // --- LOGIC HELPER ĐƯỢC VIẾT LẠI HOÀN TOÀN ---
    @Transactional
    protected DonHangDto updateStatus(Integer donHangId, Integer expectedCurrentStatusId, Integer newStatusId, String errorMessage) {
        // 1. Tìm TẤT CẢ các dòng chi tiết của đơn hàng
        List<ChiTietDonHang> chiTietList = chiTietDonHangRepository.findByIdDonHang(donHangId);

        // 2. Nếu không tìm thấy dòng chi tiết nào, tức là đơn hàng không tồn tại -> Lỗi 404
        if (chiTietList == null || chiTietList.isEmpty()) {
            throw new ResourceNotFoundException("Không tìm thấy đơn hàng với ID: " + donHangId);
        }

        // 3. Lấy trạng thái hiện tại từ dòng chi tiết ĐẦU TIÊN để kiểm tra
        ChiTietDonHang firstItem = chiTietList.get(0);
        if (!firstItem.getIdTrangThai().equals(expectedCurrentStatusId)) {
            throw new IllegalStateException(errorMessage);
        }

        // 4. Tìm đối tượng TrangThaiDonHang mới để cập nhật
        TrangThaiDonHang newTrangThai = trangThaiDonHangRepository.findById(newStatusId)
                .orElseThrow(() -> new ResourceNotFoundException("Lỗi hệ thống: Không tìm thấy trạng thái với ID: " + newStatusId));

        // 5. Cập nhật trạng thái cho TẤT CẢ các dòng chi tiết - SỬ DỤNG NATIVE QUERY
        for (ChiTietDonHang chiTiet : chiTietList) {
            // Sử dụng native query để chỉ cập nhật trạng thái
            chiTietDonHangRepository.updateTrangThaiById(chiTiet.getId(), newStatusId);
        }

        // 6. Lấy lại dữ liệu đã cập nhật
        List<ChiTietDonHang> updatedChiTietList = chiTietDonHangRepository.findByIdDonHang(donHangId);

        // 7. Sử dụng mapper của bạn để chuyển đổi danh sách đã cập nhật thành DTO
        return DonHangMapper.toDonHangDto(updatedChiTietList);
    }

    @Override
    @Transactional
    public DonHangDto taoDonHang(TaoDonHangRequestDto requestDto) {
        // --- BƯỚC 1: XÁC THỰC VÀ LẤY CÁC THỰC THỂ LIÊN QUAN ---
        KhachHang khachHang = khachHangRepository.findById(requestDto.getKhachHangId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy khách hàng với ID: " + requestDto.getKhachHangId()));

        DiaChi diaChi = diaChiRepository.findById(requestDto.getDiaChiId())
                .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy địa chỉ với ID: " + requestDto.getDiaChiId()));

        TrangThaiDonHang trangThaiBanDau = trangThaiDonHangRepository.findById(TrangThaiDonHangConstant.CHO_XAC_NHAN)
                .orElseThrow(() -> new IllegalStateException("Lỗi hệ thống: Không tìm thấy trạng thái 'Chờ Xác Nhận'"));

        // --- BƯỚC 2: TẠO ĐỐI TƯỢNG ĐƠN HÀNG CHÍNH ---
        DonHang donHangMoi = new DonHang();
        
        // Tạo mã đơn hàng
        String maDonHang = generateMaDonHang();
        donHangMoi.setMaDonHang(maDonHang);
        donHangMoi.setNgayDat(LocalDateTime.now());
        donHangMoi.setKhachHang(khachHang);
        donHangMoi.setLoaiDonHang(requestDto.getLoaiDonHang() != null ? requestDto.getLoaiDonHang() : true); // true = online

        // Tổng tiền sẽ được tính và set sau
        BigDecimal tongTienHang = BigDecimal.ZERO;
        List<ChiTietDonHang> danhSachChiTietDonHang = new ArrayList<>();

        // --- BƯỚC 3: XỬ LÝ TỪNG SẢN PHẨM VÀ TẠO ChiTietDonHang ---
        for (SanPhamTrongDonHangDto spDto : requestDto.getChiTietSanPhams()) {
            ChiTietSanPham chiTietSanPham = chiTietSanPhamRepository.findById(spDto.getChiTietSanPhamId())
                    .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy chi tiết sản phẩm với ID: " + spDto.getChiTietSanPhamId()));

            // Kiểm tra số lượng tồn kho
            if (chiTietSanPham.getSoLuong() < spDto.getSoLuong()) {
                throw new IllegalStateException("Sản phẩm '" + chiTietSanPham.getSanPham().getTenSanPham() + "' không đủ số lượng trong kho.");
            }
            
            // TRỪ SỐ LƯỢNG SẢN PHẨM
            chiTietSanPham.setSoLuong(chiTietSanPham.getSoLuong() - spDto.getSoLuong());
            chiTietSanPhamRepository.save(chiTietSanPham);

            BigDecimal giaBan = BigDecimal.valueOf(chiTietSanPham.getGia());
            BigDecimal thanhTien = giaBan.multiply(BigDecimal.valueOf(spDto.getSoLuong()));
            tongTienHang = tongTienHang.add(thanhTien);

            ChiTietDonHang chiTiet = new ChiTietDonHang();

            // Gán các thông tin vào ChiTietDonHang
            chiTiet.setChiTietSanPham(chiTietSanPham);
            chiTiet.setSoLuong(spDto.getSoLuong());
            chiTiet.setKhachHang(khachHang);
            chiTiet.setDiaChi(diaChi);
            chiTiet.setTrangThai(trangThaiBanDau);
            chiTiet.setDonHang(donHangMoi);

            danhSachChiTietDonHang.add(chiTiet);
        }

        // --- BƯỚC 4: CẬP NHẬT TỔNG TIỀN VÀ LƯU ĐƠN HÀNG CHÍNH ---
        donHangMoi.setTongTienHang(tongTienHang);
        donHangMoi.setTongThanhToan(tongTienHang); // Tạm tính
        DonHang savedDonHang = donHangRepository.save(donHangMoi);

        // --- BƯỚC 5: LƯU CHI TIẾT ĐƠN HÀNG ---
        List<ChiTietDonHang> savedChiTietList = chiTietDonHangRepository.saveAll(danhSachChiTietDonHang);

        // --- BƯỚC 6: TRẢ VỀ DTO SỬ DỤNG MAPPER ---
        return DonHangMapper.toDonHangDto(savedChiTietList);
    }

    // Helper method để tạo mã đơn hàng
    private String generateMaDonHang() {
        // Lấy số lượng đơn hàng hiện tại để tạo mã
        long count = donHangRepository.count();
        return String.format("DH%06d", count + 1);
    }

    // POS method
    @Override
    public com.example.ZMEN.entity.DonHang saveDonHang(com.example.ZMEN.entity.DonHang donHang) {
        return donHangRepository.save(donHang);
    }
}