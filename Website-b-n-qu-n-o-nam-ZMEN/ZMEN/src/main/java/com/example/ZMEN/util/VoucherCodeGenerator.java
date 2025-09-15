package com.example.ZMEN.util;

import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class VoucherCodeGenerator {
    
    private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final int CODE_LENGTH = 8;
    private static final SecureRandom RANDOM = new SecureRandom();
    
    /**
     * Generate mã voucher tự động với format: VC + YYYYMMDD + 4 ký tự ngẫu nhiên
     * Ví dụ: VC202412011234
     */
    public String generateVoucherCode() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = generateRandomString(4);
        return "VC" + datePart + randomPart;
    }
    
    /**
     * Generate mã voucher với prefix tùy chỉnh
     * @param prefix Prefix cho mã voucher (ví dụ: "SALE", "NEW", "VIP")
     */
    public String generateVoucherCode(String prefix) {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = generateRandomString(4);
        return prefix + datePart + randomPart;
    }
    
    /**
     * Generate mã voucher ngắn gọn (8 ký tự)
     */
    public String generateShortVoucherCode() {
        return generateRandomString(CODE_LENGTH);
    }
    
    /**
     * Generate mã voucher với format tùy chỉnh
     * @param format Format string (ví dụ: "VOUCHER-{DATE}-{RANDOM}")
     */
    public String generateVoucherCodeWithFormat(String format) {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        String randomPart = generateRandomString(4);
        
        return format
                .replace("{DATE}", datePart)
                .replace("{RANDOM}", randomPart);
    }
    
    /**
     * Generate chuỗi ngẫu nhiên từ alphabet
     */
    private String generateRandomString(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(ALPHABET.charAt(RANDOM.nextInt(ALPHABET.length())));
        }
        return sb.toString();
    }
    
    /**
     * Kiểm tra mã voucher có hợp lệ không
     */
    public boolean isValidVoucherCode(String code) {
        if (code == null || code.trim().isEmpty()) {
            return false;
        }
        
        // Kiểm tra độ dài tối thiểu
        if (code.length() < 6) {
            return false;
        }
        
        // Kiểm tra chỉ chứa chữ cái và số
        return code.matches("^[A-Z0-9]+$");
    }
    
    /**
     * Generate mã voucher theo loại giảm giá
     */
    public String generateVoucherCodeByType(String loaiGiamGia) {
        String prefix;
        switch (loaiGiamGia) {
            case "GIA_TIEN":
                prefix = "GT";
                break;
            case "PHAN_TRAM":
                prefix = "PT";
                break;
            case "MIEN_PHI_VAN_CHUYEN":
                prefix = "MF";
                break;
            default:
                prefix = "VC";
        }
        
        return generateVoucherCode(prefix);
    }
}
