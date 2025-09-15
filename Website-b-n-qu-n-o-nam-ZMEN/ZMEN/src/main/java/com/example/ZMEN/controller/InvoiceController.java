package com.example.ZMEN.controller;

import com.example.ZMEN.service.Impl.HtmlInvoicePdfService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/invoices")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class InvoiceController {

    private final HtmlInvoicePdfService invoicePdfService;
    // Không còn cần OrderService ở đây nữa nếu HTML được gửi trực tiếp từ frontend
    // private final OrderService orderService;

    // Constructor đã được cập nhật
    public InvoiceController(HtmlInvoicePdfService invoicePdfService) {
        this.invoicePdfService = invoicePdfService;
        // this.orderService = orderService; // Bỏ dòng này
    }

    /**
     * Endpoint nhận chuỗi HTML từ frontend và chuyển đổi thành file PDF.
     * Frontend (React) sẽ gửi dữ liệu hóa đơn đã được render thành HTML lên đây.
     *
     * @param htmlContent Chuỗi HTML đại diện cho hóa đơn.
     * @return ResponseEntity chứa mảng byte của file PDF.
     * @throws IOException Nếu có lỗi trong quá trình tạo PDF.
     */
    @PostMapping(value = "/generate-from-html",
                 consumes = MediaType.TEXT_HTML_VALUE, // Chỉ rõ rằng endpoint này nhận Content-Type là text/html
                 produces = MediaType.APPLICATION_PDF_VALUE) // Chỉ rõ rằng endpoint này trả về Content-Type là application/pdf
    public ResponseEntity<byte[]> generatePdfFromHtml(@RequestBody String htmlContent) throws IOException {
        // Gọi service để tạo PDF từ chuỗi HTML
        byte[] pdfBytes = invoicePdfService.generatePdfFromHtml(htmlContent);

        // Thiết lập các header cho response
        HttpHeaders headers = new HttpHeaders();
        // Dùng "inline" để trình duyệt cố gắng hiển thị PDF trực tiếp
        // Dùng "attachment" để trình duyệt tự động tải về file
        headers.setContentDispositionFormData("inline", "invoice.pdf");
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentLength(pdfBytes.length);

        // Trả về file PDF
        return ResponseEntity.ok().headers(headers).body(pdfBytes);
    }
}