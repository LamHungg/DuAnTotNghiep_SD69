import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaUsers,
  FaBox,
  FaDollarSign,
  FaChartLine,
  FaEye,
  FaEdit,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaSync,
  FaArrowRight,
  FaInfoCircle,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import EmptyState from "../components/EmptyState";
import AdminStatsCard from "../components/AdminStatsCard";
import AdminModal from "../components/AdminModal";
import { getAllOrders } from "../services/donHangService";
import khachHangService from "../services/khachHangService";
import { getAllSanPham } from "../services/sanPhamService";

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalCustomers: 0,
    totalProducts: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Fetch real data from APIs
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch all data in parallel
      const [ordersRes, customersRes, productsRes] = await Promise.all([
        getAllOrders(),
        khachHangService.getAllKhachHang(),
        getAllSanPham(),
      ]);

      console.log("Orders response:", ordersRes);
      console.log("Customers response:", customersRes);
      console.log("Products response:", productsRes);

      const orders = Array.isArray(ordersRes?.data) ? ordersRes.data : [];
      const customers = Array.isArray(customersRes?.data)
        ? customersRes.data
        : Array.isArray(customersRes)
        ? customersRes
        : [];
      const products = Array.isArray(productsRes?.data)
        ? productsRes.data
        : Array.isArray(productsRes)
        ? productsRes
        : [];

      // Calculate statistics
      const totalOrders = orders.length;
      const pendingOrders = orders.filter(
        (order) =>
          order.trangThai === "Chờ xác nhận" ||
          order.trangThai === "Chờ thêm sản phẩm"
      ).length;
      const completedOrders = orders.filter(
        (order) =>
          order.trangThai === "Hoàn thành" ||
          order.trangThai === "Giao hàng thành công"
      ).length;

      // Calculate total revenue from completed orders
      const totalRevenue = orders
        .filter(
          (order) =>
            order.trangThai === "Hoàn thành" ||
            order.trangThai === "Giao hàng thành công"
        )
        .reduce((sum, order) => sum + (order.tongThanhToan || 0), 0);

      // Get recent orders (last 5 orders)
      const recentOrdersData = orders
        .sort((a, b) => new Date(b.ngayDat) - new Date(a.ngayDat))
        .slice(0, 5)
        .map((order) => ({
          id: order.maDonHang || `ORD-${order.id}`,
          customer: order.tenKhachHang || "Khách hàng",
          phone: order.soDienThoai || "N/A",
          date: new Date(order.ngayDat).toLocaleDateString("vi-VN"),
          status: order.trangThai || "Chờ xử lý",
          amount: order.tongThanhToan || 0,
          items: order.chiTietDonHang?.length || 0,
          originalOrder: order,
        }));

      setStats({
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue,
        totalCustomers: customers.length,
        totalProducts: products.length,
      });

      setRecentOrders(recentOrdersData);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Không thể tải dữ liệu dashboard. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleViewAllOrders = () => {
    navigate("/dashboard/orders");
  };

  const handleViewAllCustomers = () => {
    navigate("/dashboard/customers");
  };

  const handleViewStatistics = () => {
    navigate("/dashboard/stats");
  };

  const handleViewOrderDetail = (order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleEditOrder = (order) => {
    navigate(`/orders/${order.id}`);
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      "Chờ xác nhận": {
        class: "admin-badge-warning",
        icon: <FaClock />,
        text: "Chờ xác nhận",
      },
      "Chờ thêm sản phẩm": {
        class: "admin-badge-warning",
        icon: <FaClock />,
        text: "Chờ thêm sản phẩm",
      },
      "Đang xử lý": {
        class: "admin-badge-info",
        icon: <FaExclamationTriangle />,
        text: "Đang xử lý",
      },
      "Hoàn thành": {
        class: "admin-badge-success",
        icon: <FaCheckCircle />,
        text: "Hoàn thành",
      },
      "Giao hàng thành công": {
        class: "admin-badge-success",
        icon: <FaCheckCircle />,
        text: "Giao hàng thành công",
      },
      "Đã hủy": {
        class: "admin-badge-danger",
        icon: <FaTimesCircle />,
        text: "Đã hủy",
      },
    };

    const config = statusConfig[status] || {
      class: "admin-badge-secondary",
      icon: <FaClock />,
      text: status || "Chờ xử lý",
    };

    return (
      <span
        className={`admin-badge ${config.class} d-flex align-items-center gap-1`}
      >
        {config.icon}
        {config.text}
      </span>
    );
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  if (loading) {
    return <LoadingSpinner fullScreen text="Đang tải dữ liệu dashboard..." />;
  }

  if (error) {
    return (
      <EmptyState
        type="error"
        title="Lỗi tải dữ liệu"
        description={error}
        actionText="Thử lại"
        onAction={handleRefresh}
      />
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-header-info">
            <h1 className="dashboard-title">
              <FaChartLine className="dashboard-title-icon" />
              Tổng quan hệ thống
            </h1>
            <p className="dashboard-subtitle">
              Chào mừng bạn trở lại! Đây là tổng quan về hoạt động của hệ thống.
            </p>
          </div>
          <button
            className="admin-btn admin-btn-outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            <FaSync className={loading ? "fa-spin" : ""} />
            <span>Làm mới</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <AdminStatsCard
          title="Tổng đơn hàng"
          value={stats.totalOrders}
          icon={<FaShoppingCart />}
          change={stats.totalOrders}
          changeType="positive"
          color="primary"
          onClick={handleViewAllOrders}
        />

        <AdminStatsCard
          title="Đơn hàng chờ xử lý"
          value={stats.pendingOrders}
          icon={<FaClock />}
          change={stats.pendingOrders > 0 ? stats.pendingOrders : 0}
          changeType={stats.pendingOrders > 0 ? "negative" : "positive"}
          color="warning"
          onClick={handleViewAllOrders}
        />

        <AdminStatsCard
          title="Tổng doanh thu"
          value={stats.totalRevenue}
          icon={<FaDollarSign />}
          change={stats.completedOrders}
          changeType="positive"
          color="success"
          onClick={handleViewStatistics}
        />

        <AdminStatsCard
          title="Khách hàng"
          value={stats.totalCustomers}
          icon={<FaUsers />}
          change={stats.totalCustomers}
          changeType="positive"
          color="info"
          onClick={handleViewAllCustomers}
        />
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-content-grid">
        {/* Order Distribution Card */}
        <div className="admin-card dashboard-card">
          <div className="admin-card-header">
            <h5 className="admin-card-title">
              <FaChartLine className="admin-title-icon" />
              Phân bố đơn hàng
            </h5>
          </div>
          <div className="admin-card-body">
            <div className="order-distribution">
              <div className="distribution-item">
                <div className="distribution-label">
                  <span className="distribution-color distribution-success"></span>
                  Hoàn thành
                </div>
                <div className="distribution-value">
                  {stats.completedOrders}
                </div>
              </div>
              <div className="distribution-item">
                <div className="distribution-label">
                  <span className="distribution-color distribution-warning"></span>
                  Chờ xử lý
                </div>
                <div className="distribution-value">{stats.pendingOrders}</div>
              </div>
              <div className="distribution-item">
                <div className="distribution-label">
                  <span className="distribution-color distribution-info"></span>
                  Đang xử lý
                </div>
                <div className="distribution-value">
                  {stats.totalOrders -
                    stats.completedOrders -
                    stats.pendingOrders}
                </div>
              </div>
              <div className="distribution-item distribution-total">
                <div className="distribution-label">
                  <span className="distribution-color distribution-primary"></span>
                  Tổng cộng
                </div>
                <div className="distribution-value">{stats.totalOrders}</div>
              </div>
            </div>
            <div className="revenue-summary">
              <p className="revenue-text">
                <strong>Tổng doanh thu hiện tại:</strong>{" "}
                {formatCurrency(stats.totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        {/* Recent Orders Card */}
        <div className="admin-card dashboard-card dashboard-card-wide">
          <div className="admin-card-header">
            <h5 className="admin-card-title">
              <FaShoppingCart className="admin-title-icon" />
              Đơn hàng gần đây
            </h5>
            <button
              className="admin-btn admin-btn-primary admin-btn-sm"
              onClick={handleViewAllOrders}
            >
              Xem tất cả
            </button>
          </div>

          {recentOrders.length === 0 ? (
            <div className="admin-card-body">
              <EmptyState
                type="inbox"
                title="Chưa có đơn hàng nào"
                description="Hiện tại chưa có đơn hàng nào trong hệ thống."
                showAction={false}
              />
            </div>
          ) : (
            <div className="admin-card-body">
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Mã đơn hàng</th>
                      <th>Khách hàng</th>
                      <th>Ngày đặt</th>
                      <th>Trạng thái</th>
                      <th>Số tiền</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentOrders.map((order) => (
                      <tr key={order.id}>
                        <td>
                          <div className="order-id">
                            <strong>{order.id}</strong>
                            <small>{order.items} sản phẩm</small>
                          </div>
                        </td>
                        <td>
                          <div className="customer-info">
                            <div className="customer-name">
                              {order.customer}
                            </div>
                            <small className="customer-phone">
                              {order.phone}
                            </small>
                          </div>
                        </td>
                        <td>{order.date}</td>
                        <td>{getStatusBadge(order.status)}</td>
                        <td>
                          <strong>{formatCurrency(order.amount)}</strong>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="admin-action-btn admin-action-btn-view"
                              title="Xem chi tiết"
                              onClick={() => handleViewOrderDetail(order)}
                            >
                              <FaEye />
                            </button>
                            <button
                              className="admin-action-btn admin-action-btn-edit"
                              title="Cập nhật"
                              onClick={() => handleEditOrder(order)}
                            >
                              <FaEdit />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Order Detail Modal */}
      <AdminModal
        show={showOrderModal}
        onHide={() => setShowOrderModal(false)}
        title={`Chi tiết đơn hàng: ${selectedOrder?.id}`}
        size="lg"
        footer={
          <>
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={() => setShowOrderModal(false)}
            >
              Đóng
            </button>
            <button
              type="button"
              className="admin-btn admin-btn-primary"
              onClick={() => {
                setShowOrderModal(false);
                handleEditOrder(selectedOrder);
              }}
            >
              Chỉnh sửa đơn hàng
            </button>
          </>
        }
      >
        {selectedOrder && (
          <>
            <div className="modal-content-grid">
              <div className="info-section">
                <h6 className="info-section-title">
                  <FaUsers className="section-icon" />
                  Thông tin khách hàng
                </h6>
                <div className="info-item">
                  <span className="info-label">Tên khách hàng:</span>
                  <span className="info-value">{selectedOrder.customer}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Số điện thoại:</span>
                  <span className="info-value">{selectedOrder.phone}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Mã đơn hàng:</span>
                  <span className="info-value order-id">
                    {selectedOrder.id}
                  </span>
                </div>
              </div>

              <div className="info-section">
                <h6 className="info-section-title">
                  <FaShoppingCart className="section-icon" />
                  Thông tin đơn hàng
                </h6>
                <div className="info-item">
                  <span className="info-label">Ngày đặt:</span>
                  <span className="info-value">{selectedOrder.date}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Trạng thái:</span>
                  <span className="info-value">
                    {getStatusBadge(selectedOrder.status)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Số sản phẩm:</span>
                  <span className="info-value">
                    {selectedOrder.items} sản phẩm
                  </span>
                </div>
              </div>
            </div>

            <div className="info-section">
              <h6 className="info-section-title">
                <FaDollarSign className="section-icon" />
                Thông tin thanh toán
              </h6>
              <div className="payment-info">
                <div className="payment-item">
                  <span className="payment-label">Tổng tiền hàng:</span>
                  <span className="payment-value">
                    {formatCurrency(selectedOrder.amount)}
                  </span>
                </div>
                <div className="payment-item payment-total">
                  <span className="payment-label">Tổng thanh toán:</span>
                  <span className="payment-value payment-total-amount">
                    {formatCurrency(selectedOrder.amount)}
                  </span>
                </div>
              </div>
            </div>

            {selectedOrder.originalOrder && (
              <div className="info-section">
                <h6 className="info-section-title">
                  <FaBox className="section-icon" />
                  Chi tiết sản phẩm
                </h6>
                <div className="products-placeholder">
                  <p className="text-muted">
                    <FaInfoCircle className="section-icon" />
                    Chi tiết sản phẩm sẽ được hiển thị khi có dữ liệu
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </AdminModal>
    </div>
  );
};

export default Dashboard;
