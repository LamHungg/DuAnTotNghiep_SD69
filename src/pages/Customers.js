import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import khachHangService from "../services/khachHangService";

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchValue, setSearchValue] = useState("");

  const handleSearch = async () => {
    setLoading(true);
    try {
      if (searchValue.trim() === "") {
        const data = await khachHangService.getAllKhachHang();
        setCustomers(data);
      } else {
        const data = await khachHangService.searchKhachHang(searchValue);
        setCustomers(data);
      }
    } catch (error) {
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const data = await khachHangService.getAllKhachHang();
        setCustomers(data);
      } catch (error) {
        setCustomers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
        <h2 className="fw-bold mb-0">Quản lý khách hàng</h2>
        <div className="search-customer-box position-relative">
          <input
            className="form-control search-customer-input"
            placeholder="Search customers..."
            style={{ paddingRight: 38, minWidth: 240 }}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
          />
          <FaSearch
            className="search-customer-icon position-absolute top-50 end-0 translate-middle-y me-3"
            style={{ cursor: "pointer" }}
            onClick={handleSearch}
          />
        </div>
      </div>
      <div className="customer-table-wrapper">
        <table className="table customer-table align-middle mb-0">
          <thead>
            <tr>
              <th className="text-center">STT</th>
              <th className="text-center">MÃ KHÁCH HÀNG</th>
              <th className="text-center">HỌ TÊN</th>
              <th className="text-center">EMAIL</th>
              <th className="text-center">SỐ ĐIỆN THOẠI</th>
              <th className="text-center">TRẠNG THÁI</th>
              <th className="text-center">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center">
                  Đang tải...
                </td>
              </tr>
            ) : customers.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center">
                  Không có khách hàng
                </td>
              </tr>
            ) : (
              customers.map((cus, idx) => (
                <tr key={cus.maKhachHang || idx}>
                  <td className="text-center">{idx + 1}</td>
                  <td className="text-center">{cus.maKhachHang}</td>
                  <td className="text-center">{cus.hoTen}</td>
                  <td className="text-center">{cus.email}</td>
                  <td className="text-center">{cus.soDienThoai}</td>
                  <td className="text-center">
                    <span
                      style={{
                        padding: "4px 10px",
                        borderRadius: "12px",
                        fontSize: 12,
                        fontWeight: 600,
                        backgroundColor:
                          cus.trangThaiTaiKhoan === 1 ||
                          cus.trangThaiTaiKhoan === true
                            ? "#d1fae5"
                            : "#fee2e2",
                        color:
                          cus.trangThaiTaiKhoan === 1 ||
                          cus.trangThaiTaiKhoan === true
                            ? "#065f46"
                            : "#991b1b",
                      }}
                    >
                      {cus.trangThaiTaiKhoan === 1 ||
                      cus.trangThaiTaiKhoan === true
                        ? "Hoạt động"
                        : "Khóa"}
                    </span>
                  </td>
                  <td className="text-center">
                    <button className="btn btn-update-customer">
                      Cập nhật
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
