import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaTruck,
  FaCheckCircle,
  FaArrowLeft,
  FaGift,
  FaTimes,
  FaMoneyBillWave,
  FaUniversity,
} from "react-icons/fa";
import "../styles/main.css";
import addressService from "../services/addressService";
import checkoutService from "../services/checkoutService";
import cartService from "../services/cartService";
import authService from "../services/authService";
import VoucherSelector from "../components/VoucherSelector";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [step, setStep] = useState(1);

  // Data states
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [voucher, setVoucher] = useState(null);
  const [note, setNote] = useState("");
  const [showVoucherSelector, setShowVoucherSelector] = useState(false);

  // Calculation states
  const [subtotal, setSubtotal] = useState(0);
  const [shippingFee, setShippingFee] = useState(30000);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Kiểm tra xác thực trước khi load dữ liệu checkout
    if (!authService.isAuthenticated()) {
      alert("Vui lòng đăng nhập để tiếp tục thanh toán!");
      navigate("/login");
      return;
    }

    loadCheckoutData();
  }, [navigate]);

  useEffect(() => {
    calculateTotals();
  }, [cartItems, shippingFee, voucher]);

  const loadCheckoutData = async () => {
    try {
      setLoading(true);

      // Load cart items from localStorage or API
      const savedCart = localStorage.getItem("checkout_cart");
      const savedVoucher = localStorage.getItem("checkout_voucher");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);

        // Transform cart items for API - LUÔN sử dụng chiTietSanPhamId
        const transformedCart = parsedCart.map((item) => {
          // Đảm bảo luôn có chiTietSanPhamId
          const chiTietSanPhamId = item.chiTietSanPhamId || item.id;

          if (!chiTietSanPhamId) {
            console.error("❌ Missing chiTietSanPhamId for item:", item);
            throw new Error("Missing chiTietSanPhamId for cart item");
          }

          return {
            chiTietSanPhamId: chiTietSanPhamId, // LUÔN sử dụng chiTietSanPhamId
            soLuong: item.quantity,
            gia: item.price,
            thanhTien: item.thanhTien || item.price * item.quantity,
            // Giữ lại thông tin hiển thị
            tenSanPham: item.name,
            mauSac: item.mauSac,
            kichCo: item.kichCo,
          };
        });
        setCartItems(transformedCart);
      }

      if (savedVoucher) {
        setVoucher(JSON.parse(savedVoucher));
      }

      // Load addresses
      const addressesData = await addressService.getAddresses();
      setAddresses(addressesData);
      if (addressesData.length > 0) {
        setSelectedAddress(addressesData[0]);
      }

      // Load payment methods - chỉ lấy 2 phương thức chính
      try {
        console.log("Loading payment methods...");
        const paymentData = await checkoutService.getPaymentMethods();
        console.log("Payment methods loaded:", paymentData);

        // Chỉ lấy 2 phương thức thanh toán chính (ID 1 và 2)
        const filteredPaymentMethods = paymentData.filter(
          (method) => method.id === 1 || method.id === 2
        );

        if (filteredPaymentMethods.length >= 2) {
          setPaymentMethods(filteredPaymentMethods);
          setSelectedPayment(filteredPaymentMethods[0]);
          console.log("Selected payment method:", filteredPaymentMethods[0]);
        } else {
          console.log("Không đủ 2 phương thức thanh toán, sử dụng fallback");
          throw new Error("Không đủ phương thức thanh toán");
        }
      } catch (error) {
        console.error("Error loading payment methods:", error);
        // Fallback: tạo payment methods mặc định
        const fallbackPaymentMethods = [
          {
            id: 1,
            ten: "Tiền mặt",
            moTa: "Thanh toán khi nhận hàng",
          },
          {
            id: 2,
            ten: "Chuyển khoản",
            moTa: "Chuyển khoản ngân hàng",
          },
        ];
        setPaymentMethods(fallbackPaymentMethods);
        setSelectedPayment(fallbackPaymentMethods[0]);
        console.log("Using fallback payment methods");
      }
    } catch (error) {
      console.error("Lỗi load checkout data:", error);
      alert("Có lỗi xảy ra khi tải dữ liệu checkout!");
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = () => {
    const subtotalValue = cartItems.reduce(
      (sum, item) => sum + (item.thanhTien || item.gia * item.soLuong),
      0
    );
    setSubtotal(subtotalValue);

    // Calculate discount from voucher
    let discountValue = 0;
    if (voucher) {
      if (voucher.loaiGiamGia === "PHAN_TRAM") {
        discountValue = Math.min(
          (subtotalValue * voucher.giaTriGiam) / 100,
          voucher.giamToiDa || Infinity
        );
      } else {
        discountValue = voucher.giaTriGiam;
      }
    }
    setDiscount(discountValue);

    const totalValue = subtotalValue + shippingFee - discountValue;
    setTotal(totalValue);
  };

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
  };

  const handlePaymentSelect = (payment) => {
    setSelectedPayment(payment);
  };

  const handleVoucherSelect = (selectedVoucher) => {
    setVoucher(selectedVoucher);
    setShowVoucherSelector(false);

    // Lưu voucher vào localStorage
    if (selectedVoucher) {
      localStorage.setItem("checkout_voucher", JSON.stringify(selectedVoucher));
    } else {
      localStorage.removeItem("checkout_voucher");
    }
  };

  const handleRemoveVoucher = () => {
    setVoucher(null);
    localStorage.removeItem("checkout_voucher");
  };

  const handleProcessCheckout = async () => {
    // Kiểm tra xác thực trước khi checkout
    if (!authService.isAuthenticated()) {
      alert("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!");
      navigate("/login");
      return;
    }

    if (!selectedAddress) {
      alert("Vui lòng chọn địa chỉ giao hàng!");
      return;
    }

    if (!selectedPayment) {
      alert("Vui lòng chọn phương thức thanh toán!");
      return;
    }

    try {
      setProcessing(true);

      const checkoutData = {
        cartItems: cartItems,
        diaChiId: selectedAddress.id,
        voucherId: voucher?.id || null,
        phuongThucThanhToanId: selectedPayment.id,
        ghiChuKhachHang: note,
        phiVanChuyen: shippingFee,
        tongTienHang: subtotal,
        tongThanhToan: total,
      };

      console.log("Processing checkout with data:", checkoutData);

      // Test trước với endpoint test
      const testResponse = await checkoutService.testProcessCheckout(
        checkoutData
      );
      console.log("Test response:", testResponse);

      const response = await checkoutService.processCheckout(checkoutData);

      // Clear localStorage
      localStorage.removeItem("checkout_cart");
      localStorage.removeItem("checkout_voucher");

      // Show success
      setStep(3);

      // Clear cart
      try {
        await cartService.clearCart();
      } catch (error) {
        console.error("Lỗi clear cart:", error);
      }
    } catch (error) {
      console.error("Lỗi checkout:", error);
      alert(
        "Có lỗi xảy ra khi xử lý đơn hàng: " +
          (error.response?.data?.error || error.message)
      );
    } finally {
      setProcessing(false);
    }
  };

  const handleBackToCart = () => {
    navigate("/cart");
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  if (loading) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <div className="checkout-loading">
            <div className="loading-spinner"></div>
            <p>Đang tải thông tin checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* Header */}
        <div className="checkout-header">
          <button className="checkout-back-btn" onClick={handleBackToCart}>
            <FaArrowLeft /> Quay lại giỏ hàng
          </button>
          <h1>Thanh toán đơn hàng</h1>
        </div>

        {/* Steps */}
        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? "active" : ""}`}>
            <div className="step-number">1</div>
            <div className="step-label">Thông tin giao hàng</div>
          </div>
          <div className={`step ${step >= 2 ? "active" : ""}`}>
            <div className="step-number">2</div>
            <div className="step-label">Thanh toán</div>
          </div>
          <div className={`step ${step >= 3 ? "active" : ""}`}>
            <div className="step-number">3</div>
            <div className="step-label">Hoàn thành</div>
          </div>
        </div>

        <div className="checkout-content">
          {/* Left side - Form */}
          <div className="checkout-form">
            {step === 1 && (
              <div className="checkout-section">
                <h2>
                  <FaMapMarkerAlt /> Địa chỉ giao hàng
                </h2>
                <div className="address-list">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      className={`address-item ${
                        selectedAddress?.id === address.id ? "selected" : ""
                      }`}
                      onClick={() => handleAddressSelect(address)}
                    >
                      <div className="address-info">
                        <div className="address-name">{address.hoTen}</div>
                        <div className="address-phone">
                          {address.soDienThoai}
                        </div>
                        <div className="address-detail">
                          {address.diaChiChiTiet}
                        </div>
                        <div className="address-location">
                          {address.xa}, {address.huyen}, {address.tinh}
                        </div>
                      </div>
                      {selectedAddress?.id === address.id && (
                        <FaCheckCircle className="address-check" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="checkout-actions">
                  <button
                    className="checkout-next-btn"
                    onClick={() => setStep(2)}
                    disabled={!selectedAddress}
                  >
                    Tiếp tục
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="checkout-section">
                <h2>
                  <FaCreditCard /> Phương thức thanh toán
                </h2>
                <div className="payment-list">
                  {paymentMethods.map((payment) => (
                    <div
                      key={payment.id}
                      className={`payment-item ${
                        selectedPayment?.id === payment.id ? "selected" : ""
                      }`}
                      onClick={() => handlePaymentSelect(payment)}
                    >
                      <div className="payment-icon">
                        {payment.id === 1 ? (
                          <FaMoneyBillWave />
                        ) : (
                          <FaUniversity />
                        )}
                      </div>
                      <div className="payment-info">
                        <div className="payment-name">{payment.ten}</div>
                        <div className="payment-description">
                          {payment.moTa}
                        </div>
                      </div>
                      {selectedPayment?.id === payment.id && (
                        <FaCheckCircle className="payment-check" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Voucher Section */}
                <div className="checkout-voucher-section">
                  <h3>
                    <FaGift /> Mã giảm giá
                  </h3>
                  <div className="voucher-selector">
                    {voucher ? (
                      <div className="selected-voucher">
                        <div className="voucher-info">
                          <div className="voucher-code">
                            {voucher.maVoucher}
                          </div>
                          <div className="voucher-description">
                            {voucher.loaiGiamGia === "PHAN_TRAM"
                              ? `Giảm ${voucher.giaTriGiam}%`
                              : `Giảm ₫${voucher.giaTriGiam.toLocaleString()}`}
                          </div>
                        </div>
                        <button
                          className="voucher-remove-btn"
                          onClick={handleRemoveVoucher}
                          title="Xóa voucher"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ) : (
                      <button
                        className="voucher-select-btn"
                        onClick={() => setShowVoucherSelector(true)}
                      >
                        <FaGift />
                        Chọn mã giảm giá
                      </button>
                    )}
                  </div>
                </div>

                <div className="checkout-note">
                  <h3>Ghi chú đơn hàng</h3>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Nhập ghi chú cho đơn hàng (không bắt buộc)..."
                    rows="3"
                  />
                </div>

                <div className="checkout-actions">
                  <button
                    className="checkout-back-step-btn"
                    onClick={() => setStep(1)}
                  >
                    Quay lại
                  </button>
                  <button
                    className="checkout-process-btn"
                    onClick={handleProcessCheckout}
                    disabled={!selectedPayment || processing}
                  >
                    {processing ? "Đang xử lý..." : "Đặt hàng"}
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="checkout-success">
                <div className="success-icon">✅</div>
                <h2>Đặt hàng thành công!</h2>
                <p>
                  Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng của bạn
                  sớm nhất.
                </p>
                <div className="success-actions">
                  <button
                    className="checkout-continue-btn"
                    onClick={handleContinueShopping}
                  >
                    Tiếp tục mua sắm
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right side - Order summary */}
          <div className="checkout-summary">
            <h3>Đơn hàng của bạn</h3>

            <div className="order-items">
              {cartItems.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-info">
                    <div className="order-item-name">
                      {item.tenSanPham || `Sản phẩm ${index + 1}`}
                    </div>
                    <div className="order-item-variant">
                      {item.mauSac && `${item.mauSac} - ${item.kichCo}`}
                    </div>
                  </div>
                  <div className="order-item-price">
                    ₫
                    {(
                      item.thanhTien || item.gia * item.soLuong
                    ).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="order-summary">
              <div className="summary-row">
                <span>Tạm tính:</span>
                <span>₫{subtotal.toLocaleString()}</span>
              </div>
              <div className="summary-row">
                <span>Phí vận chuyển:</span>
                <span>₫{shippingFee.toLocaleString()}</span>
              </div>
              {discount > 0 && (
                <div className="summary-row discount">
                  <span>Giảm giá:</span>
                  <span>-₫{discount.toLocaleString()}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Tổng cộng:</span>
                <span>₫{total.toLocaleString()}</span>
              </div>
            </div>

            {voucher && (
              <div className="voucher-applied">
                <h4>Voucher đã áp dụng</h4>
                <div className="voucher-info">
                  <span className="voucher-code">{voucher.maVoucher}</span>
                  <span className="voucher-discount">
                    -₫{discount.toLocaleString()}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Voucher Selector Modal */}
        {showVoucherSelector && (
          <div className="modal-overlay">
            <VoucherSelector
              onVoucherSelect={handleVoucherSelect}
              selectedVoucher={voucher}
              totalAmount={subtotal}
              onClose={() => setShowVoucherSelector(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
