import React, { useState } from "react";

const statusOptions = [
  { value: "pending", label: "Chờ xử lý", color: "#b26a00" },
  { value: "processing", label: "Đang xử lý", color: "#096dd9" },
  { value: "completed", label: "Hoàn thành", color: "#389e0d" },
  { value: "cancelled", label: "Đã hủy", color: "#cf1322" },
];

const OrderUpdate = () => {
  const [status, setStatus] = useState("pending");

  return (
    <div className="order-update-wrapper">
      <h3 className="fw-bold mb-4">Cập Nhật Đơn Hàng</h3>
      <div className="order-update-form bg-white p-4">
        <form>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label">Mã Đơn Hàng</label>
              <input className="form-control order-input" placeholder="" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Mã Khách Hàng</label>
              <input className="form-control order-input" placeholder="" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Số Điện Thoại</label>
              <input className="form-control order-input" placeholder="" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Ngày Đặt Hàng</label>
              <input className="form-control order-input" placeholder="" />
            </div>
            <div className="col-md-6">
              <label className="form-label">Trạng Thái</label>
              <div className="order-status-select position-relative">
                <select
                  className="form-select order-input"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <span
                  className="order-status-dot position-absolute top-50 start-0 translate-middle-y ms-3"
                  style={{
                    color: statusOptions.find((s) => s.value === status)?.color,
                  }}
                >
                  ●
                </span>
              </div>
            </div>
            <div className="col-md-6">
              <label className="form-label">Tổng Tiền</label>
              <input className="form-control order-input" placeholder="" />
            </div>
          </div>
          <div className="d-flex justify-content-end gap-3 mt-5">
            <button type="button" className="btn btn-cancel">
              Hủy
            </button>
            <button type="submit" className="btn btn-save">
              Lưu Thay Đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OrderUpdate;
