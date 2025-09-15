package com.example.ZMEN.service.Impl;

import com.example.ZMEN.dto.LoginRequest;
import com.example.ZMEN.dto.LoginResponse;
import com.example.ZMEN.dto.ResetPasswordRequest;
import com.example.ZMEN.entity.NguoiDung;
import com.example.ZMEN.repository.NguoiDungRepository;
import com.example.ZMEN.service.NguoiDungService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NguoiDungImpl implements NguoiDungService {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    // Kiểm tra quyền admin
    private boolean isAdmin(NguoiDung user) {
        return "ADMIN".equals(user.getChucVu());
    }

    @Override
    public List<NguoiDung> getAllNguoiDung() {
        return nguoiDungRepository.findAll();
    }

    @Override
    public Optional<NguoiDung> getNguoiDungById(Long id) {
        return nguoiDungRepository.findById(id);
    }

    @Override
    public NguoiDung createNguoiDung(NguoiDung currentUser, @Valid NguoiDung nguoiDung) {
        // Chỉ admin mới được thêm tài khoản
        if (!isAdmin(currentUser)) {
            throw new RuntimeException("Chỉ admin mới có quyền thêm tài khoản");
        }

        // Kiểm tra trùng lặp tên đăng nhập
        if (nguoiDungRepository.existsByTenDangNhap(nguoiDung.getTenDangNhap())) {
            throw new RuntimeException("Tên đăng nhập '" + nguoiDung.getTenDangNhap() + "' đã tồn tại. Vui lòng chọn tên đăng nhập khác.");
        }

        // Kiểm tra trùng lặp email
        if (nguoiDungRepository.existsByEmail(nguoiDung.getEmail())) {
            throw new RuntimeException("Email '" + nguoiDung.getEmail() + "' đã tồn tại. Vui lòng sử dụng email khác.");
        }

        // Kiểm tra trùng lặp mã
        if (nguoiDungRepository.existsByMa(nguoiDung.getMa())) {
            throw new RuntimeException("Mã người dùng '" + nguoiDung.getMa() + "' đã tồn tại. Vui lòng chọn mã khác.");
        }

        // Mặc định tài khoản mới là active
        nguoiDung.setTrangThai(true);

        return nguoiDungRepository.save(nguoiDung);
    }

    @Override
    public NguoiDung updateNguoiDung(NguoiDung currentUser, Long id, @Valid NguoiDung nguoiDungDetails) {
        // Kiểm tra quyền sửa
        if (!isAdmin(currentUser) && !currentUser.getId().equals(id)) {
            throw new RuntimeException("Không có quyền cập nhật thông tin người dùng khác");
        }

        NguoiDung existingNguoiDung = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        // Nếu không phải admin, không cho phép thay đổi chuc_vu và trang_thai
        if (!isAdmin(currentUser)) {
            nguoiDungDetails.setChucVu(existingNguoiDung.getChucVu());
            nguoiDungDetails.setTrangThai(existingNguoiDung.getTrangThai());
        }

        // Kiểm tra trùng lặp email nếu có thay đổi
        if (!existingNguoiDung.getEmail().equals(nguoiDungDetails.getEmail())) {
            if (nguoiDungRepository.existsByEmail(nguoiDungDetails.getEmail())) {
                throw new RuntimeException("Email '" + nguoiDungDetails.getEmail() + "' đã tồn tại. Vui lòng sử dụng email khác.");
            }
        }

        // Cập nhật thông tin
        existingNguoiDung.setHoTen(nguoiDungDetails.getHoTen());
        existingNguoiDung.setEmail(nguoiDungDetails.getEmail());
        existingNguoiDung.setSoDienThoai(nguoiDungDetails.getSoDienThoai());

        // Chỉ admin mới được thay đổi chuc_vu và trang_thai
        if (isAdmin(currentUser)) {
            existingNguoiDung.setChucVu(nguoiDungDetails.getChucVu());
            existingNguoiDung.setTrangThai(nguoiDungDetails.getTrangThai());
        }

        return nguoiDungRepository.save(existingNguoiDung);
    }

    @Override
    public NguoiDung updateStatus(NguoiDung currentUser, Long id, boolean status) {
        // Chỉ admin mới được thay đổi trạng thái
        if (!isAdmin(currentUser)) {
            throw new RuntimeException("Chỉ admin mới có quyền thay đổi trạng thái tài khoản");
        }

        // Không thể vô hiệu hóa chính mình
        if (currentUser.getId().equals(id)) {
            throw new RuntimeException("Không thể vô hiệu hóa tài khoản của chính mình");
        }

        NguoiDung user = nguoiDungRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        user.setTrangThai(status);
        return nguoiDungRepository.save(user);
    }

    @Override
    public void deleteNguoiDung(Long id) {
        nguoiDungRepository.deleteById(id);
    }

    @Override
    public List<NguoiDung> searchNguoiDung(String hoTen) {
        return nguoiDungRepository.findByHoTenContaining(hoTen);
    }

    @Override
    public LoginResponse login(LoginRequest loginRequest) {
        NguoiDung user = nguoiDungRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("Email không tồn tại"));

        // Kiểm tra mật khẩu
        if (!user.getMatKhau().equals(loginRequest.getMatKhau())) {
            throw new RuntimeException("Mật khẩu không đúng");
        }

        // Kiểm tra trạng thái tài khoản
        if (!user.getTrangThai()) {
            throw new RuntimeException("Tài khoản của bạn đã bị vô hiệu hóa. Vui lòng liên hệ quản trị viên để được hỗ trợ.");
        }

        LoginResponse response = new LoginResponse();
        response.setId(user.getId());
        response.setMa(user.getMa());
        response.setChucVu(user.getChucVu());
        response.setTenDangNhap(user.getTenDangNhap());
        response.setHoTen(user.getHoTen());
        response.setEmail(user.getEmail());
        response.setSoDienThoai(user.getSoDienThoai());
        response.setTrangThai(user.getTrangThai());
        response.setToken("dummy-token"); // Thay thế bằng token thực tế nếu cần
        return response;
    }

    @Override
    public boolean existsByEmail(String email) {
        return nguoiDungRepository.existsByEmail(email);
    }

    @Override
    public boolean resetPassword(ResetPasswordRequest request) {
        Optional<NguoiDung> optionalUser = nguoiDungRepository.findByEmail(request.getEmail());
        if (optionalUser.isPresent()) {
            NguoiDung user = optionalUser.get();
            user.setMatKhau(request.getMatKhauMoi());
            nguoiDungRepository.save(user);
            return true;
        }
        return false;
    }
}
