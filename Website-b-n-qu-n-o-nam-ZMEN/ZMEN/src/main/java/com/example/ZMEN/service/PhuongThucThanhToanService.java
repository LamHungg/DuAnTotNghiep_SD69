package com.example.ZMEN.service;

import com.example.ZMEN.entity.PhuongThucThanhToan;
import java.util.List;

public interface PhuongThucThanhToanService {
    List<PhuongThucThanhToan> getAllPhuongThucThanhToan();
    PhuongThucThanhToan getPhuongThucThanhToanById(Integer id);
    PhuongThucThanhToan createPhuongThucThanhToan(PhuongThucThanhToan phuongThucThanhToan);
    PhuongThucThanhToan updatePhuongThucThanhToan(Integer id, PhuongThucThanhToan phuongThucThanhToan);
    void deletePhuongThucThanhToan(Integer id);
}
