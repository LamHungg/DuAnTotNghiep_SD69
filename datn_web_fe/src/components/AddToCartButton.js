import React, { useState } from "react";
import cartService from "../services/cartService";

const AddToCartButton = ({
  chiTietSanPhamId,
  soLuong = 1,
  onSuccess,
  onError,
}) => {
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    try {
      setLoading(true);
      await cartService.addToCart(chiTietSanPhamId, soLuong);

      // Trigger cart reload event
      window.dispatchEvent(new Event("cartUpdated"));

      if (onSuccess) {
        onSuccess();
      } else {
        alert("Đã thêm sản phẩm vào giỏ hàng!");
      }
    } catch (error) {
      console.error("Lỗi thêm vào giỏ hàng:", error);

      if (onError) {
        onError(error);
      } else {
        alert("Có lỗi xảy ra khi thêm vào giỏ hàng!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading}
      style={{
        padding: "10px 20px",
        backgroundColor: loading ? "#ccc" : "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: loading ? "not-allowed" : "pointer",
        fontSize: "14px",
      }}
    >
      {loading ? "Đang thêm..." : "Thêm vào giỏ hàng"}
    </button>
  );
};

export default AddToCartButton;
