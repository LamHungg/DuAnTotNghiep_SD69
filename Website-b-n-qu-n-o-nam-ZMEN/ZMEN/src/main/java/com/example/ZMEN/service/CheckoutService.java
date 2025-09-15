package com.example.ZMEN.service;

import com.example.ZMEN.dto.CheckoutRequest;
import com.example.ZMEN.dto.CheckoutResponse;

public interface CheckoutService {
    CheckoutResponse processCheckout(CheckoutRequest request, Integer khachHangId);
    String generateMaDonHang();
}
