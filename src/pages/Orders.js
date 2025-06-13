import React from "react";

const Orders = () => {
  return (
    <div>
      <h2 className="mb-4">Orders</h2>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Date</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>#12345</td>
                  <td>John Doe</td>
                  <td>2024-03-15</td>
                  <td>$89.97</td>
                  <td>
                    <span className="badge bg-success">Completed</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-info me-2">View</button>
                    <button className="btn btn-sm btn-warning">
                      Update Status
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>#12346</td>
                  <td>Jane Smith</td>
                  <td>2024-03-14</td>
                  <td>$59.99</td>
                  <td>
                    <span className="badge bg-warning">Pending</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-info me-2">View</button>
                    <button className="btn btn-sm btn-warning">
                      Update Status
                    </button>
                  </td>
                </tr>
                <tr>
                  <td>#12347</td>
                  <td>Mike Johnson</td>
                  <td>2024-03-13</td>
                  <td>$149.98</td>
                  <td>
                    <span className="badge bg-info">Processing</span>
                  </td>
                  <td>
                    <button className="btn btn-sm btn-info me-2">View</button>
                    <button className="btn btn-sm btn-warning">
                      Update Status
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

export default Orders;
