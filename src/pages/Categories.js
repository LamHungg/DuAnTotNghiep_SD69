import React, { useState, useEffect } from "react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    // Lấy dữ liệu từ localStorage hoặc tạo dữ liệu mẫu
    const saved = JSON.parse(localStorage.getItem("categories") || "[]");
    setCategories(saved);
  }, []);

  const getStatusText = (status) => (status === 1 ? "Hoạt động" : "Không hoạt động");
  const getStatusBadgeStyle = (status) => ({
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: status === 1 ? "#d1fae5" : "#fee2e2",
    color: status === 1 ? "#065f46" : "#991b1b"
  });

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.ten_danh_muc?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "" || cat.trang_thai === parseInt(statusFilter);
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = (id) => {
    setCategories(prev => {
      const updated = prev.map(cat =>
        cat.id === id ? { ...cat, trang_thai: cat.trang_thai === 1 ? 0 : 1 } : cat
      );
      localStorage.setItem("categories", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontWeight: 700, marginBottom: 24 }}>Danh mục sản phẩm</h2>
      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <input
          type="text"
          placeholder="Tìm kiếm tên danh mục..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd", minWidth: 220 }}
        />
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="1">Hoạt động</option>
          <option value="0">Không hoạt động</option>
        </select>
      </div>
      <div style={{ background: "#fff", borderRadius: 8, boxShadow: "0 2px 8px #f0f1f2", overflow: "hidden" }}>
        <table style={{ width: "100%" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ padding: 12, textAlign: "left" }}>ID</th>
              <th style={{ padding: 12, textAlign: "left" }}>Tên danh mục</th>
              <th style={{ padding: 12, textAlign: "left" }}>Trạng thái</th>
              <th style={{ padding: 12, textAlign: "left" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => (
              <tr key={cat.id}>
                <td style={{ padding: 12 }}>{cat.id}</td>
                <td style={{ padding: 12 }}>{cat.ten_danh_muc}</td>
                <td style={{ padding: 12 }}>
                  <span style={getStatusBadgeStyle(cat.trang_thai)}>{getStatusText(cat.trang_thai)}</span>
                </td>
                <td style={{ padding: 12 }}>
                  <button
                    style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20 }}
                    title={cat.trang_thai === 1 ? "Tắt hoạt động" : "Bật hoạt động"}
                    onClick={() => handleToggleStatus(cat.id)}
                  >
                    {cat.trang_thai === 1 ? <FaToggleOn color="#10b981" /> : <FaToggleOff color="#6b7280" />}
                  </button>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: "center", padding: 32, color: "#888" }}>
                  Không có danh mục nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Categories; 