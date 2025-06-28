import React, { useState, useEffect } from "react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { sampleMaterials } from "../data/sampleData";
import Toast from "../components/Toast";

const Materials = () => {
  const [materials, setMaterials] = useState([]);
  const [filteredMaterials, setFilteredMaterials] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [toast, setToast] = useState({
    visible: false,
    type: "info",
    message: "",
  });

  useEffect(() => {
    let savedMaterials = [];
    try {
      savedMaterials = JSON.parse(localStorage.getItem("materials") || "[]");
    } catch {
      savedMaterials = [];
    }
    // Nếu không có dữ liệu hợp lệ thì lấy lại dữ liệu mẫu
    if (!Array.isArray(savedMaterials) || savedMaterials.length === 0) {
      localStorage.setItem("materials", JSON.stringify(sampleMaterials));
      setMaterials(sampleMaterials);
      setFilteredMaterials(sampleMaterials);
    } else {
      setMaterials(savedMaterials);
      setFilteredMaterials(savedMaterials);
    }
  }, []);

  useEffect(() => {
    let result = materials;
    if (searchTerm !== "") {
      result = result.filter((material) =>
        material.ten_chat_lieu.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "") {
      result = result.filter(
        (material) => material.trang_thai === parseInt(statusFilter)
      );
    }
    setFilteredMaterials(result);
  }, [searchTerm, statusFilter, materials]);

  const getStatusText = (status) => {
    return status === 1 ? "Đang hoạt động" : "Ngừng hoạt động";
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

  const handleToggleStatus = (id) => {
    const updatedMaterials = materials.map((material) => {
      if (material.id === id) {
        return { ...material, trang_thai: material.trang_thai === 1 ? 0 : 1 };
      }
      return material;
    });
    setMaterials(updatedMaterials);
    localStorage.setItem("materials", JSON.stringify(updatedMaterials));

    const material = materials.find((m) => m.id === id);
    const statusText = material.trang_thai === 1 ? "tắt" : "bật";
    setToast({
      visible: true,
      type: "info",
      message: `Đã ${statusText} trạng thái chất liệu "${material.ten_chat_lieu}"!`,
    });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 1500);
  };

  const handleAddMaterial = (e) => {
    e.preventDefault();
    // Logic to add new material
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
    textAlign: "center",
    borderBottom: "1px solid #dee2e6",
    fontWeight: "600",
  };

  const tdStyle = {
    padding: "12px",
    borderBottom: "1px solid #dee2e6",
    textAlign: "center",
  };

  const addFormStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px",
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={titleStyle}>Quản lý Chất liệu</h1>
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

      {showAddForm && (
        <form onSubmit={handleAddMaterial} style={addFormStyle}>
          {/* Add form fields here */}
        </form>
      )}

      {/* Search and Filter Section */}
      <div style={searchSectionStyle}>
        <div style={formStyle}>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên chất liệu..."
            style={inputStyle}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            style={selectStyle}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="1">Đang hoạt động</option>
            <option value="0">Ngừng hoạt động</option>
          </select>
        </div>
      </div>

      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: "center" }}>Tên chất liệu</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Trạng thái</th>
            <th style={{ ...thStyle, textAlign: "center" }}>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredMaterials.map((material) => (
            <tr key={material.id}>
              <td style={{ ...tdStyle, textAlign: "center" }}>
                {material.ten_chat_lieu}
              </td>
              <td style={{ ...tdStyle, textAlign: "center" }}>
                <span style={getStatusBadgeStyle(material.trang_thai)}>
                  {getStatusText(material.trang_thai)}
                </span>
              </td>
              <td style={{ ...tdStyle, textAlign: "center" }}>
                <button
                  onClick={() => handleToggleStatus(material.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: material.trang_thai === 1 ? "#10b981" : "#6b7280",
                    transition: "color 0.2s",
                  }}
                  title={
                    material.trang_thai === 1
                      ? "Tắt hoạt động"
                      : "Bật hoạt động"
                  }
                >
                  {material.trang_thai === 1 ? <FaToggleOn /> : <FaToggleOff />}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredMaterials.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
          Không tìm thấy chất liệu nào
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

export default Materials;
