package com.example.ZMEN.controller;

import com.example.ZMEN.entity.PhuongThucThanhToan;
import com.example.ZMEN.service.PhuongThucThanhToanService;
import com.example.ZMEN.service.Impl.VietQRService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowCredentials = "true")
public class PaymentController {

    @Autowired
    private PhuongThucThanhToanService phuongThucThanhToanService;

    @Autowired
    private VietQRService vietQRService;

    @GetMapping("/methods")
    public ResponseEntity<List<PhuongThucThanhToan>> getPaymentMethods() {
        System.out.println("Debug - PaymentController.getPaymentMethods() called");
        try {
            List<PhuongThucThanhToan> allMethods = phuongThucThanhToanService.getAllPhuongThucThanhToan();
            System.out.println("Found " + allMethods.size() + " total payment methods");

            List<PhuongThucThanhToan> mainMethods = allMethods.stream()
                    .filter(method -> method.getId() == 1 || method.getId() == 2)
                    .toList();

            System.out.println("Returning " + mainMethods.size() + " main payment methods");
            return ResponseEntity.ok(mainMethods);
        } catch (Exception e) {
            System.err.println("Error getting payment methods: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/test")
    public ResponseEntity<String> testPaymentEndpoint() {
        return ResponseEntity.ok("Payment endpoint is working");
    }

    @PostMapping("/create-vietqr-payment")
    public ResponseEntity<Map<String, String>> createVietQRPayment(@RequestBody VietQRRequest request) {
        System.out.println("Creating VietQR payment:");
        System.out.println("Amount: " + request.getAmount());
        System.out.println("Order Code: " + request.getOrderCode());
        System.out.println("Description: " + request.getDescription());

        try {
            String qrDataURL = vietQRService.generateVietQR(
                    request.getAmount(),
                    request.getOrderCode(),
                    request.getDescription()
            ).block();
            return ResponseEntity.ok(Map.of("qrDataURL", qrDataURL));
        } catch (Exception e) {
            System.err.println("Error generating QR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500).body(Map.of("error", "Error generating QR: " + e.getMessage()));
        }
    }

    public static class VietQRRequest {
        private double amount;
        private String orderCode;
        private String description;

        public double getAmount() { return amount; }
        public void setAmount(double amount) { this.amount = amount; }
        public String getOrderCode() { return orderCode; }
        public void setOrderCode(String orderCode) { this.orderCode = orderCode; }
        public String getDescription() { return description; }
        public void setDescription(String description) { this.description = description; }
    }
}