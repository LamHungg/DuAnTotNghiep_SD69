package com.example.ZMEN.util;

import com.example.ZMEN.dto.ThongKeDto.DoanhThuDto;
import com.example.ZMEN.dto.ThongKeDto.HieuSuatNVDto;
import com.example.ZMEN.dto.ThongKeDto.KhachHangChiTieuDto;
import com.example.ZMEN.dto.ThongKeDto.SanPhamBanChayDto;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;
import java.util.Map;

public class ExcelExportUtil {
    public static ResponseEntity<byte[]> exportSanPhamBanChayToExcel(List<SanPhamBanChayDto> data, String fileName) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("SanPhamBanChay");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Tên sản phẩm");
        header.createCell(1).setCellValue("Số lượng bán");
        header.createCell(2).setCellValue("Doanh thu");

        int rowIdx = 1;
        double tongSoLuong = data.stream().mapToDouble(SanPhamBanChayDto::getSoLuongBan).sum();
        
        for (SanPhamBanChayDto dto : data) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(dto.getTenSanPham());
            row.createCell(1).setCellValue(dto.getSoLuongBan());
            row.createCell(2).setCellValue(dto.getDoanhThu() != null ? dto.getDoanhThu() : 0.0);
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(out.toByteArray());
    }


    public static ResponseEntity<byte[]> exportDoanhThuToExcel(DoanhThuDto dto, String fileName) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("DoanhThu");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Tổng doanh thu");

        Row row = sheet.createRow(1);
        row.createCell(0).setCellValue(dto.getTongDoanhThu().doubleValue());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(out.toByteArray());
    }


    public static ResponseEntity<byte[]> exportHieuSuatNhanVienToExcel(List<HieuSuatNVDto> data, String fileName) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("HieuSuatNhanVien");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("ID Nhân Viên");
        header.createCell(1).setCellValue("Họ Tên");
        header.createCell(2).setCellValue("Số Đơn");
        header.createCell(3).setCellValue("Tổng Doanh Thu");

        int rowIdx = 1;
        for (HieuSuatNVDto dto : data) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(dto.getIdNhanVien());
            row.createCell(1).setCellValue(dto.getHoTen());
            row.createCell(2).setCellValue(dto.getSoLuongDon());
            row.createCell(3).setCellValue(dto.getTongDoanhThu().doubleValue());
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(out.toByteArray());
    }


    public static ResponseEntity<byte[]> exportKhachHangChiTieuToExcel(List<KhachHangChiTieuDto> data, String fileName) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("KhachHangChiTieu");

        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("ID Khách Hàng");
        header.createCell(1).setCellValue("Họ Tên");
        header.createCell(2).setCellValue("Email");
        header.createCell(3).setCellValue("Số Điện Thoại");
        header.createCell(4).setCellValue("Số Đơn");
        header.createCell(5).setCellValue("Tổng Chi Tiêu");

        int rowIdx = 1;
        for (KhachHangChiTieuDto dto : data) {
            Row row = sheet.createRow(rowIdx++);
            row.createCell(0).setCellValue(dto.getIdKhachHang());
            row.createCell(1).setCellValue(dto.getHoTen());
            row.createCell(2).setCellValue(dto.getEmail());
            row.createCell(3).setCellValue(dto.getSoDienThoai());
            row.createCell(4).setCellValue(dto.getSoLuongDon());
            row.createCell(5).setCellValue(dto.getTongChiTieu().doubleValue());
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(out.toByteArray());
    }

    public static ResponseEntity<byte[]> exportTongQuanToExcel(java.util.Map<String, Object> data, String fileName) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("ThongKeTongQuan");

        // Header
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Chỉ số");
        header.createCell(1).setCellValue("Giá trị");

        // Dữ liệu
        int rowIdx = 1;
        
        // Thống kê tổng quan
        addRow(sheet, rowIdx++, "Tổng đơn hàng", data.get("tongDonHang"));
        addRow(sheet, rowIdx++, "Tổng khách hàng", data.get("tongKhachHang"));
        addRow(sheet, rowIdx++, "Tổng sản phẩm", data.get("tongSanPham"));
        addRow(sheet, rowIdx++, "Doanh thu hôm nay", data.get("doanhThuHomNay"));
        addRow(sheet, rowIdx++, "Doanh thu tháng này", data.get("doanhThuThangNay"));
        addRow(sheet, rowIdx++, "Doanh thu năm này", data.get("doanhThuNamNay"));
        addRow(sheet, rowIdx++, "Tăng trưởng tháng (%)", data.get("tangTruongThang"));
        addRow(sheet, rowIdx++, "Tăng trưởng năm (%)", data.get("tangTruongNam"));

        // Top sản phẩm bán chạy
        if (data.get("topSanPhamThang") instanceof List) {
            List<?> topSanPham = (List<?>) data.get("topSanPhamThang");
            if (!topSanPham.isEmpty()) {
                addRow(sheet, rowIdx++, "", "");
                addRow(sheet, rowIdx++, "TOP SẢN PHẨM BÁN CHẠY THÁNG", "");
                
                for (int i = 0; i < Math.min(topSanPham.size(), 5); i++) {
                    Object item = topSanPham.get(i);
                    if (item instanceof java.util.Map) {
                        java.util.Map<?, ?> map = (java.util.Map<?, ?>) item;
                        String tenSanPham = String.valueOf(map.get("tenSanPham"));
                        Object soLuongBan = map.get("soLuongBan");
                        Object doanhThu = map.get("doanhThu");
                        addRow(sheet, rowIdx++, (i + 1) + ". " + tenSanPham, 
                               "SL: " + soLuongBan + " | DT: " + formatCurrency(doanhThu));
                    }
                }
            }
        }

        // Top khách hàng
        if (data.get("topKhachHangThang") instanceof List) {
            List<?> topKhachHang = (List<?>) data.get("topKhachHangThang");
            if (!topKhachHang.isEmpty()) {
                addRow(sheet, rowIdx++, "", "");
                addRow(sheet, rowIdx++, "TOP KHÁCH HÀNG THÁNG", "");
                
                for (int i = 0; i < Math.min(topKhachHang.size(), 5); i++) {
                    Object item = topKhachHang.get(i);
                    if (item instanceof java.util.Map) {
                        java.util.Map<?, ?> map = (java.util.Map<?, ?>) item;
                        String hoTen = String.valueOf(map.get("hoTen"));
                        Object soLuongDon = map.get("soLuongDon");
                        Object tongChiTieu = map.get("tongChiTieu");
                        addRow(sheet, rowIdx++, (i + 1) + ". " + hoTen, 
                               "Đơn: " + soLuongDon + " | Chi: " + formatCurrency(tongChiTieu));
                    }
                }
            }
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(out.toByteArray());
    }

    // ==================== EXPORT THỐNG KÊ MỚI ====================
    public static ResponseEntity<byte[]> exportThongKeToExcel(java.util.Map<String, Object> data, String fileName) throws IOException {
        Workbook workbook = new XSSFWorkbook();
        
        // Sheet 1: Tổng quan
        Sheet sheet1 = workbook.createSheet("Tổng Quan");
        createTongQuanSheet(sheet1, data);
        
        // Sheet 2: Doanh thu theo ngày
        if (data.get("doanhThuChart") instanceof List) {
            Sheet sheet2 = workbook.createSheet("Doanh Thu Theo Ngày");
            createDoanhThuSheet(sheet2, (List<?>) data.get("doanhThuChart"));
        }
        
        // Sheet 3: Top sản phẩm
        if (data.get("topSanPham") instanceof List) {
            Sheet sheet3 = workbook.createSheet("Top Sản Phẩm");
            createTopSanPhamSheet(sheet3, (List<?>) data.get("topSanPham"));
        }
        
        // Sheet 4: Top khách hàng
        if (data.get("topKhachHang") instanceof List) {
            Sheet sheet4 = workbook.createSheet("Top Khách Hàng");
            createTopKhachHangSheet(sheet4, (List<?>) data.get("topKhachHang"));
        }
        
        // Sheet 5: Danh sách đơn hàng
        if (data.get("donHangList") instanceof List) {
            Sheet sheet5 = workbook.createSheet("Danh Sách Đơn Hàng");
            createDonHangSheet(sheet5, (List<?>) data.get("donHangList"));
        }

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(out.toByteArray());
    }

    public static ResponseEntity<byte[]> exportThongKeToPDF(Map<String, Object> data, String fileName) throws IOException {
        // Sử dụng PDFExportUtil để tạo PDF chỉnh chu
        try {
            return PDFExportUtil.exportThongKeToPDF(data, fileName);
        } catch (Exception e) {
            // Fallback: tạo Excel nếu không có iText PDF
            System.out.println("Không thể tạo PDF, tạo Excel thay thế: " + e.getMessage());
            return exportThongKeToExcel(data, fileName.replace(".pdf", ".xlsx"));
        }
    }

    private static void createTongQuanSheet(Sheet sheet, java.util.Map<String, Object> data) {
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("BÁO CÁO THỐNG KÊ TỔNG QUAN");
        header.createCell(1).setCellValue("");

        int rowIdx = 2;
        addRow(sheet, rowIdx++, "KPI Metrics", "");
        addRow(sheet, rowIdx++, "Doanh thu hôm nay", formatCurrency(data.get("doanhThuHomNay")));
        addRow(sheet, rowIdx++, "Doanh thu tháng", formatCurrency(data.get("doanhThuThangNay")));
        addRow(sheet, rowIdx++, "Tổng đơn hàng", data.get("tongDonHang"));
        addRow(sheet, rowIdx++, "Khách hàng mới", data.get("khachHangMoi"));
        addRow(sheet, rowIdx++, "Tỷ lệ hủy (%)", data.get("tyLeHuy"));
    }

    private static void createDoanhThuSheet(Sheet sheet, List<?> data) {
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Ngày");
        header.createCell(1).setCellValue("Doanh thu");

        int rowIdx = 1;
        for (Object item : data) {
            if (item instanceof java.util.Map) {
                java.util.Map<?, ?> map = (java.util.Map<?, ?>) item;
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(String.valueOf(map.get("ngay")));
                row.createCell(1).setCellValue(formatCurrency(map.get("doanhThu")));
            }
        }
    }

    private static void createTopSanPhamSheet(Sheet sheet, List<?> data) {
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Tên sản phẩm");
        header.createCell(1).setCellValue("Số lượng bán");
        header.createCell(2).setCellValue("Doanh thu");

        int rowIdx = 1;
        for (Object item : data) {
            if (item instanceof java.util.Map) {
                java.util.Map<?, ?> map = (java.util.Map<?, ?>) item;
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(String.valueOf(map.get("tenSanPham")));
                row.createCell(1).setCellValue(String.valueOf(map.get("soLuongBan")));
                row.createCell(2).setCellValue(formatCurrency(map.get("doanhThu")));
            }
        }
    }

    private static void createTopKhachHangSheet(Sheet sheet, List<?> data) {
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Khách hàng");
        header.createCell(1).setCellValue("Số đơn hàng");
        header.createCell(2).setCellValue("Tổng chi tiêu");

        int rowIdx = 1;
        for (Object item : data) {
            if (item instanceof java.util.Map) {
                java.util.Map<?, ?> map = (java.util.Map<?, ?>) item;
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(String.valueOf(map.get("khachHang")));
                row.createCell(1).setCellValue(String.valueOf(map.get("soDonHang")));
                row.createCell(2).setCellValue(formatCurrency(map.get("tongChiTieu")));
            }
        }
    }

    private static void createDonHangSheet(Sheet sheet, List<?> data) {
        Row header = sheet.createRow(0);
        header.createCell(0).setCellValue("Mã đơn hàng");
        header.createCell(1).setCellValue("Khách hàng");
        header.createCell(2).setCellValue("Ngày đặt");
        header.createCell(3).setCellValue("Tổng tiền");
        header.createCell(4).setCellValue("Trạng thái");

        int rowIdx = 1;
        for (Object item : data) {
            if (item instanceof java.util.Map) {
                java.util.Map<?, ?> map = (java.util.Map<?, ?>) item;
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(String.valueOf(map.get("maDonHang")));
                row.createCell(1).setCellValue(String.valueOf(map.get("khachHang")));
                row.createCell(2).setCellValue(String.valueOf(map.get("ngayDat")));
                row.createCell(3).setCellValue(formatCurrency(map.get("tongTien")));
                row.createCell(4).setCellValue(String.valueOf(map.get("trangThai")));
            }
        }
    }

    private static void addRow(Sheet sheet, int rowIdx, String label, Object value) {
        Row row = sheet.createRow(rowIdx);
        row.createCell(0).setCellValue(label);
        if (value != null) {
            if (value instanceof Number) {
                row.createCell(1).setCellValue(((Number) value).doubleValue());
            } else {
                row.createCell(1).setCellValue(value.toString());
            }
        }
    }

    private static String formatCurrency(Object value) {
        if (value == null) return "0";
        if (value instanceof Number) {
            double num = ((Number) value).doubleValue();
            return String.format("%,.0f VNĐ", num);
        }
        return value.toString();
    }
}
