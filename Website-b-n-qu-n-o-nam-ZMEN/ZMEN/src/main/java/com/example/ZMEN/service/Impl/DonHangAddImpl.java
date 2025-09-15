package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.DonHangAddDto;
import com.example.ZMEN.entity.DonHang;
import com.example.ZMEN.mapper.DonHangAddMapper;
import com.example.ZMEN.repository.DonHangRepository;
import com.example.ZMEN.service.DonHangAddService;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;

@Service
@AllArgsConstructor
public class DonHangAddImpl implements DonHangAddService {

    private final DonHangRepository donHangRepository;

    @Override
    public DonHangAddDto addDonHang(DonHangAddDto donHangAddDto) {
        // Khởi tạo một đối tượng DonHang Entity mới
        // Không cần map từ donHangAddDto ban đầu nếu nó chỉ là một DTO trống
        DonHang donHang = new DonHang();

        // 1. Tạo mã đơn hàng tự sinh và gán vào Entity
        String maDonHang = generateRandomMaDonHang();
        donHang.setMaDonHang(maDonHang);

        // 2. Loại đơn hàng: Luôn là offline (false) cho bán hàng tại quầy
        donHang.setLoaiDonHang(false); // Đặt rõ ràng là false

        // 3. Ngày đặt: Luôn là ngày hiện tại
        donHang.setNgayDat(LocalDateTime.now());

        // 4. Tổng tiền hàng ban đầu: Mặc định là 0
        donHang.setTongTienHang(BigDecimal.ZERO);

        // 5. Tổng thanh toán ban đầu: Mặc định là 0
        donHang.setTongThanhToan(BigDecimal.ZERO);

        // 6. Các trường khác nếu có trong DTO mà bạn muốn copy (ví dụ: ghiChuKhachHang)
        // Nếu DTO của bạn có các trường khác mà frontend có thể gửi lên và bạn muốn giữ lại
        // thì bạn có thể copy chúng sau khi đã thiết lập các giá trị mặc định.
        // Ví dụ:
        // if (donHangAddDto.getGhiChuKhachHang() != null) {
        //     donHang.setGhiChuKhachHang(donHangAddDto.getGhiChuKhachHang());
        // }


        // 7. Lưu DonHang vào cơ sở dữ liệu
        DonHang savedDonHang = donHangRepository.save(donHang);

        // 8. Chuyển đổi Entity DonHang đã lưu sang DTO để trả về
        return DonHangAddMapper.mapToDonHangAddDto(savedDonHang);
    }

    // Phương thức để sinh mã đơn hàng ngẫu nhiên (giữ nguyên)
    private String generateRandomMaDonHang() {
        Random random = new Random();
        // Sinh số ngẫu nhiên từ 100000 đến 999999 (6 chữ số)
        int randomNumber = 100000 + random.nextInt(900000);
        return "DH" + randomNumber;
    }
}