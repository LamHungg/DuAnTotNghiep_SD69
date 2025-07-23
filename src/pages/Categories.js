import React, { useState, useEffect } from "react";
import { FaToggleOn, FaToggleOff } from "react-icons/fa";
import { getAllDanhMuc, updateDanhMucStatus } from "../services/danhMucService";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllDanhMuc();
        setCategories(data || []);
      } catch (err) {
        console.error("Lỗi khi lấy danh mục:", err);
        setCategories([]);
      }
    };
    fetchCategories();
  }, []);

  const getStatusText = (status) =>
    status === 1 ? "Hoạt động" : "Không hoạt động";
  const getStatusBadgeStyle = (status) => ({
    padding: "4px 8px",
    borderRadius: "12px",
    fontSize: "12px",
    fontWeight: "600",
    backgroundColor: status === 1 ? "#d1fae5" : "#fee2e2",
    color: status === 1 ? "#065f46" : "#991b1b",
  });

  const filteredCategories = categories.filter((cat) => {
    const matchesSearch = cat.tenDanhMuc
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "" || cat.trang_thai === parseInt(statusFilter);
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (id, currentStatus) => {
    console.log("Toggle click:", id, currentStatus);
    try {
      const cat = categories.find((c) => c.id === id);
      if (!cat) return;
      const updatedCat = {
        id: cat.id,
        tenDanhMuc: cat.tenDanhMuc,
        idDanhMucCha: cat.idDanhMucCha,
        trangThai: currentStatus === 1 ? 0 : 1,
        idNguoiTao: cat.idNguoiTao,
        ngayTao: cat.ngayTao,
        idNguoiCapNhat: cat.idNguoiCapNhat,
        ngayCapNhat: cat.ngayCapNhat,
      };
      await updateDanhMucStatus(id, updatedCat);
      const data = await getAllDanhMuc();
      setCategories(data || []);
    } catch (err) {
      alert("Lỗi khi cập nhật trạng thái!");
      console.error("Lỗi cập nhật:", err?.response?.data || err);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2 style={{ fontWeight: 700, marginBottom: 24 }}>Danh mục sản phẩm</h2>
      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <input
          type="text"
          placeholder="Tìm kiếm tên danh mục..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: 8,
            borderRadius: 4,
            border: "1px solid #ddd",
            minWidth: 220,
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ padding: 8, borderRadius: 4, border: "1px solid #ddd" }}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="1">Hoạt động</option>
          <option value="0">Không hoạt động</option>
        </select>
      </div>
      <div
        style={{
          background: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px #f0f1f2",
          overflow: "hidden",
        }}
      >
        <table style={{ width: "100%" }}>
          <thead>
            <tr style={{ background: "#f8f9fa" }}>
              <th style={{ padding: 12, textAlign: "center" }}>ID</th>
              <th style={{ padding: 12, textAlign: "center" }}>Tên danh mục</th>
              <th style={{ padding: 12, textAlign: "center" }}>Trạng thái</th>
              <th style={{ padding: 12, textAlign: "center" }}>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((cat) => (
              <tr key={cat.id}>
                <td style={{ padding: 12, textAlign: "center" }}>{cat.id}</td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  {cat.tenDanhMuc}
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  <span style={getStatusBadgeStyle(cat.trangThai)}>
                    {getStatusText(cat.trangThai)}
                  </span>
                </td>
                <td style={{ padding: 12, textAlign: "center" }}>
                  <button
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: 20,
                    }}
                    title={
                      cat.trangThai === 1 ? "Tắt hoạt động" : "Bật hoạt động"
                    }
                    onClick={() => handleToggleStatus(cat.id, cat.trangThai)}
                  >
                    {cat.trangThai === 1 ? (
                      <FaToggleOn color="#10b981" />
                    ) : (
                      <FaToggleOff color="#6b7280" />
                    )}
                  </button>
                </td>
              </tr>
            ))}
            {filteredCategories.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "center", padding: 32, color: "#888" }}
                >
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
