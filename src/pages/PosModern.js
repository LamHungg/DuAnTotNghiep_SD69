import React, { useState, useEffect, useCallback, useMemo } from "react";
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
  FaSave,
} from "react-icons/fa";
import "./PosNew.css";
import posService from "../services/posService";
import authService from "../services/authService";
import ProductImage from "../components/ProductImage";

const PosModern = () => {
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

  // Additional states for enhanced functionality
  const [showOrderHistory, setShowOrderHistory] = useState(false);
  const [orderHistory, setOrderHistory] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [barcodeInput, setBarcodeInput] = useState("");
  const [recentProducts, setRecentProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [showReceipt, setShowReceipt] = useState(false);
  const [currentReceipt, setCurrentReceipt] = useState(null);

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

  // Product grouping states
  const [groupedProducts, setGroupedProducts] = useState([]);
  const [selectedProductForVariants, setSelectedProductForVariants] =
    useState(null);

  // Utility functions
  const formatCurrency = useCallback((amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  }, []);

  const formatDate = useCallback((date) => {
    return new Date(date).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const showToast = useCallback((message, type = "info") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "" }), 3000);
  }, []);

  // Cart management
  const getCurrentOrder = useCallback(() => {
    const currentOrder = orders.find((order) => order.id === activeOrderId);

    if (!currentOrder) {
      return {
        id: null,
        items: [],
        customer: null,
        voucher: null,
        paymentMethod: "cash",
        customerPaid: 0,
        notes: "",
        status: "pending",
      };
    }

    return currentOrder;
  }, [orders, activeOrderId]);

  // Enhanced order management functions
  const saveOrder = useCallback(
    async (orderData) => {
      try {
        if (!orderData.items || orderData.items.length === 0) {
          throw new Error("Đơn hàng không có sản phẩm");
        }

        const stockErrors = [];
        orderData.items.forEach((item) => {
          const product = products.find((p) => p.id === item.productId);
          if (product && (product.soLuong || 0) < item.quantity) {
            stockErrors.push(
              `${product.tenSanPham}: Chỉ còn ${product.soLuong || 0} trong kho`
            );
          }
        });

        if (stockErrors.length > 0) {
          throw new Error(
            `Sản phẩm không đủ số lượng: ${stockErrors.join(", ")}`
          );
        }

        const savedOrders = JSON.parse(
          localStorage.getItem("pos_saved_orders") || "[]"
        );
        const orderToSave = {
          ...orderData,
          id: orderData.id || Date.now(),
          savedAt: new Date().toISOString(),
          status: "saved",
        };

        const updatedOrders = [
          ...savedOrders.filter((o) => o.id !== orderToSave.id),
          orderToSave,
        ];
        localStorage.setItem("pos_saved_orders", JSON.stringify(updatedOrders));

        showToast("Đã lưu đơn hàng thành công", "success");
        return orderToSave;
      } catch (error) {
        showToast("Lỗi khi lưu đơn hàng: " + error.message, "error");
        throw error;
      }
    },
    [products, showToast]
  );

  const printReceipt = useCallback(() => {
    if (currentReceipt) {
      const printWindow = window.open("", "_blank");
      printWindow.document.write(`
        <html>
          <head>
            <title>Hóa đơn #${currentReceipt.id}</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              .header { text-align: center; margin-bottom: 20px; }
              .item { display: flex; justify-content: space-between; margin: 5px 0; }
              .total { font-weight: bold; border-top: 1px solid #000; padding-top: 10px; }
              .footer { text-align: center; margin-top: 20px; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h2>HÓA ĐƠN BÁN HÀNG</h2>
              <p>Mã: #${currentReceipt.id}</p>
              <p>Ngày: ${currentReceipt.date}</p>
            </div>
            <div class="items">
              ${currentReceipt.items
                .map(
                  (item) => `
                <div class="item">
                  <span>${item.productName} x${item.quantity}</span>
                  <span>${formatCurrency(
                    item.productPrice * item.quantity
                  )}</span>
                </div>
              `
                )
                .join("")}
            </div>
            <div class="total">
              <div class="item">
                <span>Tổng tiền:</span>
                <span>${formatCurrency(currentReceipt.total)}</span>
              </div>
            </div>
            <div class="footer">
              <p>Cảm ơn quý khách!</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  }, [currentReceipt, formatCurrency]);

  // Initialize data function
  const initializeData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsData, customersData, vouchersData] = await Promise.all([
        posService.getAllProducts(),
        posService.getAllCustomers(),
        posService.getActiveVouchers(),
      ]);

      const savedCompletedOrders = JSON.parse(
        localStorage.getItem("pos_completed_orders") || "[]"
      );
      setOrderHistory(savedCompletedOrders);

      setProducts(productsData || []);
      setCustomers(customersData || []);
      setVouchers(vouchersData || []);

      if (productsData && productsData.length > 0) {
        const grouped = groupProductsByName(productsData);
        setGroupedProducts(grouped);
      }

      if (orders.length === 0) {
        const newOrderId = Date.now();
        const newOrder = {
          id: newOrderId,
          items: [],
          customer: null,
          voucher: null,
          paymentMethod: "cash",
          customerPaid: 0,
          notes: "",
          status: "pending",
        };
        setOrders([newOrder]);
        setActiveOrderId(newOrderId);
      } else if (!activeOrderId && orders.length > 0) {
        setActiveOrderId(orders[0].id);
      }
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

  // Product grouping function
  const groupProductsByName = (products) => {
    const groups = {};

    products.forEach((product) => {
      const productName = product.tenSanPham || "Tên sản phẩm";

      if (!groups[productName]) {
        groups[productName] = {
          name: productName,
          code: product.maSanPham,
          description: product.moTa,
          hinhAnh: product.hinhAnh,
          variants: [],
          totalStock: 0,
          minPrice: Infinity,
          maxPrice: 0,
          hasActiveVariants: false,
        };
      }

      const stockQuantity =
        product.soLuongTon ||
        product.soLuong ||
        product.quantity ||
        product.stock ||
        0;
      const price = product.giaBan || product.gia || product.price || 0;

      groups[productName].variants.push({
        id: product.id,
        size: product.tenKichCo,
        color: product.tenMauSac,
        material: product.tenChatLieu,
        stock: stockQuantity,
        price: price,
        importPrice: product.giaNhap,
        status: product.trangThai,
        hinhAnh: product.hinhAnh,
      });

      groups[productName].totalStock += stockQuantity;
      groups[productName].minPrice = Math.min(
        groups[productName].minPrice,
        price
      );
      groups[productName].maxPrice = Math.max(
        groups[productName].maxPrice,
        price
      );

      if (product.trangThai === 1) {
        groups[productName].hasActiveVariants = true;
      }
    });

    return Object.values(groups);
  };

  // Cart functions
  const getCartTotal = useCallback(() => {
    const currentOrder = getCurrentOrder();
    return currentOrder.items.reduce(
      (total, item) => total + item.productPrice * item.quantity,
      0
    );
  }, [getCurrentOrder]);

  const getVoucherDiscount = useCallback(() => {
    const currentOrder = getCurrentOrder();
    const voucher = selectedVoucher || currentOrder.voucher;
    if (!voucher) return 0;

    const cartTotal = getCartTotal();
    const minOrderAmount = parseFloat(voucher.giaTriToiThieu) || 0;
    if (minOrderAmount > 0 && cartTotal < minOrderAmount) {
      return 0;
    }

    let discount = 0;
    if (voucher.loaiGiamGia === "PHAN_TRAM") {
      const percentageValue = parseFloat(voucher.giaTriGiam) || 0;
      discount = (cartTotal * percentageValue) / 100;
      const maxDiscount = parseFloat(voucher.giamToiDa) || 0;
      if (maxDiscount > 0 && discount > maxDiscount) {
        discount = maxDiscount;
      }
    } else {
      discount = parseFloat(voucher.giaTriGiam) || 0;
    }

    return Math.min(discount, cartTotal);
  }, [selectedVoucher, getCurrentOrder, getCartTotal]);

  const getVoucherValidationMessage = useCallback(() => {
    const currentOrder = getCurrentOrder();
    const voucher = selectedVoucher || currentOrder.voucher;
    if (!voucher) return null;

    const cartTotal = getCartTotal();
    const minOrderAmount = parseFloat(voucher.giaTriToiThieu) || 0;
    if (minOrderAmount > 0 && cartTotal < minOrderAmount) {
      const remaining = minOrderAmount - cartTotal;
      return `Voucher yêu cầu đơn hàng tối thiểu ${formatCurrency(
        minOrderAmount
      )}. Cần thêm ${formatCurrency(remaining)} để áp dụng voucher.`;
    }

    return null;
  }, [selectedVoucher, getCurrentOrder, getCartTotal, formatCurrency]);

  const isVoucherApplicable = useCallback(() => {
    const currentOrder = getCurrentOrder();
    const voucher = selectedVoucher || currentOrder.voucher;
    if (!voucher) return false;

    const cartTotal = getCartTotal();
    const minOrderAmount = parseFloat(voucher.giaTriToiThieu) || 0;

    return minOrderAmount === 0 || cartTotal >= minOrderAmount;
  }, [selectedVoucher, getCurrentOrder, getCartTotal]);

  const getFinalTotal = useCallback(() => {
    return getCartTotal() - getVoucherDiscount();
  }, [getCartTotal, getVoucherDiscount]);

  const getChange = useCallback(() => {
    return customerPaid - getFinalTotal();
  }, [customerPaid, getFinalTotal]);

  // Generate QR code
  const handleGenerateQR = useCallback(async () => {
    setQrLoading(true);
    try {
      const order = getCurrentOrder();
      if (getFinalTotal() <= 0) {
        throw new Error("Không có số tiền để thanh toán");
      }
      const response = await posService.generateVietQR(
        getFinalTotal(),
        order.id.toString(),
        orderNotes || `Thanh toan don hang ${order.id}`
      );
      if (response && response.qrDataURL) {
        setQrData(response.qrDataURL);
        setShowQRModal(true);
        showToast("Đã tạo mã QR thanh toán thành công", "success");
      } else {
        throw new Error("Không nhận được dữ liệu QR hợp lệ");
      }
    } catch (error) {
      console.error("QR generation error:", error);
      showToast(
        "Lỗi tạo mã QR: " + (error.message || "Không thể kết nối đến dịch vụ"),
        "error"
      );
      setQrData("");
    } finally {
      setQrLoading(false);
    }
  }, [getFinalTotal, getCurrentOrder, orderNotes, showToast]);

  // Product functions
  const handleProductClick = (productGroup) => {
    setSelectedProductForVariants(productGroup);
    setShowVariantModal(true);
  };

  const handleVariantSelect = (variant) => {
    const originalProduct = products.find((p) => p.id === variant.id);
    if (originalProduct) {
      addToCart(originalProduct);
      setShowVariantModal(false);
      setSelectedProductForVariants(null);
      showToast(
        `Đã thêm ${variant.size || ""} ${variant.color || ""} ${
          variant.material || ""
        } vào giỏ hàng`,
        "success"
      );
    }
  };

  const addToCart = (product) => {
    const currentOrder = getCurrentOrder();
    const existingItem = currentOrder.items.find(
      (item) => item.productId === product.id
    );

    if (existingItem) {
      updateItemQuantity(product.id, existingItem.quantity + 1);
    } else {
      const price = product.giaBan || product.gia || product.price || 0;

      const newItem = {
        productId: product.id,
        productName: product.tenSanPham || "Tên sản phẩm",
        productCode: product.maSanPham,
        productPrice: price,
        productImage: product.hinhAnh,
        quantity: 1,
        productDetails: {
          size: product.tenKichCo,
          mauSac: product.tenMauSac,
          chatLieu: product.tenChatLieu,
          moTa: product.moTa,
          importPrice: product.giaNhap,
          status: product.trangThai,
        },
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

      showToast(
        `Đã thêm ${product.tenSanPham || "sản phẩm"} vào giỏ hàng`,
        "success"
      );

      addToRecentProducts(product);
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

  // Additional functions
  const addToRecentProducts = (product) => {
    setRecentProducts((prev) => {
      const filtered = prev.filter((p) => p.id !== product.id);
      return [product, ...filtered].slice(0, 10);
    });
  };

  const handleBarcodeScan = (barcode) => {
    setBarcodeInput(barcode);
    const product = products.find((p) => p.maSanPham === barcode);
    if (product) {
      addToCart(product);
      showToast(`Đã tìm thấy sản phẩm: ${product.tenSanPham}`, "success");
    } else {
      showToast("Không tìm thấy sản phẩm với mã vạch này", "error");
    }
  };

  const generateReceipt = (order) => {
    const receipt = {
      id: order.id,
      date: new Date().toLocaleString("vi-VN"),
      items: order.items,
      subtotal: getCartTotal(),
      discount: getVoucherDiscount(),
      total: getFinalTotal(),
      customer: selectedCustomer,
      paymentMethod: paymentMethod,
      customerPaid: customerPaid,
      change: getChange(),
      notes: orderNotes,
    };
    setCurrentReceipt(receipt);
    setShowReceipt(true);
  };

  const completeOrder = async () => {
    alert("🚀 DEBUG: completeOrder được gọi!");
    console.log("🚀 === BẮT ĐẦU XỬ LÝ HOÀN TẤT ĐƠN HÀNG (PosModern) ===");

    try {
      const currentOrder = getCurrentOrder();
      console.log("🔍 1. Thông tin đơn hàng hiện tại:", currentOrder);

      if (
        !currentOrder ||
        !currentOrder.items ||
        currentOrder.items.length === 0
      ) {
        showToast("Giỏ hàng trống, không thể hoàn tất đơn hàng", "error");
        return;
      }

      console.log("🔍 1.5. Tính toán tổng tiền...");
      const finalTotal = getFinalTotal();
      console.log("🔍 1.6. Final total:", finalTotal);

      console.log("🔍 1.7. Kiểm tra thanh toán...");
      if (
        paymentMethod === "cash" &&
        customerPaid > 0 &&
        customerPaid < finalTotal
      ) {
        console.log("🔍 1.8. ❌ Số tiền khách trả không đủ");
        showToast("Số tiền khách trả không đủ", "error");
        return;
      }
      console.log("🔍 1.9. ✅ Thanh toán hợp lệ");

      console.log("🔍 1.10. Kiểm tra tồn kho...");
      const stockErrors = [];
      currentOrder.items.forEach((item) => {
        console.log("🔍 1.11. Kiểm tra item:", item);
        const product = products.find((p) => p.id === item.productId);
        console.log("🔍 1.12. Tìm thấy product:", product);
        if (product && (product.soLuong || 0) < item.quantity) {
          stockErrors.push(
            `${product.tenSanPham}: Chỉ còn ${product.soLuong || 0} trong kho`
          );
        }
      });

      if (stockErrors.length > 0) {
        console.log("🔍 1.13. ❌ Lỗi tồn kho:", stockErrors);
        showToast(
          `Sản phẩm không đủ số lượng: ${stockErrors.join(", ")}`,
          "error"
        );
        return;
      }
      console.log("🔍 1.14. ✅ Tồn kho hợp lệ");

      console.log("🔍 2. Thông tin thanh toán:");
      console.log("   - Payment method:", paymentMethod);
      console.log("   - Customer paid:", customerPaid);
      console.log("   - Final total:", finalTotal);
      console.log("   - Selected customer:", selectedCustomer);
      console.log("   - Selected voucher:", selectedVoucher);

      const orderData = {
        items: currentOrder.items,
        customer: selectedCustomer,
        voucher: selectedVoucher,
        paymentMethod: paymentMethod,
        customerPaid: customerPaid,
        totalAmount: finalTotal,
        notes: orderNotes,
        createdAt: new Date().toISOString(),
      };

      console.log("🔍 3. Dữ liệu đơn hàng:", orderData);

      console.log("🔍 4. Bắt đầu gọi API backend...");

      const apiOrderData = {
        maDonHang: `POS-${Date.now()}`,
        khachHangId:
          selectedCustomer?.id === "guest" ? null : selectedCustomer?.id,
        voucherId: selectedVoucher?.id || null,
        phuongThucThanhToan:
          paymentMethod === "cash" ? "TIEN_MAT" : "CHUYEN_KHOAN",
        tongThanhToan: finalTotal,
        ghiChu: orderNotes,
        chiTietDonHang: currentOrder.items.map((item) => ({
          chiTietSanPhamId: item.productId,
          soLuong: item.quantity,
          giaBan: item.productPrice,
        })),
      };

      console.log("🔍 5. Dữ liệu gửi API:", apiOrderData);

      let response;
      try {
        response = await posService.createPOSOrder(apiOrderData);
        console.log("🔍 6. Kết quả API:", response);
      } catch (error) {
        console.log("🔍 6. ❌ Lỗi API chi tiết:");
        console.log("   - Status:", error.response?.status);
        console.log("   - Status Text:", error.response?.statusText);
        console.log("   - Response Data:", error.response?.data);
        console.log("   - Error Message:", error.message);
        throw error;
      }

      let completedOrder;
      if (response && response.success) {
        console.log("✅ Đơn hàng tạo thành công với ID:", response.donHangId);
        completedOrder = {
          ...orderData,
          id: response.donHangId,
          status: "completed",
          backendId: response.donHangId,
        };
      } else {
        console.log("❌ API thất bại, tạo đơn hàng local");
        completedOrder = {
          ...orderData,
          id: Date.now(),
          status: "completed",
        };
      }

      const updatedProducts = products.map((product) => {
        const orderItem = currentOrder.items.find(
          (item) => item.productId === product.id
        );
        if (orderItem) {
          const newSoLuong = Math.max(
            0,
            (product.soLuong || 0) - orderItem.quantity
          );
          const newSoLuongTon = Math.max(
            0,
            (product.soLuongTon || 0) - orderItem.quantity
          );

          return {
            ...product,
            soLuong: newSoLuong,
            soLuongTon: newSoLuongTon,
          };
        }
        return product;
      });

      setProducts(updatedProducts);
      const updatedGroupedProducts = groupProductsByName(updatedProducts);
      setGroupedProducts(updatedGroupedProducts);

      const savedOrders = JSON.parse(
        localStorage.getItem("pos_completed_orders") || "[]"
      );
      const updatedCompletedOrders = [completedOrder, ...savedOrders];
      localStorage.setItem(
        "pos_completed_orders",
        JSON.stringify(updatedCompletedOrders)
      );

      setOrderHistory((prev) => [completedOrder, ...prev]);

      const newOrderId = Date.now() + 1;
      const newOrder = {
        id: newOrderId,
        items: [],
        customer: null,
        voucher: null,
        paymentMethod: "cash",
        customerPaid: 0,
        notes: "",
        status: "pending",
      };

      setOrders((prevOrders) => {
        const filteredOrders = prevOrders.filter(
          (o) => o.id !== currentOrder.id
        );
        return [...filteredOrders, completedOrder, newOrder];
      });

      setActiveOrderId(newOrderId);
      setSelectedCustomer(null);
      setSelectedVoucher(null);
      setCustomerPaid(0);
      setOrderNotes("");

      generateReceipt(completedOrder);

      console.log("🔍 7. Hoàn tất xử lý đơn hàng");
      console.log("🎉 === HOÀN THÀNH XỬ LÝ ĐƠN HÀNG (PosModern) ===");

      showToast("Đơn hàng đã được hoàn tất thành công!", "success");
    } catch (error) {
      console.error("❌ Lỗi khi hoàn tất đơn hàng:", error);
      console.log("🔍 4. ❌ Lỗi exception:", error.message);
      showToast("Lỗi khi hoàn tất đơn hàng: " + error.message, "error");
    }
  };

  // Search and filter grouped products
  const filteredGroupedProducts = useMemo(() => {
    return groupedProducts.filter((productGroup) => {
      const matchesSearch = productGroup.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || productGroup.category === filterCategory;
      const hasStock = !showStock || productGroup.totalStock > 0;
      const hasActiveVariants = productGroup.hasActiveVariants;

      return matchesSearch && matchesCategory && hasStock && hasActiveVariants;
    });
  }, [groupedProducts, searchTerm, filterCategory, showStock]);

  const sortedGroupedProducts = useMemo(() => {
    return [...filteredGroupedProducts].sort((a, b) => {
      switch (sortBy) {
        case "price":
          return a.minPrice - b.minPrice;
        case "stock":
          return b.totalStock - a.totalStock;
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [filteredGroupedProducts, sortBy]);

  // Render functions
  const renderProductCard = (productGroup) => {
    const stockQuantity = productGroup.totalStock;
    const price = productGroup.minPrice;
    const importPrice = productGroup.variants[0]?.importPrice || 0;
    const variantCount = productGroup.variants.length;

    return (
      <div
        key={productGroup.name}
        className="product-card"
        onClick={() => handleProductClick(productGroup)}
      >
        <div className="product-image-container">
          <ProductImage
            product={productGroup}
            alt={productGroup.name}
            className="product-image"
          />
          {stockQuantity <= 0 && (
            <div className="out-of-stock-badge">Hết hàng</div>
          )}
          {stockQuantity <= 5 && stockQuantity > 0 && (
            <div className="low-stock-badge">Sắp hết</div>
          )}
          {variantCount > 1 && (
            <div className="variant-count-badge">{variantCount} biến thể</div>
          )}
        </div>
        <div className="product-info">
          <div className="product-header">
            <h4 className="product-name">
              {productGroup.name || "Tên sản phẩm"}
            </h4>
            {productGroup.code && (
              <span className="product-code">#{productGroup.code}</span>
            )}
          </div>

          <div className="product-pricing">
            <div className="product-price">
              {productGroup.minPrice === productGroup.maxPrice
                ? formatCurrency(productGroup.minPrice)
                : `${formatCurrency(productGroup.minPrice)} - ${formatCurrency(
                    productGroup.maxPrice
                  )}`}
            </div>
            {importPrice > 0 && (
              <div className="product-import-price">
                Giá nhập: {formatCurrency(importPrice)}
              </div>
            )}
          </div>

          <div className="product-stock">Tồn kho: {stockQuantity} sản phẩm</div>

          {productGroup.description && (
            <div className="product-description">
              {productGroup.description.length > 50
                ? `${productGroup.description.substring(0, 50)}...`
                : productGroup.description}
            </div>
          )}

          <div className="product-variants">
            <span className="variant-tag info">
              {variantCount} biến thể có sẵn
            </span>
          </div>

          <div className="product-meta">
            <span className="meta-item">
              <small>Click để chọn biến thể</small>
            </span>
          </div>
        </div>
      </div>
    );
  };

  const renderProductList = (productGroup) => {
    const stockQuantity = productGroup.totalStock;
    const price = productGroup.minPrice;
    const importPrice = productGroup.variants[0]?.importPrice || 0;
    const variantCount = productGroup.variants.length;

    return (
      <div
        key={productGroup.name}
        className="product-list-item"
        onClick={() => handleProductClick(productGroup)}
      >
        <div className="product-list-image">
          <ProductImage
            product={productGroup}
            alt={productGroup.name}
            className="product-image"
          />
          {variantCount > 1 && (
            <div className="variant-count-badge">{variantCount} biến thể</div>
          )}
        </div>
        <div className="product-list-info">
          <div className="product-list-header">
            <h4 className="product-name">
              {productGroup.name || "Tên sản phẩm"}
            </h4>
            {productGroup.code && (
              <span className="product-code">#{productGroup.code}</span>
            )}
          </div>

          {productGroup.description && (
            <div className="product-description">
              {productGroup.description.length > 80
                ? `${productGroup.description.substring(0, 80)}...`
                : productGroup.description}
            </div>
          )}

          <div className="product-details">
            <div className="pricing-info">
              <span className="product-price">
                {productGroup.minPrice === productGroup.maxPrice
                  ? formatCurrency(productGroup.minPrice)
                  : `${formatCurrency(
                      productGroup.minPrice
                    )} - ${formatCurrency(productGroup.maxPrice)}`}
              </span>
              {importPrice > 0 && (
                <span className="product-import-price">
                  Nhập: {formatCurrency(importPrice)}
                </span>
              )}
            </div>
            <div className="stock-info">
              <span className="product-stock">Tồn: {stockQuantity}</span>
              <span className="variant-info">{variantCount} biến thể</span>
            </div>
          </div>

          <div className="product-meta">
            <small>Click để chọn biến thể</small>
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

  // Initialize component
  useEffect(() => {
    if (!isInitialized) {
      initializeData();
      setIsInitialized(true);
    }
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);

    return () => clearInterval(timer);
  }, [isInitialized]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "s") {
        e.preventDefault();
        const currentOrder = getCurrentOrder();
        if (currentOrder.items && currentOrder.items.length > 0) {
          saveOrder({
            ...currentOrder,
            customer: selectedCustomer,
            voucher: selectedVoucher,
            paymentMethod: paymentMethod,
            customerPaid: customerPaid,
            notes: orderNotes,
          });
        } else {
          showToast("Không có sản phẩm để lưu", "error");
        }
      }

      if (e.ctrlKey && e.key === "p") {
        e.preventDefault();
        if (currentReceipt) {
          printReceipt();
        } else {
          showToast("Không có hóa đơn để in", "error");
        }
      }

      if (e.key === "F11") {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      }

      if (e.key === "Escape") {
        setShowCustomerModal(false);
        setShowVoucherModal(false);
        setShowQRModal(false);
        setShowVariantModal(false);
        setShowDeleteConfirmModal(false);
        setShowOrderHistory(false);
        setShowSettings(false);
        setShowHelp(false);
        setShowReceipt(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [
    isFullscreen,
    currentReceipt,
    getCurrentOrder,
    saveOrder,
    selectedCustomer,
    selectedVoucher,
    paymentMethod,
    customerPaid,
    orderNotes,
    showToast,
    printReceipt,
  ]);

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
                <span>{groupedProducts.length} Sản phẩm</span>
              </div>
              <div className="stat-item">
                <FaUsers />
                <span>{customers.length} Khách hàng</span>
              </div>
              <div className="stat-item">
                <FaChartLine />
                <span>{orders.length} Đơn hàng</span>
              </div>
              <div className="stat-item">
                <FaShoppingCart />
                <span>{getCurrentOrder().items?.length || 0} Trong giỏ</span>
              </div>
              <div className="stat-item">
                <FaMoneyBillWave />
                <span>{formatCurrency(getCartTotal())}</span>
              </div>
            </div>
            <div className="header-actions">
              <button
                className="header-btn"
                onClick={() => setShowOrderHistory(true)}
                title="Lịch sử đơn hàng"
              >
                <FaReceipt />
              </button>
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
              <button
                className="header-btn"
                onClick={() => setShowSettings(true)}
                title="Cài đặt"
              >
                <FaCog />
              </button>
              <button
                className="header-btn"
                onClick={() => setShowHelp(true)}
                title="Trợ giúp"
              >
                <FaBell />
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

              <div className="barcode-input-wrapper">
                <FaBarcode className="barcode-icon" />
                <input
                  type="text"
                  placeholder="Quét mã vạch..."
                  value={barcodeInput}
                  onChange={(e) => setBarcodeInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      handleBarcodeScan(barcodeInput);
                      setBarcodeInput("");
                    }
                  }}
                  className="barcode-input"
                />
                <button
                  className="scan-btn"
                  onClick={() => {
                    handleBarcodeScan(barcodeInput);
                    setBarcodeInput("");
                  }}
                >
                  <FaSearch />
                </button>
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
            ) : sortedGroupedProducts.length === 0 ? (
              <div className="empty-container">
                <FaBox />
                <p>Không tìm thấy sản phẩm nào</p>
              </div>
            ) : (
              <div className={`products-container ${viewMode}`}>
                {viewMode === "grid"
                  ? sortedGroupedProducts.map(renderProductCard)
                  : sortedGroupedProducts.map(renderProductList)}
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
                <div className="order-header-actions">
                  <button
                    className="new-order-btn"
                    onClick={() => {
                      const newOrderId = Date.now();
                      const newOrder = {
                        id: newOrderId,
                        items: [],
                        customer: null,
                        voucher: null,
                        paymentMethod: "cash",
                        customerPaid: 0,
                        notes: "",
                        status: "pending",
                      };
                      setActiveOrderId(newOrderId);
                      setOrders([...orders, newOrder]);
                    }}
                  >
                    <FaPlus />
                    Đơn mới
                  </button>
                </div>
              </div>

              <div className="order-tabs-list">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className={`order-tab ${
                      activeOrderId === order.id ? "active" : ""
                    } ${order.status === "completed" ? "completed" : ""}`}
                    onClick={() => setActiveOrderId(order.id)}
                  >
                    <span>
                      {order.status === "completed" ? "✅ Hoàn thành" : "Đơn"} #
                      {order.id}
                    </span>
                    <span className="order-item-count">
                      {order.items?.length || 0}
                    </span>
                    {order.status !== "completed" && (
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
                    )}
                  </div>
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
              <div className="cart-header-actions">
                <span className="cart-item-count">
                  {getCurrentOrder().items?.length || 0} sản phẩm
                </span>
                {getCurrentOrder().items?.length > 0 && (
                  <button
                    className="clear-cart-btn"
                    onClick={() => {
                      const currentOrder = getCurrentOrder();
                      if (currentOrder.id) {
                        setOrders(
                          orders.map((order) =>
                            order.id === currentOrder.id
                              ? { ...order, items: [] }
                              : order
                          )
                        );
                        showToast(
                          "Đã xóa tất cả sản phẩm trong giỏ hàng",
                          "info"
                        );
                      }
                    }}
                    title="Xóa giỏ hàng"
                  >
                    <FaTrash />
                  </button>
                )}
              </div>
            </div>

            <div className="cart-items">
              {getCurrentOrder().status === "completed" ? (
                <div className="completed-order-notice">
                  <FaCheck />
                  <p>Đơn hàng đã hoàn thành</p>
                  <span>Không thể chỉnh sửa đơn hàng đã hoàn thành</span>
                </div>
              ) : getCurrentOrder().items?.length === 0 ? (
                <div className="empty-cart">
                  <FaShoppingCart />
                  <p>Giỏ hàng trống</p>
                  <span>Chọn sản phẩm để thêm vào giỏ hàng</span>
                </div>
              ) : (
                getCurrentOrder().items?.map((item) => {
                  return (
                    <div key={item.productId} className="cart-item">
                      <div className="cart-item-image">
                        <ProductImage
                          product={{
                            hinhAnh: item.productImage,
                            tenSanPham: item.productName,
                          }}
                          alt={item.productName}
                          className="product-image"
                        />
                      </div>
                      <div className="cart-item-content">
                        <div className="cart-item-header">
                          <div className="cart-item-title">
                            <h4 className="cart-item-name">
                              {item.productName}
                            </h4>
                            {item.productCode && (
                              <span className="cart-item-code">
                                #{item.productCode}
                              </span>
                            )}
                          </div>
                          {getCurrentOrder().status !== "completed" && (
                            <button
                              className="remove-item-btn"
                              onClick={() => removeItemFromCart(item.productId)}
                            >
                              <FaTimes />
                            </button>
                          )}
                        </div>

                        {item.productDetails && (
                          <div className="cart-item-details">
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

                            {item.productDetails.moTa && (
                              <div className="cart-item-description">
                                {item.productDetails.moTa.length > 60
                                  ? `${item.productDetails.moTa.substring(
                                      0,
                                      60
                                    )}...`
                                  : item.productDetails.moTa}
                              </div>
                            )}

                            {item.productDetails.importPrice && (
                              <div className="cart-item-import-price">
                                Giá nhập:{" "}
                                {formatCurrency(
                                  item.productDetails.importPrice
                                )}
                              </div>
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
                              disabled={
                                item.quantity <= 1 ||
                                getCurrentOrder().status === "completed"
                              }
                            >
                              <FaMinus />
                            </button>
                            <input
                              type="number"
                              className="quantity-input"
                              value={item.quantity}
                              onChange={(e) => {
                                if (getCurrentOrder().status === "completed")
                                  return;
                                const newQuantity =
                                  parseInt(e.target.value) || 1;
                                const product = products.find(
                                  (p) => p.id === item.productId
                                );
                                const maxStock = product
                                  ? product.soLuong || 0
                                  : 999;

                                if (newQuantity > maxStock) {
                                  showToast(
                                    `Chỉ còn ${maxStock} sản phẩm trong kho`,
                                    "warning"
                                  );
                                  updateItemQuantity(item.productId, maxStock);
                                } else {
                                  updateItemQuantity(
                                    item.productId,
                                    newQuantity
                                  );
                                }
                              }}
                              min="1"
                              max={(() => {
                                const product = products.find(
                                  (p) => p.id === item.productId
                                );
                                return product ? product.soLuong || 999 : 999;
                              })()}
                              disabled={
                                getCurrentOrder().status === "completed"
                              }
                            />
                            <button
                              className="quantity-btn"
                              onClick={() => {
                                if (getCurrentOrder().status === "completed")
                                  return;
                                const product = products.find(
                                  (p) => p.id === item.productId
                                );
                                const maxStock = product
                                  ? product.soLuong || 0
                                  : 999;

                                if (item.quantity >= maxStock) {
                                  showToast(
                                    `Chỉ còn ${maxStock} sản phẩm trong kho`,
                                    "warning"
                                  );
                                } else {
                                  updateItemQuantity(
                                    item.productId,
                                    item.quantity + 1
                                  );
                                }
                              }}
                              disabled={(() => {
                                const product = products.find(
                                  (p) => p.id === item.productId
                                );
                                return product
                                  ? item.quantity >= (product.soLuong || 0) ||
                                      getCurrentOrder().status === "completed"
                                  : getCurrentOrder().status === "completed";
                              })()}
                            >
                              <FaPlus />
                            </button>
                          </div>
                          <div className="cart-item-price">
                            {formatCurrency(item.productPrice * item.quantity)}
                          </div>
                          <div className="cart-item-stock">
                            <small>
                              Còn:{" "}
                              {(() => {
                                const product = products.find(
                                  (p) => p.id === item.productId
                                );
                                return product ? product.soLuong || 0 : "N/A";
                              })()}{" "}
                              trong kho
                            </small>
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
                <div className="customer-actions">
                  <button
                    className="select-btn"
                    onClick={() => setShowCustomerModal(true)}
                    disabled={getCurrentOrder().status === "completed"}
                  >
                    {selectedCustomer ? "Thay đổi" : "Chọn khách hàng"}
                  </button>
                  {selectedCustomer &&
                    getCurrentOrder().status !== "completed" && (
                      <button
                        className="remove-customer-btn"
                        onClick={() => setSelectedCustomer(null)}
                        title="Xóa khách hàng"
                      >
                        <FaTimes />
                      </button>
                    )}
                </div>
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
                <div className="voucher-actions">
                  <button
                    className="select-btn"
                    onClick={() => setShowVoucherModal(true)}
                    disabled={getCurrentOrder().status === "completed"}
                  >
                    {selectedVoucher ? "Thay đổi" : "Chọn voucher"}
                  </button>
                  {selectedVoucher &&
                    getCurrentOrder().status !== "completed" && (
                      <button
                        className="remove-voucher-btn"
                        onClick={() => {
                          setSelectedVoucher(null);
                          const currentOrder = getCurrentOrder();
                          if (currentOrder.id) {
                            const updatedOrder = {
                              ...currentOrder,
                              voucher: null,
                            };
                            setOrders(
                              orders.map((order) =>
                                order.id === currentOrder.id
                                  ? updatedOrder
                                  : order
                              )
                            );
                          }
                        }}
                        title="Xóa voucher"
                      >
                        <FaTimes />
                      </button>
                    )}
                </div>
              </div>
              {selectedVoucher && (
                <div className="selected-voucher">
                  <div className="voucher-info">
                    <strong>{selectedVoucher.maVoucher}</strong>
                    <span>
                      {selectedVoucher.loaiGiamGia === "PHAN_TRAM"
                        ? `Giảm ${selectedVoucher.giaTriGiam}%`
                        : `Giảm ${formatCurrency(selectedVoucher.giaTriGiam)}`}
                    </span>
                    {selectedVoucher.giaTriToiThieu && (
                      <small>
                        Đơn tối thiểu:{" "}
                        {formatCurrency(
                          parseFloat(selectedVoucher.giaTriToiThieu) || 0
                        )}
                      </small>
                    )}
                    {selectedVoucher.giamToiDa &&
                      selectedVoucher.loaiGiamGia === "PHAN_TRAM" && (
                        <small>
                          Giảm tối đa:{" "}
                          {formatCurrency(
                            parseFloat(selectedVoucher.giamToiDa) || 0
                          )}
                        </small>
                      )}
                  </div>
                  {getVoucherValidationMessage() && (
                    <div className="voucher-validation-message">
                      <FaExclamationTriangle />
                      {getVoucherValidationMessage()}
                    </div>
                  )}
                  {isVoucherApplicable() && getVoucherDiscount() > 0 && (
                    <div className="voucher-applied-message">
                      <FaCheck />
                      Voucher đã được áp dụng thành công!
                    </div>
                  )}
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
              {isVoucherApplicable() && getVoucherDiscount() > 0 && (
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
                    disabled={getCurrentOrder().status === "completed"}
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
                    disabled={getCurrentOrder().status === "completed"}
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
                      disabled={getCurrentOrder().status === "completed"}
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
                  <div className="transfer-info">
                    <p>
                      Tổng tiền cần thanh toán:{" "}
                      <strong>{formatCurrency(getFinalTotal())}</strong>
                    </p>
                    <p>Ngân hàng: MBBank</p>
                    <p>Số tài khoản: 0567846199999</p>
                    <p>Chủ tài khoản: DANG LAM HUNG</p>
                  </div>
                  <button
                    className="qr-generate-btn"
                    onClick={handleGenerateQR}
                    disabled={qrLoading || getFinalTotal() <= 0}
                  >
                    {qrLoading ? (
                      <div className="loading-spinner small"></div>
                    ) : (
                      <FaQrcode />
                    )}
                    Tạo mã QR thanh toán
                  </button>
                  <div className="transfer-note">
                    <small>
                      Quét mã QR để thanh toán hoặc chuyển khoản trực tiếp
                    </small>
                  </div>
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
                disabled={getCurrentOrder().status === "completed"}
              />
            </div>
          </div>

          {/* Checkout Actions */}
          <div className="checkout-actions">
            <button
              className="checkout-btn primary"
              disabled={
                getCurrentOrder().items?.length === 0 ||
                getCurrentOrder().status === "completed"
              }
              onClick={completeOrder}
            >
              <FaCheck />
              {getCurrentOrder().status === "completed"
                ? "Đã Hoàn Thành"
                : "Hoàn Tất Đơn Hàng"}
            </button>
            <button
              className="checkout-btn secondary"
              disabled={
                getCurrentOrder().items?.length === 0 ||
                getCurrentOrder().status === "completed"
              }
              onClick={() => {
                const currentOrder = getCurrentOrder();
                if (currentOrder.items && currentOrder.items.length > 0) {
                  saveOrder({
                    ...currentOrder,
                    customer: selectedCustomer,
                    voucher: selectedVoucher,
                    paymentMethod: paymentMethod,
                    customerPaid: customerPaid,
                    notes: orderNotes,
                  });
                } else {
                  showToast("Không có sản phẩm để lưu", "error");
                }
              }}
            >
              <FaSave />
              Lưu Đơn Hàng
            </button>
            <button
              className="checkout-btn secondary"
              disabled={getCurrentOrder().items?.length === 0}
              onClick={() => generateReceipt(getCurrentOrder())}
            >
              <FaPrint />
              Xem Hóa Đơn
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
                <div
                  className="customer-item guest-customer"
                  onClick={() => {
                    setSelectedCustomer({
                      id: "guest",
                      hoTen: "Khách lẻ",
                      soDienThoai: "N/A",
                      email: "N/A",
                      maKhachHang: "GUEST",
                    });
                    setShowCustomerModal(false);
                  }}
                >
                  <div className="customer-avatar guest">
                    <FaUser />
                  </div>
                  <div className="customer-details">
                    <h4>Khách lẻ</h4>
                    <p>Khách hàng không đăng ký</p>
                    <p>Không có thông tin liên hệ</p>
                  </div>
                </div>

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
                {vouchers.map((voucher) => {
                  const minOrderAmount =
                    parseFloat(voucher.giaTriToiThieu) || 0;
                  const cartTotal = getCartTotal();
                  const isApplicable =
                    minOrderAmount === 0 || cartTotal >= minOrderAmount;

                  return (
                    <div
                      key={voucher.id}
                      className={`voucher-item ${
                        !isApplicable ? "disabled" : ""
                      }`}
                      onClick={() => {
                        setSelectedVoucher(voucher);
                        setShowVoucherModal(false);

                        const currentOrder = getCurrentOrder();
                        if (currentOrder.id) {
                          const updatedOrder = {
                            ...currentOrder,
                            voucher: voucher,
                          };
                          setOrders(
                            orders.map((order) =>
                              order.id === currentOrder.id
                                ? updatedOrder
                                : order
                            )
                          );
                        }
                      }}
                    >
                      <div className="voucher-code">{voucher.maVoucher}</div>
                      <div className="voucher-details">
                        <h4>
                          {voucher.loaiGiamGia === "PHAN_TRAM"
                            ? `Giảm ${voucher.giaTriGiam}%`
                            : `Giảm ${formatCurrency(voucher.giaTriGiam)}`}
                        </h4>
                        <p>
                          Đơn tối thiểu:{" "}
                          {formatCurrency(
                            parseFloat(voucher.giaTriToiThieu) || 0
                          )}
                        </p>
                        {voucher.giamToiDa &&
                          voucher.loaiGiamGia === "PHAN_TRAM" && (
                            <p>
                              Giảm tối đa:{" "}
                              {formatCurrency(
                                parseFloat(voucher.giamToiDa) || 0
                              )}
                            </p>
                          )}
                        {voucher.moTa && (
                          <p className="voucher-description">{voucher.moTa}</p>
                        )}
                        {!isApplicable && (
                          <p className="voucher-not-applicable">
                            Cần thêm{" "}
                            {formatCurrency(minOrderAmount - cartTotal)} để áp
                            dụng
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
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
                {qrLoading ? (
                  <div className="loading-spinner">Đang tạo QR...</div>
                ) : qrData ? (
                  <>
                    <img
                      src={qrData}
                      alt="QR Code Thanh Toán"
                      style={{
                        width: "400px",
                        height: "400px",
                        maxWidth: "100%",
                      }}
                    />
                    <p>
                      Số tiền:{" "}
                      <strong>{formatCurrency(getFinalTotal())}</strong>
                    </p>
                    <p>Quét mã QR để thanh toán</p>
                    <div className="bank-info">
                      <h4>Thông Tin Chuyển Khoản</h4>
                      <p>
                        <strong>Ngân hàng:</strong> MBBank
                      </p>
                      <p>
                        <strong>Số tài khoản:</strong> 0567846199999
                      </p>
                      <p>
                        <strong>Chủ tài khoản:</strong> DANG LAM HUNG
                      </p>
                      <p>
                        <strong>Nội dung:</strong>{" "}
                        {orderNotes ||
                          `Thanh toan don hang ${getCurrentOrder().id}`}
                      </p>
                    </div>
                  </>
                ) : (
                  <p className="error-message">
                    Không thể tạo mã QR. Vui lòng thử lại.
                  </p>
                )}
              </div>
              <div className="modal-actions">
                <button className="btn-primary" onClick={handleGenerateQR}>
                  <FaSync /> Tạo lại QR
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowQRModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product Variants Modal */}
      {showVariantModal && selectedProductForVariants && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Chọn Biến Thể - {selectedProductForVariants.name}</h3>
              <button
                onClick={() => {
                  setShowVariantModal(false);
                  setSelectedProductForVariants(null);
                }}
              >
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="product-variants-grid">
                {selectedProductForVariants.variants.map((variant) => (
                  <div
                    key={variant.id}
                    className={`variant-card ${
                      variant.stock <= 0 ? "out-of-stock" : ""
                    }`}
                    onClick={() =>
                      variant.stock > 0 && handleVariantSelect(variant)
                    }
                  >
                    <div className="variant-image">
                      <ProductImage
                        product={{
                          hinhAnh: variant.hinhAnh,
                          tenSanPham: selectedProductForVariants.name,
                        }}
                        alt={`${selectedProductForVariants.name} - ${
                          variant.size || ""
                        } ${variant.color || ""}`}
                        className="product-image"
                      />
                      {variant.stock <= 0 && (
                        <div className="out-of-stock-overlay">Hết hàng</div>
                      )}
                    </div>
                    <div className="variant-info">
                      <div className="variant-details">
                        {variant.size && (
                          <span className="variant-tag size">
                            Size: {variant.size}
                          </span>
                        )}
                        {variant.color && (
                          <span className="variant-tag color">
                            Màu: {variant.color}
                          </span>
                        )}
                        {variant.material && (
                          <span className="variant-tag material">
                            Chất liệu: {variant.material}
                          </span>
                        )}
                      </div>
                      <div className="variant-pricing">
                        <div className="variant-price">
                          {formatCurrency(variant.price)}
                        </div>
                        <div className="variant-stock">
                          Tồn: {variant.stock}
                        </div>
                      </div>
                      {variant.stock > 0 && (
                        <button className="select-variant-btn">
                          <FaPlus /> Chọn
                        </button>
                      )}
                    </div>
                  </div>
                ))}
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

      {/* Order History Modal */}
      {showOrderHistory && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>Lịch Sử Đơn Hàng</h3>
              <button onClick={() => setShowOrderHistory(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="order-history-list">
                {orderHistory.length === 0 ? (
                  <div className="empty-container">
                    <FaReceipt />
                    <p>Chưa có đơn hàng nào được hoàn tất</p>
                  </div>
                ) : (
                  orderHistory.map((order) => (
                    <div key={order.id} className="order-history-item">
                      <div className="order-history-header">
                        <h4>Đơn #{order.id}</h4>
                        <span>{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="order-history-details">
                        <p>
                          <strong>Tổng tiền:</strong>{" "}
                          {formatCurrency(order.totalAmount)}
                        </p>
                        {order.customer && (
                          <p>
                            <strong>Khách hàng:</strong>{" "}
                            {order.customer.hoTen || "Khách lẻ"}
                          </p>
                        )}
                        {order.voucher && (
                          <p>
                            <strong>Voucher:</strong> {order.voucher.maVoucher}
                          </p>
                        )}
                        <p>
                          <strong>Phương thức:</strong>{" "}
                          {order.paymentMethod === "cash"
                            ? "Tiền mặt"
                            : "Chuyển khoản"}
                        </p>
                        {order.notes && (
                          <p>
                            <strong>Ghi chú:</strong> {order.notes}
                          </p>
                        )}
                      </div>
                      <div className="order-history-items">
                        {order.items.map((item) => (
                          <div key={item.productId} className="order-item">
                            <span>
                              {item.productName} x{item.quantity}
                            </span>
                            <span>
                              {formatCurrency(
                                item.productPrice * item.quantity
                              )}
                            </span>
                          </div>
                        ))}
                      </div>
                      <button
                        className="view-receipt-btn"
                        onClick={() => generateReceipt(order)}
                      >
                        <FaEye /> Xem hóa đơn
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettings && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Cài Đặt</h3>
              <button onClick={() => setShowSettings(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="settings-section">
                <h4>Giao Diện</h4>
                <div className="setting-item">
                  <label>
                    <input
                      type="checkbox"
                      checked={isFullscreen}
                      onChange={() => setIsFullscreen(!isFullscreen)}
                    />
                    Chế độ toàn màn hình
                  </label>
                </div>
                <div className="setting-item">
                  <label>Chế độ xem sản phẩm:</label>
                  <select
                    value={viewMode}
                    onChange={(e) => setViewMode(e.target.value)}
                  >
                    <option value="grid">Lưới</option>
                    <option value="list">Danh sách</option>
                  </select>
                </div>
              </div>
              <div className="settings-section">
                <h4>Hệ Thống</h4>
                <div className="setting-item">
                  <button
                    className="btn-primary"
                    onClick={() => {
                      localStorage.removeItem("pos_saved_orders");
                      localStorage.removeItem("pos_completed_orders");
                      setOrders([]);
                      setOrderHistory([]);
                      setActiveOrderId(null);
                      showToast("Đã xóa tất cả dữ liệu đơn hàng", "success");
                    }}
                  >
                    Xóa dữ liệu đơn hàng
                  </button>
                </div>
                <div className="setting-item">
                  <button className="btn-primary" onClick={initializeData}>
                    <FaSync /> Làm mới dữ liệu
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help Modal */}
      {showHelp && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Trợ Giúp</h3>
              <button onClick={() => setShowHelp(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="help-section">
                <h4>Phím Tắt</h4>
                <ul>
                  <li>
                    <strong>Ctrl + S:</strong> Lưu đơn hàng
                  </li>
                  <li>
                    <strong>Ctrl + P:</strong> In hóa đơn
                  </li>
                  <li>
                    <strong>F11:</strong> Bật/Tắt chế độ toàn màn hình
                  </li>
                  <li>
                    <strong>Esc:</strong> Đóng các modal
                  </li>
                </ul>
              </div>
              <div className="help-section">
                <h4>Hỗ Trợ</h4>
                <p>Liên hệ: support@pos-system.com</p>
                <p>Hotline: 0123-456-789</p>
                <p>
                  Hướng dẫn sử dụng: <a href="/docs">Tài liệu</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && currentReceipt && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Hóa Đơn #{currentReceipt.id}</h3>
              <button onClick={() => setShowReceipt(false)}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-body">
              <div className="receipt-content">
                <div className="receipt-header">
                  <h2>HÓA ĐƠN BÁN HÀNG</h2>
                  <p>Mã: #{currentReceipt.id}</p>
                  <p>Ngày: {currentReceipt.date}</p>
                  {currentReceipt.customer && (
                    <p>
                      Khách hàng: {currentReceipt.customer.hoTen || "Khách lẻ"}
                    </p>
                  )}
                </div>
                <div className="receipt-items">
                  {currentReceipt.items.map((item) => (
                    <div key={item.productId} className="receipt-item">
                      <span>
                        {item.productName} x{item.quantity}
                      </span>
                      <span>
                        {formatCurrency(item.productPrice * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="receipt-summary">
                  <div className="receipt-row">
                    <span>Tổng tiền hàng:</span>
                    <span>{formatCurrency(currentReceipt.subtotal)}</span>
                  </div>
                  {currentReceipt.discount > 0 && (
                    <div className="receipt-row">
                      <span>Giảm giá:</span>
                      <span>-{formatCurrency(currentReceipt.discount)}</span>
                    </div>
                  )}
                  <div className="receipt-row total">
                    <span>Tổng thanh toán:</span>
                    <span>{formatCurrency(currentReceipt.total)}</span>
                  </div>
                  {currentReceipt.paymentMethod === "cash" && (
                    <>
                      <div className="receipt-row">
                        <span>Khách trả:</span>
                        <span>
                          {formatCurrency(currentReceipt.customerPaid)}
                        </span>
                      </div>
                      <div className="receipt-row">
                        <span>Tiền thối:</span>
                        <span>{formatCurrency(currentReceipt.change)}</span>
                      </div>
                    </>
                  )}
                  {currentReceipt.notes && (
                    <div className="receipt-row">
                      <span>Ghi chú:</span>
                      <span>{currentReceipt.notes}</span>
                    </div>
                  )}
                </div>
                <div className="receipt-footer">
                  <p>Cảm ơn quý khách!</p>
                </div>
              </div>
              <div className="modal-actions">
                <button className="btn-primary" onClick={printReceipt}>
                  <FaPrint /> In hóa đơn
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setShowReceipt(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PosModern;
