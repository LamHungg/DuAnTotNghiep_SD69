package com.example.ZMEN.service;

import com.example.ZMEN.dto.LoginRequest;
import com.example.ZMEN.dto.LoginResponse;
import com.example.ZMEN.dto.ResetPasswordRequest;
import com.example.ZMEN.entity.NguoiDung;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

public interface NguoiDungService {
    List<NguoiDung> getAllNguoiDung();
    Optional<NguoiDung> getNguoiDungById(Long id);
    NguoiDung createNguoiDung(NguoiDung currentUser, @Valid NguoiDung nguoiDung);
    NguoiDung updateNguoiDung(NguoiDung currentUser, Long id, @Valid NguoiDung nguoiDung);
    NguoiDung updateStatus(NguoiDung currentUser, Long id, boolean status);
    void deleteNguoiDung(Long id);
    List<NguoiDung> searchNguoiDung(String hoTen);
    LoginResponse login(LoginRequest loginRequest);
    boolean existsByEmail(String email);
    boolean resetPassword(ResetPasswordRequest request);
}
