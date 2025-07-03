import React, { useEffect, useState } from "react";
import {
  getAllOrders,
  confirmOrder,
  shipOrder,
  deliverOrder,
  completeOrder,
  cancelOrder,
  getOrderById
} from "../services/donHangService";
import { FaEye, FaHistory, FaClock, FaCheckCircle, FaShippingFast, FaTimesCircle, FaBoxOpen, FaMoneyBillWave, FaListAlt, FaDollarSign } from "react-icons/fa";

const statusBadge = (status) => {
  switch (status) {
    case "Chờ xác nhận":
      return <span className="order-badge order-badge-pending"><FaClock className="me-1" />{status}</span>;
    case "Đã xác nhận":
      return <span className="order-badge order-badge-confirmed"><FaCheckCircle className="me-1" />{status}</span>;
    case "Đang giao hàng":
    case "Đang giao":
      return <span className="order-badge order-badge-shipping"><FaShippingFast className="me-1" />{status}</span>;
    case "Giao hàng thành công":
    case "Đã giao":
      return <span className="order-badge order-badge-delivered"><FaBoxOpen className="me-1" />{status}</span>;
    case "Đã hủy":
      return <span className="order-badge order-badge-cancel"><FaTimesCircle className="me-1" />{status}</span>;
    case "Hoàn thành":
      return <span className="order-badge order-badge-complete"><FaCheckCircle className="me-1" />{status}</span>;
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

  const trangThaiList = Array.from(new Set(orders.map(o => o.tenTrangThai).filter(Boolean)));
  const hinhThucList = Array.from(new Set(orders.map(o => o.hinhThucDonHang).filter(Boolean)));

  const filteredOrders = orders.filter(order => {
    const matchMaDonHang = filterMaDonHang === "" || order.maDonHang?.toLowerCase().includes(filterMaDonHang.toLowerCase());
    const matchTenKhachHang = filterTenKhachHang === "" || order.tenKhachHang?.toLowerCase().includes(filterTenKhachHang.toLowerCase());
    const matchTrangThai = filterTrangThai === "" || order.tenTrangThai === filterTrangThai;
    const matchHinhThuc = filterHinhThuc === "" || order.hinhThucDonHang === filterHinhThuc;
    const matchDateFrom = filterDateFrom === "" || (order.ngayDat && order.ngayDat >= filterDateFrom);
    const matchDateTo = filterDateTo === "" || (order.ngayDat && order.ngayDat <= filterDateTo);
    return matchMaDonHang && matchTenKhachHang && matchTrangThai && matchHinhThuc && matchDateFrom && matchDateTo;
  });

  const totalPages = Math.ceil(filteredOrders.length / pageSize);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  useEffect(() => {
    getAllOrders()
      .then((res) => {
        setOrders(res.data);
        setLoading(false);
      })
      .catch((err) => {
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
    .filter-label, .form-label { font-size: 1.08rem !important; }
    .form-control, .form-select { font-size: 1.08rem !important; }
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
      box-shadow: 0 4px 16px 0 rgba(78,84,200,0.08);
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
      box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.16);
      border: none;
      background: #f8fafc;
    }
    .order-detail-section {
      background: #fff;
      border-radius: 16px;
      padding: 28px 28px 18px 28px;
      margin-bottom: 18px;
      box-shadow: 0 2px 16px 0 rgba(31, 38, 135, 0.08);
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
      box-shadow: 0 2px 12px 0 rgba(31, 38, 135, 0.06);
    }
    .order-badge {
      display: inline-flex;
      align-items: center;
      font-weight: 700;
      font-size: 1.05rem;
      border-radius: 2rem;
      padding: 0.32em 1.1em 0.32em 0.9em;
      box-shadow: 0 2px 8px 0 rgba(0,0,0,0.11);
      letter-spacing: 0.01em;
      border: none;
      margin-bottom: 2px;
    }
    .order-detail-section .order-badge {
      font-size: 1.12rem;
      padding: 0.38em 1.2em 0.38em 1em;
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
  const totalTienHang = orders.reduce((sum, o) => sum + (o.tongTienHang || 0), 0);
  const totalThanhToan = orders.reduce((sum, o) => sum + (o.tongThanhToan || 0), 0);
  const countByStatus = (status) => orders.filter(o => o.tenTrangThai === status).length;

  // Thêm hàm xử lý xác nhận/hủy đơn hàng
  const handleConfirmOrder = async (orderId) => {
    try {
      console.log('Xác nhận đơn hàng với id:', orderId, 'Trạng thái:', selectedOrder.tenTrangThai);
      await confirmOrder(orderId);
      alert('Xác nhận đơn hàng thành công!');
      getAllOrders().then((res) => setOrders(res.data));
      setShowDetail(false);
    } catch (err) {
      console.log('Lỗi xác nhận:', err.response?.data || err.message);
      alert('Xác nhận đơn hàng thất bại!');
    }
  };
  const handleCancelOrder = async (orderId) => {
    try {
      await cancelOrder(orderId);
      alert('Hủy đơn hàng thành công!');
      getAllOrders().then((res) => setOrders(res.data));
      setShowDetail(false);
    } catch (err) {
      alert('Hủy đơn hàng thất bại!');
    }
  };

  // Thêm các hàm xử lý trạng thái
  const handleShipOrder = async (orderId) => {
    try {
      await shipOrder(orderId);
      alert('Bắt đầu giao hàng thành công!');
      getAllOrders().then((res) => setOrders(res.data));
      setShowDetail(false);
    } catch (err) {
      alert('Bắt đầu giao hàng thất bại!');
    }
  };
  const handleDeliverOrder = async (orderId) => {
    try {
      await deliverOrder(orderId);
      alert('Giao hàng thành công!');
      getAllOrders().then((res) => setOrders(res.data));
      setShowDetail(false);
    } catch (err) {
      alert('Giao hàng thất bại!');
    }
  };
  const handleCompleteOrder = async (orderId) => {
    try {
      await completeOrder(orderId);
      alert('Hoàn thành đơn hàng thành công!');
      getAllOrders().then((res) => setOrders(res.data));
      setShowDetail(false);
    } catch (err) {
      alert('Hoàn thành đơn hàng thất bại!');
    }
  };

  // Hàm ghép địa chỉ từ các trường nhỏ
  const getFullAddress = (order) => {
    const { duong, phuongXa, quanHuyen, tinhThanh } = order;
    return [duong, phuongXa, quanHuyen, tinhThanh].filter(Boolean).join(', ') || 'Không có thông tin';
  };

  const handleCloseModal = () => {
    setShowDetail(false);
    setShowHistory(false);
  };

  return (
    <div className="container-fluid px-0">
      <style>{customStyles}</style>
      <h2 className="mb-4 fw-bold text-primary">Quản lý Đơn hàng</h2>
      {/* Thống kê tổng quan */}
      <div className="row g-3 mb-3">
        {/* Hàng 1: Tổng quan */}
        <div className="col-md-3 col-6">
          <div className="stat-card shadow-sm rounded-3 p-3 text-center bg-white">
            <FaListAlt size={28} className="mb-1 text-primary" />
            <div className="fw-bold" style={{fontSize: 20}}>{totalOrders}</div>
            <div style={{fontSize: 13, color: '#888'}}>Tổng số đơn</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="stat-card shadow-sm rounded-3 p-3 text-center bg-white">
            <FaMoneyBillWave size={28} className="mb-1 text-success" />
            <div className="fw-bold text-success" style={{fontSize: 20}}>{totalTienHang.toLocaleString('vi-VN')} đ</div>
            <div style={{fontSize: 13, color: '#888'}}>Tổng tiền hàng</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="stat-card shadow-sm rounded-3 p-3 text-center bg-white">
            <FaDollarSign size={28} className="mb-1 text-info" />
            <div className="fw-bold text-info" style={{fontSize: 20}}>{totalThanhToan.toLocaleString('vi-VN')} đ</div>
            <div style={{fontSize: 13, color: '#888'}}>Tổng thanh toán</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="stat-card shadow-sm rounded-3 p-3 text-center bg-white">
            <FaTimesCircle size={24} className="mb-1 text-danger" />
            <div className="fw-bold text-danger" style={{fontSize: 18}}>{countByStatus('Đã hủy')}</div>
            <div style={{fontSize: 13, color: '#888'}}>Đã hủy</div>
          </div>
        </div>
        {/* Hàng 2: Trạng thái */}
        <div className="col-md-3 col-6">
          <div className="stat-card shadow-sm rounded-3 p-3 text-center bg-white">
            <FaClock size={24} className="mb-1 text-warning" />
            <div className="fw-bold text-warning" style={{fontSize: 18}}>{countByStatus('Chờ xác nhận')}</div>
            <div style={{fontSize: 13, color: '#888'}}>Chờ xác nhận</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="stat-card shadow-sm rounded-3 p-3 text-center bg-white">
            <FaCheckCircle size={24} className="mb-1 text-primary" />
            <div className="fw-bold text-primary" style={{fontSize: 18}}>{countByStatus('Đã xác nhận')}</div>
            <div style={{fontSize: 13, color: '#888'}}>Đã xác nhận</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="stat-card shadow-sm rounded-3 p-3 text-center bg-white">
            <FaShippingFast size={24} className="mb-1 text-info" />
            <div className="fw-bold text-info" style={{fontSize: 18}}>{countByStatus('Đang giao hàng') + countByStatus('Đang giao')}</div>
            <div style={{fontSize: 13, color: '#888'}}>Đang giao</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="stat-card shadow-sm rounded-3 p-3 text-center bg-white">
            <FaBoxOpen size={24} className="mb-1 text-success" />
            <div className="fw-bold text-success" style={{fontSize: 18}}>{countByStatus('Giao hàng thành công') + countByStatus('Đã giao')}</div>
            <div style={{fontSize: 13, color: '#888'}}>Đã giao</div>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="stat-card shadow-sm rounded-3 p-3 text-center bg-white">
            <FaCheckCircle size={24} className="mb-1 text-info" />
            <div className="fw-bold text-info" style={{fontSize: 18}}>{countByStatus('Hoàn thành')}</div>
            <div style={{fontSize: 13, color: '#888'}}>Hoàn thành</div>
          </div>
        </div>
      </div>
      {/* Card bộ lọc */}
      <div className="card shadow-sm border-0 mb-3" style={{borderRadius: 14}}>
        <div className="card-body pb-2">
          <form className="row g-3 align-items-end">
            <div className="col-md-2">
              <label className="form-label mb-1 text-secondary" style={{fontSize: '0.95rem'}}>Mã đơn hàng</label>
              <input type="text" className="form-control rounded-pill" value={filterMaDonHang} onChange={e => setFilterMaDonHang(e.target.value)} placeholder="Nhập mã đơn hàng" />
            </div>
            <div className="col-md-2">
              <label className="form-label mb-1 text-secondary" style={{fontSize: '0.95rem'}}>Tên khách hàng</label>
              <input type="text" className="form-control rounded-pill" value={filterTenKhachHang} onChange={e => setFilterTenKhachHang(e.target.value)} placeholder="Nhập tên khách hàng" />
            </div>
            <div className="col-md-2">
              <label className="form-label mb-1 text-secondary" style={{fontSize: '0.95rem'}}>Trạng thái</label>
              <select className="form-select rounded-pill" value={filterTrangThai} onChange={e => setFilterTrangThai(e.target.value)}>
                <option value="">Tất cả</option>
                {trangThaiList.map((tt, idx) => <option key={idx} value={tt}>{tt}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label mb-1 text-secondary" style={{fontSize: '0.95rem'}}>Hình thức</label>
              <select className="form-select rounded-pill" value={filterHinhThuc} onChange={e => setFilterHinhThuc(e.target.value)}>
                <option value="">Tất cả</option>
                {hinhThucList.map((ht, idx) => <option key={idx} value={ht}>{ht}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label mb-1 text-secondary" style={{fontSize: '0.95rem'}}>Ngày đặt từ</label>
              <input type="date" className="form-control rounded-pill" value={filterDateFrom} onChange={e => setFilterDateFrom(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label mb-1 text-secondary" style={{fontSize: '0.95rem'}}>Đến ngày</label>
              <input type="date" className="form-control rounded-pill" value={filterDateTo} onChange={e => setFilterDateTo(e.target.value)} />
            </div>
            <div className="col-12 d-flex justify-content-end">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm px-4 rounded-pill mt-2 fw-bold shadow-sm"
                style={{letterSpacing: '0.03em'}}
                onClick={() => {
                  setFilterMaDonHang('');
                  setFilterTenKhachHang('');
                  setFilterTrangThai('');
                  setFilterHinhThuc('');
                  setFilterDateFrom('');
                  setFilterDateTo('');
                }}
              >
                Xóa bộ lọc
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Card bảng đơn hàng */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          {loading ? (
            <div>Đang tải...</div>
          ) : error ? (
            <div className="text-danger">{error}</div>
          ) : (
          <div className="table-responsive">
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
                  {paginatedOrders.map((order, idx) => (
                    <tr key={order.id}>
                      <td className="text-center">{(currentPage - 1) * pageSize + idx + 1}</td>
                      <td className="fw-bold">{order.maDonHang}</td>
                      <td>{order.tenKhachHang}</td>
                      <td>{order.hinhThucDonHang}</td>
                      <td>{statusBadge(order.tenTrangThai)}</td>
                      <td>{order.ngayDat}</td>
                      <td className="text-end">{order.tongTienHang?.toLocaleString("vi-VN")}</td>
                      <td className="text-end">{order.tongThanhToan?.toLocaleString("vi-VN")}</td>
                      <td className="text-center">
                        <button
                          className="btn btn-eye btn-sm"
                          title="Xem chi tiết"
                          onClick={async () => {
                            try {
                              const res = await getOrderById(order.id);
                              setSelectedOrder({ ...res.data, id: order.id });
                              setShowDetail(true);
                            } catch (err) {
                              alert('Không lấy được chi tiết đơn hàng!');
                            }
                          }}
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination controls */}
              {totalPages > 1 && (
                <nav className="d-flex justify-content-end mt-3">
                  <ul className="pagination">
                    <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>&laquo;</button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <li key={i + 1} className={`page-item${currentPage === i + 1 ? " active" : ""}`}>
                        <button className="page-link" onClick={() => setCurrentPage(i + 1)}>{i + 1}</button>
                      </li>
                    ))}
                    <li className={`page-item${currentPage === totalPages ? " disabled" : ""}`}>
                      <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>&raquo;</button>
                    </li>
                  </ul>
                </nav>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Modal chi tiết đơn hàng */}
      {showDetail && selectedOrder && (
        <div
          className="modal fade show"
          style={{ display: 'block', zIndex: 1055 }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-lg" role="document" style={{ zIndex: 1060 }}>
            <div
              className="modal-content"
              style={{ background: '#fff', borderRadius: 18, border: 'none', zIndex: 1060 }}
            >
              <style>{`
                .info-section {
                  border: 1.5px solid #e3e8f0;
                  border-radius: 14px;
                  background: #fff;
                  padding: 18px 22px 12px 22px;
                  margin-bottom: 18px;
                  box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.06);
                }
                .info-section-title {
                  font-weight: 700;
                  font-size: 1.13rem;
                  color: #4e54c8;
                  margin-bottom: 12px;
                  display: flex;
                  align-items: center;
                  gap: 8px;
                }
              `}</style>
              <div className="modal-header" style={{background: 'linear-gradient(90deg, #4e54c8 0%, #8f94fb 100%)', borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottom: 'none', justifyContent: 'center'}}>
                <h5 className="modal-title fw-bold text-white" style={{fontSize: '1.5rem', letterSpacing: 1}}><FaEye className="me-2"/>Chi tiết đơn hàng: <span style={{color:'#ffd200'}}>{selectedOrder.maDonHang}</span></h5>
                <button type="button" className="btn-close bg-white" onClick={handleCloseModal}></button>
              </div>
              <div className="modal-body" style={{borderRadius: 16, margin: 10, boxShadow: '0 2px 16px 0 rgba(31, 38, 135, 0.08)'}}>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="info-section">
                      <div className="info-section-title"><FaListAlt /> Thông tin đơn hàng</div>
                      <div className="mb-2"><span className="fw-semibold">Mã đơn hàng:</span> <span style={{color:'#222'}}>{selectedOrder.maDonHang || 'Không có thông tin'}</span></div>
                      <div className="mb-2"><span className="fw-semibold">Hình thức đơn hàng:</span> <span>{selectedOrder.hinhThucDonHang || 'Không có thông tin'}</span></div>
                      <div className="mb-2"><span className="fw-semibold">Ngày đặt:</span> <span>{selectedOrder.ngayDat || 'Không có thông tin'}</span></div>
                      <div className="mb-2"><span className="fw-semibold">Trạng thái:</span> {statusBadge(selectedOrder.tenTrangThai) || 'Không có thông tin'}</div>
                      <div className="mb-2"><span className="fw-semibold">Tổng tiền:</span> <span className="fw-bold text-primary" style={{fontSize:'1.15rem'}}>{selectedOrder.tongThanhToan?.toLocaleString('vi-VN') || '0'} đ</span></div>
                      <div className="d-flex gap-2 mt-3">
                        {selectedOrder.tenTrangThai === "Chờ xác nhận" && (
                          <>
                            <button className="btn btn-success btn-sm fw-bold px-3" onClick={() => handleConfirmOrder(selectedOrder.id)}>
                              Xác nhận đơn hàng
                            </button>
                            <button className="btn btn-danger btn-sm fw-bold px-3" onClick={() => handleCancelOrder(selectedOrder.id)}>
                              Hủy đơn hàng
                            </button>
                          </>
                        )}
                        {selectedOrder.tenTrangThai === "Đã xác nhận" && (
                          <button className="btn btn-info btn-sm fw-bold px-3" onClick={() => handleShipOrder(selectedOrder.id)}>
                            Bắt đầu giao hàng
                          </button>
                        )}
                        {(selectedOrder.tenTrangThai === "Đang giao hàng" || selectedOrder.tenTrangThai === "Đang giao") && (
                          <button className="btn btn-primary btn-sm fw-bold px-3" onClick={() => handleDeliverOrder(selectedOrder.id)}>
                            Giao hàng thành công
                          </button>
                        )}
                        {(selectedOrder.tenTrangThai === "Giao hàng thành công" || selectedOrder.tenTrangThai === "Đã giao") && (
                          <button className="btn btn-success btn-sm fw-bold px-3" onClick={() => handleCompleteOrder(selectedOrder.id)}>
                            Hoàn thành đơn hàng
                          </button>
                        )}
                        <button className="btn btn-outline-secondary btn-sm fw-bold px-3" onClick={() => setShowHistory((prev) => !prev)}>
                          <FaHistory className="me-1" />Lịch sử
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-section">
                      <div className="info-section-title"><FaListAlt /> Thông tin khách hàng</div>
                      <div className="mb-2"><span className="fw-semibold">Tên khách hàng:</span> <span>{selectedOrder.tenKhachHang || 'Không có thông tin'}</span></div>
                      <div className="mb-2"><span className="fw-semibold">Số điện thoại:</span> <span>{selectedOrder.soDienThoai || 'Không có thông tin'}</span></div>
                      <div className="mb-2"><span className="fw-semibold">Email:</span> <span>{selectedOrder.email || 'Không có thông tin'}</span></div>
                      <div className="mb-2"><span className="fw-semibold">Địa chỉ:</span> <span>{getFullAddress(selectedOrder)}</span></div>
                    </div>
                  </div>
                </div>
                <div className="info-section">
                  <div className="info-section-title"><FaListAlt /> Chi tiết sản phẩm</div>
                  <div className="table-responsive">
                    <table className="table order-detail-table">
                      <thead>
                        <tr>
                          <th>TÊN SẢN PHẨM</th>
                          <th>SỐ LƯỢNG</th>
                          <th className="text-end">ĐƠN GIÁ</th>
                          <th className="text-end">THÀNH TIỀN</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedOrder.chiTietSanPhams && selectedOrder.chiTietSanPhams.map((item, idx) => (
                          <tr key={idx}>
                            <td>{item.tenSanPham}</td>
                            <td>{item.soLuong}</td>
                            <td className="text-end">{item.gia?.toLocaleString('vi-VN')} đ</td>
                            <td className="text-end">{(item.gia && item.soLuong ? (item.gia * item.soLuong).toLocaleString('vi-VN') : '0')} đ</td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr>
                          <td colSpan="3" className="text-end fw-bold">Tổng cộng:</td>
                          <td className="text-end fw-bold text-primary">
                            {selectedOrder.chiTietSanPhams
                              ? selectedOrder.chiTietSanPhams.reduce((sum, i) => sum + (i.gia && i.soLuong ? i.gia * i.soLuong : 0), 0).toLocaleString('vi-VN')
                              : '0'} đ
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
                {showHistory && selectedOrder.lichSuDonHang && selectedOrder.lichSuDonHang.length > 0 && (
                  <div className="info-section">
                    <div className="info-section-title"><FaHistory /> Lịch sử đơn hàng</div>
                    <div className="table-responsive">
                      <table className="table table-bordered">
                        <thead>
                          <tr>
                            <th>Thời gian</th>
                            <th>Trạng thái</th>
                            <th>Ghi chú</th>
                            <th>Người cập nhật</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedOrder.lichSuDonHang.map((item, idx) => (
                            <tr key={idx}>
                              <td>{item.thoiGianCapNhat ? new Date(item.thoiGianCapNhat).toLocaleString('vi-VN') : ''}</td>
                              <td>{item.tenTrangThai}</td>
                              <td>{item.ghiChu}</td>
                              <td>{item.tenNguoiCapNhat}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div
            className="modal-backdrop fade show"
            style={{ zIndex: 1050 }}
            onClick={handleCloseModal}
          ></div>
        </div>
      )}
    </div>
  );
};

export default Orders;
