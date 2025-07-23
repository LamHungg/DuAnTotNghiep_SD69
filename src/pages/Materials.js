import React, { useState, useEffect } from "react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { sampleMaterials } from "../data/sampleData";
import Toast from "../components/Toast";
import {
  getAllChatLieu,
  updateChatLieuStatus,
} from "../services/chatLieuService";

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
    const fetchMaterials = async () => {
      try {
        const data = await getAllChatLieu();
        setMaterials(data || []);
      } catch (err) {
        setMaterials([]);
        console.error("Lỗi khi lấy chất liệu:", err);
      }
    };
    fetchMaterials();
  }, []);

  useEffect(() => {
    let result = materials;
    if (searchTerm !== "") {
      result = result.filter((material) =>
        material.tenChatLieu.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== "") {
      result = result.filter(
        (material) => material.trangThai === parseInt(statusFilter)
      );
    }
    setFilteredMaterials(result);
  }, [searchTerm, statusFilter, materials]);

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

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const material = materials.find((m) => m.id === id);
      if (!material) return;
      const updatedMaterial = {
        id: material.id,
        tenChatLieu: material.tenChatLieu,
        trangThai: currentStatus === 1 ? 0 : 1,
      };
      await updateChatLieuStatus(id, updatedMaterial);
      const data = await getAllChatLieu();
      setMaterials(data || []);
      setToast({
        visible: true,
        type: "info",
        message: `Đã đổi trạng thái chất liệu "${material.tenChatLieu}"!`,
      });
      setTimeout(() => setToast((t) => ({ ...t, visible: false })), 1500);
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái!");
      console.error("Lỗi cập nhật:", err?.response?.data || err);
    }
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
                {material.tenChatLieu}
              </td>
              <td style={{ ...tdStyle, textAlign: "center" }}>
                <span style={getStatusBadgeStyle(material.trangThai)}>
                  {getStatusText(material.trangThai)}
                </span>
              </td>
              <td style={{ ...tdStyle, textAlign: "center" }}>
                <button
                  onClick={() =>
                    handleToggleStatus(material.id, material.trangThai)
                  }
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "20px",
                    color: material.trangThai === 1 ? "#10b981" : "#6b7280",
                    transition: "color 0.2s",
                  }}
                  title={
                    material.trangThai === 1 ? "Tắt hoạt động" : "Bật hoạt động"
                  }
                >
                  {material.trangThai === 1 ? <FaToggleOn /> : <FaToggleOff />}
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
