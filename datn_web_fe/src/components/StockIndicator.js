import React, { useState, useEffect } from "react";
import stockService from "../services/stockService";
import "../styles/main.css";
import "../styles/stockIndicator.css";

const StockIndicator = ({
  chiTietSanPhamId,
  quantity = 1,
  showDetails = true,
}) => {
  const [stockInfo, setStockInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (chiTietSanPhamId) {
      checkStock();
    }
  }, [chiTietSanPhamId, quantity]);

  const checkStock = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await stockService.canAddToCart(
        chiTietSanPhamId,
        quantity
      );
      setStockInfo(result);
    } catch (err) {
      console.error("Error checking stock:", err);
      setError("Lỗi kiểm tra tồn kho");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stock-indicator loading">
        <span className="loading-text">Đang kiểm tra...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-indicator error">
        <span className="error-text">⚠️ {error}</span>
      </div>
    );
  }

  if (!stockInfo) {
    return null;
  }

  const getStockStatus = () => {
    if (!stockInfo.canAdd) {
      return {
        status: "out-of-stock",
        icon: "❌",
        text: "Hết hàng",
        color: "#dc3545",
      };
    }

    if (stockInfo.stock <= 5) {
      return {
        status: "low-stock",
        icon: "⚠️",
        text: "Sắp hết",
        color: "#ffc107",
      };
    }

    return {
      status: "in-stock",
      icon: "✅",
      text: "Còn hàng",
      color: "#28a745",
    };
  };

  const stockStatus = getStockStatus();

  return (
    <div className={`stock-indicator ${stockStatus.status}`}>
      <div className="stock-status">
        <span className="stock-icon">{stockStatus.icon}</span>
        <span className="stock-text" style={{ color: stockStatus.color }}>
          {stockStatus.text}
        </span>
      </div>

      {showDetails && (
        <div className="stock-details">
          <div className="stock-item">
            <span className="label">Tồn kho:</span>
            <span className="value">{stockInfo.stock}</span>
          </div>

          {stockInfo.inCart > 0 && (
            <div className="stock-item">
              <span className="label">Trong giỏ:</span>
              <span className="value">{stockInfo.inCart}</span>
            </div>
          )}

          <div className="stock-item">
            <span className="label">Có thể thêm:</span>
            <span className="value">{stockInfo.canAdd}</span>
          </div>
        </div>
      )}

      {!stockInfo.canAdd && stockInfo.reason && (
        <div className="stock-message">
          <small style={{ color: "#dc3545" }}>{stockInfo.reason}</small>
        </div>
      )}
    </div>
  );
};

export default StockIndicator;
