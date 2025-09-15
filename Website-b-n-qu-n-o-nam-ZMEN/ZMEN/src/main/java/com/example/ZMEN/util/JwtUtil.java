package com.example.ZMEN.util;

import org.springframework.stereotype.Component;

@Component
public class JwtUtil {

    // Tạm thời sử dụng cách đơn giản để lấy khachHangId từ token
    public Integer getKhachHangIdFromToken(String token) {
        try {
            // Với token format: "customer-token-{id}"
            if (token != null && token.startsWith("customer-token-")) {
                String idStr = token.substring("customer-token-".length());
                return Integer.parseInt(idStr);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    public String generateToken(String username, Integer khachHangId) {
        return "customer-token-" + khachHangId;
    }

    public Boolean validateToken(String token) {
        return token != null && token.startsWith("customer-token-");
    }
}
