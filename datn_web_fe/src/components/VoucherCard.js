import React from "react";
import { FaGift, FaClock, FaPercent, FaMoneyBillWave } from "react-icons/fa";
import "../styles/main.css";

const VoucherCard = ({ voucher, onSelect, isSelected = false }) => {
  const getDiscountText = () => {
    if (voucher.loaiGiamGia === "PHAN_TRAM") {
      return `Giảm ${voucher.giaTriGiam}%`;
    } else {
      return `Giảm ${voucher.giaTriGiam?.toLocaleString()}đ`;
    }
  };

  const getMinOrderText = () => {
    if (voucher.giaTriToiThieu) {
      return `Đơn tối thiểu ${voucher.giaTriToiThieu.toLocaleString()}đ`;
    }
    return "Không giới hạn";
  };

  const getMaxDiscountText = () => {
    if (voucher.giamToiDa && voucher.loaiGiamGia === "PHAN_TRAM") {
      return `Tối đa ${voucher.giamToiDa.toLocaleString()}đ`;
    }
    return "";
  };

  const getStatusColor = () => {
    if (voucher.ngayConLai <= 0) return "#dc3545";
    if (voucher.ngayConLai <= 3) return "#ffc107";
    return "#28a745";
  };

  const getStatusText = () => {
    if (voucher.ngayConLai <= 0) return "Hết hạn";
    if (voucher.ngayConLai <= 3) return "Sắp hết hạn";
    return "Còn hiệu lực";
  };

  return (
    <div
      className={`voucher-card ${isSelected ? "selected" : ""}`}
      onClick={() => onSelect && onSelect(voucher)}
    >
      <div className="voucher-card__header">
        <div className="voucher-card__icon">
          <FaGift />
        </div>
        <div className="voucher-card__code">{voucher.maVoucher}</div>
        <div
          className="voucher-card__status"
          style={{ color: getStatusColor() }}
        >
          {getStatusText()}
        </div>
      </div>

      <div className="voucher-card__content">
        <h3 className="voucher-card__title">{voucher.tenVoucher}</h3>

        <div className="voucher-card__discount">
          <FaPercent className="voucher-card__discount-icon" />
          <span className="voucher-card__discount-text">
            {getDiscountText()}
          </span>
        </div>

        {getMaxDiscountText() && (
          <div className="voucher-card__max-discount">
            {getMaxDiscountText()}
          </div>
        )}

        <div className="voucher-card__min-order">
          <FaMoneyBillWave className="voucher-card__min-order-icon" />
          <span>{getMinOrderText()}</span>
        </div>

        {voucher.moTa && (
          <p className="voucher-card__description">{voucher.moTa}</p>
        )}

        <div className="voucher-card__footer">
          <div className="voucher-card__time">
            <FaClock className="voucher-card__time-icon" />
            <span>
              {voucher.ngayConLai > 0
                ? `Còn ${voucher.ngayConLai} ngày`
                : "Đã hết hạn"}
            </span>
          </div>

          {voucher.soLuong !== null && (
            <div className="voucher-card__quantity">
              Còn {voucher.soLuong} voucher
            </div>
          )}
        </div>
      </div>

      {isSelected && (
        <div className="voucher-card__selected-overlay">
          <div className="voucher-card__selected-icon">✓</div>
        </div>
      )}
    </div>
  );
};

export default VoucherCard;
