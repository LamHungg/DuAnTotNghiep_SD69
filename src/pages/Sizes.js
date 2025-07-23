import React, { useState, useEffect } from "react";
import { FaToggleOn, FaToggleOff, FaPlus, FaSearch } from "react-icons/fa";
import { sampleSizes } from "../data/sampleData";
import Toast from "../components/Toast";
import { getAllKichCo, updateKichCoStatus } from "../services/kichCoService";

const Sizes = () => {
  const [sizes, setSizes] = useState([]);
  const [filteredSizes, setFilteredSizes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSizeName, setNewSizeName] = useState("");
  const [newSizeError, setNewSizeError] = useState("");
  const [sizeType, setSizeType] = useState("Kích cỡ số");
  const [toast, setToast] = useState({
    visible: false,
    type: "info",
    message: "",
  });

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const data = await getAllKichCo();
        setSizes(data || []);
      } catch (err) {
        setSizes([]);
        console.error("Lỗi khi lấy kích cỡ:", err);
      }
    };
    fetchSizes();
  }, []);

  useEffect(() => {
    let result = sizes;
    if (searchTerm !== "") {
      result = result.filter((size) =>
        size.tenKichCo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "") {
      result = result.filter(
        (size) => size.trangThai === parseInt(statusFilter)
      );
    }
    setFilteredSizes(result);
  }, [searchTerm, statusFilter, sizes]);

  const handleAddNew = (e) => {
    e.preventDefault();
    if (!newSizeName) {
      setNewSizeError("Tên kích thước không được để trống.");
      return;
    }
    // ... existing code ...
    setNewSizeError("");
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const size = sizes.find((s) => s.id === id);
      if (!size) return;
      const updatedSize = {
        id: size.id,
        tenKichCo: size.tenKichCo,
        trangThai: currentStatus === 1 ? 0 : 1,
      };
      await updateKichCoStatus(id, updatedSize);
      const data = await getAllKichCo();
      setSizes(data || []);
      setToast({
        visible: true,
        type: "info",
        message: `Đã đổi trạng thái kích cỡ "${size.tenKichCo}"!`,
      });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 1500);
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái!");
      console.error("Lỗi cập nhật:", err?.response?.data || err);
    }
  };

  const getStatusText = (status) =>
    status === 1 ? "Đang hoạt động" : "Ngừng hoạt động";
  const getStatusBadgeStyle = (status) => ({
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: status === 1 ? "#d1fae5" : "#fee2e2",
    color: status === 1 ? "#065f46" : "#991b1b",
  });

  const getSizeType = (type) => {
    return type === "Kích cỡ số" ? "Số" : "Chữ";
  };

  const getSizeTypeStyle = (type) => {
    return {
      padding: "3px 8px",
      borderRadius: "4px",
      fontSize: "12px",
      fontWeight: "500",
      backgroundColor: type === "Kích cỡ số" ? "#e0e7ff" : "#fef3c7",
      color: type === "Kích cỡ số" ? "#4f46e5" : "#92400e",
    };
  };

  // Styles
  const containerStyle = {
    padding: "20px",
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px",
  };

  const titleStyle = {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
    margin: 0,
  };

  const searchSectionStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  };

  const formStyle = {
    display: "grid",
    gridTemplateColumns: "1fr 1fr auto",
    gap: "15px",
    alignItems: "end",
  };

  const inputStyle = {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  };

  const selectStyle = {
    padding: "10px 12px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    fontSize: "14px",
  };

  const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "10px 20px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
  };

  const tableStyle = {
    width: "100%",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    overflow: "hidden",
  };

  const thStyle = {
    backgroundColor: "#f8f9fa",
    padding: "12px",
    textAlign: "left",
    borderBottom: "1px solid #dee2e6",
    fontWeight: "600",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #dee2e6",
  };

  const addFormStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  };

  const formGroupStyle = {
    marginBottom: "15px",
  };

  const labelStyle = {
    display: "block",
    marginBottom: "5px",
    fontWeight: "500",
  };

  const errorStyle = {
    color: "#dc3545",
    fontSize: "12px",
    marginTop: "4px",
  };

  const toggleButtonStyle = (isActive) => ({
    padding: "8px 16px",
    border: "1px solid #ddd",
    cursor: "pointer",
    backgroundColor: isActive ? "#007bff" : "white",
    color: isActive ? "white" : "#333",
    fontSize: "14px",
    transition: "all 0.2s",
  });

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Quản lý Kích cỡ</h1>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            ...buttonStyle,
            backgroundColor: "#28a745",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {showAddForm ? "Đóng" : "Thêm mới"}
        </button>
      </div>

      {/* Form thêm mới */}
      {showAddForm && (
        <div style={addFormStyle}>
          <h3 style={{ marginTop: 0, marginBottom: "20px" }}>
            Thêm kích cỡ mới
          </h3>
          <form onSubmit={handleAddNew}>
            <div style={formGroupStyle}>
              <label style={labelStyle}>
                Tên kích cỡ <span style={{ color: "#dc3545" }}>*</span>
              </label>
              <input
                type="text"
                value={newSizeName}
                onChange={(e) => setNewSizeName(e.target.value)}
                style={
                  newSizeError
                    ? { ...inputStyle, borderColor: "#dc3545" }
                    : inputStyle
                }
                placeholder="Nhập tên kích cỡ (VD: S, M, L, 40, 41...)"
              />
              {newSizeError && <div style={errorStyle}>{newSizeError}</div>}
            </div>

            <div style={formGroupStyle}>
              <label style={labelStyle}>Trạng thái</label>
              <select
                value={sizeType}
                onChange={(e) => setSizeType(e.target.value)}
                style={selectStyle}
              >
                <option value="Kích cỡ số">Kích cỡ số</option>
                <option value="Kích cỡ chữ">Kích cỡ chữ</option>
              </select>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button type="submit" style={buttonStyle}>
                Lưu
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{ ...buttonStyle, backgroundColor: "#6c757d" }}
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tìm kiếm và lọc */}
      <div style={searchSectionStyle}>
        <div style={formStyle}>
          <div>
            <label style={labelStyle}>Tìm kiếm</label>
            <input
              type="text"
              placeholder="Tìm theo tên kích cỡ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
          </div>
          <div>
            <label style={labelStyle}>Trạng thái</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={selectStyle}
            >
              <option value="">Tất cả</option>
              <option value="1">Đang hoạt động</option>
              <option value="0">Ngừng hoạt động</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bảng dữ liệu */}
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: "center" }}>Kích cỡ</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Trạng thái</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredSizes.map((size) => (
            <tr key={size.id}>
              <td style={{ ...tdStyle, textAlign: "center" }}>
                <strong>{size.tenKichCo}</strong>
              </td>
              <td style={{ ...tdStyle, textAlign: "center" }}>
                <span style={getStatusBadgeStyle(size.trangThai)}>
                  {getStatusText(size.trangThai)}
                </span>
              </td>
              <td style={{ ...tdStyle, textAlign: "center" }}>
                <button
                  onClick={() => handleToggleStatus(size.id, size.trangThai)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                  title={
                    size.trangThai === 1 ? "Tắt hoạt động" : "Bật hoạt động"
                  }
                >
                  {size.trangThai === 1 ? (
                    <FaToggleOn style={{ color: "#10b981", fontSize: 32 }} />
                  ) : (
                    <FaToggleOff style={{ color: "#d1d5db", fontSize: 32 }} />
                  )}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredSizes.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Không tìm thấy kích cỡ nào
        </div>
      )}

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

export default Sizes;
