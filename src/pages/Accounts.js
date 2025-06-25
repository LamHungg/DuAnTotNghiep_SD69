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
  FaChevronLeft,
  FaChevronRight,
  FaTrash,
} from "react-icons/fa";
import Toast from "../components/Toast";

const Accounts = () => {
  const navigate = useNavigate();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("employees");
  const [statusFilter, setStatusFilter] = useState("");
  const [showPassword, setShowPassword] = useState({});
  const [toast, setToast] = useState({
    visible: false,
    type: "info",
    message: "",
  });
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 5;

  // Thêm CSS cho custom switch vào file hoặc inline style
  const switchStyle = {
    position: 'relative',
    display: 'inline-block',
    width: 40,
    height: 22,
    verticalAlign: 'middle',
  };
  const sliderStyle = (active) => ({
    position: 'absolute',
    cursor: 'pointer',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: active ? '#10b981' : '#d1d5db',
    borderRadius: 22,
    transition: '0.3s',
  });
  const circleStyle = (active) => ({
    position: 'absolute',
    height: 18,
    width: 18,
    left: active ? 20 : 2,
    bottom: 2,
    backgroundColor: '#fff',
    borderRadius: '50%',
    transition: '0.3s',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  });

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
      setToast({
        visible: true,
        type: "success",
        message: "Cập nhật trạng thái thành công!",
      });
      // Refresh danh sách sau khi cập nhật
      fetchAccounts();
    } catch (err) {
      setToast({
        visible: true,
        type: "error",
        message:
          "Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại sau!",
      });
      console.error("Error updating account status:", err);
    }
  };

  // Xóa tài khoản
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa tài khoản này?")) {
      try {
        await nguoiDungService.deleteNguoiDung(id);
        setToast({
          visible: true,
          type: "success",
          message: "Xóa tài khoản thành công!",
        });
        // Refresh danh sách sau khi xóa
        fetchAccounts();
      } catch (err) {
        setToast({
          visible: true,
          type: "error",
          message: "Không thể xóa tài khoản. Vui lòng thử lại sau!",
        });
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

  // Lọc theo chức vụ
  const filteredByRole = roleFilter === "ALL"
    ? filteredData
    : filteredData.filter(acc => acc.chucVu === roleFilter);

  // Phân trang
  const totalPages = Math.ceil(filteredByRole.length / recordsPerPage);
  const paginatedData = filteredByRole.slice(
    (currentPage - 1) * recordsPerPage,
    currentPage * recordsPerPage
  );

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

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

  const isActive = (trangThai) => trangThai === 1 || trangThai === true || trangThai === "1";

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

      {/* Combobox lọc chức vụ */}
      <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        <label style={{ fontWeight: 600, fontSize: 15, color: '#4b5563' }}>Lọc theo chức vụ:</label>
        <select
          value={roleFilter}
          onChange={e => { setRoleFilter(e.target.value); setCurrentPage(1); }}
          style={{
            padding: '6px 18px',
            borderRadius: 20,
            border: '1.5px solid #7c3aed',
            background: '#fff',
            color: '#4b5563',
            fontSize: 15,
            fontWeight: 500,
            outline: 'none',
            boxShadow: '0 1px 4px rgba(124,60,237,0.06)',
            transition: 'border 0.2s, box-shadow 0.2s',
            cursor: 'pointer',
          }}
          onMouseOver={e => e.currentTarget.style.border = '1.5px solid #a78bfa'}
          onMouseOut={e => e.currentTarget.style.border = '1.5px solid #7c3aed'}
        >
          <option value="ALL">Tất cả</option>
          <option value="ADMIN">Admin</option>
          <option value="NHANVIEN">Nhân viên</option>
        </select>
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
            {paginatedData.map((account) => (
              <tr key={account.id}>
                <td>{account.ma}</td>
                <td>{account.hoTen}</td>
                <td>{account.chucVu}</td>
                <td>{account.email}</td>
                <td>{account.soDienThoai}</td>
                <td>
                  <span style={getStatusBadgeStyle(isActive(account.trangThai) ? 1 : 0)}>
                    {getStatusText(isActive(account.trangThai) ? 1 : 0)}
                  </span>
                </td>
                <td>
                  <button
                    onClick={() => handleStatusUpdate(account.id, account.trangThai)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginRight: 8 }}
                    title={isActive(account.trangThai) ? 'Đang hoạt động (Bấm để tắt)' : 'Đã nghỉ việc (Bấm để bật)'}
                  >
                    <span style={switchStyle}>
                      <span style={sliderStyle(isActive(account.trangThai))}></span>
                      <span style={circleStyle(isActive(account.trangThai))}></span>
                    </span>
                  </button>
                  <button
                    onClick={() => handleDelete(account.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: '#ef4444',
                      fontSize: 18,
                    }}
                    title="Xóa tài khoản"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          style={{
            margin: '0 2px',
            padding: '2px 8px',
            borderRadius: 6,
            border: '1.5px solid #222',
            background: '#fafbfc',
            color: '#222',
            fontSize: 15,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            outline: 'none',
          }}
        >
          <FaChevronLeft />
        </button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            style={{
              margin: '0 2px',
              padding: '2px 10px',
              borderRadius: 6,
              border: currentPage === i + 1 ? '1.5px solid #7c3aed' : '1.5px solid #ccc',
              background: currentPage === i + 1 ? '#7c3aed' : '#fff',
              color: currentPage === i + 1 ? '#fff' : '#222',
              fontWeight: currentPage === i + 1 ? 'bold' : 'normal',
              fontSize: 14,
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
              cursor: 'pointer',
              transition: 'all 0.2s',
              outline: 'none',
            }}
            onMouseOver={e => e.currentTarget.style.background = currentPage === i + 1 ? '#7c3aed' : '#f3f4f6'}
            onMouseOut={e => e.currentTarget.style.background = currentPage === i + 1 ? '#7c3aed' : '#fff'}
          >
            {i + 1}
          </button>
        ))}
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          style={{
            margin: '0 2px',
            padding: '2px 8px',
            borderRadius: 6,
            border: '1.5px solid #222',
            background: '#fafbfc',
            color: '#222',
            fontSize: 15,
            boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            outline: 'none',
          }}
        >
          <FaChevronRight />
        </button>
      </div>

      {toast.visible && (
        <Toast
          type={toast.type}
          message={toast.message}
          visible={toast.visible}
          onClose={() => setToast((t) => ({ ...t, visible: false }))}
        />
      )}
    </div>
  );
};

export default Accounts;
