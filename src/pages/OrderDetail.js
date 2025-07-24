import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getOrderById, confirmOrder, cancelOrder, shipOrder, deliverOrder, completeOrder } from "../services/donHangService";
import { FaEye, FaHistory, FaListAlt, FaArrowLeft, FaCheck, FaExclamation, FaTruck, FaShippingFast, FaCreditCard } from "react-icons/fa";

const statusBadge = (status) => {
  switch (status) {
    case "Chờ xác nhận":
      return <span className="order-badge order-badge-pending">{status}</span>;
    case "Đã xác nhận":
      return <span className="order-badge order-badge-confirmed">{status}</span>;
    case "Đang giao hàng":
    case "Đang giao":
      return <span className="order-badge order-badge-shipping">{status}</span>;
    case "Giao hàng thành công":
    case "Đã giao":
      return <span className="order-badge order-badge-delivered">{status}</span>;
    case "Đã hủy":
      return <span className="order-badge order-badge-cancel">{status}</span>;
    case "Hoàn thành":
      return <span className="order-badge order-badge-complete">{status}</span>;
    default:
      return <span className="order-badge order-badge-default">{status}</span>;
  }
};

const getFullAddress = (order) => {
  const { duong, phuongXa, quanHuyen, tinhThanh } = order || {};
  return [duong, phuongXa, quanHuyen, tinhThanh].filter(Boolean).join(", ") || "Không có thông tin";
};

// Hàm format thời gian kiểu Việt Nam
function formatVNDateTime(dateString) {
  const d = new Date(dateString);
  const pad = n => n.toString().padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())} ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

const OrderDetail = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    if (orderId) {
      getOrderById(orderId)
        .then((res) => {
          setOrder({ ...res.data, id: orderId });
          setLoading(false);
        })
        .catch(() => {
          setError("Không lấy được chi tiết đơn hàng!");
          setLoading(false);
        });
    }
  }, [orderId]);

  // Các hàm xử lý trạng thái (thêm log và báo lỗi rõ ràng)
  const handleConfirmOrder = async () => {
    try {
      const res = await confirmOrder(order.id);
      console.log('Xác nhận đơn hàng:', res);
      alert("Xác nhận đơn hàng thành công!");
      getOrderById(order.id).then((res) => setOrder({ ...res.data, id: order.id }));
    } catch (err) {
      console.error('Lỗi xác nhận:', err?.response || err);
      alert("Xác nhận đơn hàng thất bại! " + (err?.response?.data?.message || err?.message || ''));
    }
  };
  const handleCancelOrder = async () => {
    try {
      const res = await cancelOrder(order.id);
      console.log('Hủy đơn hàng:', res);
      alert("Hủy đơn hàng thành công!");
      getOrderById(order.id).then((res) => setOrder({ ...res.data, id: order.id }));
    } catch (err) {
      console.error('Lỗi hủy:', err?.response || err);
      alert("Hủy đơn hàng thất bại! " + (err?.response?.data?.message || err?.message || ''));
    }
  };
  const handleShipOrder = async () => {
    try {
      const res = await shipOrder(order.id);
      console.log('Bắt đầu giao hàng:', res);
      alert("Bắt đầu giao hàng thành công!");
      getOrderById(order.id).then((res) => setOrder({ ...res.data, id: order.id }));
    } catch (err) {
      console.error('Lỗi giao hàng:', err?.response || err);
      alert("Bắt đầu giao hàng thất bại! " + (err?.response?.data?.message || err?.message || ''));
    }
  };
  const handleDeliverOrder = async () => {
    try {
      const res = await deliverOrder(order.id);
      console.log('Giao hàng thành công:', res);
      alert("Giao hàng thành công!");
      getOrderById(order.id).then((res) => setOrder({ ...res.data, id: order.id }));
    } catch (err) {
      console.error('Lỗi giao hàng:', err?.response || err);
      alert("Giao hàng thất bại! " + (err?.response?.data?.message || err?.message || ''));
    }
  };
  const handleCompleteOrder = async () => {
    try {
      const res = await completeOrder(order.id);
      console.log('Hoàn thành đơn hàng:', res);
      alert("Hoàn thành đơn hàng thành công!");
      getOrderById(order.id).then((res) => setOrder({ ...res.data, id: order.id }));
    } catch (err) {
      console.error('Lỗi hoàn thành:', err?.response || err);
      alert("Hoàn thành đơn hàng thất bại! " + (err?.response?.data?.message || err?.message || ''));
    }
  };

  if (loading) return <div className="container mt-4">Đang tải...</div>;
  if (error) return <div className="container mt-4 text-danger">{error}</div>;
  if (!order) return null;

  // Lấy thời gian trạng thái hiện tại (ưu tiên bản ghi mới nhất trong lịch sử, fallback ngày đặt)
  let trangThaiTime = order.ngayDat ? formatVNDateTime(order.ngayDat) : '';
  if (order.lichSuDonHang && order.lichSuDonHang.length > 0) {
    // Tìm bản ghi lịch sử mới nhất có trạng thái đúng với trạng thái hiện tại
    const last = [...order.lichSuDonHang].reverse().find(l => l.tenTrangThai === order.tenTrangThai);
    if (last && last.thoiGianCapNhat) trangThaiTime = formatVNDateTime(last.thoiGianCapNhat);
  }

  // Icon trạng thái lớn (statusIcon) giữ nguyên
  const statusIcon = () => {
    switch (order.tenTrangThai) {
      case "Chờ xác nhận":
        return <div style={{background:'#03a9f4',color:'#fff',borderRadius:'50%',width:100,height:100,display:'flex',alignItems:'center',justifyContent:'center',fontSize:60,margin:'0 auto'}}><span>!</span></div>;
      case "Đã xác nhận":
        return <div style={{background:'#43cea2',color:'#fff',borderRadius:'50%',width:100,height:100,display:'flex',alignItems:'center',justifyContent:'center',fontSize:60,margin:'0 auto'}}><span>✓</span></div>;
      case "Đang giao hàng":
      case "Đang giao":
        return <div style={{background:'#36d1c4',color:'#fff',borderRadius:'50%',width:100,height:100,display:'flex',alignItems:'center',justifyContent:'center',fontSize:60,margin:'0 auto'}}><span>🚚</span></div>;
      case "Giao hàng thành công":
      case "Đã giao":
        return <div style={{background:'#56ab2f',color:'#fff',borderRadius:'50%',width:100,height:100,display:'flex',alignItems:'center',justifyContent:'center',fontSize:60,margin:'0 auto'}}><span>📦</span></div>;
      case "Đã hủy":
        return <div style={{background:'#ff5858',color:'#fff',borderRadius:'50%',width:100,height:100,display:'flex',alignItems:'center',justifyContent:'center',fontSize:60,margin:'0 auto'}}><span>✖</span></div>;
      case "Hoàn thành":
        return <div style={{background:'#00c6ff',color:'#fff',borderRadius:'50%',width:100,height:100,display:'flex',alignItems:'center',justifyContent:'center',fontSize:60,margin:'0 auto'}}><span>✔</span></div>;
      default:
        return <div style={{background:'#e0e0e0',color:'#333',borderRadius:'50%',width:100,height:100,display:'flex',alignItems:'center',justifyContent:'center',fontSize:60,margin:'0 auto'}}><span>?</span></div>;
    }
  };

  return (
    <div className="container py-4">
      <style>{`
        .order-back-btn {
          position: absolute;
          left: 32px;
          top: 24px;
          z-index: 10;
          border-radius: 2rem;
          font-weight: 700;
          font-size: 1.08rem;
          padding: 8px 22px 8px 16px;
          background: #f0f4f8;
          color: #1976d2;
          border: none;
          box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.08);
          display: flex;
          align-items: center;
          gap: 8px;
          transition: background 0.2s, color 0.2s;
        }
        .order-back-btn:hover {
          background: #1976d2;
          color: #fff;
        }
        @media (max-width: 600px) {
          .order-back-btn { left: 8px; top: 8px; padding: 6px 12px 6px 10px; font-size: 1rem; }
        }
        .order-status-center {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 32px;
        }
        .order-status-icon {
          background: linear-gradient(135deg, #36d1c4 0%, #5b86e5 100%);
          color: #fff;
          border-radius: 50%;
          width: 110px;
          height: 110px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 60px;
          box-shadow: 0 4px 24px 0 rgba(31, 38, 135, 0.13);
        }
        .order-status-title {
          font-size: 2rem;
          font-weight: 800;
          margin-top: 18px;
          color: #1976d2;
          letter-spacing: 0.01em;
        }
        .order-status-time {
          color: #888;
          font-size: 1.08rem;
          margin-top: 2px;
        }
        .order-action-bar {
          display: flex;
          justify-content: center;
          gap: 18px;
          margin-bottom: 32px;
        }
        .order-action-btn {
          border-radius: 2rem;
          font-weight: 700;
          font-size: 1.08rem;
          min-width: 160px;
          padding: 10px 0;
          box-shadow: 0 2px 8px 0 rgba(31, 38, 135, 0.08);
        }
        .order-info-row {
          display: flex;
          gap: 24px;
          margin-bottom: 32px;
          flex-wrap: wrap;
        }
        .order-info-card {
          flex: 1 1 320px;
          background: #fff;
          border-radius: 18px;
          box-shadow: 0 2px 16px 0 rgba(31, 38, 135, 0.09);
          padding: 28px 32px 18px 32px;
          min-width: 320px;
        }
        .order-info-title {
          font-size: 1.18rem;
          font-weight: 800;
          color: #4e54c8;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .order-info-label {
          color: #7b809a;
          font-size: 1.08rem;
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .order-info-value {
          font-weight: 700;
          font-size: 1.13rem;
          margin-bottom: 10px;
          color: #222;
        }
        .order-table-section {
          background: #fff;
          border-radius: 16px;
          padding: 18px 18px 8px 18px;
          margin-bottom: 18px;
          box-shadow: 0 2px 12px 0 rgba(31, 38, 135, 0.06);
          border: 1px solid #e3e8f0;
        }
        .order-detail-table th {
          background: #f0f4f8;
          color: #1976d2;
          font-weight: 700;
          font-size: 1.13rem;
        }
        .order-detail-table td {
          vertical-align: middle;
          background: #fff;
          font-size: 1.08rem;
        }
        .order-detail-table tfoot td {
          font-weight: 800;
          color: #1976d2;
          font-size: 1.15rem;
          background: #f0f4f8;
        }
        @media (max-width: 900px) {
          .order-info-row { flex-direction: column; gap: 12px; }
          .order-info-card { padding: 14px 10px 10px 10px; min-width: unset; }
        }
        .order-track-box {
          max-width: 480px;
          margin: 0 auto 32px auto;
          background: #fff;
          border: 2px solid #e3e8f0;
          border-radius: 18px;
          box-shadow: 0 2px 12px 0 rgba(31, 38, 135, 0.07);
          padding: 32px 18px 18px 18px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        @media (max-width: 600px) {
          .order-track-box { padding: 18px 4px 10px 4px; }
        }
      `}</style>
      <button className="order-back-btn" onClick={() => navigate(-1)}><FaArrowLeft /> Quay lại</button>
      <h2 className="fw-bold mb-4 text-center">Theo dõi đơn hàng</h2>
      {/* Box border cho phần trạng thái */}
      <div className="order-track-box">
        <div className="order-status-center">
          <div className="order-status-icon">{statusIcon()}</div>
          <div className="order-status-title">{order.tenTrangThai}</div>
          <div className="order-status-time">{trangThaiTime}</div>
        </div>
      </div>
      {/* Nút hành động */}
      <div className="order-action-bar">
        {order.tenTrangThai === "Chờ xác nhận" && (
          <>
            <button className="btn btn-primary order-action-btn" onClick={handleConfirmOrder}>Xác nhận</button>
            <button className="btn btn-danger order-action-btn" onClick={handleCancelOrder}>Hủy</button>
          </>
        )}
        {order.tenTrangThai === "Đã xác nhận" && (
          <button className="btn btn-info order-action-btn" onClick={handleShipOrder}>Bắt đầu giao hàng</button>
        )}
        {(order.tenTrangThai === "Đang giao hàng" || order.tenTrangThai === "Đang giao") && (
          <button className="btn btn-primary order-action-btn" onClick={handleDeliverOrder}>Giao hàng thành công</button>
        )}
        {(order.tenTrangThai === "Giao hàng thành công" || order.tenTrangThai === "Đã giao") && (
          <button className="btn btn-success order-action-btn" onClick={handleCompleteOrder}>Hoàn thành đơn hàng</button>
        )}
        <button className="btn btn-success order-action-btn" style={{background:'#388e3c',border:'none'}} onClick={() => setShowHistory((prev) => !prev)}>Lịch sử</button>
      </div>
      {/* Thông tin đơn hàng & khách hàng */}
      <div className="order-info-row">
        <div className="order-info-card">
          <div className="order-info-title"><span>📝</span> Thông tin đơn hàng</div>
          <div className="order-info-label">Mã đơn hàng:</div>
          <div className="order-info-value">{order.maDonHang || 'Không có thông tin'}</div>
          <div className="order-info-label">Hình thức đơn hàng:</div>
          <div className="order-info-value">{order.hinhThucDonHang || 'Không có thông tin'}</div>
          <div className="order-info-label">Ngày đặt:</div>
          <div className="order-info-value">{order.ngayDat ? formatVNDateTime(order.ngayDat) : 'Không có thông tin'}</div>
          <div className="order-info-label">Trạng thái:</div>
          <div className="order-info-value">{statusBadge(order.tenTrangThai) || 'Không có thông tin'}</div>
          <div className="order-info-label">Tổng tiền:</div>
          <div className="order-info-value text-primary" style={{fontSize:'1.15rem'}}>{order.tongThanhToan?.toLocaleString('vi-VN') || '0'} đ</div>
        </div>
        <div className="order-info-card">
          <div className="order-info-title"><span>👤</span> Thông tin khách hàng</div>
          <div className="order-info-label">Tên khách hàng:</div>
          <div className="order-info-value">{order.tenKhachHang || 'Không có thông tin'}</div>
          <div className="order-info-label">Số điện thoại:</div>
          <div className="order-info-value">{order.soDienThoai || 'Không có thông tin'}</div>
          <div className="order-info-label">Email:</div>
          <div className="order-info-value">{order.email || 'Không có thông tin'}</div>
          <div className="order-info-label">Địa chỉ:</div>
          <div className="order-info-value">{getFullAddress(order)}</div>
        </div>
      </div>
      {/* Bảng sản phẩm */}
      <div className="order-table-section">
        <div className="order-info-title" style={{marginBottom:10}}><span>📦</span> Chi tiết sản phẩm</div>
        <div className="table-responsive">
          <table className="table order-detail-table mb-0">
            <thead>
              <tr>
                <th>TÊN SẢN PHẨM</th>
                <th>SỐ LƯỢNG</th>
                <th className="text-end">ĐƠN GIÁ</th>
                <th className="text-end">THÀNH TIỀN</th>
              </tr>
            </thead>
            <tbody>
              {order.chiTietSanPhams && order.chiTietSanPhams.length > 0 ? order.chiTietSanPhams.map((item, idx) => {
                const soLuong = item.soLuong || item.soluong || item.quantity || '';
                const gia = item.gia || item.price || 0;
                return (
                  <tr key={idx}>
                    <td>{item.tenSanPham || item.ten_san_pham || item.name || ''}</td>
                    <td>{soLuong}</td>
                    <td className="text-end">{gia ? gia.toLocaleString('vi-VN') : ''} đ</td>
                    <td className="text-end">{(gia && soLuong ? (gia * soLuong).toLocaleString('vi-VN') : '0')} đ</td>
                  </tr>
                );
              }) : (
                <tr><td colSpan="4" className="text-center text-secondary">Không có sản phẩm</td></tr>
              )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end fw-bold">Tổng cộng:</td>
                <td className="text-end fw-bold text-primary">
                  {order.chiTietSanPhams
                    ? order.chiTietSanPhams.reduce((sum, i) => sum + (i.gia && i.soLuong ? i.gia * i.soLuong : 0), 0).toLocaleString('vi-VN')
                    : '0'} đ
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
      {/* Lịch sử đơn hàng */}
      {showHistory && order.lichSuDonHang && order.lichSuDonHang.length > 0 && (
        <div className="order-table-section">
          <div className="order-info-title"><span>🕒</span> Lịch sử đơn hàng</div>
          <div className="table-responsive">
            <table className="table table-bordered mb-0">
              <thead>
                <tr>
                  <th>Thời gian</th>
                  <th>Trạng thái</th>
                  <th>Ghi chú</th>
                  <th>Người cập nhật</th>
                </tr>
              </thead>
              <tbody>
                {[...order.lichSuDonHang].reverse().map((item, idx) => (
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
  );
};

export default OrderDetail; 