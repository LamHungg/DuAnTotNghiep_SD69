package com.example.ZMEN.service.Impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import jakarta.annotation.PostConstruct;
import java.util.HashMap;
import java.util.Map;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class VietQRService {

    @Value("${vietqr.api.url}")
    private String vietqrApiUrl;

    @Value("${vietqr.client.id}")
    private String clientId;

    @Value("${vietqr.api.key}")
    private String apiKey;

    @Value("${vietqr.bank.id}")
    private String bankId;

    @Value("${vietqr.account.number}")
    private String accountNumber;

    @Value("${vietqr.account.name}")
    private String accountName;

    private WebClient webClient;
    private final ObjectMapper objectMapper;

    public VietQRService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @PostConstruct
    public void initWebClient() {
        // Đảm bảo baseUrl không kết thúc bằng dấu /
        String baseUrl = vietqrApiUrl.endsWith("/") ? vietqrApiUrl.substring(0, vietqrApiUrl.length() - 1) : vietqrApiUrl;
        this.webClient = WebClient.builder().baseUrl(baseUrl).build();
        System.out.println("VietQR WebClient initialized with baseUrl: " + baseUrl);
    }

    /**
     * Tạo mã QR thanh toán động.
     * @param amount Số tiền thanh toán.
     * @param orderCode Mã đơn hàng.
     * @param description Nội dung thanh toán.
     * @return Mono chứa URL của hình ảnh QR.
     */
    public Mono<String> generateVietQR(double amount, String orderCode, String description) {
        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("acqId", bankId);
        requestBody.put("accountNo", accountNumber);
        requestBody.put("accountName", accountName);
        requestBody.put("amount", (int) amount); // VietQR yêu cầu integer
        requestBody.put("addInfo", description);
        requestBody.put("format", "text"); // Để lấy qrDataURL (URL image)
        requestBody.put("template", "print");

        System.out.println("Requesting VietQR API with data: " + requestBody);
        System.out.println("Full URL will be: " + vietqrApiUrl + "generate");

        return webClient.post()
                .uri("/generate")
                .header("x-client-id", clientId)
                .header("x-api-key", apiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(JsonNode.class)
                .map(jsonNode -> {
                    if (jsonNode != null && jsonNode.has("data") && jsonNode.get("data").has("qrDataURL")) {
                        return jsonNode.get("data").get("qrDataURL").asText();
                    }
                    throw new RuntimeException("Failed to get QR from VietQR API: " + jsonNode.toString());
                })
                .doOnError(e -> {
                    System.err.println("Error calling VietQR API: " + e.getMessage());
                    System.err.println("Error type: " + e.getClass().getSimpleName());
                    if (e instanceof org.springframework.web.reactive.function.client.WebClientResponseException) {
                        org.springframework.web.reactive.function.client.WebClientResponseException wcre = 
                            (org.springframework.web.reactive.function.client.WebClientResponseException) e;
                        System.err.println("HTTP Status: " + wcre.getStatusCode());
                        System.err.println("Response Body: " + wcre.getResponseBodyAsString());
                    }
                });
    }

    /**
     * Xác thực chữ ký webhook.
     * @param webhookPayload Dữ liệu JSON từ webhook.
     * @param receivedSignature Chữ ký được gửi trong header.
     * @return true nếu chữ ký hợp lệ, false nếu không.
     */
    public boolean verifyWebhookSignature(Map<String, Object> webhookPayload, String receivedSignature) {
        System.out.println("Received webhook. Note: Signature verification is a placeholder. Implement based on provider's docs.");
        return true; // Placeholder, cần triển khai thực tế
    }

    /**
     * Cập nhật trạng thái đơn hàng dựa trên webhook callback.
     * @param payload Dữ liệu từ webhook.
     */
    public void processPaymentCallback(Map<String, Object> payload) {
        String status = (String) payload.get("status");
        String transactionId = (String) payload.get("transactionId");
        String orderCode = (String) payload.get("orderCode");
        Double amount = (Double) payload.get("amount");

        if ("PAID".equals(status) || "SUCCESS".equals(status)) {
            System.out.println("Webhook: Payment successful for order " + orderCode + ", transaction ID: " + transactionId + ", amount: " + amount);
            // TODO: Cập nhật trạng thái đơn hàng
        } else if ("FAILED".equals(status)) {
            System.out.println("Webhook: Payment failed for order " + orderCode + ", transaction ID: " + transactionId);
            // TODO: Cập nhật trạng thái thất bại
        } else {
            System.out.println("Webhook: Unknown status for order " + orderCode + ": " + status);
        }
    }
}