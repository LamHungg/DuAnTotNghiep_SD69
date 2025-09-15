import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import cartService from "../services/cartService";

const CartBadge = () => {
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();

    // Listen for login/logout events
    const handleStorageChange = (e) => {
      if (e.key === "isLoggedIn" || e.key === "user") {
        checkLoginStatus();
      }
    };

    window.addEventListener("storage", handleStorageChange);

    // Custom event listener for login/logout
    const handleAuthChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("authChange", handleAuthChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("authChange", handleAuthChange);
    };
  }, []);

  const checkLoginStatus = () => {
    // Kiểm tra xem user đã đăng nhập chưa
    const user = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    if (user && isLoggedIn) {
      setIsLoggedIn(true);
      loadCartCount();

      // Refresh cart count every 30 seconds
      const interval = setInterval(loadCartCount, 30000);
      return () => clearInterval(interval);
    } else {
      setIsLoggedIn(false);
      setLoading(false);
    }
  };

  const loadCartCount = async () => {
    if (!isLoggedIn) {
      setCartCount(0);
      setLoading(false);
      return;
    }

    try {
      const count = await cartService.getCartCount();
      setCartCount(count);
    } catch (error) {
      console.error("Lỗi load cart count:", error);
      setCartCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  if (loading) {
    return (
      <div
        onClick={handleCartClick}
        style={{
          position: "relative",
          cursor: "pointer",
          padding: "10px",
          display: "inline-block",
        }}
      >
        🛒
      </div>
    );
  }

  return (
    <div
      onClick={handleCartClick}
      style={{
        position: "relative",
        cursor: "pointer",
        padding: "10px",
        display: "inline-block",
      }}
    >
      🛒
      {cartCount > 0 && (
        <span
          style={{
            position: "absolute",
            top: "0",
            right: "0",
            backgroundColor: "#ff4444",
            color: "white",
            borderRadius: "50%",
            width: "20px",
            height: "20px",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "bold",
          }}
        >
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </div>
  );
};

export default CartBadge;
