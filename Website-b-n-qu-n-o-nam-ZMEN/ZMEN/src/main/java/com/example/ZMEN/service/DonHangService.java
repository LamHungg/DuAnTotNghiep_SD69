package com.example.ZMEN.service;

import com.example.ZMEN.dto.ChiTietDonHangDto;
import com.example.ZMEN.dto.DonHangDto;
import com.example.ZMEN.dto.request.TaoDonHangRequestDto;
import jakarta.validation.Valid;

import java.util.List;

public interface DonHangService {
    List<DonHangDto> layDanhSachDonHangTomTat();

    ChiTietDonHangDto layChiTietDonHangTheoId(Integer id);

    DonHangDto daXacNhan(Integer donHangId);

    /**
     * Bắt đầu giao một đơn hàng. Chuyển từ ĐÃ XÁC NHẬN -> ĐANG GIAO.
     * @param donHangId ID của đơn hàng cần giao.
     * @return DonHangDto sau khi đã cập nhật.
     * @throws IllegalStateException nếu đơn hàng không ở trạng thái ĐÃ XÁC NHẬN.
     * @throws com.example.ZMEN.exception.ResourceNotFoundException nếu không tìm thấy đơn hàng.
     */
    DonHangDto dangGiao(Integer donHangId);

    /**
     * Đánh dấu đơn hàng đã được giao tới nơi. Chuyển từ ĐANG GIAO -> ĐÃ GIAO.
     * @param donHangId ID của đơn hàng.
     * @return DonHangDto sau khi đã cập nhật.
     */
    DonHangDto daGiao(Integer donHangId);

    /**
     * Hoàn thành đơn hàng. Chuyển từ ĐÃ GIAO -> HOÀN THÀNH.
     * @param donHangId ID của đơn hàng.
     * @return DonHangDto sau khi đã cập nhật.
     */
    DonHangDto hoanThanhDonHang(Integer donHangId);

    /**
     * Hủy một đơn hàng. Chỉ có thể hủy khi đang ở trạng thái CHỜ XÁC NHẬN.
     * @param donHangId ID của đơn hàng cần hủy.
     * @return DonHangDto sau khi đã cập nhật.
     * @throws IllegalStateException nếu đơn hàng không ở trạng thái CHỜ XÁC NHẬN.
     * @throws com.example.ZMEN.exception.ResourceNotFoundException nếu không tìm thấy đơn hàng.
     */
    DonHangDto huyDonHang(Integer donHangId);

    /**
     * Tạo đơn hàng mới từ giỏ hàng của khách hàng.
     * @param requestDto DTO chứa thông tin đơn hàng cần tạo.
     * @return DonHangDto của đơn hàng vừa tạo.
     */
    DonHangDto taoDonHang(TaoDonHangRequestDto requestDto);

    // POS method
    com.example.ZMEN.entity.DonHang saveDonHang(com.example.ZMEN.entity.DonHang donHang);
}
