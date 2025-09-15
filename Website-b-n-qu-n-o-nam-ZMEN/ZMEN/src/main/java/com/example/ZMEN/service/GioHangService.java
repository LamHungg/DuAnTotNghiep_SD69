package com.example.ZMEN.service;

import com.example.ZMEN.dto.CartItemDTO;
import com.example.ZMEN.dto.request.AddToCartRequestDTO;

import java.util.List;

public interface GioHangService {
    void addItemToCart(Integer idKhachHang, AddToCartRequestDTO request);
    
    List<CartItemDTO> getCartItems(Integer idKhachHang);
    
    void updateCartItemQuantity(Integer idKhachHang, Integer cartItemId, Integer soLuong);
    
    void removeFromCart(Integer idKhachHang, Integer cartItemId);
    
    void clearCart(Integer idKhachHang);
    
    Integer getCartItemCount(Integer idKhachHang);
}
