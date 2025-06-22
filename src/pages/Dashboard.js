import React from "react";

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
                  <th className="text-center">Mã đơn hàng</th>
                  <th className="text-center">Mã khách hàng</th>
                  <th className="text-center">Số điện thoại</th>
                  <th className="text-center">Ngày đặt</th>
                  <th className="text-center">Trạng thái</th>
                  <th className="text-center">Số tiền</th>
                  <th className="text-center">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">ORD-2024-001</td>
                  <td className="text-center">John Smith</td>
                  <td className="text-center">+1 (555) 123-4567</td>
                  <td className="text-center">2024-01-20</td>
                  <td className="text-center">
                    <span className="badge bg-warning text-dark">
                      Chờ xử lý
                    </span>
                  </td>
                  <td className="text-center">$299.99</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-primary me-2">
                      Xem
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      Cập nhật
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="text-center">ORD-2024-002</td>
                  <td className="text-center">Sarah Johnson</td>
                  <td className="text-center">+1 (555) 234-5678</td>
                  <td className="text-center">2024-01-20</td>
                  <td className="text-center">
                    <span className="badge bg-info text-dark">Đang xử lý</span>
                  </td>
                  <td className="text-center">$149.99</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-primary me-2">
                      Xem
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      Cập nhật
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="text-center">ORD-2024-003</td>
                  <td className="text-center">Michael Brown</td>
                  <td className="text-center">+1 (555) 345-6789</td>
                  <td className="text-center">2024-01-19</td>
                  <td className="text-center">
                    <span className="badge bg-success">Hoàn thành</span>
                  </td>
                  <td className="text-center">$499.99</td>
                  <td className="text-center">
                    <button className="btn btn-sm btn-outline-primary me-2">
                      Xem
                    </button>
                    <button className="btn btn-sm btn-outline-secondary">
                      Cập nhật
                    </button>
                  </td>
                </tr>
                <tr>
                  <td className="text-center">ORD-2024-004</td>
                  <td className="text-center">Emma Davis</td>
                  <td className="text-center">+1 (555) 456-7890</td>
                  <td className="text-center">2024-01-19</td>
                  <td className="text-center">
                    <span className="badge bg-danger">Đã hủy</span>
                  </td>
                  <td className="text-center">$89.99</td>
                  <td className="text-center">
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
