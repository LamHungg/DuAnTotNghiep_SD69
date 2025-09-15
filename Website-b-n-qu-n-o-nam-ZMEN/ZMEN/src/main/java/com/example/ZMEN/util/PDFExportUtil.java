package com.example.ZMEN.util;

import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;

// Import cho font Unicode
import com.itextpdf.text.pdf.BaseFont;

public class PDFExportUtil {
    
    // Font Unicode cho tiếng Việt
    private static BaseFont unicodeFont;
    
    static {
        try {
            // Sử dụng font có hỗ trợ Unicode tốt hơn cho tiếng Việt
            unicodeFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        } catch (Exception e) {
            try {
                // Fallback to Times font với Unicode
                unicodeFont = BaseFont.createFont(BaseFont.TIMES_ROMAN, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            } catch (Exception ex) {
                try {
                    // Fallback cuối cùng
                    unicodeFont = BaseFont.createFont();
                } catch (Exception ex2) {
                    // Use default
                }
            }
        }
    }
    
    public static ResponseEntity<byte[]> exportThongKeToPDF(Map<String, Object> data, String fileName) throws IOException {
        try {
            Document document = new Document(PageSize.A4, 50, 50, 50, 50);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);
            
            document.open();
            
            // ==================== HEADER ====================
            addHeader(document);
            
            // ==================== TITLE ====================
            addTitle(document, "BÁO CÁO THỐNG KÊ TỔNG QUAN");
            
            // ==================== THÔNG TIN THỜI GIAN ====================
            addTimeInfo(document, data);
            
            // ==================== KPI SECTION ====================
            addKPISection(document, data);
            
            // ==================== DOANH THU SECTION ====================
            if (data.get("doanhThuChart") != null) {
                addRevenueSection(document, (List<?>) data.get("doanhThuChart"));
            }
            
            // ==================== TOP SẢN PHẨM SECTION ====================
            if (data.get("topSanPham") != null) {
                addTopProductSection(document, (List<?>) data.get("topSanPham"));
            }
            
            // ==================== TOP KHÁCH HÀNG SECTION ====================
            if (data.get("topKhachHang") != null) {
                addTopCustomerSection(document, (List<?>) data.get("topKhachHang"));
            }
            
            // ==================== FOOTER ====================
            addFooter(document);
            
            document.close();
            
            HttpHeaders headers = new HttpHeaders();
            headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName);
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(baos.toByteArray());
                    
        } catch (Exception e) {
            throw new IOException("Lỗi tạo PDF: " + e.getMessage(), e);
        }
    }
    
    private static void addHeader(Document document) throws DocumentException {
        // Logo và thông tin công ty
        Font companyFont = createUnicodeFont(14, Font.BOLD, BaseColor.BLUE);
        Font headerFont = createUnicodeFont(12, Font.BOLD);
        
        Paragraph companyInfo = new Paragraph("ZMEN - CỬA HÀNG THỜI TRANG NAM", companyFont);
        companyInfo.setAlignment(Element.ALIGN_CENTER);
        document.add(companyInfo);
        
        Paragraph address = new Paragraph("Địa chỉ: 123 Đường ABC, Quận XYZ, Thành phố Hồ Chí Minh", headerFont);
        address.setAlignment(Element.ALIGN_CENTER);
        document.add(address);
        
        Paragraph phone = new Paragraph("Điện thoại: 0123-456-789 | Email: info@zmen.com | Website: www.zmen.com", headerFont);
        phone.setAlignment(Element.ALIGN_CENTER);
        document.add(phone);
        
        document.add(new Paragraph(" ")); // Spacing
    }
    
    private static void addTitle(Document document, String title) throws DocumentException {
        Font titleFont = createUnicodeFont(18, Font.BOLD, BaseColor.DARK_GRAY);
        Paragraph titleParagraph = new Paragraph(title, titleFont);
        titleParagraph.setAlignment(Element.ALIGN_CENTER);
        titleParagraph.setSpacingAfter(20);
        document.add(titleParagraph);
    }
    
    private static void addTimeInfo(Document document, Map<String, Object> data) throws DocumentException {
        Font infoFont = createUnicodeFont(10, Font.NORMAL);
        
        Paragraph timeInfo = new Paragraph();
        timeInfo.add(new Chunk("Thời gian báo cáo: ", infoFont));
        timeInfo.add(new Chunk(getCurrentDate(), infoFont));
        timeInfo.setSpacingAfter(15);
        document.add(timeInfo);
    }
    
    private static void addKPISection(Document document, Map<String, Object> data) throws DocumentException {
        Font sectionFont = createUnicodeFont(14, Font.BOLD, BaseColor.BLUE);
        Font labelFont = createUnicodeFont(11, Font.BOLD);
        Font valueFont = createUnicodeFont(11, Font.NORMAL);
        
        // Section title
        Paragraph sectionTitle = new Paragraph("CHỈ SỐ KPI", sectionFont);
        sectionTitle.setSpacingAfter(10);
        document.add(sectionTitle);
        
        // KPI Table
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(20);
        
        // Header
        PdfPCell headerCell1 = new PdfPCell(new Phrase("Chỉ số", labelFont));
        PdfPCell headerCell2 = new PdfPCell(new Phrase("Giá trị", labelFont));
        headerCell1.setBackgroundColor(BaseColor.LIGHT_GRAY);
        headerCell2.setBackgroundColor(BaseColor.LIGHT_GRAY);
        headerCell1.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell2.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(headerCell1);
        table.addCell(headerCell2);
        
        // KPI Data
        Map<String, Object> kpiData = (Map<String, Object>) data.get("kpiData");
        if (kpiData != null) {
            addKPIRow(table, "Doanh thu hôm nay", formatCurrency(kpiData.get("doanhThuHomNay")), labelFont, valueFont);
            addKPIRow(table, "Doanh thu tháng này", formatCurrency(kpiData.get("doanhThuThangNay")), labelFont, valueFont);
            addKPIRow(table, "Doanh thu năm nay", formatCurrency(kpiData.get("doanhThuNamNay")), labelFont, valueFont);
            addKPIRow(table, "Tổng số đơn hàng", formatNumber(kpiData.get("tongDonHang")), labelFont, valueFont);
            addKPIRow(table, "Tổng số khách hàng", formatNumber(kpiData.get("tongKhachHang")), labelFont, valueFont);
            addKPIRow(table, "Tổng số sản phẩm", formatNumber(kpiData.get("tongSanPham")), labelFont, valueFont);
            addKPIRow(table, "Khách hàng mới", formatNumber(kpiData.get("khachHangMoi")), labelFont, valueFont);
            addKPIRow(table, "Tỷ lệ hủy đơn hàng (%)", formatNumber(kpiData.get("tyLeHuy")) + "%", labelFont, valueFont);
            addKPIRow(table, "Tăng trưởng tháng (%)", formatNumber(kpiData.get("tangTruongThang")) + "%", labelFont, valueFont);
            addKPIRow(table, "Tăng trưởng năm (%)", formatNumber(kpiData.get("tangTruongNam")) + "%", labelFont, valueFont);
        } else {
            // Fallback: try direct access
            addKPIRow(table, "Doanh thu hôm nay", formatCurrency(data.get("doanhThuHomNay")), labelFont, valueFont);
            addKPIRow(table, "Doanh thu tháng này", formatCurrency(data.get("doanhThuThangNay")), labelFont, valueFont);
            addKPIRow(table, "Doanh thu năm nay", formatCurrency(data.get("doanhThuNamNay")), labelFont, valueFont);
            addKPIRow(table, "Tổng số đơn hàng", formatNumber(data.get("tongDonHang")), labelFont, valueFont);
            addKPIRow(table, "Tổng số khách hàng", formatNumber(data.get("tongKhachHang")), labelFont, valueFont);
            addKPIRow(table, "Tổng số sản phẩm", formatNumber(data.get("tongSanPham")), labelFont, valueFont);
            addKPIRow(table, "Khách hàng mới", formatNumber(data.get("khachHangMoi")), labelFont, valueFont);
            addKPIRow(table, "Tỷ lệ hủy đơn hàng (%)", formatNumber(data.get("tyLeHuy")) + "%", labelFont, valueFont);
            addKPIRow(table, "Tăng trưởng tháng (%)", formatNumber(data.get("tangTruongThang")) + "%", labelFont, valueFont);
            addKPIRow(table, "Tăng trưởng năm (%)", formatNumber(data.get("tangTruongNam")) + "%", labelFont, valueFont);
        }
        
        document.add(table);
    }
    
    private static void addRevenueSection(Document document, List<?> data) throws DocumentException {
        Font sectionFont = createUnicodeFont(14, Font.BOLD, BaseColor.BLUE);
        Font headerFont = createUnicodeFont(11, Font.BOLD);
        Font dataFont = createUnicodeFont(10, Font.NORMAL);
        
        // Section title
        Paragraph sectionTitle = new Paragraph("BIỂU ĐỒ DOANH THU THEO NGÀY", sectionFont);
        sectionTitle.setSpacingAfter(10);
        document.add(sectionTitle);
        
        // Revenue Table
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(20);
        
        // Header
        PdfPCell headerCell1 = new PdfPCell(new Phrase("Ngày", headerFont));
        PdfPCell headerCell2 = new PdfPCell(new Phrase("Doanh thu (VND)", headerFont));
        headerCell1.setBackgroundColor(BaseColor.LIGHT_GRAY);
        headerCell2.setBackgroundColor(BaseColor.LIGHT_GRAY);
        headerCell1.setHorizontalAlignment(Element.ALIGN_CENTER);
        headerCell2.setHorizontalAlignment(Element.ALIGN_CENTER);
        table.addCell(headerCell1);
        table.addCell(headerCell2);
        
        // Data
        for (Object item : data) {
            if (item instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) item;
                table.addCell(new Phrase(String.valueOf(map.get("thoiGian")), dataFont));
                table.addCell(new Phrase(formatCurrency(map.get("doanhThu")), dataFont));
            }
        }
        
        document.add(table);
    }
    
    private static void addTopProductSection(Document document, List<?> data) throws DocumentException {
        Font sectionFont = createUnicodeFont(14, Font.BOLD, BaseColor.BLUE);
        Font headerFont = createUnicodeFont(10, Font.BOLD);
        Font dataFont = createUnicodeFont(9, Font.NORMAL);
        
        // Section title
        Paragraph sectionTitle = new Paragraph("TOP 10 SẢN PHẨM BÁN CHẠY NHẤT", sectionFont);
        sectionTitle.setSpacingAfter(10);
        document.add(sectionTitle);
        
        // Product Table
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(20);
        
        // Header
        String[] headers = {"STT", "Tên sản phẩm", "Số lượng đã bán", "Doanh thu (VND)"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
        
        // Data
        for (int i = 0; i < data.size(); i++) {
            Object item = data.get(i);
            if (item instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) item;
                table.addCell(new Phrase(String.valueOf(i + 1), dataFont));
                table.addCell(new Phrase(String.valueOf(map.get("tenSanPham")), dataFont));
                table.addCell(new Phrase(formatNumber(map.get("soLuongBan")), dataFont));
                table.addCell(new Phrase(formatCurrency(map.get("doanhThu")), dataFont));
            }
        }
        
        document.add(table);
    }
    
    private static void addTopCustomerSection(Document document, List<?> data) throws DocumentException {
        Font sectionFont = createUnicodeFont(14, Font.BOLD, BaseColor.BLUE);
        Font headerFont = createUnicodeFont(10, Font.BOLD);
        Font dataFont = createUnicodeFont(9, Font.NORMAL);
        
        // Section title
        Paragraph sectionTitle = new Paragraph("TOP 10 KHÁCH HÀNG CHI TIÊU CAO NHẤT", sectionFont);
        sectionTitle.setSpacingAfter(10);
        document.add(sectionTitle);
        
        // Customer Table
        PdfPTable table = new PdfPTable(4);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);
        table.setSpacingAfter(20);
        
        // Header
        String[] headers = {"STT", "Họ và tên", "Số đơn hàng", "Tổng chi tiêu (VND)"};
        for (String header : headers) {
            PdfPCell cell = new PdfPCell(new Phrase(header, headerFont));
            cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }
        
        // Data
        for (int i = 0; i < data.size(); i++) {
            Object item = data.get(i);
            if (item instanceof Map) {
                Map<?, ?> map = (Map<?, ?>) item;
                table.addCell(new Phrase(String.valueOf(i + 1), dataFont));
                table.addCell(new Phrase(String.valueOf(map.get("hoTen")), dataFont));
                table.addCell(new Phrase(formatNumber(map.get("soLuongDon")), dataFont));
                table.addCell(new Phrase(formatCurrency(map.get("tongChiTieu")), dataFont));
            }
        }
        
        document.add(table);
    }
    
    private static void addFooter(Document document) throws DocumentException {
        Font footerFont = createUnicodeFont(10, Font.ITALIC, BaseColor.GRAY);
        
        Paragraph footer = new Paragraph();
        footer.add(new Chunk("Báo cáo được tạo tự động bởi hệ thống quản lý ZMEN", footerFont));
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(30);
        document.add(footer);
    }
    
    private static void addKPIRow(PdfPTable table, String label, String value, Font labelFont, Font valueFont) {
        PdfPCell labelCell = new PdfPCell(new Phrase(label, labelFont));
        PdfPCell valueCell = new PdfPCell(new Phrase(value, valueFont));
        labelCell.setBorderWidth(0.5f);
        valueCell.setBorderWidth(0.5f);
        valueCell.setHorizontalAlignment(Element.ALIGN_RIGHT);
        table.addCell(labelCell);
        table.addCell(valueCell);
    }
    
    private static String formatCurrency(Object value) {
        if (value == null) return "0 VND";
        if (value instanceof Number) {
            double num = ((Number) value).doubleValue();
            return String.format("%,.0f VND", num);
        }
        return value.toString() + " VND";
    }
    
    private static String formatNumber(Object value) {
        if (value == null) return "0";
        if (value instanceof Number) {
            double num = ((Number) value).doubleValue();
            return String.format("%,.0f", num);
        }
        return value.toString();
    }
    
    private static String getCurrentDate() {
        return LocalDate.now().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
    }
    
    // Helper method để tạo font Unicode
    private static Font createUnicodeFont(int size, int style) {
        try {
            // Sử dụng Times font với encoding Unicode
            BaseFont baseFont = BaseFont.createFont(BaseFont.TIMES_ROMAN, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            return new Font(baseFont, size, style);
        } catch (Exception e) {
            try {
                // Fallback to Helvetica với Unicode
                BaseFont baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                return new Font(baseFont, size, style);
            } catch (Exception ex) {
                // Fallback cuối cùng
                return new Font(Font.FontFamily.HELVETICA, size, style);
            }
        }
    }
    
    private static Font createUnicodeFont(int size, int style, BaseColor color) {
        try {
            // Sử dụng Times font với encoding Unicode
            BaseFont baseFont = BaseFont.createFont(BaseFont.TIMES_ROMAN, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
            return new Font(baseFont, size, style, color);
        } catch (Exception e) {
            try {
                // Fallback to Helvetica với Unicode
                BaseFont baseFont = BaseFont.createFont(BaseFont.HELVETICA, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
                return new Font(baseFont, size, style, color);
            } catch (Exception ex) {
                // Fallback cuối cùng
                return new Font(Font.FontFamily.HELVETICA, size, style, color);
            }
        }
    }
}
