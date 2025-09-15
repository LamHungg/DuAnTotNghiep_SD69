import React, { useState, useEffect } from "react";
import axios from "axios"; // Đảm bảo đã cài đặt axios (npm install axios)
import { QRCodeCanvas } from "qrcode.react"; // <--- THAY ĐỔI DÒNG NÀY ĐỂ SỬ DỤNG COMPONENT QRCODECANVAS

function Pos() {
  // --- State declarations ---
  const [activeOrder, setActiveOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [showLimit, setShowLimit] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productQty, setProductQty] = useState(1);
  const [qtyError, setQtyError] = useState("");
  const [showProductModal, setShowProductModal] = useState(false);

  // Voucher states
  const [voucherCode, setVoucherCode] = useState("");
  const [voucherApplied, setVoucherApplied] = useState(null);

  // Payment states
  const [customerPaid, setCustomerPaid] = useState(0);
  const [isDelivery, setIsDelivery] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrData, setQRData] = useState(null); // qrData sẽ chứa chuỗi QRCPS
  const [qrLoading, setQrLoading] = useState(false);
  const [qrError, setQrError] = useState(null);

  const [paymentAmount, setPaymentAmount] = useState(0); // Có thể bỏ nếu chỉ dùng customerPaid
  const [paymentMethod, setPaymentMethod] = useState("cash");

  // Confirmation and Toast states
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Customer states
  const [customerModal, setCustomerModal] = useState(false);

  // Không còn demo data - chỉ sử dụng dữ liệu thực tế từ backend

  // Không còn demo data - chỉ sử dụng dữ liệu thực tế từ backend

  // --- Helper Functions ---

  // Hàm format tiền tệ
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN").format(amount) + " đ";
  };

  // Hàm tính toán tổng tiền, giảm giá, tiền thừa cho đơn hàng
  const calculateOrderTotals = (order, appliedVoucher) => {
    const subTotal = order.cart.reduce(
      (sum, item) => sum + item.product.price * item.qty,
      0
    );
    let discountAmount = 0;
    if (appliedVoucher && subTotal >= appliedVoucher.min) {
      discountAmount = Math.min(
        subTotal * appliedVoucher.discount,
        appliedVoucher.value
      );
    }
    const totalAmount = subTotal - discountAmount + (order.shippingFee || 0);
    const change = order.customerPaid ? order.customerPaid - totalAmount : 0;

    return {
      subTotal,
      discountAmount,
      totalAmount,
      change: change > 0 ? change : 0,
    };
  };

  // --- Event Handlers ---

  // Tạo mới đơn hàng
  const handleCreateOrder = () => {
    if (orders.length >= 5) {
      setShowLimit(true);
      setTimeout(() => setShowLimit(false), 2000);
      return;
    }
    const newOrder = {
      id: Date.now().toString(),
      cart: [],
      customer: null,
      customerPaid: 0,
      paymentMethod: "cash",
      isDelivery: false,
      invoiceNumber: `HD-${Date.now().toString().slice(-8)}`,
      shippingFee: 0,
      notes: "",
      paymentStatus: "Chờ thanh toán",
    };
    setOrders((prev) => [...prev, newOrder]);
    setActiveOrder(newOrder.id);
  };

  // Hàm áp dụng voucher
  const handleApplyVoucher = () => {
    // Không còn demo data - chỉ sử dụng dữ liệu thực tế từ backend
    setVoucherApplied(null);
  };

  // Hàm xử lý hiển thị QR code
  const handleShowQR = (orderTotalAmount) => {
    if (paymentMethod === "bank" && orderTotalAmount > 0) {
      handleGenerateVietQR(orderTotalAmount);
    } else {
      alert(
        "Vui lòng chọn phương thức chuyển khoản và nhập số tiền lớn hơn 0 để tạo QR."
      );
    }
  };

  // Hàm gọi API lấy mã QR thanh toán với số tiền
  const handleGenerateVietQR = async (amount) => {
    if (!activeOrder || amount <= 0) {
      setQrError("Số tiền thanh toán không hợp lệ.");
      return;
    }
    setQrLoading(true);
    setQrError(null);
    setQRData(null); // Xóa dữ liệu QR cũ

    try {
      const currentOrder = orders.find((o) => o.id === activeOrder);
      if (!currentOrder) {
        throw new Error("Không tìm thấy đơn hàng đang hoạt động.");
      }

      const params = new URLSearchParams();
      params.append("amount", amount);
      params.append("orderCode", currentOrder.invoiceNumber || activeOrder);
      params.append(
        "description",
        `Thanh toán đơn hàng #${currentOrder.invoiceNumber || activeOrder}`
      );

      // SỬ DỤNG URL TUYỆT ĐỐI ĐỂ ĐẢM BẢO REQUEST ĐI ĐÚNG NƠI
      const BACKEND_BASE_URL = "http://localhost:8080";
      const PAYMENT_ENDPOINT = "/payment/create-vietqr-payment";

      const res = await fetch(`${BACKEND_BASE_URL}${PAYMENT_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: params.toString(),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Lỗi từ API backend: ${res.status} - ${errorText}`);
      }

      const qrContent = await res.text(); // Backend trả về chuỗi QRCPS

      console.log("QR Content received in frontend (QRCPS):", qrContent); // In ra console để kiểm tra

      // Vì backend trả về chuỗi QRCPS, chúng ta sẽ lưu chuỗi này và dùng thư viện qrcode.react để tạo hình ảnh
      if (qrContent && qrContent.length > 0) {
        setQRData(qrContent);
      } else {
        throw new Error("Không nhận được dữ liệu QR hợp lệ từ backend.");
      }
      setShowQRModal(true);
    } catch (err) {
      console.error("Error generating QR:", err);
      setQrError(`Không thể tạo mã QR: ${err.message}`);
    } finally {
      setQrLoading(false);
    }
  };

  // Hàm cập nhật số tiền khách trả
  const handleCustomerPaidChange = (e) => {
    setCustomerPaid(Number(e.target.value));
    setOrders((prev) =>
      prev.map((order) =>
        order.id === activeOrder
          ? { ...order, customerPaid: Number(e.target.value) }
          : order
      )
    );
  };

  // Thay đổi số lượng sản phẩm
  const handleQtyChange = (e) => {
    let val = Number(e.target.value);
    if (!val || val < 1) val = 1;
    if (selectedProduct && val > selectedProduct.stock)
      val = selectedProduct.stock;
    setProductQty(val);
    setQtyError("");
  };

  // Hàm chọn sản phẩm
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setProductQty(1);
    setQtyError("");
    setShowProductModal(true);
  };

  // Đóng modal chi tiết sản phẩm
  const handleCloseProductDetail = () => {
    setSelectedProduct(null);
    setProductQty(1);
    setQtyError("");
    setShowProductModal(false);
  };

  // Thêm sản phẩm vào giỏ hàng
  const handleAddToCart = () => {
    if (!selectedProduct) return;
    if (productQty < 1 || productQty > selectedProduct.stock) {
      setQtyError("Số lượng không hợp lệ!");
      return;
    }
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== activeOrder) return order;
        const existIdx = order.cart.findIndex(
          (item) => item.product.id === selectedProduct.id
        );
        if (existIdx !== -1) {
          const newCart = [...order.cart];
          newCart[existIdx].qty = Math.min(
            newCart[existIdx].qty + productQty,
            selectedProduct.stock
          );
          return { ...order, cart: newCart };
        }
        return {
          ...order,
          cart: [...order.cart, { product: selectedProduct, qty: productQty }],
        };
      })
    );
    handleCloseProductDetail();
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveCartItem = (productId) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== activeOrder) return order;
        return {
          ...order,
          cart: order.cart.filter((item) => item.product.id !== productId),
        };
      })
    );
  };

  // Chọn khách hàng cho đơn hàng
  const handleChooseCustomer = (customer) => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id !== activeOrder) return order;
        return { ...order, customer };
      })
    );
    setCustomerModal(false);
  };

  // --- Invoice PDF Generation ---
  const handleGenerateInvoicePdf = async () => {
    if (!activeOrder) {
      alert("Vui lòng chọn hoặc tạo một đơn hàng để xuất hóa đơn.");
      return;
    }

    const currentOrder = orders.find((order) => order.id === activeOrder);
    if (!currentOrder) {
      alert("Không tìm thấy đơn hàng đang hoạt động.");
      return;
    }

    // Tính toán lại tổng tiền để truyền vào HTML (nếu chưa được tính trong order object)
    const { subTotal, discountAmount, totalAmount } = calculateOrderTotals(
      currentOrder,
      voucherApplied
    );

    const orderForInvoice = {
      ...currentOrder,
      customerName: currentOrder.customer?.name || "Khách lẻ",
      customerAddress: "Chưa có địa chỉ", // Placeholder, bạn có thể thêm input để lấy địa chỉ
      customerPhone: currentOrder.customer?.phone || "Chưa có",
      subTotal: subTotal,
      shippingFee: currentOrder.isDelivery ? 25000 : 0, // Ví dụ phí vận chuyển nếu là giao hàng
      discountAmount: discountAmount,
      totalAmount: totalAmount + (currentOrder.isDelivery ? 25000 : 0), // Cập nhật tổng tiền với phí vận chuyển
      paymentStatus:
        currentOrder.paymentMethod === "bank" &&
        currentOrder.customerPaid >= totalAmount
          ? "Đã thanh toán"
          : "Chưa thanh toán", // Logic trạng thái thanh toán
      notes: currentOrder.notes || "",
    };

    const formattedPrice = (price) =>
      new Intl.NumberFormat("vi-VN").format(price);
    const currentDate = new Date().toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit", // Đã sửa lỗi chính tả `sday` thành `day`
      hour: "2-digit",
      minute: "2-digit",
    });

    const itemsHtml = orderForInvoice.cart
      .map(
        (item, index) => `
            <tr>
                <td style="text-align: center;">${index + 1}</td>
                <td>${item.product.name}</td>
                <td style="text-align: center;">${item.qty}</td>
                <td style="text-align: right;">${formattedPrice(
                  item.product.price
                )} đ</td>
                <td style="text-align: right;">${formattedPrice(
                  item.qty * item.product.price
                )} đ</td>
            </tr>
        `
      )
      .join("");

    const htmlContent = `
            <!DOCTYPE html>
            <html lang="vi">
            <head>
                <meta charset="UTF-8" />
                <title>Hóa Đơn BÁN HÀNG - ZMEN</title>
                <style>
                    body { font-family: 'DejaVu Sans', sans-serif; font-size: 10px; margin: 20px 30px; }
                    .container { width: 100%; max-width: 700px; margin: 0 auto; }
                    .header-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                    .header-section .logo { width: 80px; height: auto; }
                    .header-section .invoice-title { text-align: center; flex-grow: 1; }
                    .header-section .invoice-title h1 { font-size: 18px; margin: 0; text-transform: uppercase; }
                    .shop-info p, .customer-info p { margin: 2px 0; }
                    table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
                    th, td { border: 1px solid #ccc; padding: 6px; text-align: left; vertical-align: top; }
                    th { background-color: #f0f0f0; font-weight: bold; text-align: center; }
                    .text-right { text-align: right; }
                    .text-center { text-align: center; }
                    .total-amount { font-size: 14px; font-weight: bold; text-align: right; margin-top: 15px; }
                    .signature-section { margin-top: 40px; display: flex; justify-content: space-around; text-align: center; }
                    .signature-column { width: 45%; }
                    .signature-title { font-weight: bold; margin-bottom: 50px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header-section">
                        <div class="logo-container">
                            <img src="https://via.placeholder.com/80x80?text=ZMEN_Logo" alt="ZMEN Logo" class="logo"/>
                        </div>
                        <div class="invoice-title">
                            <h1>ZMEN STORE</h1>
                            <p>Hóa đơn bán hàng</p>
                            <p>Số: ${orderForInvoice.invoiceNumber}</p>
                            <p>Ngày: ${currentDate}</p>
                        </div>
                    </div>

                    <div class="shop-info">
                        <p><strong>ZMEN Store</strong></p>
                        <p>Địa chỉ: 123 Đường ABC, Quận XYZ, TP.HCM</p>
                        <p>Điện thoại: 0123456789</p>
                    </div>

                    <div class="customer-info">
                        <h3>Thông tin khách hàng:</h3>
                        <p><strong>Khách hàng:</strong> ${
                          orderForInvoice.customerName
                        }</p>
                        <p><strong>Điện thoại:</strong> ${
                          orderForInvoice.customerPhone
                        }</p>
                        <p><strong>Địa chỉ:</strong> ${
                          orderForInvoice.customerAddress
                        }</p>
                        <p><strong>Ghi chú:</strong> ${
                          orderForInvoice.notes
                        }</p>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th style="width: 5%;">STT</th>
                                <th style="width: 40%;">Nội dung</th>
                                <th style="width: 15%;">Số lượng</th>
                                <th style="width: 20%;">Đơn giá</th>
                                <th style="width: 20%;">Thành tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${itemsHtml}
                        </tbody>
                    </table>

                    <div class="order-summary">
                        <p class="text-right">Tổng tiền hàng: ${formattedPrice(
                          orderForInvoice.subTotal
                        )} đ</p>
                        <p class="text-right">Phí vận chuyển: ${formattedPrice(
                          orderForInvoice.shippingFee
                        )} đ</p>
                        <p class="text-right">Giảm giá: -${formattedPrice(
                          orderForInvoice.discountAmount
                        )} đ</p>
                        <div class="total-amount">
                            <p>Tổng thanh toán: ${formattedPrice(
                              orderForInvoice.totalAmount
                            )} đ</p>
                        </div>
                        <p class="text-right">Trạng thái: ${
                          orderForInvoice.paymentStatus
                        }</p>
                    </div>

                    <div class="signature-section">
                        <div>
                            <p class="signature-title">Người lập hóa đơn</p>
                            <br /><br /><br />
                            <p>____________________</p>
                        </div>
                        <div>
                            <p class="signature-title">Khách hàng</p>
                            <br /><br /><br />
                            <p>____________________</p>
                        </div>
                    </div>
                </div>
            </body>
            </html>
        `;

    try {
      const response = await axios.post(
        "http://localhost:8080/invoices/generate-from-html", // URL của backend Spring Boot
        htmlContent,
        {
          headers: {
            "Content-Type": "text/html",
            Accept: "application/pdf",
          },
          responseType: "blob", // Quan trọng: yêu cầu response dưới dạng Blob để xử lý file
        }
      );

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(pdfBlob);
      window.open(url, "_blank"); // Mở trong tab mới để xem PDF
    } catch (err) {
      console.error("Error generating PDF:", err);
      alert("Có lỗi xảy ra khi tạo hóa đơn PDF. Vui lòng thử lại.");
    }
  };

  // --- Render JSX ---
  const activeOrderObj = orders.find((order) => order.id === activeOrder);
  const orderTotals = activeOrderObj
    ? calculateOrderTotals(activeOrderObj, voucherApplied)
    : {};

  useEffect(() => {
    if (orders.length > 0 && !activeOrder) {
      setActiveOrder(orders[0].id);
    } else if (orders.length === 0) {
      setActiveOrder(null);
    }
  }, [orders, activeOrder]);

  return (
    <>
      <div className="container py-4" style={{ minHeight: "70vh" }}>
        {/* Nút tạo mới đơn hàng */}
        <div className="mb-3 d-flex align-items-center">
          <button
            className="btn btn-primary fw-bold"
            style={{ minWidth: 160 }}
            onClick={handleCreateOrder}
          >
            Tạo mới đơn hàng
          </button>
          {showLimit && (
            <span className="ms-3 text-danger fw-bold">
              Chỉ tạo tối đa 5 đơn hàng cùng lúc!
            </span>
          )}
        </div>

        {/* Tabs đơn hàng */}
        {orders.length > 0 && (
          <div className="mb-4">
            <ul className="nav nav-tabs">
              {orders.map((order) => (
                <li className="nav-item" key={order.id}>
                  <button
                    className={`nav-link ${
                      activeOrder === order.id ? "active" : ""
                    }`}
                    onClick={() => setActiveOrder(order.id)}
                  >
                    Đơn hàng {order.id.substring(order.id.length - 4)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Chi tiết đơn hàng đang hoạt động */}
        {activeOrderObj && (
          <div className="row">
            <div className="col-md-7">
              {/* Phần danh sách sản phẩm trong đơn hàng */}
              <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Giỏ hàng</h5>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => setShowProductModal(true)}
                  >
                    Thêm sản phẩm
                  </button>
                </div>
                <div className="card-body">
                  {activeOrderObj.cart.length === 0 ? (
                    <p className="text-muted text-center mb-0">
                      Giỏ hàng trống
                    </p>
                  ) : (
                    <table className="table table-sm table-bordered align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>SP</th>
                          <th>SL</th>
                          <th>Giá</th>
                          <th>Tổng</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {activeOrderObj.cart.map((item) => (
                          <tr key={item.product.id}>
                            <td>{item.product.name}</td>
                            <td>{item.qty}</td>
                            <td>{formatCurrency(item.product.price)}</td>
                            <td>
                              {formatCurrency(item.product.price * item.qty)}
                            </td>
                            <td>
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() =>
                                  handleRemoveCartItem(item.product.id)
                                }
                              >
                                Xóa
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
              {/* Phần thông tin khách hàng */}
              <div className="card mb-3">
                <div className="card-header d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Thông tin khách hàng</h5>
                  <button
                    className="btn btn-sm btn-info text-white"
                    onClick={() => setCustomerModal(true)}
                  >
                    Chọn khách hàng
                  </button>
                </div>
                <div className="card-body">
                  {activeOrderObj.customer ? (
                    <>
                      <p className="mb-1">
                        <strong>Tên:</strong> {activeOrderObj.customer.name}
                      </p>
                      <p className="mb-1">
                        <strong>SĐT:</strong> {activeOrderObj.customer.phone}
                      </p>
                      <p className="mb-0">
                        <strong>Email:</strong> {activeOrderObj.customer.email}
                      </p>
                    </>
                  ) : (
                    <p className="text-muted mb-0">Chưa có khách hàng</p>
                  )}
                </div>
              </div>
              {/* Phần ghi chú và trạng thái giao hàng */}
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Ghi chú & Giao hàng</h5>
                </div>
                <div className="card-body">
                  <div className="mb-3">
                    <label htmlFor="notes" className="form-label">
                      Ghi chú
                    </label>
                    <textarea
                      className="form-control"
                      id="notes"
                      rows="3"
                      value={activeOrderObj.notes}
                      onChange={(e) =>
                        setOrders((prev) =>
                          prev.map((order) =>
                            order.id === activeOrder
                              ? { ...order, notes: e.target.value }
                              : order
                          )
                        )
                      }
                    ></textarea>
                  </div>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="isDelivery"
                      checked={activeOrderObj.isDelivery}
                      onChange={(e) =>
                        setOrders((prev) =>
                          prev.map((order) =>
                            order.id === activeOrder
                              ? { ...order, isDelivery: e.target.checked }
                              : order
                          )
                        )
                      }
                    />
                    <label className="form-check-label" htmlFor="isDelivery">
                      Giao hàng tận nơi
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-5">
              {/* Phần thanh toán và tổng kết */}
              <div className="card mb-3">
                <div className="card-header">
                  <h5 className="mb-0">Thanh toán</h5>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-2">
                    <span>Tổng tiền hàng:</span>
                    <span className="fw-bold">
                      {formatCurrency(orderTotals.subTotal)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Giảm giá Voucher:</span>
                    <span className="fw-bold text-danger">
                      -{formatCurrency(orderTotals.discountAmount)}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span>Phí vận chuyển:</span>
                    <span className="fw-bold">
                      {formatCurrency(activeOrderObj.shippingFee)}
                    </span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between mb-3">
                    <h4>Tổng cộng:</h4>
                    <h4 className="fw-bold text-primary">
                      {formatCurrency(orderTotals.totalAmount)}
                    </h4>
                  </div>

                  {/* Phương thức thanh toán */}
                  <div className="mb-3">
                    <label className="form-label">Phương thức thanh toán</label>
                    <select
                      className="form-select"
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    >
                      <option value="cash">Tiền mặt</option>
                      <option value="bank">Chuyển khoản</option>
                      {/* Thêm các phương thức khác nếu có */}
                    </select>
                  </div>

                  {/* Số tiền khách trả */}
                  <div className="mb-3">
                    <label className="form-label">Số tiền khách trả</label>
                    <input
                      type="number"
                      className="form-control"
                      value={customerPaid}
                      onChange={handleCustomerPaidChange}
                    />
                  </div>

                  <div className="d-flex justify-content-between mb-2">
                    <span>Tiền thừa:</span>
                    <span className="fw-bold text-success">
                      {formatCurrency(orderTotals.change)}
                    </span>
                  </div>

                  {paymentMethod === "bank" && (
                    <button
                      className="btn btn-info text-white w-100 fw-bold mt-2"
                      onClick={() => handleShowQR(orderTotals.totalAmount)}
                    >
                      Tạo Mã QR Thanh Toán
                    </button>
                  )}

                  <button
                    className="btn btn-primary w-100 fw-bold mt-2"
                    style={{ fontSize: 17 }}
                    onClick={() => setShowConfirmModal(true)}
                  >
                    Xác nhận đơn hàng
                  </button>

                  {/* Nút Xuất Hóa Đơn PDF */}
                  <button
                    className="btn btn-secondary w-100 fw-bold mt-2"
                    onClick={handleGenerateInvoicePdf}
                  >
                    Xuất Hóa Đơn PDF
                  </button>
                </div>
              </div>
              {/* Phần Voucher */}
              <div className="card">
                <div className="card-header">
                  <h5 className="mb-0">Voucher</h5>
                </div>
                <div className="card-body">
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập mã voucher"
                      value={voucherCode}
                      onChange={(e) => setVoucherCode(e.target.value)}
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      onClick={handleApplyVoucher}
                    >
                      Áp dụng
                    </button>
                  </div>
                  {voucherApplied ? (
                    <p className="text-success mb-0">{voucherApplied.desc}</p>
                  ) : (
                    <p className="text-muted mb-0">Chưa áp dụng voucher</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals: Product, Customer, QR, Confirm, Success Toast */}

      {/* Modal QR Code */}
      {showQRModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.18)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowQRModal(false)}
        >
          <div
            className="bg-white p-4"
            style={{
              minWidth: 300,
              borderRadius: 10,
              boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Mã QR Thanh Toán</h5>
              <button
                className="btn-close"
                onClick={() => setShowQRModal(false)}
              />
            </div>
            <div className="text-center">
              {qrLoading ? (
                <p>Đang tạo mã QR...</p>
              ) : qrError ? (
                <p className="text-danger">{qrError}</p>
              ) : qrData ? (
                <>
                  <p>Quét mã QR để thanh toán:</p>
                  {/* SỬ DỤNG COMPONENT QRCODECANVAS */}
                  <QRCodeCanvas value={qrData} size={400} level="H" />
                </>
              ) : (
                <p>Không có mã QR để hiển thị.</p>
              )}
              <p className="mt-2">
                Số tiền: {formatCurrency(orderTotals.totalAmount)}
              </p>
              <p>
                Nội dung: Thanh toán đơn hàng #
                {activeOrderObj.invoiceNumber || activeOrder}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận đơn hàng */}
      {showConfirmModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.18)",
            zIndex: 3000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setShowConfirmModal(false)}
        >
          <div
            className="bg-white p-4"
            style={{
              minWidth: 340,
              borderRadius: 10,
              boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h5 className="mb-3">Xác nhận đơn hàng</h5>
            <div className="mb-3">
              Bạn có chắc chắn muốn xác nhận đơn hàng này không?
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={() => setShowConfirmModal(false)}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary fw-bold"
                onClick={() => {
                  setShowConfirmModal(false);
                  setShowSuccessToast(true);
                  setTimeout(() => setShowSuccessToast(false), 2500);
                  // TODO: Gửi đơn hàng lên backend tại đây
                  // Sau khi gửi thành công, có thể xóa đơn hàng hiện tại khỏi orders
                  setOrders((prev) =>
                    prev.filter((order) => order.id !== activeOrder)
                  );
                  setActiveOrder(null);
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast thông báo xác nhận đơn hàng thành công */}
      {showSuccessToast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            zIndex: 4000,
            minWidth: 320,
            background: "#fff",
            border: "1.5px solid #198754",
            borderRadius: 8,
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ color: "#198754", fontSize: 22, marginRight: 8 }}>
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="12" cy="12" r="12" fill="#198754" />
              <path
                d="M7 13.5L10.5 17L17 10"
                stroke="#fff"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span style={{ color: "#198754", fontWeight: 600, fontSize: 16 }}>
            Xác nhận đơn hàng thành công!
          </span>
        </div>
      )}

      {/* Modal chọn khách hàng */}
      {customerModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.18)",
            zIndex: 1200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setCustomerModal(false)}
        >
          <div
            className="bg-white p-4"
            style={{
              minWidth: 900,
              borderRadius: 10,
              boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Chọn khách hàng</h5>
              <button
                className="btn-close"
                onClick={() => setCustomerModal(false)}
              />
            </div>
            <div style={{ maxHeight: 350, overflowY: "auto" }}>
              <table className="table table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{ width: 50 }}>ID</th>
                    <th style={{ width: 120 }}>MÃ KHÁCH HÀNG</th>
                    <th style={{ width: 180 }}>HỌ TÊN</th>
                    <th style={{ width: 140 }}>SỐ ĐIỆN THOẠI</th>
                    <th style={{ width: 220 }}>EMAIL</th>
                    <th style={{ width: 120 }}>NGÀY SINH</th>
                    <th style={{ width: 90 }}>ACTION</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Không còn demo data - chỉ sử dụng dữ liệu thực tế từ backend */}
                  <tr>
                    <td colSpan="7" className="text-center text-muted">
                      Không có dữ liệu khách hàng
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal chọn sản phẩm */}
      {showProductModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.18)",
            zIndex: 1300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleCloseProductDetail}
        >
          <div
            className="bg-white p-4"
            style={{
              minWidth: 600,
              borderRadius: 10,
              boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Chọn sản phẩm</h5>
              <button
                className="btn-close"
                onClick={handleCloseProductDetail}
              />
            </div>
            <div style={{ maxHeight: 350, overflowY: "auto" }}>
              <table className="table table-bordered align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Mã SP</th>
                    <th>Tên sản phẩm</th>
                    <th>Loại</th>
                    <th>Màu</th>
                    <th>Size</th>
                    <th>Chất liệu</th>
                    <th>Giá</th>
                    <th>Tồn kho</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {/* Không còn demo data - chỉ sử dụng dữ liệu thực tế từ backend */}
                  <tr>
                    <td colSpan="9" className="text-center text-muted">
                      Không có dữ liệu sản phẩm
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Modal chi tiết sản phẩm (khi chọn sản phẩm để thêm vào giỏ) */}
      {selectedProduct && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.18)",
            zIndex: 1400,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={handleCloseProductDetail}
        >
          <div
            className="bg-white p-4"
            style={{
              minWidth: 400,
              borderRadius: 10,
              boxShadow: "0 2px 16px rgba(0,0,0,0.15)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">Thêm sản phẩm vào giỏ</h5>
              <button
                className="btn-close"
                onClick={handleCloseProductDetail}
              />
            </div>
            <div className="mb-3">
              <div className="fw-bold mb-1">{selectedProduct.name}</div>
              <div className="text-muted mb-1">Mã SP: {selectedProduct.id}</div>
              <div className="mb-1">
                Giá:{" "}
                <span className="fw-bold text-danger">
                  {selectedProduct.price.toLocaleString()} đ
                </span>
              </div>
              <div className="mb-1">
                Tồn kho:{" "}
                <span className="fw-bold">{selectedProduct.stock}</span>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Số lượng</label>
              <input
                type="number"
                className="form-control"
                min={1}
                max={selectedProduct.stock}
                value={productQty}
                onChange={handleQtyChange}
                style={{ width: 120 }}
              />
              {qtyError && <div className="text-danger mt-1">{qtyError}</div>}
            </div>
            <div className="d-flex justify-content-end gap-2">
              <button
                className="btn btn-secondary"
                onClick={handleCloseProductDetail}
              >
                Hủy
              </button>
              <button
                className="btn btn-primary fw-bold"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Pos;
