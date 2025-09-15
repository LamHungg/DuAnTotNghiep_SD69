package com.example.ZMEN.service.Impl;

import com.openhtmltopdf.extend.FSSupplier; // Đảm bảo import này đúng
import com.openhtmltopdf.pdfboxout.PdfRendererBuilder;
import org.springframework.stereotype.Service;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Objects;

@Service
public class HtmlInvoicePdfService {

    public byte[] generatePdfFromHtml(String htmlContent) throws IOException {
        ByteArrayOutputStream os = new ByteArrayOutputStream();
        PdfRendererBuilder builder = new PdfRendererBuilder();

        // **QUAN TRỌNG: Đăng ký Font cho tiếng Việt**
        // Đảm bảo bạn đã tải file DejaVuSans.ttf và đặt đúng vị trí src/main/resources/fonts/
        try {
            InputStream fontStream = getClass().getClassLoader().getResourceAsStream("fonts/DejaVuSans.ttf");
            if (fontStream == null) {
                System.err.println("Font 'DejaVu Sans' not found. Ensure DejaVuSans.ttf is in src/main/resources/fonts/.");
                // Ném exception để dừng xử lý nếu font là bắt buộc
                throw new RuntimeException("Failed to load font for PDF generation: Font not found."); // <-- Thêm dòng này để lỗi dừng lại rõ ràng hơn
            } else {
                builder.useFont(new FSSupplier<InputStream>() {
                    @Override
                    public InputStream supply() {
                        return fontStream;
                    }
                }, "DejaVu Sans");
            }
        } catch (Exception e) {
            System.err.println("Could not load font 'DejaVu Sans' for PDF. Error: " + e.getMessage());
            throw new RuntimeException("Failed to load font for PDF generation", e); // <-- Đảm bảo re-throw exception
        }

        builder.withHtmlContent(htmlContent, "");
        builder.toStream(os);
        builder.run();

        return os.toByteArray();
    }
}