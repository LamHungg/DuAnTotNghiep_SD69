package com.example.ZMEN.controller;

import com.example.ZMEN.dto.ThongKeDto.DoanhThuDto;
import com.example.ZMEN.dto.ThongKeDto.HieuSuatNVDto;
import com.example.ZMEN.dto.ThongKeDto.KhachHangChiTieuDto;
import com.example.ZMEN.dto.ThongKeDto.SanPhamBanChayDto;
import com.example.ZMEN.service.ThongKeService;
import com.example.ZMEN.util.ExcelExportUtil;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/zmen")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class ThongKeControllor {
    @Autowired
    private ThongKeService thongKeService;

    // ==================== SẢN PHẨM BÁN CHẠY ====================
    @GetMapping("/san-pham/ngay")
    public List<SanPhamBanChayDto> thongKeTheoNgay(@RequestParam("ngay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay) {
        return thongKeService.thongKeTheoNgay(ngay);
    }

    @GetMapping("/san-pham/thang")
    public List<SanPhamBanChayDto> thongKeTheoThang(@RequestParam("thang") int thang, @RequestParam("nam") int nam) {
        return thongKeService.thongKeTheoThang(thang, nam);
    }

    @GetMapping("/san-pham/nam")
    public List<SanPhamBanChayDto> thongKeTheoNam(@RequestParam("nam") int nam) {
        return thongKeService.thongKeTheoNam(nam);
    }

    @GetMapping("/san-pham/khoang-ngay")
    public List<SanPhamBanChayDto> thongKeKhoangNgay(
            @RequestParam("tuNgay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tuNgay,
            @RequestParam("denNgay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate denNgay
    ) {
        return thongKeService.thongKeTheoKhoangNgay(tuNgay, denNgay);
    }

    // ==================== DOANH THU ====================
    @GetMapping("/doanh-thu/ngay")
    public DoanhThuDto getDoanhThuTheoNgay(@RequestParam("ngay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay) {
        return thongKeService.getDoanhThuTheoNgay(ngay);
    }

    @GetMapping("/doanh-thu/thang")
    public DoanhThuDto getDoanhThuTheoThang(@RequestParam("thang") int thang, @RequestParam("nam") int nam) {
        return thongKeService.getDoanhThuTheoThang(thang, nam);
    }

    @GetMapping("/doanh-thu/nam")
    public DoanhThuDto getDoanhThuTheoNam(@RequestParam("nam") int nam) {
        return thongKeService.getDoanhThuTheoNam(nam);
    }

    @GetMapping("/doanh-thu/khoang-ngay")
    public DoanhThuDto getDoanhThuKhoangNgay(
            @RequestParam("tuNgay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tuNgay,
            @RequestParam("denNgay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate denNgay
    ) {
        return thongKeService.getDoanhThuKhoangNgay(tuNgay, denNgay);
    }

    // ==================== HIỆU SUẤT NHÂN VIÊN ====================
    @GetMapping("/nhan-vien/ngay")
    public List<HieuSuatNVDto> getHieuSuatNVTheoNgay(@RequestParam("ngay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay) {
        return thongKeService.getHieuSuatNVTheoNgay(ngay);
    }

    @GetMapping("/nhan-vien/thang")
    public List<HieuSuatNVDto> getHieuSuatNVTheoThang(@RequestParam("thang") int thang, @RequestParam("nam") int nam) {
        return thongKeService.getHieuSuatNVTheoThang(thang, nam);
    }

    @GetMapping("/nhan-vien/nam")
    public List<HieuSuatNVDto> getHieuSuatNVTheoNam(@RequestParam("nam") int nam) {
        return thongKeService.getHieuSuatNVTheoNam(nam);
    }

    @GetMapping("/nhan-vien/khoang-ngay")
    public List<HieuSuatNVDto> getHieuSuatNVKhoangNgay(
            @RequestParam("tuNgay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tuNgay,
            @RequestParam("denNgay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate denNgay
    ) {
        return thongKeService.getHieuSuatNVKhoangNgay(tuNgay, denNgay);
    }

    // ==================== KHÁCH HÀNG CHI TIÊU ====================
    @GetMapping("/khach-hang/ngay")
    public List<KhachHangChiTieuDto> getKhachHangChiTieuTheoNgay(@RequestParam("ngay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay) {
        return thongKeService.getKhachHangChiTieuTheoNgay(ngay);
    }

    @GetMapping("/khach-hang/thang")
    public List<KhachHangChiTieuDto> getKhachHangChiTieuTheoThang(@RequestParam("thang") int thang, @RequestParam("nam") int nam) {
        return thongKeService.getKhachHangChiTieuTheoThang(thang, nam);
    }

    @GetMapping("/khach-hang/nam")
    public List<KhachHangChiTieuDto> getKhachHangChiTieuTheoNam(@RequestParam("nam") int nam) {
        return thongKeService.getKhachHangChiTieuTheoNam(nam);
    }

    @GetMapping("/khach-hang/khoang-ngay")
    public List<KhachHangChiTieuDto> getKhachHangChiTieuKhoangNgay(
            @RequestParam("tuNgay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate tuNgay,
            @RequestParam("denNgay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate denNgay
    ) {
        return thongKeService.getKhachHangChiTieuKhoangNgay(tuNgay, denNgay);
    }

    // ==================== DANH SÁCH ĐƠN HÀNG ====================
    @GetMapping("/don-hang/list")
    public List<Map<String, Object>> getDonHangList(
            @RequestParam("filterType") String filterType,
            @RequestParam(value = "selectedDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate selectedDate,
            @RequestParam(value = "selectedMonth", required = false) Integer selectedMonth,
            @RequestParam(value = "selectedYear", required = false) Integer selectedYear,
            @RequestParam(value = "dateFrom", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateFrom,
            @RequestParam(value = "dateTo", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate dateTo
    ) {
        return thongKeService.getDonHangList(filterType, selectedDate, selectedMonth, selectedYear, dateFrom, dateTo);
    }

    // ==================== TEST ENDPOINT ====================
    @GetMapping("/test")
    public String test() {
        return "Backend is running!";
    }

    // ==================== TEST ENDPOINT ĐƠN GIẢN ====================
    @GetMapping("/test-simple")
    public Map<String, Object> testSimple() {
        Map<String, Object> result = new HashMap<>();
        result.put("message", "Backend is working!");
        result.put("timestamp", new java.util.Date());
        result.put("status", "success");
        return result;
    }

    // ==================== THỐNG KÊ TỔNG QUAN ====================
    @GetMapping("/tong-quan")
    public Map<String, Object> getThongKeTongQuan() {
        try {
            Map<String, Object> result = new HashMap<>();
            
            // Thống kê tổng quan
            result.put("tongDonHang", thongKeService.getTongDonHang());
            result.put("tongKhachHang", thongKeService.getTongKhachHang());
            result.put("tongSanPham", thongKeService.getTongSanPham());
            result.put("doanhThuHomNay", thongKeService.getDoanhThuHomNay());
            result.put("doanhThuThangNay", thongKeService.getDoanhThuThangNay());
            result.put("doanhThuNamNay", thongKeService.getDoanhThuNamNay());
            result.put("khachHangMoi", thongKeService.getKhachHangMoi());
            result.put("tyLeHuy", thongKeService.getTyLeHuy());
            
            // Tỷ lệ tăng trưởng
            result.put("tangTruongThang", thongKeService.getTangTruongThang());
            result.put("tangTruongNam", thongKeService.getTangTruongNam());
            
            // Top sản phẩm bán chạy tháng
            result.put("topSanPhamThang", thongKeService.getTopSanPhamBanChayThang());
            
            // Top khách hàng tháng
            result.put("topKhachHangThang", thongKeService.getTopKhachHangThang());
            
            return result;
        } catch (Exception e) {
            Map<String, Object> errorResult = new HashMap<>();
            errorResult.put("error", "Database error: " + e.getMessage());
            errorResult.put("status", "error");
            return errorResult;
        }
    }

    // ==================== BIỂU ĐỒ DOANH THU THEO THỜI GIAN ====================
    @GetMapping("/bieu-do/doanh-thu")
    public List<Map<String, Object>> getBieuDoDoanhThu(
            @RequestParam("loai") String loai, // "ngay", "thang", "nam"
            @RequestParam(value = "nam", required = false) Integer nam,
            @RequestParam(value = "thang", required = false) Integer thang
    ) {
        return thongKeService.getBieuDoDoanhThu(loai, nam, thang);
    }

    // ==================== BIỂU ĐỒ DOANH THU (ALIAS) ====================
    @GetMapping("/doanh-thu/bieu-do")
    public List<Map<String, Object>> getBieuDoDoanhThuAlias(
            @RequestParam("filterType") String filterType,
            @RequestParam(value = "year", required = false) Integer year,
            @RequestParam(value = "month", required = false) Integer month
    ) {
        // Chuyển đổi filterType thành loai
        String loai = "thang"; // mặc định
        if (filterType.equals("hom-nay")) loai = "ngay";
        else if (filterType.equals("tuan-nay")) loai = "tuan";
        else if (filterType.equals("thang-nay")) loai = "thang";
        else if (filterType.equals("nam-nay")) loai = "nam";
        
        return thongKeService.getBieuDoDoanhThu(loai, year, month);
    }

    // ==================== THỐNG KÊ THEO DANH MỤC ====================
    @GetMapping("/danh-muc/doanh-thu")
    public List<Map<String, Object>> getDoanhThuTheoDanhMuc(
            @RequestParam(value = "nam", required = false) Integer nam,
            @RequestParam(value = "thang", required = false) Integer thang
    ) {
        return thongKeService.getDoanhThuTheoDanhMuc(nam, thang);
    }

    // ==================== THỐNG KÊ PHƯƠNG THỨC THANH TOÁN ====================
    @GetMapping("/thanh-toan/thong-ke")
    public List<Map<String, Object>> getThongKeThanhToan(
            @RequestParam(value = "nam", required = false) Integer nam,
            @RequestParam(value = "thang", required = false) Integer thang
    ) {
        return thongKeService.getThongKeThanhToan(nam, thang);
    }

    // ==================== EXPORT EXCEL ====================
    @GetMapping("/san-pham/ngay/export-excel")
    public ResponseEntity<byte[]> exportSanPhamBanChayExcel(
            @RequestParam("ngay") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay
    ) throws IOException {
        List<SanPhamBanChayDto> data = thongKeService.thongKeTheoNgay(ngay);

        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("SanPhamBanChay");

        // Header
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Tên sản phẩm");
        header.createCell(1).setCellValue("Số lượng bán");
        header.createCell(2).setCellValue("Doanh thu");
        header.createCell(3).setCellValue("Tỷ lệ %");

        // Dữ liệu
        int rowIdx = 1;
        double tongSoLuong = data.stream().mapToDouble(SanPhamBanChayDto::getSoLuongBan).sum();
        
        for (SanPhamBanChayDto dto : data) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(dto.getTenSanPham());
            row.createCell(1).setCellValue(dto.getSoLuongBan());
            row.createCell(2).setCellValue(dto.getDoanhThu());
            row.createCell(3).setCellValue(tongSoLuong > 0 ? (dto.getSoLuongBan() / tongSoLuong * 100) : 0);
        }

        // Xuất file
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=san-pham-ban-chay-" + ngay + ".xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(out.toByteArray());
    }

    @GetMapping("/san-pham/thang/export-excel")
    public ResponseEntity<byte[]> exportSanPhamBanChayTheoThangExcel(
            @RequestParam("thang") int thang,
            @RequestParam("nam") int nam
    ) throws IOException {
        List<SanPhamBanChayDto> data = thongKeService.thongKeTheoThang(thang, nam);
        return ExcelExportUtil.exportSanPhamBanChayToExcel(data, "san-pham-ban-chay-" + thang + "_" + nam + ".xlsx");
    }

    @GetMapping("/doanh-thu/export-excel")
    public ResponseEntity<byte[]> exportDoanhThuExcel(
            @RequestParam("loai") String loai,
            @RequestParam(value = "ngay", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate ngay,
            @RequestParam(value = "thang", required = false) Integer thang,
            @RequestParam(value = "nam", required = false) Integer nam
    ) throws IOException {
        DoanhThuDto data = null;
        String fileName = "";
        
        switch (loai) {
            case "ngay":
                data = thongKeService.getDoanhThuTheoNgay(ngay);
                fileName = "doanh-thu-ngay-" + ngay + ".xlsx";
                break;
            case "thang":
                data = thongKeService.getDoanhThuTheoThang(thang, nam);
                fileName = "doanh-thu-thang-" + thang + "_" + nam + ".xlsx";
                break;
            case "nam":
                data = thongKeService.getDoanhThuTheoNam(nam);
                fileName = "doanh-thu-nam-" + nam + ".xlsx";
                break;
        }
        
        return ExcelExportUtil.exportDoanhThuToExcel(data, fileName);
    }

    @GetMapping("/tong-quan/export-excel")
    public ResponseEntity<byte[]> exportTongQuanExcel() throws IOException {
        Map<String, Object> data = getThongKeTongQuan();
        return ExcelExportUtil.exportTongQuanToExcel(data, "thong-ke-tong-quan.xlsx");
    }

    // ==================== EXPORT THỐNG KÊ MỚI ====================
    @PostMapping("/export/thong-ke-excel")
    public ResponseEntity<byte[]> exportThongKeExcel(@RequestBody Map<String, Object> data) throws IOException {
        return ExcelExportUtil.exportThongKeToExcel(data, "thong-ke-" + System.currentTimeMillis() + ".xlsx");
    }

    @PostMapping("/export/thong-ke-pdf")
    public ResponseEntity<byte[]> exportThongKePDF(@RequestBody Map<String, Object> data) throws IOException {
        return ExcelExportUtil.exportThongKeToPDF(data, "bao-cao-thong-ke-" + System.currentTimeMillis() + ".pdf");
    }
}
