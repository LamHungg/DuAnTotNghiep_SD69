import React, { useState, useEffect } from "react";
import { FaPercent, FaClock, FaArrowRight, FaTimes } from "react-icons/fa";
import { getActivePromotions } from "../services/voucherService";
import "../styles/main.css";

const PromotionBanner = () => {
  const [promotions, setPromotions] = useState([]);
  const [currentPromotion, setCurrentPromotion] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchPromotions();
  }, []);

  useEffect(() => {
    if (promotions.length > 1) {
      const interval = setInterval(() => {
        setCurrentPromotion((prev) => (prev + 1) % promotions.length);
      }, 5000); // Chuyển đổi mỗi 5 giây

      return () => clearInterval(interval);
    }
  }, [promotions.length]);

  const fetchPromotions = async () => {
    try {
      const data = await getActivePromotions();
      setPromotions(data);
    } catch (error) {
      console.error("Error fetching promotions:", error);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleNext = () => {
    setCurrentPromotion((prev) => (prev + 1) % promotions.length);
  };

  const handlePrev = () => {
    setCurrentPromotion(
      (prev) => (prev - 1 + promotions.length) % promotions.length
    );
  };

  if (!isVisible || promotions.length === 0) {
    return null;
  }

  const promotion = promotions[currentPromotion];

  const getTimeLeftText = () => {
    if (promotion.ngayConLai <= 0) return "Hết hạn";
    if (promotion.ngayConLai === 1) return "Còn 1 ngày";
    return `Còn ${promotion.ngayConLai} ngày`;
  };

  const getTimeLeftColor = () => {
    if (promotion.ngayConLai <= 0) return "#dc3545";
    if (promotion.ngayConLai <= 3) return "#ffc107";
    return "#28a745";
  };

  return (
    <div className="promotion-banner">
      <div className="promotion-banner__container">
        <div className="promotion-banner__content">
          <div className="promotion-banner__icon">
            <FaPercent />
          </div>

          <div className="promotion-banner__info">
            <h3 className="promotion-banner__title">
              {promotion.tenKhuyenMai}
            </h3>
            <p className="promotion-banner__description">
              {promotion.moTa ||
                `Giảm ${promotion.phanTramGiam}% cho tất cả sản phẩm`}
            </p>
          </div>

          <div className="promotion-banner__discount">
            <span className="promotion-banner__discount-text">
              -{promotion.phanTramGiam}%
            </span>
          </div>

          <div className="promotion-banner__time">
            <FaClock className="promotion-banner__time-icon" />
            <span
              className="promotion-banner__time-text"
              style={{ color: getTimeLeftColor() }}
            >
              {getTimeLeftText()}
            </span>
          </div>
        </div>

        <div className="promotion-banner__actions">
          {promotions.length > 1 && (
            <>
              <button
                className="promotion-banner__nav-btn"
                onClick={handlePrev}
              >
                <FaArrowRight style={{ transform: "rotate(180deg)" }} />
              </button>

              <div className="promotion-banner__dots">
                {promotions.map((_, index) => (
                  <button
                    key={index}
                    className={`promotion-banner__dot ${
                      index === currentPromotion ? "active" : ""
                    }`}
                    onClick={() => setCurrentPromotion(index)}
                  />
                ))}
              </div>

              <button
                className="promotion-banner__nav-btn"
                onClick={handleNext}
              >
                <FaArrowRight />
              </button>
            </>
          )}

          <button className="promotion-banner__close-btn" onClick={handleClose}>
            <FaTimes />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromotionBanner;
