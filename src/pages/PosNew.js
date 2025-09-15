import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaSearch,
  FaUser,
  FaClock,
  FaPlus,
  FaMinus,
  FaTimes,
  FaQrcode,
  FaMoneyBillWave,
  FaCreditCard,
  FaGift,
  FaPrint,
  FaCheck,
  FaTrash,
  FaEye,
  FaSync,
  FaBarcode,
  FaCalculator,
  FaReceipt,
  FaUsers,
  FaBox,
  FaChartLine,
  FaCog,
  FaBell,
  FaFilter,
  FaSort,
  FaExpand,
  FaCompress,
  FaList,
  FaExclamationTriangle,
} from "react-icons/fa";
import { QRCodeCanvas } from "qrcode.react";
import "./PosNew.css";
import posService from "../services/posService";
import authService from "../services/authService";
import ProductImage from "../components/ProductImage";

const PosNew = () => {
  // State management
  const [currentTime, setCurrentTime] = useState(new Date());
  const [orders, setOrders] = useState([]);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // Modal states
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showVariantModal, setShowVariantModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [variantModalLoading, setVariantModalLoading] = useState(false);

  // Form states
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [customerPaid, setCustomerPaid] = useState(0);
  const [orderNotes, setOrderNotes] = useState("");

  // QR and Toast states
  const [qrData, setQrData] = useState("");
  const [qrLoading, setQrLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  // UI States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid, list
  const [sortBy, setSortBy] = useState("name"); // name, price, stock
  const [filterCategory, setFilterCategory] = useState("all");
  const [showStock, setShowStock] = useState(true);

  // Initialize component
  useEffect(() => {
    if (!isInitialized) {
      initializeData();
      setIsInitialized(true);
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => clearInterval(timer);
  }, [isInitialized]);

  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, customersData, vouchersData] = await Promise.all([
        posService.getAllProducts(),
        posService.getAllCustomers(),
        posService.getActiveVouchers(),
      ]);

      setProducts(productsData || []);
      setCustomers(customersData || []);
      setVouchers(vouchersData || []);
    } catch (error) {
      const errorMessage = error.message || "Không xác định";
      setError(errorMessage);
      showToast("Lỗi khi tải dữ liệu: " + errorMessage, "error");

      setProducts([]);
      setCustomers([]);
      setVouchers([]);
    } finally {
      setLoading(false);
    }
  };

  // Utility functions
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const showToast = (message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  };

  // Cart management
  const getCurrentOrder = () => {
    console.log("🔍 getCurrentOrder() - Debug:");
    console.log("   - activeOrderId:", activeOrderId);
    console.log("   - orders count:", orders.length);
    console.log("   - orders:", orders);

    const foundOrder = orders.find((order) => order.id === activeOrderId);
    console.log("   - foundOrder:", foundOrder);

    const result = foundOrder || {
      id: null,
      items: [],
      customer: null,
      voucher: null,
      paymentMethod: "cash",
      customerPaid: 0,
      notes: "",
    };

    console.log("   - returning:", result);
    return result;
  };

  const addToCart = (product) => {
    const currentOrder = getCurrentOrder();
    const existingItem = currentOrder.items.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      updateItemQuantity(product.id, existingItem.quantity + 1);
    } else {
      const newItem = {
        productId: product.id,
        productName: product.tenSanPham,
        productPrice: product.gia || product.giaBan, // Sử dụng gia hoặc giaBan
        productImage: product.hinhAnh,
        quantity: 1,
        productDetails: product.chiTietSanPham || {},
      };

      const updatedOrder = {
        ...currentOrder,
        items: [...currentOrder.items, newItem],
      };

      if (currentOrder.id) {
        setOrders(
          orders.map((order) =>
            order.id === currentOrder.id ? updatedOrder : order
          )
        );
      } else {
        const newOrderId = Date.now();
        setActiveOrderId(newOrderId);
        setOrders([...orders, { ...updatedOrder, id: newOrderId }]);
      }

      showToast(`Đã thêm ${product.tenSanPham} vào giỏ hàng`, "success");
    }
  };

  const removeItemFromCart = (productId) => {
    const currentOrder = getCurrentOrder();
    const updatedItems = currentOrder.items.filter(
      (item) => item.productId !== productId
    );

    const updatedOrder = { ...currentOrder, items: updatedItems };

    if (currentOrder.id) {
      setOrders(
        orders.map((order) =>
          order.id === currentOrder.id ? updatedOrder : order
        )
      );
    }
  };

  const updateItemQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeItemFromCart(productId);
      return;
    }

    const currentOrder = getCurrentOrder();
    const updatedItems = currentOrder.items.map((item) =>
      item.productId === productId ? { ...item, quantity: newQuantity } : item
    );

    const updatedOrder = { ...currentOrder, items: updatedItems };

    if (currentOrder.id) {
      setOrders(
        orders.map((order) =>
          order.id === currentOrder.id ? updatedOrder : order
        )
      );
    }
  };

  const getCartTotal = () => {
    const currentOrder = getCurrentOrder();
    return currentOrder.items.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0
    );
  };

  const getVoucherDiscount = () => {
    const currentOrder = getCurrentOrder();
    if (!currentOrder.voucher) return 0;
    return currentOrder.voucher.giaTriGiam;
  };

  const getFinalTotal = () => {
    return getCartTotal() - getVoucherDiscount();
  };

  const getChange = () => {
    return customerPaid - getFinalTotal();
  };

  // Handle complete order
  const handleCompleteOrder = async () => {
    alert("🚀 DEBUG: handleCompleteOrder được gọi!");
    console.log("🚀 === BẮT ĐẦU XỬ LÝ HOÀN TẤT ĐƠN HÀNG ===");

    const currentOrder = getCurrentOrder();

    console.log("🔍 1. Thông tin đơn hàng hiện tại:");
    console.log("   - Order ID:", currentOrder.id);
    console.log("   - Items count:", currentOrder.items?.length || 0);
    console.log("   - Items:", currentOrder.items);

    console.log("🔍 2. Thông tin thanh toán:");
    console.log("   - Payment method:", paymentMethod);
    console.log("   - Customer paid:", customerPaid);
    console.log("   - Cart total:", getCartTotal());
    console.log("   - Voucher discount:", getVoucherDiscount());
    console.log("   - Final total:", getFinalTotal());

    console.log("🔍 3. Thông tin khách hàng:");
    console.log("   - Selected customer:", selectedCustomer);
    console.log("   - Selected voucher:", selectedVoucher);
    console.log("   - Order notes:", orderNotes);

    // Validation 1: Kiểm tra giỏ hàng
    console.log("🔍 4. Validation - Kiểm tra giỏ hàng:");
    if (!currentOrder.items || currentOrder.items.length === 0) {
      console.log("   ❌ Giỏ hàng trống!");
      showToast("Giỏ hàng trống! Vui lòng thêm sản phẩm", "error");
      return;
    }
    console.log("   ✅ Giỏ hàng có sản phẩm");

    // Validation 2: Kiểm tra tiền khách trả
    console.log("🔍 5. Validation - Kiểm tra tiền khách trả:");
    if (paymentMethod === "cash" && customerPaid < getFinalTotal()) {
      console.log("   ❌ Tiền khách trả không đủ!");
      console.log("   - Khách trả:", customerPaid);
      console.log("   - Cần trả:", getFinalTotal());
      showToast("Số tiền khách trả không đủ!", "error");
      return;
    }
    console.log("   ✅ Tiền khách trả đủ");

    try {
      console.log("🔍 6. Bắt đầu tạo đơn hàng...");
      showToast("Đang xử lý đơn hàng...", "info");

      // Prepare order data
      console.log("🔍 7. Chuẩn bị dữ liệu đơn hàng:");
      const orderData = {
        maDonHang: `POS-${Date.now()}`,
        khachHangId: selectedCustomer?.id || null,
        voucherId: selectedVoucher?.id || null,
        phuongThucThanhToan:
          paymentMethod === "cash" ? "Tiền mặt" : "Chuyển khoản",
        tongThanhToan: getFinalTotal(),
        ghiChu: orderNotes,
        chiTietDonHang: currentOrder.items.map((item) => ({
          chiTietSanPhamId: item.productId,
          soLuong: item.quantity,
          giaBan: item.productPrice,
        })),
      };

      console.log("   📦 Dữ liệu đơn hàng chi tiết:");
      console.log("   - Mã đơn hàng:", orderData.maDonHang);
      console.log("   - Khách hàng ID:", orderData.khachHangId);
      console.log("   - Voucher ID:", orderData.voucherId);
      console.log(
        "   - Phương thức thanh toán:",
        orderData.phuongThucThanhToan
      );
      console.log("   - Tổng thanh toán:", orderData.tongThanhToan);
      console.log("   - Ghi chú:", orderData.ghiChu);
      console.log("   - Chi tiết đơn hàng:", orderData.chiTietDonHang);

      // Call API to create order
      console.log("🔍 8. Gọi API tạo đơn hàng...");
      console.log("   📡 Gọi posService.createPOSOrder()");

      const response = await posService.createPOSOrder(orderData);

      console.log("🔍 9. Kết quả API:");
      console.log("   📋 Response:", response);
      console.log("   - Success:", response.success);
      console.log("   - Message:", response.message);
      console.log("   - Order ID:", response.donHangId);

      if (response.success) {
        console.log("🔍 10. ✅ Đơn hàng tạo thành công!");
        console.log("   - Order ID:", response.donHangId);
        console.log("   - Message:", response.message);

        showToast("Đơn hàng đã được tạo thành công!", "success");

        // Clear current order and reset form
        console.log("🔍 11. Reset form và tạo đơn hàng mới:");
        console.log("   - Xóa đơn hàng cũ (ID:", activeOrderId, ")");
        console.log("   - Reset customer, voucher, payment");

        setOrders(orders.filter((order) => order.id !== activeOrderId));
        setSelectedCustomer(null);
        setSelectedVoucher(null);
        setCustomerPaid(0);
        setOrderNotes("");

        // Create new empty order
        const newOrderId = Date.now();
        console.log("   - Tạo đơn hàng mới (ID:", newOrderId, ")");

        setActiveOrderId(newOrderId);
        setOrders((prevOrders) => [
          ...prevOrders.filter((order) => order.id !== activeOrderId),
          {
            id: newOrderId,
            items: [],
            customer: null,
            voucher: null,
            paymentMethod: "cash",
            customerPaid: 0,
            notes: "",
          },
        ]);

        console.log("🎉 === HOÀN THÀNH XỬ LÝ ĐƠN HÀNG ===");
      } else {
        console.log("🔍 10. ❌ Lỗi tạo đơn hàng:");
        console.log("   - Success:", response.success);
        console.log("   - Message:", response.message);

        showToast(
          "Lỗi tạo đơn hàng: " + (response.message || "Không xác định"),
          "error"
        );
      }
    } catch (error) {
      console.log("🔍 10. ❌ Lỗi exception:");
      console.log("   - Error message:", error.message);
      console.log("   - Error stack:", error.stack);
      console.log("   - Full error:", error);

      console.error("Error creating order:", error);
      showToast(
        "Lỗi tạo đơn hàng: " + (error.message || "Không xác định"),
        "error"
      );
    }
  };

  // Handle print invoice
  const handlePrintInvoice = async () => {
    const currentOrder = getCurrentOrder();

    if (!currentOrder.items || currentOrder.items.length === 0) {
      showToast("Giỏ hàng trống! Vui lòng thêm sản phẩm", "error");
      return;
    }

    try {
      showToast("Đang tạo hóa đơn...", "info");

      // Create invoice HTML
      const invoiceHTML = `
        <!DOCTYPE html>
        <html>
        <head>
          <title>Hóa Đơn - ZMEN</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .invoice-info { margin-bottom: 20px; }
            .items-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .items-table th { background-color: #f2f2f2; }
            .total { text-align: right; font-weight: bold; margin-top: 20px; }
            .footer { margin-top: 40px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>ZMEN - HÓA ĐƠN BÁN HÀNG</h1>
            <p>Ngày: ${new Date().toLocaleDateString("vi-VN")}</p>
            <p>Mã đơn: POS-${Date.now()}</p>
          </div>
          
          <div class="invoice-info">
            <p><strong>Khách hàng:</strong> ${
              selectedCustomer?.hoTen || "Khách lẻ"
            }</p>
            <p><strong>Số điện thoại:</strong> ${
              selectedCustomer?.soDienThoai || "N/A"
            }</p>
          </div>
          
          <table class="items-table">
            <thead>
              <tr>
                <th>Sản phẩm</th>
                <th>Số lượng</th>
                <th>Đơn giá</th>
                <th>Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              ${currentOrder.items
                .map(
                  (item) => `
                <tr>
                  <td>${item.productName}</td>
                  <td>${item.quantity}</td>
                  <td>${formatCurrency(item.productPrice)}</td>
                  <td>${formatCurrency(item.productPrice * item.quantity)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="total">
            <p>Tổng tiền hàng: ${formatCurrency(getCartTotal())}</p>
            ${
              selectedVoucher
                ? `<p>Giảm giá: -${formatCurrency(getVoucherDiscount())}</p>`
                : ""
            }
            <p><strong>Tổng cộng: ${formatCurrency(
              getFinalTotal()
            )}</strong></p>
            ${
              paymentMethod === "cash"
                ? `<p>Khách trả: ${formatCurrency(customerPaid)}</p>
            <p>Tiền thối: ${formatCurrency(getChange())}</p>`
                : ""
            }
          </div>
          
          <div class="footer">
            <p>Cảm ơn quý khách đã mua hàng!</p>
            <p>ZMEN - Thời trang chất lượng</p>
          </div>
        </body>
        </html>
      `;

      // Call API to generate PDF
      const pdfBlob = await posService.generateInvoicePDF(invoiceHTML);

      // Create download link
      const url = window.URL.createObjectURL(pdfBlob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `hoa-don-POS-${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      showToast("Hóa đơn đã được tạo thành công!", "success");
    } catch (error) {
      console.error("Error generating invoice:", error);
      showToast(
        "Lỗi tạo hóa đơn: " + (error.message || "Không xác định"),
        "error"
      );
    }
  };

  // Search and filter
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.tenSanPham
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || product.danhMuc === filterCategory;
    const hasStock = !showStock || (product.soLuong || product.soLuongTon) > 0;
    return matchesSearch && matchesCategory && hasStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return (a.gia || a.giaBan) - (b.gia || b.giaBan);
      case "stock":
        return (b.soLuong || b.soLuongTon) - (a.soLuong || a.soLuongTon);
      default:
        return a.tenSanPham.localeCompare(b.tenSanPham);
    }
  });

  // Helper function to get image source
  const getImageSource = (product) => {
    if (product.hinhAnh) {
      if (Array.isArray(product.hinhAnh) && product.hinhAnh.length > 0) {
        return product.hinhAnh[0].duongDan || product.hinhAnh[0];
      } else if (typeof product.hinhAnh === "string") {
        return product.hinhAnh;
      }
    }
    return null;
  };

  // Render functions
  const renderProductCard = (product) => {
    const imageSrc = getImageSource(product);

    return (
      <div
        key={product.id}
        className="product-card"
        onClick={() => addToCart(product)}
      >
        <div className="product-image-container">
          <ProductImage
            src={imageSrc}
            alt={product.tenSanPham}
            className="product-image"
          />
          {(product.soLuong || product.soLuongTon) <= 0 && (
            <div className="out-of-stock-badge">Hết hàng</div>
          )}
          {(product.soLuong || product.soLuongTon) <= 5 &&
            (product.soLuong || product.soLuongTon) > 0 && (
              <div className="low-stock-badge">Sắp hết</div>
            )}
        </div>
        <div className="product-info">
          <h4 className="product-name">{product.tenSanPham}</h4>
          <div className="product-price">
            {formatCurrency(product.gia || product.giaBan)}
          </div>
          <div className="product-stock">
            Tồn kho: {product.soLuong || product.soLuongTon} sản phẩm
          </div>
          {product.chiTietSanPham && (
            <div className="product-variants">
              {product.chiTietSanPham.size && (
                <span className="variant-tag size">
                  Size: {product.chiTietSanPham.size}
                </span>
              )}
              {product.chiTietSanPham.mauSac && (
                <span className="variant-tag color">
                  Màu: {product.chiTietSanPham.mauSac}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderProductList = (product) => {
    const imageSrc = getImageSource(product);

    return (
      <div
        key={product.id}
        className="product-list-item"
        onClick={() => addToCart(product)}
      >
        <div className="product-list-image">
          <ProductImage
            src={imageSrc}
            alt={product.tenSanPham}
            className="product-image"
          />
        </div>
        <div className="product-list-info">
          <h4 className="product-name">{product.tenSanPham}</h4>
          <div className="product-details">
            <span className="product-price">
              {formatCurrency(product.gia || product.giaBan)}
            </span>
            <span className="product-stock">
              Tồn: {product.soLuong || product.soLuongTon}
            </span>
          </div>
        </div>
        <div className="product-list-actions">
          <button className="add-to-cart-btn">
            <FaPlus />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`pos-container ${isFullscreen ? "fullscreen" : ""}`}>
      {/* Header */}
      <div className="pos-header">
        <div className="header-content">
          <div className="header-left">
            <h2>
              <FaShoppingCart />
              Hệ Thống POS - Quản Lý Bán Hàng
            </h2>
            <div className="pos-time">
              <FaClock />
              {currentTime.toLocaleString("vi-VN")}
            </div>
          </div>
          <div className="header-right">
            <div className="header-stats">
              <div className="stat-item">
                <FaBox />
                <span>{products.length} Sản phẩm</span>
              </div>
              <div className="stat-item">
                <FaUsers />
                <span>{customers.length} Khách hàng</span>
              </div>
              <div className="stat-item">
                <FaChartLine />
                <span>{orders.length} Đơn hàng</span>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="header-btn"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={isFullscreen ? "Thoát toàn màn hình" : "Toàn màn hình"}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
              <button
                className="header-btn"
                onClick={initializeData}
                title="Làm mới dữ liệu"
              >
                <FaSync />
              </button>
              <button className="header-btn" title="Cài đặt">
                <FaCog />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div className="pos-main-layout">
        {/* Left Panel - Products */}
        <div className="pos-left-panel">
          {/* Search and Filters */}
          <div className="search-filters-section">
            <div className="search-container">
              <div className="search-input-wrapper">
                <FaSearch className="search-icon" />
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                {searchTerm && (
                  <button
                    className="clear-search"
                    onClick={() => setSearchTerm("")}
                  >
                    <FaTimes />
                  </button>
                )}
              </div>
            </div>

            <div className="filters-container">
              <div className="filter-group">
                <label>Xem theo:</label>
                <div className="view-toggle">
                  <button
                    className={`view-btn ${
                      viewMode === "grid" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <FaBox />
                  </button>
                  <button
                    className={`view-btn ${
                      viewMode === "list" ? "active" : ""
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    <FaList />
                  </button>
                </div>
              </div>

              <div className="filter-group">
                <label>Sắp xếp:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  <option value="name">Tên sản phẩm</option>
                  <option value="price">Giá tiền</option>
                  <option value="stock">Tồn kho</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={showStock}
                    onChange={(e) => setShowStock(e.target.checked)}
                  />
                  Chỉ hiện có hàng
                </label>
              </div>
            </div>
          </div>

          {/* Products Grid/List */}
          <div className="products-section">
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p>Đang tải sản phẩm...</p>
              </div>
            ) : error ? (
              <div className="error-container">
                <FaExclamationTriangle />
                <p>Lỗi: {error}</p>
                <button onClick={initializeData} className="retry-btn">
                  Thử lại
                </button>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="empty-container">
                <FaBox />
                <p>Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <div className={`products-container ${viewMode}`}>
                {viewMode === "grid"
                  ? sortedProducts.map(renderProductCard)
                  : sortedProducts.map(renderProductList)}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Cart & Checkout */}
        <div className="pos-right-panel">
          {/* Order Management */}
          <div className="order-management">
            <div className="order-tabs">
              <div className="order-tabs-header">
                <h3>
                  <FaShoppingCart />
                  Quản Lý Đơn Hàng
                </h3>
                <button
                  className="new-order-btn"
                  onClick={() => {
                    const newOrderId = Date.now();
                    setActiveOrderId(newOrderId);
                    setOrders([...orders, { id: newOrderId, items: [] }]);
                  }}
                >
                  <FaPlus />
                  Đơn mới
                </button>
              </div>

              <div className="order-tabs-list">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    className={`order-tab ${
                      activeOrderId === order.id ? "active" : ""
                    }`}
                    onClick={() => setActiveOrderId(order.id)}
                  >
                    <span>Đơn #{order.id}</span>
                    <span className="order-item-count">
                      {order.items?.length || 0}
                    </span>
                    <button
                      className="close-order-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOrderToDelete(order);
                        setShowDeleteConfirmModal(true);
                      }}
                    >
                      <FaTimes />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cart Items */}
          <div className="cart-section">
            <div className="cart-header">
              <h3>
                <FaShoppingCart />
                Giỏ Hàng
              </h3>
              <span className="cart-item-count">
                {getCurrentOrder().items?.length || 0} sản phẩm
              </span>
            </div>

            <div className="cart-items">
              {getCurrentOrder().items?.length === 0 ? (
                <div className="empty-cart">
                  <FaShoppingCart />
                  <p>Giỏ hàng trống</p>
                  <span>Chọn sản phẩm để thêm vào giỏ hàng</span>
                </div>
              ) : (
                getCurrentOrder().items?.map((item) => {
                  const imageSrc = getImageSource({
                    hinhAnh: item.productImage,
                  });

                  return (
                    <div key={item.productId} className="cart-item">
                      <div className="cart-item-image">
                        <ProductImage
                          src={imageSrc}
                          alt={item.productName}
                          className="product-image"
                        />
                      </div>
                      <div className="cart-item-content">
                        <div className="cart-item-header">
                          <h4 className="cart-item-name">{item.productName}</h4>
                          <button
                            className="remove-item-btn"
                            onClick={() => removeItemFromCart(item.productId)}
                          >
                            <FaTimes />
                          </button>
                        </div>

                        {item.productDetails && (
                          <div className="cart-item-variants">
                            {item.productDetails.size && (
                              <span className="variant-tag size">
                                Size: {item.productDetails.size}
                              </span>
                            )}
                            {item.productDetails.mauSac && (
                              <span className="variant-tag color">
                                Màu: {item.productDetails.mauSac}
                              </span>
                            )}
                            {item.productDetails.chatLieu && (
                              <span className="variant-tag material">
                                Chất liệu: {item.productDetails.chatLieu}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                updateItemQuantity(
                                  item.productId,
                                  item.quantity - 1
                                )
                              }
                              disabled={item.quantity <= 1}
                            >
                              <FaMinus />
                            </button>
                            <input
                              type="number"
                              className="quantity-input"
                              value={item.quantity}
                              onChange={(e) =>
                                updateItemQuantity(
                                  item.productId,
                                  parseInt(e.target.value) || 1
                                )
                              }
                              min="1"
                            />
                            <button
                              className="quantity-btn"
                              onClick={() =>
                                updateItemQuantity(
                                  item.productId,
                                  item.quantity + 1
                                )
                              }
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <div className="cart-item-price">
                            {formatCurrency(item.productPrice * item.quantity)}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Customer & Voucher Selection */}
          <div className="customer-voucher-section">
            <div className="customer-selection">
              <div className="section-header">
                <h4>
                  <FaUser />
                  Khách Hàng
                </h4>
                <button
                  className="select-btn"
                  onClick={() => setShowCustomerModal(true)}
                >
                  {selectedCustomer ? "Thay đổi" : "Chọn khách hàng"}
                </button>
              </div>
              {selectedCustomer && (
                <div className="selected-customer">
                  <div className="customer-info">
                    <strong>{selectedCustomer.hoTen}</strong>
                    <span>{selectedCustomer.soDienThoai}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="voucher-selection">
              <div className="section-header">
                <h4>
                  <FaGift />
                  Mã Giảm Giá
                </h4>
                <button
                  className="select-btn"
                  onClick={() => setShowVoucherModal(true)}
                >
                  {selectedVoucher ? "Thay đổi" : "Chọn voucher"}
                </button>
              </div>
              {selectedVoucher && (
                <div className="selected-voucher">
                  <div className="voucher-info">
                    <strong>{selectedVoucher.maVoucher}</strong>
                    <span>
                      Giảm {formatCurrency(selectedVoucher.giaTriGiam)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Payment Section */}
          <div className="payment-section">
            <div className="payment-summary">
              <div className="summary-row">
                <span>Tổng tiền hàng:</span>
                <span>{formatCurrency(getCartTotal())}</span>
              </div>
              {getVoucherDiscount() > 0 && (
                <div className="summary-row discount">
                  <span>Giảm giá:</span>
                  <span>-{formatCurrency(getVoucherDiscount())}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Tổng thanh toán:</span>
                <span>{formatCurrency(getFinalTotal())}</span>
              </div>
            </div>

            <div className="payment-methods">
              <div className="payment-method-group">
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <FaMoneyBillWave />
                  Tiền mặt
                </label>
                <label className="payment-method">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="transfer"
                    checked={paymentMethod === "transfer"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <FaCreditCard />
                  Chuyển khoản
                </label>
              </div>

              {paymentMethod === "cash" && (
                <div className="cash-payment">
                  <div className="input-group">
                    <label>Khách trả:</label>
                    <input
                      type="number"
                      value={customerPaid}
                      onChange={(e) =>
                        setCustomerPaid(parseFloat(e.target.value) || 0)
                      }
                      className="payment-input"
                    />
                  </div>
                  {customerPaid > 0 && (
                    <div className="change-amount">
                      <span>Tiền thối:</span>
                      <span
                        className={getChange() >= 0 ? "positive" : "negative"}
                      >
                        {formatCurrency(Math.abs(getChange()))}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {paymentMethod === "transfer" && (
                <div className="transfer-payment">
                  <button
                    className="qr-generate-btn"
                    onClick={() => {
                      setQrLoading(true);
                      posService
                        .generateVietQR(
                          getFinalTotal(),
                          `ORDER-${Date.now()}`,
                          "Thanh toan don hang"
                        )
                        .then((data) => {
                          setQrData(data.qrDataURL);
                          setShowQRModal(true);
                        })
                        .catch((error) => {
                          showToast("Lỗi tạo mã QR: " + error.message, "error");
                        })
                        .finally(() => {
                          setQrLoading(false);
                        });
                    }}
                    disabled={qrLoading}
                  >
                    {qrLoading ? (
                      <div className="loading-spinner small"></div>
                    ) : (
                      <FaQrcode />
                    )}
                    Tạo mã QR thanh toán
                  </button>
                </div>
              )}
            </div>

            <div className="order-notes">
              <label>Ghi chú đơn hàng:</label>
              <textarea
                value={orderNotes}
                onChange={(e) => setOrderNotes(e.target.value)}
                placeholder="Nhập ghi chú cho đơn hàng..."
                className="notes-input"
              />
            </div>
          </div>

          {/* Checkout Actions */}
          <div className="checkout-actions">
            <button
              className="checkout-btn primary"
              disabled={getCurrentOrder().items?.length === 0}
              onClick={handleCompleteOrder}
            >
              <FaCheck />
              Hoàn Tất Đơn Hàng
            </button>
            <button
              className="checkout-btn secondary"
              disabled={getCurrentOrder().items?.length === 0}
              onClick={handlePrintInvoice}
            >
              <FaPrint />
              In Hóa Đơn
            </button>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          <span>{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, message: "", type: "" })}
          >
            <FaTimes />
          </button>
        </div>
      )}

      {/* Modals */}
      {/* Customer Modal */}
      {showCustomerModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Chọn Khách Hàng</h3>
              <button onClick={() => setShowCustomerModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="customer-list">
                {customers.map((customer) => (
                  <div
                    key={customer.id}
                    className="customer-item"
                    onClick={() => {
                      setSelectedCustomer(customer);
                      setShowCustomerModal(false);
                    }}
                  >
                    <div className="customer-avatar">
                      <FaUser />
                    </div>
                    <div className="customer-details">
                      <h4>{customer.hoTen}</h4>
                      <p>{customer.soDienThoai}</p>
                      <p>{customer.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Voucher Modal */}
      {showVoucherModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Chọn Voucher</h3>
              <button onClick={() => setShowVoucherModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="voucher-list">
                {vouchers.map((voucher) => (
                  <div
                    key={voucher.id}
                    className="voucher-item"
                    onClick={() => {
                      setSelectedVoucher(voucher);
                      setShowVoucherModal(false);
                    }}
                  >
                    <div className="voucher-code">{voucher.maVoucher}</div>
                    <div className="voucher-details">
                      <h4>Giảm {formatCurrency(voucher.giaTriGiam)}</h4>
                      <p>
                        Đơn tối thiểu: {formatCurrency(voucher.donToiThieu)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* QR Modal */}
      {showQRModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Mã QR Thanh Toán</h3>
              <button onClick={() => setShowQRModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="qr-container">
                <QRCodeCanvas value={qrData} size={400} />
                <p>Số tiền: {formatCurrency(getFinalTotal())}</p>
                <p>Quét mã QR để thanh toán</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Xác Nhận Xóa</h3>
              <button onClick={() => setShowDeleteConfirmModal(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc chắn muốn xóa đơn hàng này?</p>
              <div className="modal-actions">
                <button
                  className="btn-secondary"
                  onClick={() => setShowDeleteConfirmModal(false)}
                >
                  Hủy
                </button>
                <button
                  className="btn-danger"
                  onClick={() => {
                    setOrders(
                      orders.filter((order) => order.id !== orderToDelete.id)
                    );
                    setActiveOrderId(orders[0]?.id || null);
                    setShowDeleteConfirmModal(false);
                    setOrderToDelete(null);
                  }}
                >
                  Xóa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosNew;
