import React, { useState, useEffect } from "react";
import { FaGift, FaSearch, FaTimes, FaCheck } from "react-icons/fa";
import VoucherCard from "./VoucherCard";
import { getActiveVouchers, validateVoucher } from "../services/voucherService";
import "../styles/main.css";

const VoucherSelector = ({
  onVoucherSelect,
  selectedVoucher,
  totalAmount = 0,
  onClose,
}) => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [validatingVoucher, setValidatingVoucher] = useState(false);
  const [validationMessage, setValidationMessage] = useState("");

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const data = await getActiveVouchers();
      setVouchers(data);
    } catch (error) {
      console.error("Error fetching vouchers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVoucherSelect = async (voucher) => {
    try {
      setValidatingVoucher(true);
      setValidationMessage("");

      const result = await validateVoucher(voucher.maVoucher, totalAmount);

      if (result.success) {
        onVoucherSelect(voucher);
        setValidationMessage("Voucher hợp lệ!");
      } else {
        setValidationMessage(result.message);
      }
    } catch (error) {
      setValidationMessage("Lỗi khi kiểm tra voucher");
    } finally {
      setValidatingVoucher(false);
    }
  };

  const handleManualVoucherInput = async () => {
    if (!searchTerm.trim()) return;

    try {
      setValidatingVoucher(true);
      setValidationMessage("");

      const result = await validateVoucher(searchTerm.trim(), totalAmount);

      if (result.success) {
        onVoucherSelect(result.voucher);
        setValidationMessage("Voucher hợp lệ!");
        setSearchTerm("");
      } else {
        setValidationMessage(result.message);
      }
    } catch (error) {
      setValidationMessage("Lỗi khi kiểm tra voucher");
    } finally {
      setValidatingVoucher(false);
    }
  };

  const filteredVouchers = vouchers.filter(
    (voucher) =>
      voucher.tenVoucher.toLowerCase().includes(searchTerm.toLowerCase()) ||
      voucher.maVoucher.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDiscountText = (voucher) => {
    if (voucher.loaiGiamGia === "PHAN_TRAM") {
      return `Giảm ${voucher.giaTriGiam}%`;
    } else {
      return `Giảm ${voucher.giaTriGiam?.toLocaleString()}đ`;
    }
  };

  return (
    <div className="voucher-selector">
      <div className="voucher-selector__header">
        <h3 className="voucher-selector__title">
          <FaGift />
          Chọn Voucher
        </h3>
        <button className="voucher-selector__close" onClick={onClose}>
          <FaTimes />
        </button>
      </div>

      <div className="voucher-selector__search">
        <div className="voucher-selector__search-input">
          <input
            type="text"
            placeholder="Nhập mã voucher hoặc tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleManualVoucherInput()}
          />
          <button
            className="voucher-selector__search-btn"
            onClick={handleManualVoucherInput}
            disabled={validatingVoucher}
          >
            {validatingVoucher ? "Đang kiểm tra..." : <FaSearch />}
          </button>
        </div>

        {validationMessage && (
          <div
            className={`voucher-selector__message ${
              validationMessage.includes("hợp lệ") ? "success" : "error"
            }`}
          >
            {validationMessage}
          </div>
        )}
      </div>

      {selectedVoucher && (
        <div className="voucher-selector__selected">
          <div className="voucher-selector__selected-info">
            <FaCheck className="voucher-selector__selected-icon" />
            <div>
              <div className="voucher-selector__selected-code">
                {selectedVoucher.maVoucher}
              </div>
              <div className="voucher-selector__selected-discount">
                {getDiscountText(selectedVoucher)}
              </div>
            </div>
          </div>
          <button
            className="voucher-selector__remove-btn"
            onClick={() => onVoucherSelect(null)}
          >
            <FaTimes />
          </button>
        </div>
      )}

      <div className="voucher-selector__content">
        {loading ? (
          <div className="voucher-selector__loading">
            <div className="loading-spinner"></div>
            <p>Đang tải voucher...</p>
          </div>
        ) : filteredVouchers.length === 0 ? (
          <div className="voucher-selector__empty">
            <FaGift className="voucher-selector__empty-icon" />
            <p>Không tìm thấy voucher nào</p>
            <p>Hãy thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          <div className="voucher-selector__list">
            {filteredVouchers.map((voucher) => (
              <VoucherCard
                key={voucher.id}
                voucher={voucher}
                onSelect={handleVoucherSelect}
                isSelected={selectedVoucher?.id === voucher.id}
              />
            ))}
          </div>
        )}
      </div>

      <div className="voucher-selector__footer">
        <div className="voucher-selector__total">
          Tổng tiền hàng: <strong>{totalAmount.toLocaleString()}đ</strong>
        </div>
        {selectedVoucher && (
          <div className="voucher-selector__discount">
            Giảm giá: <strong>-{getDiscountText(selectedVoucher)}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default VoucherSelector;
