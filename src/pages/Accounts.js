import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import nguoiDungService from "../services/nguoiDungService";
import {
  FaSearch,
  FaUserTie,
  FaUserShield,
  FaEye,
  FaEyeSlash,
  FaToggleOn,
  FaToggleOff,
  FaPlus,
} from "react-icons/fa";

const Accounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("employees");
  const [statusFilter, setStatusFilter] = useState("");
  const [showPassword, setShowPassword] = useState({});

  // Fetch danh sách tài khoản
  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const data = await nguoiDungService.getAllNguoiDung();
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError("Không thể tải danh sách tài khoản. Vui lòng thử lại sau!");
      console.error("Error fetching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Tìm kiếm tài khoản
  const handleSearch = async () => {
    if (!searchTerm.trim()) {
      fetchAccounts();
      return;
    }

    try {
      setLoading(true);
      const data = await nguoiDungService.searchNguoiDung(searchTerm);
      setAccounts(data);
      setError(null);
    } catch (err) {
      setError("Không thể tìm kiếm tài khoản. Vui lòng thử lại sau!");
      console.error("Error searching accounts:", err);
    } finally {
      setLoading(false);
    }
  };

  // Cập nhật trạng thái tài khoản
  const handleStatusUpdate = async (id, currentStatus) => {
    try {
      await nguoiDungService.updateStatus(id, !currentStatus);
      // Refresh danh sách sau khi cập nhật
      fetchAccounts();
    } catch (err) {
      alert("Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại sau!");
      console.error("Error updating account status:", err);
    }
  };

  // Xóa tài khoản
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        await nguoiDungService.deleteNguoiDung(id);
        // Refresh danh sách sau khi xóa
        fetchAccounts();
      } catch (err) {
        alert("Không thể xóa tài khoản. Vui lòng thử lại sau!");
        console.error("Error deleting account:", err);
      }
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  if (loading) {
    return <div className="text-center p-5">Đang tải...</div>;
  }

  if (error) {
    return <div className="text-center text-danger p-5">{error}</div>;
  }

  const filteredData = accounts.filter((item) => {
    const matchesSearch =
      item.hoTen?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.ma?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.tenDangNhap?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "" || item.trangThai === parseInt(statusFilter);
    return matchesSearch && matchesStatus;
  });

  const handleAddNew = () => {
    if (activeTab === "employees") {
      navigate("/dashboard/accounts/add-employee");
    } else {
      navigate("/dashboard/accounts/add-admin");
    }
  };

  const togglePasswordVisibility = (id) => {
    setShowPassword((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  const getStatusText = (status) => {
    return status === 1 ? "Đang làm việc" : "Đã nghỉ việc";
  };

  const getStatusBadgeStyle = (status) => {
    return {
      padding: "4px 8px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: status === 1 ? "#d1fae5" : "#fee2e2",
      color: status === 1 ? "#065f46" : "#991b1b",
    };
  };

  const getTabStyle = (tabName) => ({
    padding: "12px 24px",
    border: "none",
    backgroundColor: activeTab === tabName ? "#7c3aed" : "transparent",
    color: activeTab === tabName ? "white" : "#6b7280",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    transition: "all 0.2s",
  });

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý tài khoản</h2>
        <div className="d-flex gap-2">
          <Link
            to="/dashboard/accounts/add-employee"
            className="btn btn-primary"
          >
            Thêm nhân viên
          </Link>
          <Link to="/dashboard/accounts/add-admin" className="btn btn-success">
            Thêm admin
          </Link>
        </div>
      </div>

      {/* Search bar */}
      <div className="row mb-4">
        <div className="col-md-6">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Tìm kiếm theo tên..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
            />
            <button
              className="btn btn-outline-secondary"
              onClick={handleSearch}
            >
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Accounts table */}
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Mã</th>
              <th>Họ tên</th>
              <th>Chức vụ</th>
              <th>Email</th>
              <th>Số điện thoại</th>
              <th>Trạng thái</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((account) => (
              <tr key={account.id}>
                <td>{account.ma}</td>
                <td>{account.hoTen}</td>
                <td>{account.chucVu}</td>
                <td>{account.email}</td>
                <td>{account.soDienThoai}</td>
                <td>
                  <button
                    className={`btn btn-sm ${
                      account.trangThai ? "btn-success" : "btn-danger"
                    }`}
                    onClick={() =>
                      handleStatusUpdate(account.id, account.trangThai)
                    }
                  >
                    {account.trangThai ? "Hoạt động" : "Khóa"}
                  </button>
                </td>
                <td>
                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(account.id)}
                    >
                      Xóa
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Accounts;
