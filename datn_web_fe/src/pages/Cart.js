import React, { useState, useEffect } from "react";
import "../styles/main.css";
import { useNavigate } from "react-router-dom";
import {
  FaGift,
  FaTimes,
  FaTrash,
  FaTrashAlt,
  FaShoppingCart,
} from "react-icons/fa";
import VoucherSelector from "../components/VoucherSelector";
import cartService from "../services/cartService";
// import Checkout from './muahang';

const mockAddress = {
  name: "Đặng Thị quyên",
  phone: "968 023 318",
  address: "18LK23 khu đô thị vân canh, Xã Vân Canh, Huyện Hoài Đức, Hà Nội",
};

const mockShipping = {
  method: "Nhanh",
  fee: 25300,
  discount: 25300,
  voucher: 50000,
  estimate: "11 Tháng 7 - 12 Tháng 7",
};

const mockPayment = {
  method: "Thanh toán khi nhận hàng",
};

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showVoucherSelector, setShowVoucherSelector] = useState(false);
  const navigate = useNavigate();

  // Check login status and load cart data
  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Listen for auth changes to reload cart
  useEffect(() => {
    const handleAuthChange = () => {
      console.log("🔄 Auth changed, reloading cart...");
      checkLoginStatus();
    };

    const handleCartUpdated = () => {
      console.log("🔄 Cart updated event received, reloading cart...");
      console.log("🔄 Current isLoggedIn state:", isLoggedIn);
      loadCart();
    };

    window.addEventListener("authChange", handleAuthChange);
    window.addEventListener("cartUpdated", handleCartUpdated);

    return () => {
      window.removeEventListener("authChange", handleAuthChange);
      window.removeEventListener("cartUpdated", handleCartUpdated);
    };
  }, []);

  const checkLoginStatus = () => {
    console.log("🔄 checkLoginStatus called");

    // Kiểm tra xem user đã đăng nhập chưa
    const user = localStorage.getItem("user");
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    console.log("🔄 Login check - user:", !!user, "isLoggedIn:", isLoggedIn);

    if (user && isLoggedIn) {
      console.log("✅ User is logged in, setting state and loading cart");
      setIsLoggedIn(true);
      loadCart();
    } else {
      console.log("❌ User not logged in, redirecting to login");
      setIsLoggedIn(false);
      setLoading(false);
      // Redirect to login if not logged in
      navigate("/login");
    }
  };

  const loadCart = async () => {
    console.log("🔄 loadCart called, isLoggedIn:", isLoggedIn);

    // Kiểm tra lại login status
    const user = localStorage.getItem("user");
    const isLoggedInStatus = localStorage.getItem("isLoggedIn") === "true";

    console.log(
      "🔄 localStorage check - user:",
      !!user,
      "isLoggedIn:",
      isLoggedInStatus
    );

    if (!user || !isLoggedInStatus) {
      console.log("❌ Not logged in, setting empty cart");
      setCart([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("📤 Calling cartService.getCart()...");
      const cartData = await cartService.getCart();
      console.log("📥 cartService.getCart() result:", cartData);

      // Transform API data to match UI format - QUAN TRỌNG: thêm chiTietSanPhamId
      const transformedCart = cartData.map((item) => ({
        id: item.id, // ID của ChiTietGioHang (để xóa/cập nhật)
        chiTietSanPhamId: item.chiTietSanPhamId, // QUAN TRỌNG: ID của ChiTietSanPham (để checkout)
        name: item.tenSanPham,
        image:
          item.hinhAnh ||
          "https://cf.shopee.vn/file/sg-11134201-22110-2jv7k1k2v8jv2d",
        variant: `${item.mauSac} - ${item.kichCo}, ${item.chatLieu}`,
        price: item.gia,
        oldPrice: item.gia, // No old price from API
        quantity: item.soLuong,
        checked: false,
        thanhTien: item.thanhTien,
        soLuongTonKho: item.soLuongTonKho,
        mauSac: item.mauSac,
        kichCo: item.kichCo,
        chatLieu: item.chatLieu,
      }));

      console.log("🔄 Transformed cart:", transformedCart);
      setCart(transformedCart);
    } catch (error) {
      console.error("❌ Lỗi load giỏ hàng:", error);
      // Fallback to empty cart
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheck = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };
  const handleSelectAll = () => {
    const newVal = !selectAll;
    setSelectAll(newVal);
    setCart(cart.map((item) => ({ ...item, checked: newVal })));
  };
  const handleQty = async (id, delta) => {
    try {
      const item = cart.find((item) => item.id === id);
      if (!item) return;

      const newQuantity = Math.max(1, item.quantity + delta);

      // Check stock limit
      if (newQuantity > item.soLuongTonKho) {
        alert(`Chỉ còn ${item.soLuongTonKho} sản phẩm trong kho!`);
        return;
      }

      // Update via API
      await cartService.updateQuantity(id, newQuantity);

      // Update local state with new quantity and recalculated total
      setCart(
        cart.map((item) =>
          item.id === id
            ? {
                ...item,
                quantity: newQuantity,
                thanhTien: item.price * newQuantity, // Cập nhật tổng tiền của item
              }
            : item
        )
      );
    } catch (error) {
      console.error("Lỗi cập nhật số lượng:", error);
      alert("Có lỗi xảy ra khi cập nhật số lượng!");
    }
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?")) {
      try {
        await cartService.removeFromCart(id);

        // Update local state
        setCart(cart.filter((item) => item.id !== id));

        alert("Đã xóa sản phẩm khỏi giỏ hàng!");
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm!");
      }
    }
  };

  // Xóa tất cả sản phẩm đã chọn
  const handleRemoveSelected = async () => {
    const selectedItems = cart.filter((item) => item.checked);
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để xóa!");
      return;
    }

    if (
      window.confirm(
        `Bạn có chắc muốn xóa ${selectedItems.length} sản phẩm đã chọn?`
      )
    ) {
      try {
        // Xóa từng sản phẩm đã chọn
        for (const item of selectedItems) {
          await cartService.removeFromCart(item.id);
        }

        // Update local state
        setCart(cart.filter((item) => !item.checked));

        alert("Đã xóa các sản phẩm đã chọn!");
      } catch (error) {
        console.error("Lỗi xóa sản phẩm:", error);
        alert("Có lỗi xảy ra khi xóa sản phẩm!");
      }
    }
  };

  // Xóa tất cả giỏ hàng
  const handleClearCart = async () => {
    if (cart.length === 0) {
      alert("Giỏ hàng đã trống!");
      return;
    }

    if (
      window.confirm("Bạn có chắc muốn xóa tất cả sản phẩm trong giỏ hàng?")
    ) {
      try {
        await cartService.clearCart();
        setCart([]);
        alert("Đã xóa tất cả sản phẩm trong giỏ hàng!");
      } catch (error) {
        console.error("Lỗi xóa giỏ hàng:", error);
        alert("Có lỗi xảy ra khi xóa giỏ hàng!");
      }
    }
  };
  const total = cart
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + (i.thanhTien || i.price * i.quantity), 0);
  const totalQty = cart
    .filter((i) => i.checked)
    .reduce((sum, i) => sum + i.quantity, 0);
  const checkedCart = cart.filter((i) => i.checked);

  // Tính toán giảm giá từ voucher
  const voucherDiscount = selectedVoucher
    ? selectedVoucher.loaiGiamGia === "PHAN_TRAM"
      ? Math.min(
          (total * selectedVoucher.giaTriGiam) / 100,
          selectedVoucher.giamToiDa || Infinity
        )
      : selectedVoucher.giaTriGiam
    : 0;

  const finalTotal = total - voucherDiscount;

  const handleBuy = () => {
    // Lưu cart đã chọn vào localStorage để truyền sang trang checkout
    localStorage.setItem("checkout_cart", JSON.stringify(checkedCart));
    localStorage.setItem("checkout_total", finalTotal);
    if (selectedVoucher) {
      localStorage.setItem("checkout_voucher", JSON.stringify(selectedVoucher));
    }
    navigate("/checkout");
  };

  const handleVoucherSelect = (voucher) => {
    setSelectedVoucher(voucher);
    setShowVoucherSelector(false);
  };

  if (loading) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-loading">
            <div className="loading-spinner"></div>
            <p>Đang kiểm tra đăng nhập...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <div className="cart-loading">
            <div className="cart-empty-icon">🔒</div>
            <h3>Vui lòng đăng nhập</h3>
            <p>Bạn cần đăng nhập để xem giỏ hàng</p>
            <button
              className="cart-empty-btn"
              onClick={() => navigate("/login")}
            >
              Đăng nhập ngay
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-header">
          <h1>
            <FaShoppingCart className="cart-header-icon" />
            Giỏ hàng của bạn
          </h1>
          <div className="cart-header-info">
            <span className="cart-item-count">{cart.length} sản phẩm</span>
          </div>
        </div>

        <div className="cart-list">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <h3>Giỏ hàng trống</h3>
              <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
              <button
                className="cart-empty-btn"
                onClick={() => navigate("/products")}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div className="cart-item" key={item.id}>
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => handleCheck(item.id)}
                />
                <img src={item.image} alt={item.name} className="cart-img" />
                <div className="cart-info">
                  <div className="cart-name">{item.name}</div>
                  <div className="cart-variant">{item.variant}</div>

                  {/* Stock info */}
                  <div className="cart-stock-info">
                    <span
                      className={`stock-status ${
                        item.soLuongTonKho > 0 ? "in-stock" : "out-of-stock"
                      }`}
                    >
                      {item.soLuongTonKho > 0
                        ? `Còn ${item.soLuongTonKho} sản phẩm`
                        : "Hết hàng"}
                    </span>
                  </div>

                  <div className="cart-price">
                    <div className="cart-price-unit">
                      <span className="cart-price-main">
                        ₫{item.price.toLocaleString()}
                      </span>
                      {item.oldPrice !== item.price && (
                        <span className="cart-price-old">
                          ₫{item.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className="cart-price-total">
                      <span className="cart-price-total-label">Tổng:</span>
                      <span className="cart-price-total-value">
                        ₫{(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="cart-qty">
                    <button
                      onClick={() => handleQty(item.id, -1)}
                      className="cart-qty-btn"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="cart-qty-num">{item.quantity}</span>
                    <button
                      onClick={() => handleQty(item.id, 1)}
                      className="cart-qty-btn"
                      disabled={item.quantity >= item.soLuongTonKho}
                    >
                      +
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="cart-remove-btn"
                    title="Xóa sản phẩm"
                  >
                    <FaTrashAlt />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        <div className="cart-bottom-bar">
          <div className="cart-bottom-row">
            <div className="cart-actions-left">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
              />
              <span className="cart-bottom-all">Tất cả</span>

              {/* Action buttons */}
              <button
                className="cart-action-btn cart-remove-selected-btn"
                onClick={handleRemoveSelected}
                disabled={cart.filter((item) => item.checked).length === 0}
                title="Xóa sản phẩm đã chọn"
              >
                <FaTrash /> Xóa đã chọn
              </button>

              <button
                className="cart-action-btn cart-clear-btn"
                onClick={handleClearCart}
                disabled={cart.length === 0}
                title="Xóa tất cả giỏ hàng"
              >
                <FaTrashAlt /> Xóa tất cả
              </button>
            </div>

            {/* Voucher Section */}
            <div className="cart-voucher-section">
              <button
                className="cart-voucher-btn"
                onClick={() => setShowVoucherSelector(true)}
              >
                <FaGift />
                {selectedVoucher ? selectedVoucher.maVoucher : "Chọn Voucher"}
              </button>
              {selectedVoucher && (
                <button
                  className="cart-voucher-remove"
                  onClick={() => setSelectedVoucher(null)}
                >
                  <FaTimes />
                </button>
              )}
            </div>

            <div className="cart-total-section">
              <div className="cart-total-row">
                <span>Tổng tiền hàng:</span>
                <span>₫{total.toLocaleString()}</span>
              </div>
              {selectedVoucher && (
                <div className="cart-total-row cart-discount">
                  <span>Giảm giá ({selectedVoucher.maVoucher}):</span>
                  <span>-₫{voucherDiscount.toLocaleString()}</span>
                </div>
              )}
              <div className="cart-total-row cart-final">
                <span>Tổng thanh toán:</span>
                <span>₫{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <button
              className="cart-buy-btn"
              onClick={handleBuy}
              disabled={checkedCart.length === 0}
            >
              Mua hàng ({totalQty})
            </button>
          </div>
        </div>

        {/* Voucher Selector Modal */}
        {showVoucherSelector && (
          <div className="modal-overlay">
            <VoucherSelector
              onVoucherSelect={handleVoucherSelect}
              selectedVoucher={selectedVoucher}
              totalAmount={total}
              onClose={() => setShowVoucherSelector(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
