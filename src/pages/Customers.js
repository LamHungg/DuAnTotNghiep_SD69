import React from "react";
import { FaSearch } from "react-icons/fa";

const customers = [
  {
    id: "CUS001",
    name: "John Smith",
    phone: "+1 (555) 123-4567",
    email: "john@example.com",
    address: "123 Main St, City, State",
    orders: 15,
    completed: 2,
  },
  {
    id: "CUS002",
    name: "Sarah Johnson",
    phone: "+1 (555) 987-6543",
    email: "sarah@example.com",
    address: "456 Oak Ave, City, State",
    orders: 8,
    completed: 1,
  },
  {
    id: "CUS003",
    name: "Michael Brown",
    phone: "+1 (555) 246-8135",
    email: "michael@example.com",
    address: "789 Pine Rd, City, State",
    orders: 22,
    completed: 3,
  },
];

const Customers = () => {
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold mb-0">Quản lý user</h2>
        <div className="search-customer-box position-relative">
          <input
            className="form-control search-customer-input"
            placeholder="Search customers..."
            style={{ paddingRight: 38, minWidth: 240 }}
          />
          <FaSearch className="search-customer-icon position-absolute top-50 end-0 translate-middle-y me-3" />
        </div>
      </div>
      <div className="customer-table-wrapper">
        <table className="table customer-table align-middle mb-0">
          <thead>
            <tr>
              <th>MÃ KHÁCH HÀNG</th>
              <th>TÊN</th>
              <th>SỐ ĐIỆN THOẠI</th>
              <th>Email</th>
              <th>Address</th>
              <th>ĐƠN HÀNG ĐÃ NHẬN</th>
              <th>ĐƠN HÀNG ĐÃ HOÀN</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((cus) => (
              <tr key={cus.id}>
                <td>{cus.id}</td>
                <td>{cus.name}</td>
                <td>{cus.phone}</td>
                <td>{cus.email}</td>
                <td>{cus.address}</td>
                <td>{cus.orders}</td>
                <td>{cus.completed}</td>
                <td>
                  <button className="btn btn-update-customer">Cập nhật</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
