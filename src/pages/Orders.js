import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  confirmOrder,
  shipOrder,
  deliverOrder,
  completeOrder,
  cancelOrder,
  getOrderById,
} from "../services/donHangService";
import {
  FaEye,
  FaHistory,
  FaClock,
  FaCheckCircle,
  FaShippingFast,
  FaTimesCircle,
  FaBoxOpen,
  FaMoneyBillWave,
  FaListAlt,
  FaDollarSign,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const statusBadge = (status) => {
  switch (status) {
    case "Chờ thêm sản phẩm":
      return (
        <span className="order-badge order-badge-adding">
          <FaListAlt className="me-1" />
          {status}
        </span>
      );
    case "Chờ xác nhận":
      return (
        <span className="order-badge order-badge-pending">
          <FaClock className="me-1" />
          {status}
        </span>
      );
    case "Đã xác nhận":
      return (
        <span className="order-badge order-badge-confirmed">
          <FaCheckCircle className="me-1" />
          {status}
        </span>
      );
    case "Đang giao hàng":
    case "Đang giao":
      return (
        <span className="order-badge order-badge-shipping">
          <FaShippingFast className="me-1" />
          {status}
        </span>
      );
    case "Giao hàng thành công":
    case "Đã giao":
      return (
        <span className="order-badge order-badge-delivered">
          <FaBoxOpen className="me-1" />
          {status}
        </span>
      );
    case "Đã hủy":
      return (
        <span className="order-badge order-badge-cancel">
          <FaTimesCircle className="me-1" />
          {status}
        </span>
      );
    case "Hoàn thành":
      return (
        <span className="order-badge order-badge-complete">
          <FaCheckCircle className="me-1" />
          {status}
        </span>
      );
    default:
      return <span className="order-badge order-badge-default">{status}</span>;
  }
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;
  const [filterMaDonHang, setFilterMaDonHang] = useState("");
  const [filterTenKhachHang, setFilterTenKhachHang] = useState("");
  const [filterTrangThai, setFilterTrangThai] = useState("");
  const [filterHinhThuc, setFilterHinhThuc] = useState("");
  const [filterDateFrom, setFilterDateFrom] = useState("");
  const [filterDateTo, setFilterDateTo] = useState("");
  const [showDetail, setShowDetail] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [selectedTab, setSelectedTab] = useState("TẤT CẢ");
  const statusTabs = [
    {
      label: "TẤT CẢ",
      value: "TẤT CẢ",
      icon: "📋",
      color: "primary",
    },
    {
      label: "CHỜ THÊM SẢN PHẨM",
      value: "Chờ thêm sản phẩm",
      icon: "➕",
      color: "warning",
    },
    {
      label: "CHỜ XÁC NHẬN",
      value: "Chờ xác nhận",
      icon: "⏳",
      color: "warning",
    },
    {
      label: "ĐÃ XÁC NHẬN",
      value: "Đã xác nhận",
      icon: "✅",
      color: "info",
    },
    {
      label: "ĐANG GIAO",
      value: ["Đang giao hàng", "Đang giao"],
      icon: "🚚",
      color: "primary",
    },
    {
      label: "ĐÃ GIAO",
      value: ["Giao hàng thành công", "Đã giao"],
      icon: "📦",
      color: "success",
    },
    {
      label: "HOÀN THÀNH",
      value: "Hoàn thành",
      icon: "🎉",
      color: "success",
    },
    {
      label: "ĐÃ HỦY",
      value: "Đã hủy",
      icon: "❌",
      color: "danger",
    },
  ];

  const trangThaiList = Array.from(
    new Set(orders.map((o) => o.trangThai || o.tenTrangThai).filter(Boolean))
  );
  const hinhThucList = Array.from(
    new Set(orders.map((o) => o.hinhThucDonHang).filter(Boolean))
  );

  const countByTab = (tabValue) => {
    if (tabValue === "TẤT CẢ") return orders.length;
    if (Array.isArray(tabValue)) {
      return orders.filter((o) =>
        tabValue
          .map((v) => v.toLowerCase())
          .includes((o.trangThai || o.tenTrangThai || "").toLowerCase())
      ).length;
    }
    return orders.filter(
      (o) =>
        (o.trangThai || o.tenTrangThai || "").toLowerCase() ===
        tabValue.toLowerCase()
    ).length;
  };
  const ordersByTab =
    selectedTab === "TẤT CẢ"
      ? orders
      : (() => {
          const tab = statusTabs.find((t) => t.label === selectedTab);
          if (!tab) return orders;
          if (Array.isArray(tab.value)) {
            return orders.filter((o) =>
              tab.value
                .map((v) => v.toLowerCase())
                .includes((o.trangThai || o.tenTrangThai || "").toLowerCase())
            );
          }
          return orders.filter(
            (o) =>
              (o.trangThai || o.tenTrangThai || "").toLowerCase() ===
              tab.value.toLowerCase()
          );
        })();
  // Sắp xếp đơn hàng mới nhất lên đầu
  const sortedOrders = [...ordersByTab].sort(
    (a, b) => new Date(b.ngayDat) - new Date(a.ngayDat)
  );
  const filteredOrders = sortedOrders.filter((order) => {
    const matchMaDonHang =
      filterMaDonHang === "" ||
      order.maDonHang?.toLowerCase().includes(filterMaDonHang.toLowerCase());
    const matchTenKhachHang =
      filterTenKhachHang === "" ||
      (order.hoTenNguoiNhan || order.tenKhachHang)
        ?.toLowerCase()
        .includes(filterTenKhachHang.toLowerCase());
    const matchHinhThuc =
      filterHinhThuc === "" || order.hinhThucDonHang === filterHinhThuc;
    const matchDateFrom =
      filterDateFrom === "" ||
      (order.ngayDat && order.ngayDat >= filterDateFrom);
    const matchDateTo =
      filterDateTo === "" || (order.ngayDat && order.ngayDat <= filterDateTo);
    return (
      matchMaDonHang &&
      matchTenKhachHang &&
      matchHinhThuc &&
      matchDateFrom &&
      matchDateTo
    );
  });
  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  useEffect(() => {
    getAllOrders()
      .then((res) => {
        // Kiểm tra cấu trúc dữ liệu và set đúng
        const ordersData = Array.isArray(res.data)
          ? res.data
          : res.data?.data || [];
        setOrders(ordersData);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading orders:", err);
        setError("Lỗi khi tải dữ liệu đơn hàng");
        setLoading(false);
      });
  }, []);

  // Custom CSS for better UI
  const customStyles = `
    .orders-table th {
      background: #f0f4f8;
      font-weight: 600;
      font-size: 1.13rem;
      color: #222;
    }
    .orders-table td {
      font-size: 1.08rem;
      color: #222;
    }
    .orders-table tbody tr:hover { background: #f6f9fc; }
    .orders-table .btn-eye { background: #e3f2fd; color: #1976d2; border: none; }
    .orders-table .btn-eye:hover { background: #1976d2; color: #fff; }
    .orders-table .btn-action { min-width: 110px; font-weight: 500; }
    .orders-table .btn-group .btn { margin: 0 1px; }
    .orders-table .btn-group .btn:first-child { margin-left: 0; }
    .orders-table .btn-group .btn:last-child { margin-right: 0; }
    .filter-label, .form-label { font-size: 1.08rem !important; }
    .form-control, .form-control { font-size: 1.08rem !important; }
    .pagination .page-link { padding: 0.375rem 0.75rem; }
    .pagination-sm .page-link { padding: 0.25rem 0.5rem; font-size: 0.875rem; }
    .table-responsive { border-radius: 8px; overflow: hidden; }
    .orders-table tbody tr:hover { 
      background: linear-gradient(90deg, #f8f9fa 0%, #e9ecef 100%);
      transform: translateY(-1px);
      box-shadow-md: 0 2px 8px rgba(0,0,0,0.1);
      transition: all 0.2s ease;
    }
    .orders-table tbody tr { transition: all 0.2s ease; }
    .orders-table .btn { transition: all 0.2s ease; }
    .orders-table .btn:hover { transform: scale(1.05); }
    .modal.fade.show {
      animation: fadeInModal 0.35s;
    }
    @keyframes fadeInModal {
      from { opacity: 0; transform: translateY(-30px); }
      to { opacity: 1; transform: none; }
    }
    .modal-header {
      background: linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%);
      border-bottom: none;
      border-top-left-radius: 20px;
      border-top-right-radius: 20px;
      padding-top: 24px;
      padding-bottom: 24px;
      box-shadow-md: 0 4px 16px 0 rgba(78,84,200,0.08);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-title {
      font-size: 1.7rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.02em;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .modal-content {
      border-radius: 20px;
      box-shadow-md: 0 8px 32px 0 rgba(31, 38, 135, 0.16);
      border: none;
      background: #f8fafc;
    }
    .order-detail-section {
      background: #fff;
      border-radius: 16px;
      padding: 28px 28px 18px 28px;
      margin-bottom: 18px;
      box-shadow-md: 0 2px 16px 0 rgba(31, 38, 135, 0.08);
      border: 1px solid #e3e8f0;
      min-height: 220px;
    }
    .order-detail-label {
      color: #7b809a;
      font-size: 1.08rem;
      margin-bottom: 2px;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .order-detail-value {
      font-weight: 700;
      font-size: 1.23rem;
      margin-bottom: 12px;
      color: #222;
    }
    .order-detail-section h6 {
      font-weight: 800;
      font-size: 1.23rem;
      margin-bottom: 18px;
      color: #4e54c8;
      letter-spacing: 0.01em;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .order-detail-table th {
      background: linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%);
      color: #fff;
      font-weight: 700;
      font-size: 1.15rem;
      border-top-left-radius: 10px;
      border-top-right-radius: 10px;
    }
    .order-detail-table td {
      vertical-align: middle;
      background: #fff;
      font-size: 1.13rem;
    }
    .order-detail-table tfoot td {
      font-weight: 800;
      color: #4e54c8;
      font-size: 1.18rem;
      background: #f0f4f8;
      border-bottom-left-radius: 10px;
      border-bottom-right-radius: 10px;
    }
    .order-detail-table {
      border-radius: 12px;
      overflow: hidden;
      background: #fff;
      box-shadow-md: 0 2px 12px 0 rgba(31, 38, 135, 0.06);
    }
    .order-badge {
      display: inline-flex;
      align-items: center;
      font-weight: 700;
      font-size: 1.05rem;
      border-radius: 2rem;
      padding: 0.32em 1.1em 0.32em 0.9em;
      box-shadow-md: 0 2px 8px 0 rgba(0,0,0,0.11);
      letter-spacing: 0.01em;
      border: none;
      margin-bottom: 2px;
    }
    .order-detail-section .order-badge {
      font-size: 1.12rem;
      padding: 0.38em 1.2em 0.38em 1em;
    }
         .order-badge-adding {
       background: linear-gradient(90deg, #ff9a9e 0%, #fecfef 100%);
       color: #8b0000;
     }
     .order-badge-pending {
       background: linear-gradient(90deg, #f7971e 0%, #ffd200 100%);
       color: #7a4f01;
     }
    .order-badge-confirmed {
      background: linear-gradient(90deg, #43cea2 0%, #185a9d 100%);
      color: #fff;
    }
    .order-badge-shipping {
      background: linear-gradient(90deg, #36d1c4 0%, #5b86e5 100%);
      color: #fff;
    }
    .order-badge-delivered {
      background: linear-gradient(90deg, #56ab2f 0%, #a8e063 100%);
      color: #205100;
    }
    .order-badge-cancel {
      background: linear-gradient(90deg, #ff5858 0%, #f09819 100%);
      color: #fff;
    }
    .order-badge-complete {
      background: linear-gradient(90deg, #00c6ff 0%, #0072ff 100%);
      color: #fff;
    }
    .order-badge-default {
      background: #e0e0e0;
      color: #333;
    }
    .order-detail-section .icon-label {
      color: #4e54c8;
      font-size: 1.1em;
      margin-right: 5px;
    }
    @media (max-width: 900px) {
      .order-detail-section { padding: 10px 5px; }
      .modal-content { border-radius: 10px; }
    }
  `;

  // Thống kê tổng quan
  const totalOrders = orders.length;
  const totalTienHang = orders.reduce(
    (sum, o) => sum + (o.tongTienHang || 0),
    0
  );
  const totalThanhToan = orders.reduce((sum, o) => sum + (o.tongTien || 0), 0);
  const countByStatus = (status) =>
    orders.filter((o) => o.tenTrangThai === status).length;

  // Thêm hàm xử lý xác nhận/hủy đơn hàng
  const handleConfirmOrder = async (orderId) => {
    try {
      // Tìm đơn hàng trong danh sách hiện tại
      const order = orders.find((o) => o.id === orderId);
      const currentStatus = order
        ? order.trangThai || order.tenTrangThai
        : "Không xác định";



      await confirmOrder(orderId);
      alert("Xác nhận đơn hàng thành công!");

      // Refresh danh sách đơn hàng
      const res = await getAllOrders();
      const ordersData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setOrders(ordersData);
    } catch (err) {
      alert("Xác nhận đơn hàng thất bại!");
    }
  };
  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      alert("Hủy đơn hàng thành công!");

      // Refresh danh sách đơn hàng
      const res = await getAllOrders();
      const ordersData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setOrders(ordersData);
    } catch (err) {
      alert("Hủy đơn hàng thất bại!");
    }
  };

  // Thêm các hàm xử lý trạng thái
  const handleShipOrder = async (orderId) => {
    try {
      await shipOrder(orderId);
      alert("Bắt đầu giao hàng thành công!");

      // Refresh danh sách đơn hàng
      const res = await getAllOrders();
      const ordersData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setOrders(ordersData);
    } catch (err) {
      alert("Bắt đầu giao hàng thất bại!");
    }
  };

  const handleDeliverOrder = async (orderId) => {
    try {
      await deliverOrder(orderId);
      alert("Giao hàng thành công!");

      // Refresh danh sách đơn hàng
      const res = await getAllOrders();
      const ordersData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setOrders(ordersData);
    } catch (err) {
      alert("Giao hàng thất bại!");
    }
  };

  const handleCompleteOrder = async (orderId) => {
    try {
      await completeOrder(orderId);
      alert("Hoàn thành đơn hàng thành công!");

      // Refresh danh sách đơn hàng
      const res = await getAllOrders();
      const ordersData = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];
      setOrders(ordersData);
    } catch (err) {
      alert("Hoàn thành đơn hàng thất bại!");
    }
  };

  // Hàm ghép địa chỉ từ các trường nhỏ
  const getFullAddress = (order) => {
    const { duong, phuongXa, quanHuyen, tinhThanh } = order;
    return (
      [duong, phuongXa, quanHuyen, tinhThanh].filter(Boolean).join(", ") ||
      "Không có thông tin"
    );
  };

  const handleCloseModal = () => {
    setShowDetail(false);
    setShowHistory(false);
  };

  const navigate = useNavigate();

  // Thêm hàm formatVNDateTime nếu chưa có
  function formatVNDateTime(dateString) {
    const d = new Date(dateString);
    const pad = (n) => n.toString().padStart(2, "0");
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(
      d.getSeconds()
    )} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  return (
    <div className="container-fluid px-0">
      <style>{customStyles}</style>
      <h2 className="mb-4 fw-bold text-primary">Quản lý Đơn hàng</h2>
      <div className="row g-3 mb-3">
        <div className="col-md-2 col-6">
          <div className="stat-card shadow-md-sm rounded-3 p-3 text-center bg-white">
            <FaMoneyBillWave size={24} className="mb-1 text-success" />
            <div className="fw-bold text-success" style={{ fontSize: 18 }}>
              {totalTienHang.toLocaleString("vi-VN")} đ
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>Tổng tiền hàng</div>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="stat-card shadow-md-sm rounded-3 p-3 text-center bg-white">
            <FaDollarSign size={24} className="mb-1 text-info" />
            <div className="fw-bold text-info" style={{ fontSize: 18 }}>
              {totalThanhToan.toLocaleString("vi-VN")} đ
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>Tổng thanh toán</div>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="stat-card shadow-md-sm rounded-3 p-3 text-center bg-white">
            <FaListAlt size={24} className="mb-1 text-warning" />
            <div className="fw-bold text-warning" style={{ fontSize: 18 }}>
              {countByTab("Chờ thêm sản phẩm")}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>Chờ thêm SP</div>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="stat-card shadow-md-sm rounded-3 p-3 text-center bg-white">
            <FaClock size={24} className="mb-1 text-warning" />
            <div className="fw-bold text-warning" style={{ fontSize: 18 }}>
              {countByTab("Chờ xác nhận")}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>Chờ xác nhận</div>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="stat-card shadow-md-sm rounded-3 p-3 text-center bg-white">
            <FaShippingFast size={24} className="mb-1 text-primary" />
            <div className="fw-bold text-primary" style={{ fontSize: 18 }}>
              {countByTab(["Đang giao hàng", "Đang giao"])}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>Đang giao</div>
          </div>
        </div>
        <div className="col-md-2 col-6">
          <div className="stat-card shadow-md-sm rounded-3 p-3 text-center bg-white">
            <FaCheckCircle size={24} className="mb-1 text-success" />
            <div className="fw-bold text-success" style={{ fontSize: 18 }}>
              {countByTab("Hoàn thành")}
            </div>
            <div style={{ fontSize: 12, color: "#888" }}>Hoàn thành</div>
          </div>
        </div>
      </div>
      {/* Card bộ lọc */}
      <div
        className="card shadow-md-sm border-0 mb-3"
        style={{ borderRadius: 14 }}
      >
        <div className="card-body pb-2">
          <form className="row g-3 align-items-end">
            <div className="col-md-2">
              <label
                className="form-label mb-1 text-secondary"
                style={{ fontSize: "0.95rem" }}
              >
                Mã đơn hàng
              </label>
              <input
                type="text"
                className="form-control rounded-pill"
                value={filterMaDonHang}
                onChange={(e) => setFilterMaDonHang(e.target.value)}
                placeholder="Nhập mã đơn hàng"
              />
            </div>
            <div className="col-md-2">
              <label
                className="form-label mb-1 text-secondary"
                style={{ fontSize: "0.95rem" }}
              >
                Tên khách hàng
              </label>
              <input
                type="text"
                className="form-control rounded-pill"
                value={filterTenKhachHang}
                onChange={(e) => setFilterTenKhachHang(e.target.value)}
                placeholder="Nhập tên khách hàng"
              />
            </div>
            <div className="col-md-2">
              <label
                className="form-label mb-1 text-secondary"
                style={{ fontSize: "0.95rem" }}
              >
                Hình thức
              </label>
              <select
                className="form-control rounded-pill"
                value={filterHinhThuc}
                onChange={(e) => setFilterHinhThuc(e.target.value)}
              >
                <option value="">Tất cả</option>
                {hinhThucList.map((ht, idx) => (
                  <option key={idx} value={ht}>
                    {ht}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label
                className="form-label mb-1 text-secondary"
                style={{ fontSize: "0.95rem" }}
              >
                Ngày đặt từ
              </label>
              <input
                type="date"
                className="form-control rounded-pill"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label
                className="form-label mb-1 text-secondary"
                style={{ fontSize: "0.95rem" }}
              >
                Đến ngày
              </label>
              <input
                type="date"
                className="form-control rounded-pill"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
              />
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline btn-sm px-4 rounded-pill mt-2 fw-bold shadow-md-sm"
                style={{ letterSpacing: "0.03em" }}
                onClick={() => {
                  setFilterMaDonHang("");
                  setFilterTenKhachHang("");
                  setFilterTrangThai("");
                  setFilterHinhThuc("");
                  setFilterDateFrom("");
                  setFilterDateTo("");
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Thêm UI tab trạng thái phía trên bảng đơn hàng */}
      <div
        className="card shadow-md-sm border-0 mb-3"
        style={{ borderRadius: 14 }}
      >
        <div className="card-body py-2 px-3" style={{ overflowX: "auto" }}>
          <div
            className="d-flex flex-row gap-2 align-center"
            style={{ whiteSpace: "nowrap" }}
          >
            {statusTabs.map((tab) => (
              <button
                key={tab.label}
                className={`btn btn-link px-3 py-2 fw-bold position-relative rounded-pill${
                  selectedTab === tab.label
                    ? ` text-${tab.color} bg-${tab.color} bg-opacity-10`
                    : " text-secondary"
                }`}
                style={{
                  fontSize: 16,
                  textDecoration: "none",
                  border:
                    selectedTab === tab.label
                      ? `2px solid var(--bs-${tab.color})`
                      : "2px solid transparent",
                  transition: "all 0.3s ease",
                  minWidth: "140px",
                }}
                onClick={() => setSelectedTab(tab.label)}
              >
                <span style={{ fontSize: 18, marginRight: 8 }}>{tab.icon}</span>
                {tab.label}
                <span
                  className={`badge ms-2 ${
                    selectedTab === tab.label
                      ? `bg-${tab.color}`
                      : "bg-secondary"
                  }`}
                  style={{ fontSize: 12, position: "relative", top: -1 }}
                >
                  {countByTab(tab.value)}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Card bảng đơn hàng */}
      <div className="card shadow-md-sm border-0 mb-4">
        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-3 text-muted">Đang tải dữ liệu đơn hàng...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <div className="text-danger mb-3">
                <i className="fas fa-exclamation-triangle fa-2x"></i>
              </div>
              <h5 className="text-danger">{error}</h5>
              <button
                className="btn btn-outline mt-3"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-redo me-2"></i>
                Thử lại
              </button>
            </div>
          ) : (
            <div className="table-responsive">
              {/* Thông tin tổng quan */}
              <div className="d-flex justify-between align-center mb-3">
                <div className="text-muted">
                  <small>
                    Hiển thị {paginatedOrders.length} trong tổng số{" "}
                    {filteredOrders.length} đơn hàng
                    {filteredOrders.length !== orders.length &&
                      ` (đã lọc từ ${orders.length} đơn hàng)`}
                  </small>
                </div>
                <div className="text-muted">
                  <small>
                    Trang {currentPage} / {totalPages}
                  </small>
                </div>
              </div>

              <table className="table orders-table align-middle">
                <thead>
                  <tr>
                    <th className="text-center">STT</th>
                    <th>Mã Đơn Hàng</th>
                    <th>Tên Khách Hàng</th>
                    <th>Hình Thức Đơn Hàng</th>
                    <th>Trạng Thái</th>
                    <th>Ngày Đặt</th>
                    <th className="text-end">Tổng Tiền Hàng</th>
                    <th className="text-end">Tổng Thanh Toán</th>
                    <th className="text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.length > 0 ? (
                    paginatedOrders.map((order, idx) => (
                      <tr key={order.id}>
                        <td className="text-center">
                          {(currentPage - 1) * pageSize + idx + 1}
                        </td>
                        <td className="fw-bold">{order.maDonHang}</td>
                        <td>{order.hoTenNguoiNhan || order.tenKhachHang}</td>
                        <td>{order.hinhThucDonHang}</td>
                        <td>
                          {statusBadge(order.trangThai || order.tenTrangThai)}
                        </td>
                        <td>
                          {order.ngayDat ? formatVNDateTime(order.ngayDat) : ""}
                        </td>
                        <td className="text-end">
                          {order.tongTienHang?.toLocaleString("vi-VN")}
                        </td>
                        <td className="text-end">
                          {order.tongTien?.toLocaleString("vi-VN")}
                        </td>
                        <td className="text-center">
                          <div className="btn-group" role="group">
                            {/* Nút xem chi tiết */}
                            <button
                              className="btn btn-eye btn-sm me-1"
                              title="Xem chi tiết"
                              onClick={() => navigate(`/orders/${order.id}`)}
                            >
                              <FaEye />
                            </button>

                            {/* Các nút hành động theo trạng thái */}
                            {(order.trangThai === "Chờ thêm sản phẩm" ||
                              order.tenTrangThai === "Chờ thêm sản phẩm") && (
                              <button
                                className="btn btn-warning btn-sm"
                                title="Thêm sản phẩm"
                                onClick={() => navigate(`/orders/${order.id}`)}
                              >
                                <FaListAlt />
                              </button>
                            )}

                            {(order.trangThai === "Chờ xác nhận" ||
                              order.tenTrangThai === "Chờ xác nhận") && (
                              <>
                                <button
                                  className="btn btn-success btn-sm me-1"
                                  title="Xác nhận đơn hàng"
                                  onClick={() => handleConfirmOrder(order.id)}
                                >
                                  <FaCheckCircle />
                                </button>
                                <button
                                  className="btn btn-danger btn-sm"
                                  title="Hủy đơn hàng"
                                  onClick={() => handleCancelOrder(order.id)}
                                >
                                  <FaTimesCircle />
                                </button>
                              </>
                            )}

                            {(order.trangThai === "Đã xác nhận" ||
                              order.tenTrangThai === "Đã xác nhận") && (
                              <button
                                className="btn btn-primary btn-sm"
                                title="Bắt đầu giao hàng"
                                onClick={() => handleShipOrder(order.id)}
                              >
                                <FaShippingFast />
                              </button>
                            )}

                            {(order.trangThai === "Đang giao hàng" ||
                              order.trangThai === "Đang giao" ||
                              order.tenTrangThai === "Đang giao hàng" ||
                              order.tenTrangThai === "Đang giao") && (
                              <button
                                className="btn btn-info btn-sm"
                                title="Giao hàng thành công"
                                onClick={() => handleDeliverOrder(order.id)}
                              >
                                <FaBoxOpen />
                              </button>
                            )}

                            {(order.trangThai === "Giao hàng thành công" ||
                              order.trangThai === "Đã giao" ||
                              order.tenTrangThai === "Giao hàng thành công" ||
                              order.tenTrangThai === "Đã giao") && (
                              <button
                                className="btn btn-warning btn-sm"
                                title="Hoàn thành đơn hàng"
                                onClick={() => handleCompleteOrder(order.id)}
                              >
                                <FaCheckCircle />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        <div className="text-muted">
                          <i className="fas fa-inbox fa-2x mb-2"></i>
                          <p className="mb-0">Không có đơn hàng nào</p>
                          <small>
                            Hãy thử thay đổi bộ lọc hoặc tạo đơn hàng mới
                          </small>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination controls */}
              {totalPages > 1 && (
                <nav className="d-flex justify-between align-center mt-4">
                  <div className="text-muted">
                    <small>
                      Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
                      {Math.min(currentPage * pageSize, filteredOrders.length)}
                      trong tổng số {filteredOrders.length} đơn hàng
                    </small>
                  </div>
                  <ul className="pagination pagination-sm mb-0">
                    <li
                      className={`page-item${
                        currentPage === 1 ? " disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                      >
                        <i className="fas fa-angle-double-left"></i>
                      </button>
                    </li>
                    <li
                      className={`page-item${
                        currentPage === 1 ? " disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="fas fa-angle-left"></i>
                      </button>
                    </li>

                    {/* Hiển thị tối đa 5 trang */}
                    {(() => {
                      const startPage = Math.max(1, currentPage - 2);
                      const endPage = Math.min(totalPages, startPage + 4);
                      const pages = [];

                      for (let i = startPage; i <= endPage; i++) {
                        pages.push(i);
                      }

                      return pages.map((page) => (
                        <li
                          key={page}
                          className={`page-item${
                            currentPage === page ? " active" : ""
                          }`}
                        >
                          <button
                            className="page-link"
                            onClick={() => setCurrentPage(page)}
                          >
                            {page}
                          </button>
                        </li>
                      ));
                    })()}

                    <li
                      className={`page-item${
                        currentPage === totalPages ? " disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="fas fa-angle-right"></i>
                      </button>
                    </li>
                    <li
                      className={`page-item${
                        currentPage === totalPages ? " disabled" : ""
                      }`}
                    >
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="fas fa-angle-double-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Xóa phần Modal chi tiết đơn hàng ở đây */}
    </div>
  );
};

export default Orders;
