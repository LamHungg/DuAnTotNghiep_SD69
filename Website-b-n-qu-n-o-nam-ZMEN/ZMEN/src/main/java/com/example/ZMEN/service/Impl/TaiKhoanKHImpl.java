package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.TaiKhoanKHDto.DangKyDto;
import com.example.ZMEN.dto.TaiKhoanKHDto.DangNhapDto;
import com.example.ZMEN.dto.TaiKhoanKHDto.ResetMatKhauDto;
import com.example.ZMEN.dto.TaiKhoanKHDto.UpdateThongTinCaNhanDto;
import com.example.ZMEN.entity.KhachHang;
import com.example.ZMEN.mapper.TaiKhoanKHMapper;
import com.example.ZMEN.repository.KhachHangRepository;
import com.example.ZMEN.repository.TaiKhoanKHRepository;
import com.example.ZMEN.service.TaiKhoanKHService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Optional;

@Service

public class TaiKhoanKHImpl implements TaiKhoanKHService {
    @Autowired
    private TaiKhoanKHRepository taiKhoanKHRepository;

    private BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Autowired
    private KhachHangRepository khachHangRepository;

    @Override
    public KhachHang dangKy(DangKyDto dto) {

        KhachHang kh = TaiKhoanKHMapper.fromDangKyDTO(dto);
        kh.setMatKhau(passwordEncoder.encode(dto.getMatKhau()));

        kh.setNgayDangKy(LocalDateTime.now());
        kh.setTrangThaiTaiKhoan((int) 1);
        // Lưu trước để có ID
        KhachHang savedKh = taiKhoanKHRepository.save(kh);

        // Sinh mã KH sau khi đã có ID
        savedKh.setMaKhachHang(String.format("KH%03d", savedKh.getId()));
        return taiKhoanKHRepository.save(savedKh);
    }




    @Override
    public boolean tenDangNhapDaTonTai(String tenDangNhap) {
        return taiKhoanKHRepository.existsByTenDangNhap(tenDangNhap);
    }



    @Override
    public KhachHang dangNhap(DangNhapDto dto) {
        try {
            // Thử tìm theo email trước
            Optional<KhachHang> optional = khachHangRepository.findByEmail(dto.getTaiKhoan());
            
            // Nếu không tìm thấy theo email, thử tìm theo số điện thoại
            if (optional.isEmpty()) {
                // Tìm theo số điện thoại
                optional = khachHangRepository.findBySoDienThoai(dto.getTaiKhoan());
            }
            
            if (optional.isEmpty()) {
                throw new RuntimeException("Email hoặc số điện thoại không tồn tại");
            }
            
            KhachHang khachHang = optional.get();
            if (!passwordEncoder.matches(dto.getMatKhau(), khachHang.getMatKhau())) {
                throw new RuntimeException("Mật khẩu không đúng");
            }
            return khachHang;
        } catch (Exception e) {
            System.err.println("Debug - Lỗi đăng nhập: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    @Override
    public void updateMatKhau(ResetMatKhauDto dto) {
        KhachHang kh = khachHangRepository.findByEmail(dto.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email không tồn tại"));

        kh.setMatKhau(passwordEncoder.encode(dto.getMatKhauMoi()));
        khachHangRepository.save(kh);
    }


    /**
     * Kiểm tra xem email đã tồn tại trong hệ thống chưa
     */
    @Override
    public boolean emailDaTonTai(String email) {
        return taiKhoanKHRepository.existsByEmail(email);
    }

    @Override
    public KhachHang capNhatThongTinCaNhan(Integer id, UpdateThongTinCaNhanDto dto) {
        Optional<KhachHang> optionalKh = taiKhoanKHRepository.findById(id);
        if (optionalKh.isEmpty()) {
            throw new RuntimeException("Không tìm thấy khách hàng.");
        }
        KhachHang kh = optionalKh.get();

        // Nếu email mới khác email cũ => phải check trùng
        if (!kh.getEmail().equals(dto.getEmail()) && taiKhoanKHRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email đã tồn tại, vui lòng chọn email khác.");
        }

        kh.setHoTen(dto.getHoTen());
        kh.setGioiTinh(dto.getGioiTinh());
        kh.setNgaySinh(dto.getNgaySinh());
        kh.setEmail(dto.getEmail());

        return taiKhoanKHRepository.save(kh);
    }

}
