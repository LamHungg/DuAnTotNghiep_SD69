package com.example.ZMEN.controller;

import com.example.ZMEN.dto.ChiTietDonHangDto;
import com.example.ZMEN.dto.DonHangDto;
import com.example.ZMEN.dto.request.TaoDonHangRequestDto;
import com.example.ZMEN.service.DonHangService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.util.List;

@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
@RestController
@RequestMapping("/ZMEN/Admin/DonHang")
public class DonHangContro {

    private final DonHangService donHangService;

    public DonHangContro(DonHangService donHangService) {
        this.donHangService = donHangService;
    }

    @GetMapping
    public ResponseEntity<List<DonHangDto>> layDanhSachDonHang() {
        // Gọi phương thức service để lấy dữ liệu
        List<DonHangDto> danhSachDonHang = donHangService.layDanhSachDonHangTomTat();

        // Trả về dữ liệu trong body của response với status 200
        return ResponseEntity.ok(danhSachDonHang);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChiTietDonHangDto> layDonHangTheoId(@PathVariable Integer id) {
        // Gọi phương thức service để l ấy dữ liệu chi tiết
        ChiTietDonHangDto chiTietDonHang = donHangService.layChiTietDonHangTheoId(id);

        // Kiểm tra kết quả trả về từ service
        if (chiTietDonHang != null) {
            // Nếu tìm thấy đơn hàng, trả về dữ liệu với status 200 OK
            return ResponseEntity.ok(chiTietDonHang);
        } else {
            // Nếu không tìm thấy (service trả về null), trả về status 404 Not Found
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<DonHangDto> taoDonHangMoi(@Valid @RequestBody TaoDonHangRequestDto requestDto) {
        // Gọi service để xử lý logic tạo đơn hàng
        DonHangDto donHangVuaTao = donHangService.taoDonHang(requestDto);

        // Trả về status 201 Created cùng với thông tin đơn hàng vừa tạo
        // và Location header trỏ tới tài nguyên mới
        return ResponseEntity
                .created(URI.create("/ZMEN/Admin/DonHang/" + donHangVuaTao.getId()))
                .body(donHangVuaTao);
    }

    @PostMapping("/{id}/confirm")
    public ResponseEntity<?> confirmDonHang(@PathVariable Integer id) {
        try {
            DonHangDto updatedDonHang = donHangService.daXacNhan(id);
            return ResponseEntity.ok(updatedDonHang);
        } catch (IllegalStateException e) {
            // Trả về lỗi nghiệp vụ rõ ràng
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            // Lỗi không tìm thấy đơn hàng
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    /**
     * Bắt đầu giao hàng. ĐÃ XÁC NHẬN -> ĐANG GIAO HÀNG
     * URL: POST /admin/DonHang/{id}/ship
     */
    @PostMapping("/{id}/ship")
    public ResponseEntity<?> shipDonHang(@PathVariable Integer id) {
        try {
            DonHangDto updatedDonHang = donHangService.dangGiao(id);
            return ResponseEntity.ok(updatedDonHang);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
    /**
     * Giao hàng thành công. ĐANG GIAO HÀNG -> GIAO HÀNG THÀNH CÔNG
     * URL: POST /admin/DonHang/{id}/deliver
     */

    @PostMapping("/{id}/deliver")
    public ResponseEntity<DonHangDto> deliverDonHang(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(donHangService.daGiao(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Giao hàng thành công. GIAO HÀNG THÀNH CÔNG -> HOÀN THÀNH
     * URL: POST /admin/DonHang/{id}/complete
     */

    @PostMapping("/{id}/complete")
    public ResponseEntity<DonHangDto> completeDonHang(@PathVariable Integer id) {
        try {
            return ResponseEntity.ok(donHangService.hoanThanhDonHang(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    /**
     * Hủy đơn hàng.
     * URL: POST /admin/DonHang/{id}/cancel
     */
    @PostMapping("/{id}/cancel")
    public ResponseEntity<?> cancelDonHang(@PathVariable Integer id) {
        try {
            DonHangDto updatedDonHang = donHangService.huyDonHang(id);
            return ResponseEntity.ok(updatedDonHang);
        } catch (IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }
}
