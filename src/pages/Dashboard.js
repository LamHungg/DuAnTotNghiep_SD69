import React from "react";
import {
  FaShoppingBag,
  FaShoppingCart,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";

const Dashboard = () => {
  return (
    <div>
      <h2 className="mb-4">Dashboard Overview</h2>

      {/* Statistic Cards */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-title">Đơn hàng hôm nay</div>
            <div className="stat-value">2</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-title">Đơn hàng chờ xử lý</div>
            <div className="stat-value">1</div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="stat-card">
            <div className="stat-title">Tổng doanh thu</div>
            <div className="stat-value">$1039.96</div>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="d-flex align-items-center gap-2 mb-3">
        <input
          className="form-control"
          style={{ maxWidth: 250 }}
          placeholder="Tìm kiếm đơn hàng..."
        />
        <select className="form-select" style={{ maxWidth: 180 }}>
          <option>Tất cả trạng thái</option>
          <option>Chờ xử lý</option>
          <option>Đang xử lý</option>
          <option>Hoàn thành</option>
          <option>Đã hủy</option>
        </select>
        <input
          className="form-control"
          style={{ maxWidth: 180 }}
          placeholder=""
        />
      </div>

      {/* Orders Table */}
      <div className="card mt-2">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Mã đơn hàng</th>
                  <th>Mã khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Ngày đặt</th>
                  <th>Trạng thái</th>
                  <th>Số tiền</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>ORD-2024-001</td>
                  <td>John Smith</td>
                  <td>+1 (555) 123-4567</td>
                  <td>2024-01-20</td>
                  <td>
                    <span className="badge bg-warning text-dark">
                      Chờ xử lý
                    </span>
                  </td>
                  <td>$299.99</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2">
                      Xem
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      Cập nhật
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>ORD-2024-002</td>
                  <td>Sarah Johnson</td>
                  <td>+1 (555) 234-5678</td>
                  <td>2024-01-20</td>
                  <td>
                    <span className="badge bg-info text-dark">Đang xử lý</span>
                  </td>
                  <td>$149.99</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2">
                      Xem
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      Cập nhật
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>ORD-2024-003</td>
                  <td>Michael Brown</td>
                  <td>+1 (555) 345-6789</td>
                  <td>2024-01-19</td>
                  <td>
                    <span className="badge bg-success">Hoàn thành</span>
                  </td>
                  <td>$499.99</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2">
                      Xem
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      Cập nhật
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>ORD-2024-004</td>
                  <td>Emma Davis</td>
                  <td>+1 (555) 456-7890</td>
                  <td>2024-01-19</td>
                  <td>
                    <span className="badge bg-danger">Đã hủy</span>
                  </td>
                  <td>$89.99</td>
                  <td>
                    <button className="btn btn-sm btn-outline-primary me-2">
                      Xem
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      Cập nhật
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
